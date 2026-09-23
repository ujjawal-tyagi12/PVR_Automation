import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { CitySelectionPage } from '@pages/CitySelectionPage';
import { dismissPromoPopup, MUMBAI_GEOLOCATION, UAT_BASE_URL } from '@utils/LocationHelper';
import { Logger } from '@utils/Logger';

const GET_CITY_LIST_URL = `${UAT_BASE_URL}/api/get-city-list`;
const GET_CITY_LIST_ROUTE_PATTERN = '**/api/get-city-list*';

interface ApiPopularCity {
  cityName: string;
  sequenceNumber: number;
  hasSubCities: boolean;
  cityImageURL?: string;
  cityImageURLLight?: string;
  subCities: Array<{ CityName: string }>;
}

interface ApiCityListResponse {
  statusCode: number;
  message: string;
  data: {
    popularCities: ApiPopularCity[];
    cities: Array<{ cityName: string }>;
  };
}

export class CitySelectionModule {
  private readonly citySelectionPage: CitySelectionPage;

  constructor(private page: Page) {
    this.citySelectionPage = new CitySelectionPage(page);
  }

  /**
   * Grounded 2026-09-01: on a fresh context (no geolocation permission granted), the "Enable
   * Location" modal's Cancel button opens the City Selection panel directly — no intermediate
   * auto-select chain, matching the ticket's Navigation step 2 ("denying/skipping location
   * permission"). See CitySelectionPage.ts doc comment for the full grounding trail.
   *
   * Bug fix (2026-09-01): the original single-shot version fell back to the header's city
   * control the instant the Enable Location modal didn't appear within its wait — correct for a
   * context where a city was already saved, but this UAT environment intermittently renders the
   * modal *late* under real site load (transient, matches the `sandbox-resource-constraints`
   * project memory), not absent. On a brand-new context the header button can't exist yet
   * either (no city ever saved), so that fallback just traded one timeout for another — CTY-005
   * and CTY-040 both hit this live during a real run (60s timeout on `openViaHeader()`, cleared
   * immediately on isolated retry). Retrying the full navigation first, and treating the header
   * fallback as a true last resort (a city genuinely already saved this session), fixes this
   * without masking a real absence of the modal.
   */
  async gotoCitySelection(): Promise<void> {
    Logger.info('Opening City Selection screen on a fresh UAT context (denying location permission)');
    for (let attempt = 1; attempt <= 2; attempt++) {
      await this.citySelectionPage.goto(UAT_BASE_URL);
      await dismissPromoPopup(this.page);
      const modalShown = await this.citySelectionPage.dismissEnableLocationModalIfShown();
      if (modalShown) {
        const opened = await expect(this.citySelectionPage.panelHeading())
          .toBeVisible({ timeout: 15_000 })
          .then(() => true)
          .catch(() => false);
        if (opened) return;
      }
    }
    // Last resort: a city genuinely was already saved this session (e.g. a prior step's
    // geolocation grant) — the Enable Location modal only ever appears once per fresh
    // permission state, so the real re-trigger becomes the header's own city control instead.
    await this.citySelectionPage.openViaHeader();
    await expect(this.citySelectionPage.panelHeading()).toBeVisible({ timeout: 15_000 });
  }

  /**
   * Grounded 2026-09-01: once a city is saved, the real re-open control is the header's
   * `data-slot="drawer-trigger"` button (Map Point icon + current city name + Arrow Down) —
   * confirmed to open the identical "Select Your City" dialog as the Enable Location chain.
   */
  async reopenCitySelectionViaHeader(): Promise<void> {
    await this.citySelectionPage.openViaHeader();
    await expect(this.citySelectionPage.panelHeading()).toBeVisible({ timeout: 15_000 });
  }

  async expectScreenElementsVisible(): Promise<void> {
    await expect(this.citySelectionPage.popularCitiesHeading()).toBeVisible();
    await expect(this.citySelectionPage.popularCityCards().first()).toBeVisible();
    await expect(this.citySelectionPage.allCitiesHeading()).toBeVisible();
    await expect(this.citySelectionPage.allCitiesGrid().locator('button').first()).toBeVisible();
    await expect(this.citySelectionPage.searchInput()).toBeVisible();
    await expect(this.citySelectionPage.shareLocationButton()).toBeVisible();
  }

