import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { CuratedShowsPage } from '@pages/CuratedShowsPage';
import { dismissPromoPopup, grantMumbaiGeolocation, UAT_BASE_URL } from '@utils/LocationHelper';
import { Logger } from '@utils/Logger';
import { WaitHelper } from '@utils/WaitHelper';
import { CURATED_SHOWS_API_ROUTE_PATTERN, type CuratedShowCategoryMock } from '@testdata/curatedShowsData';

/**
 * BUG FIX (2026-09-11, live run): the real `/api/curated-shows` response is double-wrapped —
 * `{ok, data: {statusCode, messageType, message, data: {cityId, curatedShows, ...}}}` — one layer
 * deeper than this interface originally assumed (`{statusCode, ..., data: {curatedShows}}`).
 * Confirmed live via direct fetch. Same site-wide envelope convention `CitySelectionModule.ts`'s
 * `fetchCityListApi()` doc comment documents for `/api/get-city-list`. This shape mismatch made
 * `mockCuratedShows`/`mockCuratedShowsPerCity` silently no-op (writing `curatedShows` one level too
 * shallow, so the real empty array always won and every content-present test saw the empty state
 * instead) — the root cause of ~29 curated-shows.spec.ts failures on 2026-09-11.
 */
interface CuratedShowsApiResponse {
  ok: boolean;
  data: {
    statusCode: number;
    messageType: string;
    message: string;
    data: {
      cityId: string;
      curatedShows: CuratedShowCategoryMock[];
      experienceDetails?: Record<string, unknown>;
    };
  };
}

export class CuratedShowsModule {
  private readonly curatedShowsPage: CuratedShowsPage;

  constructor(private page: Page) {
    this.curatedShowsPage = new CuratedShowsPage(page);
  }

  /**
   * Direct-URL navigation, matching this repo's established pattern for every other module
   * (`OffersPage.gotoOffersRoute`, `EventListingPage.gotoEventsRoute`) rather than clicking
   * through the header — see `CuratedShowsPage.ts` doc comment for why the "More" menu path
   * (CSH-001/002) was dropped as unreliable. Grants Mumbai geolocation first so the "Enable
   * Location" modal never blocks the route (see `gotoCuratedShowsWithoutLocationPermission` for
   * the deliberately-ungranted variant CSH-045 needs).
   */
  async gotoCuratedShows(): Promise<void> {
    Logger.info('Opening /curated-shows on UAT with Mumbai geolocation granted');
    await grantMumbaiGeolocation(this.page);
    await this.curatedShowsPage.goto(UAT_BASE_URL);
    await dismissPromoPopup(this.page);
    await expect(this.curatedShowsPage.pageHeading()).toBeVisible({ timeout: 20_000 });
  }

  /** CSH-045: a fresh context with no geolocation permission granted blocks on the real "Enable
   * Location" modal before any curated-shows content loads — confirmed live. Deliberately skips
   * `grantMumbaiGeolocation`. */
  async gotoCuratedShowsWithoutLocationPermission(): Promise<void> {
    Logger.info('Opening /curated-shows on UAT with NO location permission granted (CSH-045)');
    await this.curatedShowsPage.goto(UAT_BASE_URL);
  }

  async expectLocationPromptShown(): Promise<void> {
    await expect(this.curatedShowsPage.enableLocationHeading()).toBeVisible({ timeout: 15_000 });
  }

  /**
   * Registers a `page.route()` interceptor BEFORE navigation (must be called before
   * `gotoCuratedShows`) that replaces the real `/api/curated-shows` response's `curatedShows[]`
   * with the given mock categories, reusing the real response envelope via `route.fetch()` +
   * `route.fulfill({ response, json })` — same pattern `CitySelectionModule.ts` uses. See
   * `curatedShowsData.ts` for why these field names are trustworthy, not guessed.
   *
   * BUG FIX (2026-09-11, live run): swallows the specific `route.fetch: Test ended` error —
   * reproduced live (3/3, isolated) as an "error not part of any test" that Playwright attributes
   * to whichever test happens to run next. Real cause: this handler stays registered for the whole
   * test, so a late in-flight `/api/curated-shows` request (e.g. one a city switch fires just
   * before the test's own teardown) can still be mid-`route.fetch()` when the page/context closes —
   * a Playwright teardown-timing artifact, not a product or test-correctness bug (the test's own
   * assertions had already passed in every reproduction). Matches Playwright's own documented
   * remediation for this exact error (`page.unrouteAll({ behavior: 'ignoreErrors' })`), applied at
   * the handler level so every caller is covered without remembering explicit cleanup.
   */
  async mockCuratedShows(categories: CuratedShowCategoryMock[]): Promise<void> {
    await this.page.route(CURATED_SHOWS_API_ROUTE_PATTERN, async (route) => {
      try {
        const response = await route.fetch();
        const json: CuratedShowsApiResponse = await response.json();
        json.data.data.curatedShows = categories;
        await route.fulfill({ response, json });
      } catch (error) {
        if (!String(error).includes('Test ended')) throw error;
      }
    });
  }

