import type { Page } from '@playwright/test';
import { clickThroughOverlays, UAT_CITY, UAT_SUB_CITY } from '@utils/LocationHelper';

/**
 * Ticket: requirements/city-selection.md (PRD UC 9, 26 scenarios). Grounded 2026-09-01 against
 * UAT (inox-uat-web.pvrinox.com) via headless-Playwright diagnostic passes (Playwright MCP's
 * interactive browser tool fails to launch in this sandbox — no display server — see the
 * `pvr-inox-grounding-technique` project memory; scratchpad `ground-city-*.js` scripts hold the
 * raw diagnostics this comment summarizes).
 *
 * **Trigger confirmed**: on a fresh context with no geolocation permission granted, the
 * "Enable Location" modal's `role="button" name="Cancel"` opens the City Selection panel
 * directly — no intermediate popular-city/sub-city chain like the homepage's
 * `LocationHelper.dismissLocationAndSelectCity` (that helper is for *auto-selecting* a default
 * city and driving the modal away entirely; this page deliberately stops at the open panel
 * instead). Once a city is already saved (geolocation pre-granted, or a prior selection this
 * session), the modal never appears again — the real re-trigger is the header's city control:
 * a real `<button data-slot="drawer-trigger" aria-haspopup="dialog">` containing a "Map Point
 * Icon" + the currently-selected city name + an "Arrow Down" icon (confirmed live, both paths
 * open the identical `role="dialog"` panel with heading "Select Your City").
 *
 * **Panel structure** (all inside `role="dialog"`): heading "Select Your City", a
 * `input[placeholder="Search city"]` (a plain `type="text"`, NOT `type="search"` — `getByRole
 * ('searchbox')` does not resolve on it), a microphone icon (`<img alt="Microphone Icon">`
 * wrapped in an unlabeled `<button>`), a "Tap to share location" button (its accessible text
 * bundles a static subtext — "Tap to share locationUnable to detect your current location" —
 * confirmed present even before any click, not an error state), a "Popular cities" heading
 * with a 3-column grid of city cards (each a `<button aria-label="Click to select {city} as
 * your location">` — this exact aria-label pattern is the one already used by
 * `LocationHelper.dismissLocationAndSelectCity`'s `cityCard` locator, so it's proven, not
 * guessed), and an "All cities" heading with a 2-column grid of plain unlabeled buttons.
 *
 * **Duplicate-name bug worth knowing** (not a defect, just a locator trap): every popular city
 * (Mumbai-All, Bangalore, Delhi-NCR, Hyderabad, Chennai) ALSO appears as its own entry in the
 * alphabetical "All cities" grid — so `getByRole('button', { name: 'Bangalore' })` alone matches
 * twice. `popularCityCard()` disambiguates via the aria-label (only popular cards have it);
 * `allCitiesButton()` is scoped to the sibling grid after the "All cities" heading. A second
 * trap: cities with sub-cities (Delhi-NCR, Mumbai-All) render an `<img alt="Arrow Down">` INSIDE
 * their "All cities" button, which the browser folds into the button's *accessible name*
 * ("Delhi-NCR Arrow Down") — an exact-name role query for "Delhi-NCR" there returns 0 matches.
 * `allCitiesButton()` filters on `textContent` (`hasText`, which excludes `alt` text) instead of
 * accessible name to sidestep this.
 *
 * **Sub-city dropdown**: clicking a popular city with sub-cities renders a heading
 * "SUB-CITIES OF {city}" plus buttons for each real sub-city AND a synthetic "All" button (not
 * present in the `get-city-list` API's own `subCities[]` array — the UI adds it). Confirmed live
 * for both Mumbai-All (sub-cities: Mumbai, All) and Delhi-NCR (sub-cities: Delhi, Greater Noida,
 * Faridabad, Gurgaon, All — no "Noida" exists on UAT, matching the `pvr-inox-grounding-technique`
 * memory's earlier finding). Clicking "All" closes the dialog and saves the *parent* city name
 * ("Mumbai-All"/"Delhi-NCR") to the header; clicking a real sub-city (e.g. "Gurgaon") saves the
 * sub-city's own name to the header instead.
 *
 * **Search, confirmed live**: case-insensitive and partial-match ("DEL"/"del"/"de" all return
 * the same result set, e.g. "de" -> Delhi, Delhi-NCR, Hyderabad — matches mid-word), trims
 * leading/trailing spaces (" Delhi " == "Delhi"), and genuinely gates on a 2-character minimum
 * — 1 character ("d") leaves the full unfiltered Popular/All-cities view showing, not an empty
 * result. Numbers and symbols (`123`, `@#$%`) do NOT crash or filter to empty — they leave the
 * full unfiltered list showing too (same as below-minimum), so no separate "rejected" state
 * exists to assert on beyond "no crash, list unaffected". A genuinely unmatched keyword shows a
 * real `role="heading"` "City Not Found!" plus text "No matches found. Please try a different
 * keyword." (both confirmed via role/text query, not just innerText).
 *
 * **Alias search — real finding, contradicts the ticket's premise**: searching "Gurgaon" (any
 * case) returns only a "Gurgaon" result — the live `get-city-list` payload has no "Gurugram"
 * entry anywhere (confirmed by fetching the API directly and grepping the full `cities[]`
 * array), and the UI does not synthesize one. `cityNameAlias` exists as a field on the API shape
 * but is empty for Gurgaon (only one city, "Bharuch", has it set, to its own name). CTY-008 is
 * `test.fixme` for this reason — the alias behavior the PRD describes is not present in this
 * environment's live data or UI.
 *
 * **"Tap to share location", confirmed live**: with geolocation permission granted mid-session
 * (after the panel is already open — permissions apply immediately, unlike page-load-time
 * grants) and a real click, the dialog closes and the header updates to the geolocation-derived
 * city ("Mumbai" for the coordinates used) — a real, working auto-detect flow (CTY-010). Without
 * permission granted, the button click is a no-op (dialog stays open, same static subtext).
 *
 * **Voice search / denied-mic prompt — real finding, both `test.fixme`**: the microphone button
 * is real and clickable, but neither a real un-granted permission (`navigator.permissions.query
 * ('microphone')` stays `'prompt'` after the click) nor a forced `getUserMedia` rejection
 * (`NotAllowedError`, simulating an explicit deny) produced any visible DOM change — no new
 * dialog, no Settings/Cancel popup, no console error tied to the click. This matches
 * `GlobalSearchPage.ts`'s own prior finding that voice search may be App/M-Site-only; CTY-009
 * and CTY-025 are `test.fixme` with this live-grounded reason rather than asserting on UI that
 * was never observed to render.
 *
 * **List-load-failure — real bug, both `test.fixme`**: mocking `get-city-list` to return a 500
 * (or any non-200) makes the "Select Your City" panel render as a completely blank
 * `role="dialog"` after Cancel is clicked — no heading, no content, no error message of any
 * kind (confirmed via `page.on('pageerror')`/full body-text dump, not just a missing locator).
 * This directly contradicts the PRD's acceptance criterion ("Network/server failure ... shows an
 * error message instead of a blank screen") — CTY-026 and CTY-043 are `test.fixme` documenting
 * this as a real, live-grounded product gap, not an automation limitation.
 *
 * **Empty `cities[]` — confirmed real and automatable (CTY-044)**: mocking `data.cities: []`
 * while leaving `popularCities` untouched renders the panel normally — "Popular cities" heading
 * and its 5 real cards intact, "All cities" heading present with zero buttons underneath (no
 * crash, no separate "no cities" copy — just an empty grid).
 *
 * **Missing popular-city image — confirmed real and automatable (CTY-027)**: mocking a popular
 * city's `cityImageURL`/`cityImageURLLight` to empty strings makes its `<img alt="City Icon">`
 * resolve to a different, shared fallback asset path (`.../assets/pvr/map-point-lin...`, not the
 * per-city `uat-media.pvrinox.com` URL every other card uses) — a real generic placeholder, not
 * a broken-image icon.
 */