  async selectPopularCityWithNoSubCities(city: string): Promise<void> {
    await this.citySelectionPage.clickPopularCity(city);
    await expect(this.citySelectionPage.panelHeading()).toBeHidden({ timeout: 15_000 });
  }

  async openSubCityDropdown(city: string): Promise<void> {
    await this.citySelectionPage.clickPopularCity(city);
    await expect(this.citySelectionPage.subCityHeading(city)).toBeVisible({ timeout: 10_000 });
  }

  async expectSubCityOptionsVisible(city: string): Promise<void> {
    await this.openSubCityDropdown(city);
    await expect(this.citySelectionPage.subCityGrid(city).locator('button').first()).toBeVisible();
  }

  /** Also covers CTY-005 by passing subCity='All' — grounded live: selecting "All" saves the parent `city` name to the header, exactly like a real sub-city name would. */
  async selectSubCity(city: string, subCity: string): Promise<void> {
    await this.openSubCityDropdown(city);
    await this.citySelectionPage.clickSubCity(city, subCity);
    await expect(this.citySelectionPage.panelHeading()).toBeHidden({ timeout: 15_000 });
  }

  async expectHeaderCity(city: string): Promise<void> {
    await expect(this.citySelectionPage.headerCityButton()).toContainText(city, { timeout: 15_000 });
  }

  async searchCity(keyword: string): Promise<void> {
    await this.citySelectionPage.search(keyword);
  }

  async expectSearchResultsInclude(cityNames: string[]): Promise<void> {
    for (const name of cityNames) {
      await expect(this.citySelectionPage.searchResultCity(name)).toBeVisible({ timeout: 10_000 });
    }
  }

  /**
   * Grounded 2026-09-01: during an active (>=2 char) search, the "Popular cities"/"All cities"
   * headings disappear and the dialog's buttons ARE the filtered result set — no scoping needed
   * beyond the dialog itself (the mic button/close button carry no text, so they're naturally
   * excluded by the `filter(Boolean)` below).
   */
  async getSearchResultNames(keyword: string): Promise<string[]> {
    await this.citySelectionPage.search(keyword);
    const names = await this.citySelectionPage.dialog().locator('button').allTextContents();
    return names.map((n) => n.trim()).filter(Boolean).sort();
  }

  /** Shared by CTY-007 (case-insensitivity) and CTY-024 (leading/trailing space trimming) — both are "two keywords, identical result set" checks. */
  async expectSearchResultsIdentical(keywordA: string, keywordB: string): Promise<void> {
    const resultsA = await this.getSearchResultNames(keywordA);
    const resultsB = await this.getSearchResultNames(keywordB);
    expect(resultsA.length, `search "${keywordA}" should return at least one result`).toBeGreaterThan(0);
    expect(resultsA).toEqual(resultsB);
  }

  /** Grounded 2026-09-01: real copy is a heading "City Not Found!" plus "No matches found. Please try a different keyword." — confirmed via role query, not just innerText. */
  async expectCityNotFound(): Promise<void> {
    await expect(this.citySelectionPage.cityNotFoundHeading()).toBeVisible({ timeout: 10_000 });
    await expect(this.citySelectionPage.noMatchesMessage()).toBeVisible();
  }

  /**
   * Grounded 2026-09-01: below the 2-character minimum (CTY-022) AND for disallowed-character
   * input (CTY-023 — numbers, symbols) the app leaves the full unfiltered Popular/All-cities
   * view showing rather than filtering, erroring, or crashing — both scenarios share this one
   * real, confirmed signal.
   */
  async expectFullListStillShown(): Promise<void> {
    await expect(this.citySelectionPage.popularCitiesHeading()).toBeVisible();
    await expect(this.citySelectionPage.allCitiesHeading()).toBeVisible();
    await expect(this.citySelectionPage.allCitiesGrid().locator('button').first()).toBeVisible();
  }