  /**
   * CSH-022/046/062/063/070 (city-specific content / switching): branches the mocked response by
   * the real `cityId` query param so different cities can return different content within one
   * test — the underlying mechanism the real "curated shows are city specific" behavior would use
   * if any UAT city actually had content configured (none do — see `CuratedShowsPage.ts`).
   *
   * BUG FIX (2026-09-11, live run): same `route.fetch: Test ended` teardown-timing artifact
   * `mockCuratedShows` documents above — reproduced live via CSH-022's city-switch flow
   * specifically (a Bangalore `/api/curated-shows` request was still in flight when the test's own
   * assertions finished and the page tore down).
   */
  async mockCuratedShowsPerCity(byCityId: Record<string, CuratedShowCategoryMock[]>): Promise<void> {
    await this.page.route(CURATED_SHOWS_API_ROUTE_PATTERN, async (route) => {
      try {
        const url = new URL(route.request().url());
        const cityId = url.searchParams.get('cityId') ?? '';
        const response = await route.fetch();
        const json: CuratedShowsApiResponse = await response.json();
        json.data.data.curatedShows = byCityId[cityId] ?? [];
        await route.fulfill({ response, json });
      } catch (error) {
        if (!String(error).includes('Test ended')) throw error;
      }
    });
  }

  // ---- Empty state (real, live, no mocking needed) ----

  async expectEmptyState(): Promise<void> {
    await expect(this.curatedShowsPage.noCuratedShowsHeading()).toBeVisible({ timeout: 15_000 });
    await expect(this.curatedShowsPage.noCuratedShowsMessage()).toBeVisible();
    await expect(this.curatedShowsPage.backToHomepageButton()).toBeVisible();
  }

  /** CSH-054: exact copy match against the real live message text. */
  async expectExactEmptyStateMessageText(): Promise<void> {
    const text = (await this.curatedShowsPage.noCuratedShowsMessage().innerText()).replace(/\s+/g, ' ').trim();
    expect(text).toContain("Thank you for your interest in our curated shows. There is no curated content currently listed in your city, but hopefully, you'll be able to enjoy your favourite movies soon. Please stay tuned!".replace(/\s+/g, ' '));
  }

  /** CSH-059/060/068: no category/banner sections render in the empty state — the "Learn More"
   * trigger only ever exists per-category, so its absence is a reliable proxy for "no categories
   * rendered at all". */
  async expectNoCategoriesOrBanners(): Promise<void> {
    await expect(this.curatedShowsPage.learnMoreLinks()).toHaveCount(0);
  }

  async clickBackToHomepageAndExpectHome(): Promise<void> {
    await this.curatedShowsPage.clickBackToHomepage();
    await expect(this.page.getByRole('heading', { name: /now showing/i })).toBeVisible({ timeout: 20_000 });
  }

  async reopenCuratedShowsAndExpectEmptyState(): Promise<void> {
    await this.gotoCuratedShows();
    await this.expectEmptyState();
  }

  async expectSearchBarVisible(): Promise<void> {
    await expect(this.curatedShowsPage.searchInput()).toBeVisible();
  }

  /** CSH-061: search input on the empty-state page accepts input without crashing or producing a
   * different state — confirmed live, still just the same empty state. */
  async searchOnEmptyStateAndExpectNoCrash(keyword: string): Promise<void> {
    await this.curatedShowsPage.search(keyword);
    await this.expectEmptyState();
  }

  // ---- Content-present state (mocked, real render mechanism — see class/page doc comments) ----

  async expectCategoryVisible(categoryName: string): Promise<void> {
    await expect(this.curatedShowsPage.categoryHeading(categoryName)).toBeVisible({ timeout: 15_000 });
  }