export class CitySelectionPage {
  constructor(private page: Page) {}

  readonly enableLocationCancelButton = () => this.page.getByRole('button', { name: /^cancel$/i });
  // BUG FIX (2026-09-01, curated-shows.spec.ts grounding): a plain `button[data-slot="drawer-
  // trigger"]` selector is no longer unique page-wide now that Curated Shows' own "Learn More"
  // info popup uses the identical Radix drawer-trigger primitive — confirmed live via a strict-
  // mode-violation failure (2 matches: the header city control AND "Learn More"). Scoped to the
  // "Map Point Icon" alt text every header city button always renders (confirmed in
  // `LocationHelper.dismissLocationAndSelectCity`'s own `cityCard` grounding), which no other
  // drawer-trigger on this site uses.
  //
  // BUG FIX (2026-09-11): confirmed live — the real header city button no longer carries
  // `data-slot="drawer-trigger"` at all (a genuine markup change, not a race — polled its
  // presence for 10+ continuous seconds after a city change and it was permanently absent, not
  // flickering). The button's own outerHTML now has no `data-slot` attribute whatsoever. It
  // still reliably renders the "Map Point Icon" image (confirmed: exactly 1 match page-wide),
  // so that alone is enough to identify it — dropped the now-dead attribute selector rather than
  // filtering by it. This was the real root cause behind every city-selection.spec.ts failure
  // that traced through this locator (openViaHeader's click and expectHeaderCity's text check
  // alike), not the overlay/timing race it looked like at first.
  readonly headerCityButton = () => this.page.locator('button').filter({ has: this.page.getByAltText('Map Point Icon') });