  /**
   * Grounded 2026-09-01: granting geolocation permission WHILE the panel is already open (not
   * before navigation, unlike `LocationHelper.grantMumbaiGeolocation`) then clicking "Tap to
   * share location" is a real, working auto-detect flow — confirmed live: the dialog closes and
   * the header updates to the geolocation-derived city.
   */
  async grantGeolocationAndShareLocation(): Promise<void> {
    await this.page.context().grantPermissions(['geolocation']);
    await this.page.context().setGeolocation(MUMBAI_GEOLOCATION);
    await this.citySelectionPage.clickShareLocation();
    await expect(this.citySelectionPage.panelHeading()).toBeHidden({ timeout: 15_000 });
  }

  // BUG FIX (2026-09-11): confirmed live — the real response is wrapped one level deeper than
  // this method assumed: `{ok, data: {statusCode, message, data: {popularCities, cities}}}`, not
  // `{statusCode, message, data: {...}}` directly (the same `{ok, data: <real payload>}` envelope
  // already documented elsewhere in this codebase, e.g. the offers API). Every call site already
  // correctly expects the INNER shape (`api.data.popularCities` etc.) — unwrapping the outer
  // envelope here keeps all of them unchanged rather than touching each one.
  async fetchCityListApi(): Promise<ApiCityListResponse> {
    const response = await this.page.request.get(GET_CITY_LIST_URL);
    const json = await response.json();
    return json.data;
  }

  /** CTY-011/CTY-042: same underlying check (DOM order == API `sequenceNumber` ascending) — the ticket frames one as Positive and one as API parity, but both assert the identical thing. */
  async expectPopularCitiesInSequenceOrder(): Promise<void> {
    const api = await this.fetchCityListApi();
    const expected = [...api.data.popularCities].sort((a, b) => a.sequenceNumber - b.sequenceNumber).map((c) => c.cityName);
    const actual = (await this.citySelectionPage.popularCityCards().allTextContents()).map((t) => t.trim());
    expect(actual).toEqual(expected);
  }