  async expectCategoryHidden(categoryName: string): Promise<void> {
    await expect(this.curatedShowsPage.categoryHeading(categoryName)).toHaveCount(0);
  }

  async expectMovieVisible(movieName: string): Promise<void> {
    await expect(this.curatedShowsPage.movieHeading(movieName)).toBeVisible({ timeout: 15_000 });
  }

  async expectMovieHidden(movieName: string): Promise<void> {
    await expect(this.curatedShowsPage.movieHeading(movieName)).toHaveCount(0);
  }

  /** CSH-040: a movie mapped to two categories renders its heading twice (once per category) —
   * `toHaveCount` avoids the strict-mode violation a plain `.toBeVisible()` would hit on a
   * multi-match locator. */
  async expectMovieHeadingCount(movieName: string, count: number): Promise<void> {
    await expect(this.curatedShowsPage.movieHeading(movieName)).toHaveCount(count);
  }

  /** CSH-047: real finding, contradicts the sheet — a category with an empty `movies[]` still
   * renders its own heading + "Learn More" trigger on initial load (only a *search filter* down
   * to zero matches hides a category entirely, per `searchWithNoMatchAndExpectEmptyState` above,
   * not a category that was simply configured with no movies). Documents the real behavior. */
  async expectCategoryVisibleWithNoMovies(categoryName: string): Promise<void> {
    await expect(this.curatedShowsPage.categoryHeading(categoryName)).toBeVisible({ timeout: 15_000 });
  }

  async expectCategoryBannerVisible(index = 0): Promise<void> {
    await expect(this.curatedShowsPage.categoryBannerImage(index)).toBeVisible({ timeout: 15_000 });
  }

  /** CSH-005: two "Background" images render per category (see `CuratedShowsPage.ts`), so a
   * fixed per-category `nth()` isn't a stable "N categories -> N banners" check — this instead
   * confirms at least one banner image renders for each of the given category count. */
  async expectCategoryBannerCountAtLeast(minCount: number): Promise<void> {
    const count = await this.curatedShowsPage.categoryBannerImages().count();
    expect(count).toBeGreaterThanOrEqual(minCount);
  }

  /** CSH-020: poster (the movie card's own image, always rendered — real or placeholder-fallback)
   * plus a genre text confirmed live to render on the card itself. */
  async expectMovieMetadataVisible(movieName: string, genre: string): Promise<void> {
    await expect(this.curatedShowsPage.movieHeading(movieName)).toBeVisible({ timeout: 15_000 });
    await expect(this.page.getByText(genre, { exact: true }).first()).toBeVisible();
  }

  /** CSH-049: confirms the real Swiper horizontal-carousel container renders for the movie list. */
  async expectMovieCarouselVisible(index = 0): Promise<void> {
    await expect(this.curatedShowsPage.movieCarousel(index)).toBeVisible({ timeout: 15_000 });
  }

  /**
   * CSH-019/034/044: RESOLVED — the movie card's real `onClick` handler navigates to
   * `/moviesessions/{city}/{slug}/{filmId}` once the mock movie carries a real `filmId` field (the
   * genuine gap the earlier "dead click" finding missed — see `CuratedShowsPage.ts`/
   * `curatedShowsData.ts` doc comments for the full grounding trail). Works identically for a
   * guest (CSH-044) since no scenario in this file logs in.
   */
  async clickMovieCardAndExpectSessionNavigation(movieName: string): Promise<void> {
    await this.curatedShowsPage.clickMovieCard(movieName);
    await this.curatedShowsPage.waitForMovieSessionsUrl();
  }

  /** CSH-035: the real, observable effect of the "Special Shows" `categoryName` field — it
   * survives as the `curatedType` query param on the resulting session-page URL. Confirmed live
   * there is no separate on-page filter badge/label this param drives (`CSH-036`'s "headsup"
   * message doesn't exist either), so the URL param is the only real, assertable "remains applied"
   * signal. Parsed via `URL`/`URLSearchParams` (not a raw string/regex match) so `+`-encoded spaces
   * decode the same way the real app's own concatenated (non-`encodeURIComponent`'d) query value
   * ends up being interpreted by the browser. */
  async expectSessionUrlCuratedType(expectedCategoryName: string): Promise<void> {
    const url = new URL(this.page.url());
    expect(url.searchParams.get('curatedType')).toBe(expectedCategoryName);
  }