  readonly dialog = () => this.page.getByRole('dialog');
  readonly panelHeading = () => this.page.getByRole('heading', { name: 'Select Your City', exact: true });
  readonly closeButton = () => this.page.locator('button[data-slot="drawer-close"]');

  readonly searchInput = () => this.page.getByPlaceholder('Search city');
  readonly micButton = () => this.page.locator('button').filter({ has: this.page.getByAltText('Microphone Icon') });
  readonly shareLocationButton = () => this.page.getByRole('button', { name: /tap to share location/i });

  readonly popularCitiesHeading = () => this.page.getByRole('heading', { name: 'Popular cities', exact: true });
  // Grounded: only popular cards carry this aria-label — proven pattern, reused from
  // LocationHelper.dismissLocationAndSelectCity's cityCard locator on the homepage flow.
  readonly popularCityCard = (city: string) => this.page.getByRole('button', { name: new RegExp(`click to select ${city} as your location`, 'i') });
  readonly popularCityCards = () => this.page.locator('.city-info button');
  readonly popularCityImage = (city: string) => this.popularCityCard(city).locator('img');

  readonly allCitiesHeading = () => this.page.getByRole('heading', { name: 'All cities', exact: true });
  // Scoped to the grid immediately after the "All cities" heading (CSS adjacent-sibling —
  // confirmed live to resolve to exactly one match) to avoid the popular/all duplicate-name trap
  // documented in the class doc comment above.
  readonly allCitiesGrid = () => this.page.locator('h2:text-is("All cities") + div');
  // `hasText` matches textContent (excludes the "Arrow Down" <img alt="">, unlike accessible
  // name) — see class doc comment's "Duplicate-name bug" note for why an exact role-name query
  // fails on Delhi-NCR/Mumbai-All here.
  readonly allCitiesButton = (city: string) => this.allCitiesGrid().locator('button').filter({ hasText: new RegExp(`^${city}$`) });