  async expectPopularCitiesHaveImages(): Promise<void> {
    const cards = this.citySelectionPage.popularCityCards();
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      await expect(cards.nth(i).locator('img')).toBeVisible();
    }
  }

  async expectAllCitiesAlphabetical(): Promise<void> {
    const names = (await this.citySelectionPage.allCitiesGrid().locator('button').allTextContents()).map((t) => t.trim());
    expect(names.length).toBeGreaterThan(0);
    const sorted = [...names].sort((a, b) => a.localeCompare(b));
    expect(names).toEqual(sorted);
  }

  async closeWithoutSelecting(): Promise<void> {
    await this.citySelectionPage.close();
    await expect(this.citySelectionPage.panelHeading()).toBeHidden({ timeout: 10_000 });
  }

  /**
   * CTY-040: confirms the UI's Popular Cities and full city list match the live `get-city-list`
   * payload by name — the specific `statusCode`/`message` values are the ones the ticket
   * documents and were confirmed live via a direct API fetch (see CitySelectionPage.ts doc
   * comment).
   */
  async expectUiMatchesApiCityList(): Promise<void> {
    const api = await this.fetchCityListApi();
    expect(api.statusCode).toBe(200);
    expect(api.message).toBe('en.CITY_LISTED');

    const expectedPopular = [...api.data.popularCities.map((c) => c.cityName)].sort();
    const actualPopular = (await this.citySelectionPage.popularCityCards().allTextContents()).map((t) => t.trim()).sort();
    expect(actualPopular).toEqual(expectedPopular);

    const expectedAll = [...api.data.cities.map((c) => c.cityName)].sort();
    const actualAll = (await this.citySelectionPage.allCitiesGrid().locator('button').allTextContents()).map((t) => t.trim()).sort();
    expect(actualAll).toEqual(expectedAll);
  }

  /**
   * CTY-041: the live API's own `subCities[]` never includes a synthetic "All" entry — the UI
   * adds that itself (see CitySelectionPage.ts doc comment) — so the expected set here is
   * `['All', ...api subCities[].CityName]`, not a raw pass-through of the API array.
   */
  async expectSubCityDropdownMatchesApi(city: string): Promise<void> {
    const api = await this.fetchCityListApi();
    const entry = api.data.popularCities.find((c) => c.cityName === city);
    expect(entry, `expected "${city}" in popularCities with hasSubCities:true`).toBeTruthy();

    await this.openSubCityDropdown(city);
    const expected = ['All', ...(entry?.subCities.map((s) => s.CityName) ?? [])].sort();
    const actual = (await this.citySelectionPage.subCityGrid(city).locator('button').allTextContents()).map((t) => t.trim()).sort();
    expect(actual).toEqual(expected);
  }

  /**
   * CTY-027: mocks whichever popular city sits at index 1 (confirmed live to be "Bangalore" on
   * this dataset, but resolved by real name from a fresh API fetch rather than hardcoded, so this
   * stays correct if Admin Panel sequencing changes) to have no image, and returns its name for
   * the caller to assert against.
   */
  async mockPopularCityMissingImage(): Promise<string> {
    const api = await this.fetchCityListApi();
    const targetName = api.data.popularCities[1]?.cityName;
    expect(targetName, 'expected at least 2 popular cities in the live API payload').toBeTruthy();

    // BUG FIX (2026-09-11): same double-wrapped envelope fix as fetchCityListApi() and
    // mockEmptyCitiesList() — `json` here is the raw fetched response, one level deeper than
    // `json?.data?.popularCities` was reading from, so the target city was never actually found
    // or mutated.
    await this.page.route(GET_CITY_LIST_ROUTE_PATTERN, async (route) => {
      const response = await route.fetch();
      const json = await response.json();
      const city = json?.data?.data?.popularCities?.find((c: ApiPopularCity) => c.cityName === targetName);
      if (city) {
        city.cityImageURL = '';
        city.cityImageURLLight = '';
      }
      await route.fulfill({ response, json });
    });

    return targetName as string;
  }

  /**
   * Grounded 2026-09-01: a popular city with no `cityImageURL` resolves its `<img>` `src` to a
   * shared fallback asset path (contains "map-point"), distinct from every other card's
   * per-city `uat-media.pvrinox.com` URL — a real generic placeholder, not a broken-image icon.
   */
  async expectPopularCityShowsPlaceholderImage(city: string): Promise<void> {
    const image = this.citySelectionPage.popularCityImage(city);
    await expect(image).toBeVisible();
    const src = await image.getAttribute('src');
    expect(src, 'missing-image popular city should fall back to the generic placeholder asset').toMatch(/map-point/i);
  }

  /**
   * CTY-044: mocks `data.cities: []` while leaving `popularCities` untouched. Grounded live:
   * "Popular cities" renders normally, "All cities" heading stays present with zero buttons
   * underneath — no crash, no separate "no cities" copy.
   *
   * BUG FIX (2026-09-11): same double-wrapped envelope as fetchCityListApi()'s own fix
   * (`{ok, data: {statusCode, message, data: {popularCities, cities}}}`) — this was setting
   * `cities` one level too shallow (`json.data.cities`, which doesn't exist), so the real
   * `cities` array was never actually replaced and the full 61-city list kept rendering.
   */
  async mockEmptyCitiesList(): Promise<void> {
    await this.page.route(GET_CITY_LIST_ROUTE_PATTERN, async (route) => {
      const response = await route.fetch();
      const json = await response.json();
      json.data.data.cities = [];
      await route.fulfill({ response, json });
    });
  }

  async expectAllCitiesEmptyPopularIntact(): Promise<void> {
    await expect(this.citySelectionPage.popularCitiesHeading()).toBeVisible();
    await expect(this.citySelectionPage.popularCityCards().first()).toBeVisible();
    await expect(this.citySelectionPage.allCitiesHeading()).toBeVisible();
    await expect(this.citySelectionPage.allCitiesGrid().locator('button')).toHaveCount(0);
  }
}