  /** Grounded 2026-09-01: the app filters client-side with no visible loading indicator — callers
   * rely on their own follow-up `expect(...).toBeVisible()`/`toHaveCount()` assertions (which
   * auto-retry until the filter settles) rather than a fixed wait here. */
  async search(keyword: string): Promise<void> {
    await this.curatedShowsPage.search(keyword);
  }

  /** CSH-008: confirmed live — a non-matching keyword collapses to the exact same top-level empty
   * state as "no curated content at all", not a distinct "No Result Found!" state. */
  async searchWithNoMatchAndExpectEmptyState(keyword: string): Promise<void> {
    await this.search(keyword);
    await this.expectEmptyState();
  }

  /** CSH-011/012: "Learn More" is this build's real implementation of the sheet's "info icon". */
  async openCategoryInfo(categoryIndex = 0): Promise<void> {
    await this.curatedShowsPage.clickLearnMore(categoryIndex);
    await expect(this.curatedShowsPage.aboutDialogHeading()).toBeVisible({ timeout: 10_000 });
  }

  async expectCategoryInfoContent(subHeading: string): Promise<void> {
    await expect(this.curatedShowsPage.aboutDialog()).toContainText(subHeading);
  }

  async closeCategoryInfoAndExpectClosed(): Promise<void> {
    await this.curatedShowsPage.closeAboutDialog();
    await expect(this.curatedShowsPage.aboutDialog()).toBeHidden({ timeout: 10_000 });
  }

  /** CSH-039/114: DOM order mirrors the mocked `curatedShows[]` array order — the closest real
   * mechanism to "admin-configured sequence" that exists (no separate sequence field was found in
   * the real source — see `CuratedShowsPage.ts`). */
  async expectCategoriesInOrder(categoryNames: string[]): Promise<void> {
    const allHeadings = await this.page.getByRole('heading').allTextContents();
    const actualOrder = allHeadings.filter((h) => categoryNames.includes(h));
    expect(actualOrder).toEqual(categoryNames);
  }

  /** CSH-048: proxy for "how many categories rendered" — each category renders exactly one
   * "Learn More" trigger, confirmed live. */
  async expectCategoryCount(count: number): Promise<void> {
    await expect(this.curatedShowsPage.learnMoreLinks()).toHaveCount(count);
  }

  async scrollToBottomAndExpectNoCrash(): Promise<void> {
    await this.page.keyboard.press('End').catch(() => undefined);
    await this.page.mouse.wheel(0, 20_000);
    // The page heading assertion below auto-retries/polls, so no fixed settle wait is needed.
    await expect(this.curatedShowsPage.pageHeading()).toBeVisible();
  }

  // ---- Voice search (mic) ----

  /** Must be called BEFORE `gotoCuratedShows` — overrides `navigator.permissions.query` for
   * `'microphone'` to always resolve `'denied'`, since Playwright's `grantPermissions` API has no
   * direct way to force a *denied* (as opposed to un-granted/prompt) state. */
  async forceMicrophonePermissionDenied(): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- runs in the browser (no DOM
    // lib configured for this Node project), so `navigator`/`window` are only reachable via `any`.
    await this.page.addInitScript(() => {
      /* eslint-disable @typescript-eslint/no-explicit-any */
      const nav = (globalThis as any).navigator;
      const originalQuery = nav.permissions.query.bind(nav.permissions);
      nav.permissions.query = (params: { name: string }) => {
        if (params && params.name === 'microphone') {
          return Promise.resolve({ state: 'denied', onchange: null });
        }
        return originalQuery(params);
      };
      /* eslint-enable @typescript-eslint/no-explicit-any */
    });
  }

  /** CSH-009: confirmed live real native `alert()` — "Microphone permission is blocked. Please
   * enable it in browser settings." — fired on mic click when permission is denied. Asserts the
   * exact message so the module (not the spec) owns the assertion, per this repo's layering. */
  async expectMicDeniedAlertShown(): Promise<void> {
    // BUG FIX (2026-09-01, live run): a real `alert()` blocks the page's JS thread synchronously,
    // so `click()` itself never resolves until the dialog is dismissed — awaiting the click
    // BEFORE the dialog deadlocked for the full test timeout. Dismissing inside the `dialog`
    // listener itself (racing it alongside the click, not after) lets the click complete.
    let message: string | undefined;
    const dialogHandled = new Promise<void>((resolve) => {
      this.page.once('dialog', (dialog) => {
        message = dialog.message();
        void dialog.dismiss().then(resolve);
      });
    });
    await Promise.all([dialogHandled, this.curatedShowsPage.clickMic()]);
    expect(message).toBe('Microphone permission is blocked. Please enable it in browser settings.');
  }