  readonly subCityHeading = (city: string) => this.page.getByRole('heading', { name: new RegExp(`sub-cities of ${city}`, 'i') });
  // Grounded: the real DOM nests "SUB-CITIES OF {city}" in an `<h3>` whose PARENT div (not the
  // heading itself) has the button grid as its next sibling — a plain heading-adjacent-sibling
  // selector (like allCitiesGrid()) resolves to 0 matches here. `:has(> h3:text-is(...))`
  // targets that specific parent wrapper directly; confirmed live for both Mumbai-All (buttons:
  // All, Mumbai) and Delhi-NCR (buttons: All, Delhi, Greater Noida, Faridabad, Gurgaon).
  readonly subCityGrid = (city: string) => this.page.locator(`div:has(> h3:text-is("SUB-CITIES OF ${city}")) + div`);
  readonly subCityButton = (city: string, name: string) => this.subCityGrid(city).getByRole('button', { name, exact: true });

  // Rendered once "Popular cities"/"All cities" headings disappear during an active search — the
  // filtered result set is unambiguous on its own, no popular/all-cities duplication to scope.
  readonly searchResultCity = (city: string) => this.dialog().locator('button').filter({ hasText: new RegExp(`^${city}$`) });

  readonly cityNotFoundHeading = () => this.page.getByRole('heading', { name: 'City Not Found!', exact: true });
  readonly noMatchesMessage = () => this.page.getByText(/no matches found/i);

  async goto(baseUrl: string): Promise<void> {
    await this.page.goto(baseUrl);
  }

  async dismissEnableLocationModalIfShown(): Promise<boolean> {
    const shown = await this.enableLocationCancelButton().isVisible({ timeout: 12_000 }).catch(() => false);
    if (shown) await this.enableLocationCancelButton().click();
    return shown;
  }

  /**
   * Bug fix (2026-09-01): confirmed live during CTY-050 grounding (reopening City Selection
   * right after a real login round trip) — a stale `data-vaul-overlay` backdrop (left behind by
   * the just-closed login/account-panel drawer, still mid-transition) can intercept pointer
   * events on this button for the full retry budget even though Playwright reports the button
   * itself visible/enabled/stable throughout (same class of overlay-outlives-its-own-dismissal
   * quirk documented in the `pvr-inox-grounding-technique` project memory). Escape reliably
   * clears it before the click is attempted.
   *
   * BUG FIX (2026-09-11): confirmed live — this click had no retry/recovery at all, unlike
   * RegisterLoginPage's equivalent header click, which already wraps itself in
   * `clickThroughOverlays` (dismisses the location modal, promo popups, and the real
   * intermittent "Session Expired" modal via reload, then retries). This one's single raw
   * attempt could lose to any of those same overlays with no second chance — reproduced live via
   * city-selection.spec.ts's CTY-002 failing non-deterministically at different points across
   * repeated runs, consistent with a real but recoverable race rather than a deterministic bug.
   * Wrapping in the same shared retry helper closes that gap.
   */
  async openViaHeader(): Promise<void> {
    await clickThroughOverlays(
      this.page,
      async () => {
        await this.page.keyboard.press('Escape').catch(() => undefined);
        await this.headerCityButton().click({ timeout: 15_000 });
      },
      { city: UAT_CITY, subCity: UAT_SUB_CITY },
    );
  }

  async search(keyword: string): Promise<void> {
    await this.searchInput().fill(keyword);
  }

  async clearSearch(): Promise<void> {
    await this.searchInput().fill('');
  }

  async clickPopularCity(city: string): Promise<void> {
    await this.popularCityCard(city).click();
  }

  async clickAllCitiesCity(city: string): Promise<void> {
    await this.allCitiesButton(city).click();
  }

  async clickSubCity(city: string, name: string): Promise<void> {
    await this.subCityButton(city, name).click();
  }

  async clickShareLocation(): Promise<void> {
    await this.shareLocationButton().click();
  }

  async clickMic(): Promise<void> {
    await this.micButton().click();
  }

  async close(): Promise<void> {
    await this.closeButton().click();
  }
}