  // ---- API / resilience ----

  async fetchCuratedShowsApi(cityId: string): Promise<CuratedShowsApiResponse> {
    const response = await this.page.request.get(`${UAT_BASE_URL}/api/curated-shows?cityId=${cityId}`);
    return response.json();
  }

  /** CSH-066: confirms the real "empty response" API contract directly (statusCode 200, real
   * messageType, empty array) rather than just inferring it from the UI. */
  async expectApiEmptyResponseShape(cityId: string): Promise<void> {
    const api = await this.fetchCuratedShowsApi(cityId);
    expect(api.data.statusCode).toBe(200);
    expect(api.data.messageType).toBe('CURATED_SHOW_FETCHED');
    expect(api.data.data.curatedShows).toEqual([]);
  }

  /**
   * CSH-037: matches `OffersModule.ts`'s established `route.abort('internetdisconnected')`
   * pattern for simulating "no internet" without breaking `page.goto()` itself. Confirmed live:
   * the real behavior is a graceful fallback to the same empty-state UI, NOT a distinct error
   * message (the sheet's own expectation) — must be called before `gotoCuratedShows`.
   */
  async blockCuratedShowsApi(): Promise<void> {
    await this.page.route(CURATED_SHOWS_API_ROUTE_PATTERN, (route) => route.abort('internetdisconnected'));
  }

  async unblockCuratedShowsApi(): Promise<void> {
    await this.page.unroute(CURATED_SHOWS_API_ROUTE_PATTERN).catch(() => undefined);
  }

  /** CSH-067: blocks the API *after* a successful initial (empty-state) load, then confirms the
   * "Back to Homepage" CTA — a pure client-side navigation — still works gracefully. */
  async blockApiAfterLoadAndClickBackHome(): Promise<void> {
    await this.expectEmptyState();
    await this.blockCuratedShowsApi();
    await this.clickBackToHomepageAndExpectHome();
    await this.unblockCuratedShowsApi();
  }

  /** CSH-052: a general Web-platform sanity pass — no unexpected console errors beyond the
   * known third-party noise already documented elsewhere in this suite (`OffersModule.ts`'s
   * `THIRD_PARTY_TRACKING_HOSTS`, plus this site's own known-benign `getTech`/`registerPlugin`
   * page errors observed during every grounding pass here).
   *
   * BUG FIX (2026-09-11, live run): a real, reproducible (2/2) CSP `connect-src` violation blocking
   * a `stats.g.doubleclick.net` analytics beacon was NOT covered by the old pattern — genuinely the
   * same category of known third-party tracking noise the doc comment above already calls out
   * (`OffersModule.ts`'s own `THIRD_PARTY_TRACKING_HOSTS` includes `google-analytics.com`), just
   * surfacing as a CSP block rather than a missing-network error. Widened narrowly to CSP
   * violations naming a doubleclick/google-analytics/googlesyndication host specifically, so a
   * genuine CSP violation against the app's own origin still fails this check. */
  async expectNoUnexpectedConsoleErrors(): Promise<void> {
    const unexpected: string[] = [];
    const ignorePattern = /getTech|registerPlugin|requestStorageAccess|Content Security Policy.*(doubleclick|google-analytics|googlesyndication)\.(com|net)/i;
    this.page.on('console', (msg) => {
      if (msg.type() === 'error' && !ignorePattern.test(msg.text())) unexpected.push(msg.text());
    });
    await this.gotoCuratedShows();
    await WaitHelper.forNetworkIdle(this.page, 5_000).catch(() => undefined);
    expect(unexpected, `unexpected console errors: ${JSON.stringify(unexpected)}`).toEqual([]);
  }

  /** CSH-051/071: generous timeout budget (per the `sandbox-resource-constraints` project memory
   * — this sandbox can be transiently slow) rather than a tight performance-test threshold. */
  async expectLoadsWithinTimeout(maxMs: number): Promise<void> {
    const start = Date.now();
    await this.gotoCuratedShows();
    const elapsed = Date.now() - start;
    expect(elapsed, `curated-shows load took ${elapsed}ms, expected under ${maxMs}ms`).toBeLessThan(maxMs);
  }
}
