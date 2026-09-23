import type { Locator, Page } from '@playwright/test';

/**
 * Grounded 2026-08-21 against UAT (inox-uat-web.pvrinox.com, Mumbai) via a read-only
 * headless-Playwright diagnostic pass — see scratchpad ground-cinemas*.js scripts.
 *
 * The "Cinemas" nav link opens `/cinemas/{city}` — a **merged listing+detail page**
 * (confirmed: TC_WEB_340's "merged Cinema Page" is the actual default layout, not a separate
 * mode) showing "All Cinemas" / "N Cinemas" count, a list of cinema cards (each a real `<h2>`
 * with the cinema name — clicking it navigates to `/cinemasessions/{city}/{slug}/{id}`,
 * confirmed live), and a right-hand detail panel.
 *
 * Favorite icon is a real `<img alt="not favorited">` / presumably `alt="favorited"` once
 * toggled, wrapped in a `<button>` ancestor. No `data-testid` anywhere.
 *
 * Bug fix (2026-08-21): a **guest** clicking the favorite icon does NOT toggle it at all —
 * confirmed live via screenshot: a "Login to add cinema to your favorites?" modal (Cancel/
 * Login buttons) appears instead, and the icon stays "not favorited". CIN-008/CIN-049's actual
 * "reflects in sorting" behavior needs a logged-in session (matching the sheet's own
 * precondition, which the initial implementation overlooked); the guest-gate itself is now
 * what CIN-008 verifies instead.
 *
 * Grounded-but-unreliable findings (2026-08-21), locators deliberately NOT kept for these —
 * re-ground before automating:
 * - No location/city gate blocks `/cinemas/{city}` even with zero geolocation permission — the
 *   page loads full cinema content regardless (contradicts the sheet's expected "prompted to
 *   enable location" behavior for CIN-002).
 * - "List View"/"Map View" toggle buttons and the location-prompt heading were present in one
 *   grounding pass and completely absent (0 matches) in later passes against the same URL —
 *   inconsistent rendering, not a locator bug.
 *
 * Follow-up grounding (2026-08-21, second pass): which cinema has real shows is volatile
 * (matches Movie Details' finding) — all 3 showed "0 Shows" in one pass, but a later pass found
 * "INOX Megaplex, Inorbit Mall" with "30 Shows". On that cinema's Book a Movie section: real
 * date buttons ("21Fri".."17Thu"), real showtime buttons ("08:00 AM" + language), "Book Movie"/
 * "View Movie Details" tabs, and a movie heading — all reliably visible. No search textbox
 * here (unlike Movie Details' movie-first view) — makes sense, this cinema-first view has no
 * need to "search for a cinema" since one is already selected.
 *
 * Third-pass finding: a "Filter"/"Recliner only"/"Show Time"/"Price Range"/"Sort By"/
 * "Experiences" chip strip DOES exist in the DOM (shows up in a full button-text sweep) but
 * consistently failed `toBeVisible()` and `scrollIntoViewIfNeeded()` across three separate
 * grounding checks on the same confirmed-good cinema — looks like a horizontally-scrollable or
 * overflow-hidden strip whose reveal mechanism (a specific horizontal scroll gesture, most
 * likely) wasn't cracked this pass. Deliberately not kept as locators here since every attempt
 * to assert on it would be a coin-flip, not a real check — see CIN-024/028/054/072's fixme
 * reasons in the spec for the full finding.
 *
 * Fourth-pass grounding (2026-08-25, targeted CIN-009/030/031/033/056 pass): on this same
 * confirmed-good cinema, the chip strip DID render reliably this time (visible, clickable) —
 * "Filter"/"Recliner only"/"Show Time"/"Price Range"/"Sort By"/"Genre" — confirming the earlier
 * unreliable-visibility finding is real UI flakiness, not a permanently-broken feature. Clicking
 * any chip opens the same "FILTER BY" `role="dialog"` panel (tabs: Genre, Accessibility,
 * Showtime, Price Range, Languages, Sort By; a live "Show N Results (In N Movies)" CTA). Real
 * seat-category **price on hover** is confirmed: hovering a showtime button opens a real
 * `role="tooltip"` listing each seat category ("Executive"/"Club"/"Royal"/"Royal Recliner") with
 * its "₹NNN.00" price and availability ("AVAILABLE") — reliable across two independent
 * hover attempts. The movie-card carousel (`.movies-carousel.cinemas-slider`, a Swiper
 * instance) is a single-select carousel, not an accordion: only one real movie card was present
 * at grounding time, it was already expanded (showtimes visible) on load, and it never visibly
 * collapsed across repeated `force: true` re-clicks — normal (non-forced) clicks on it fail
 * Playwright's actionability check consistently (poster image / sticky header siblings
 * intercept pointer events, matching the chip strip's own historical flakiness). No "Now
 * Showing" heading/text exists anywhere on `/cinemas/{city}` or a cinema's detail view (that
 * heading is homepage-only). See CIN-009/030/031/056's fixme reasons in the spec for what this
 * means for each scenario.
 *
 * **Map View investigation (2026-09-06), root-caused via ~40 controlled headless runs (see
 * scratchpad `ground-mapview-*.js` scripts) — real, environment-driven intermittent product
 * behavior, NOT a client-side wait/timing bug.** Ruled out one at a time: (1) NOT a race in
 * `gotoCinemasListing()`'s nav-click-then-query timing (CIN-074's own bug fix) — waiting on the
 * real "All Cinemas" listing-loaded signal first, then waiting up to 45s for the button, still
 * shows it absent from the DOM entirely (`document.querySelectorAll` finds ZERO matching
 * elements — not hidden, not slow, genuinely never mounted) in a losing run. (2) NOT the
 * direct-`page.goto()` vs. real nav-link-click distinction (an early false lead: direct
 * `page.goto('/cinemas/Mumbai')` hits `ERR_TOO_MANY_REDIRECTS` — that route only resolves via
 * client-side SPA navigation — while `/cinemas/Mumbai-All` loads fine but never shows Map View
 * either way; the real `gotoCinemasListing()` flow already uses the nav-click path). (3) NOT
 * viewport size (reproduced the absence at 1920x1080, 1280x720, and 375x812). (4) NOT the Google
 * Maps JS API failing/slow to load (`window.google.maps` is confirmed DEFINED even in runs where
 * the button never renders; the script itself loads in under 2s from this sandbox, confirmed via
 * direct `curl` timing). (5) NOT a build/deploy difference (identical `_next/static` chunk
 * hashes across winning and losing runs). (6) NOT a backend feature-flag/config difference
 * visible in any inspected API response (`api/config-user`, `api/quick-book-init`,
 * `api/nearby-cinemas`, `api/detect-city` — all identical shape/data, all `200`, across both
 * outcomes). (7) NOT an active Evergage/Salesforce-Interaction-Studio personalization campaign
 * (`campaignResponses: []` — empty — in every run checked, win or lose). Across the investigation
 * session, runs clustered in long win streaks and long loss streaks rather than a stable per-run
 * coin flip (11 wins then ~38 consecutive losses) — consistent with a real, occasionally-toggled
 * environment-level condition on this shared, already-documented-as-volatile UAT instance (see
 * the spec file header's cinema-data-volatility note), not a per-request race. Matches this
 * project's `ALT-013` precedent exactly: a genuine, evidence-confirmed intermittent product
 * behavior with no discoverable DOM signal to poll/wait on — the correct fix is this repo's own
 * `openCinemaWithShows()`-style self-`test.skip()` pattern, not a longer wait or a different
 * locator. See `CinemasListingDetailModule.ts`'s `openMapView()` doc comment for the resulting
 * helper, and the spec file for exactly which of the 9 Map-View-dependent scenarios that
 * unblocks vs. which remain `test.fixme` for a narrower, separately-confirmed reason (their own
 * specific sub-interaction — e.g. the Distance panel's slider, recenter/zoom controls' own
 * accessible names — was never independently opened and inspected during any of the investigation's
 * brief Map-View-available windows).
 *
 * **Location-permission comparison — re-grounded and the sheet's premise DISPROVEN (2026-09-06,
 * 4/4 independent same-run controlled comparisons: one full-suite pass plus 3 isolated
 * `repeat-each` re-runs)**: an early single observation (no geolocation permission ever granted,
 * via the manual "Cancel" → pick-city drawer flow — listing still loads fully, matching CIN-002's
 * finding of no permission gate on the listing itself — but Map View absent that run) looked
 * consistent with CIN-038/039's "permission gates Map View" premise. A proper same-run controlled
 * comparison (grant vs. not, same session, via `compareMapViewWithAndWithoutGeoPermission()`)
 * shows otherwise, reproduced all 4 times: whenever Map View rendered at all, it rendered
 * IDENTICALLY with and without granted permission — the early observation was coincidental with
 * this section's separate, broader environment-level toggle, not caused by permission. CIN-038/
 * 039 now assert this real, disproven-premise finding (matching this file's own established
 * pattern for a sheet premise contradicted by live grounding — see CIN-002/CIN-008/CIN-065),
 * self-skipping only when Map View is unavailable in BOTH states that run.
 *
 * **Eighth-pass grounding (2026-09-07, CIN-005/030/031/040/041/042/049/054/056/057/058/060
 * targeted pass — see `CinemasListingDetailModule.ts` for the resulting helpers):**
 * - **CIN-005's real hang cause, found via trace-equivalent step-by-step headless timing/network
 *   tracing (matching `ALT-013`'s rigor)**: it was never a locator/timing bug in the favorite
 *   click itself (which resolves in ~350ms once genuinely logged in). A brand-new phone number's
 *   OTP success opens a real registration-details form FIRST (matching `MovieAlertsPage.ts`'s own
 *   documented flow) — this suite's usual "OTP input hidden" signal is satisfied by that form too,
 *   so treating it as "logged in" leaves the session in a genuine limbo state where the favorite
 *   click re-triggers CIN-008's OWN guest "Login to add cinema to your favorites?" gate. Whatever
 *   the original test did next (retrying against a state that could never change) burned the full
 *   180s budget. Completing the real registration form + onboarding-nudge dismissal (composing
 *   `RegistrationModule`/`ProfileCompletionModule`, matching `MovieAlertsModule`'s own established
 *   composition pattern for this exact precondition) produces a genuinely authenticated session.
 * - **Favorite sort-to-top is real, but is NOT a live client re-sort — confirmed via a controlled
 *   before/after/reload comparison**: favoriting a cinema flips its icon immediately but does NOT
 *   reorder the visible list in the same render (confirmed: favoriting the farthest of 3 cinemas
 *   left the order unchanged with no reload). A subsequent reload DOES apply the real sort
 *   (confirmed: the favorited cinema moved to the top after reload). This is what CIN-005 now
 *   verifies; CIN-049's own "reflects immediately" premise is the one real, narrower thing this
 *   disproves (matching this file's established pattern for a disproven sheet premise).
 * - **CIN-054 confirmed true via bounding boxes**: the page-level "Experiences" filter chip's Y
 *   position is above the movie-card carousel's own Y position, on a cinema confirmed to have
 *   real shows.
 * - **CIN-030's real blocker, re-investigated with two substantively different automated
 *   approaches, both of which concretely failed**: (1) selecting EVERY checkbox across
 *   Genre/Accessibility/Languages is a no-op for reaching zero results — each facet is OR'd
 *   internally, so "select all" matches everything, the opposite of narrowing; confirmed live,
 *   still "Show 26 Results" after selecting all 13 checkboxes. (2) Keyboard-shrinking the
 *   Showtime tab's real `role="slider"` range (confirmed present, `aria-valuemin`/`max`
 *   0–1439 minutes) moved the range only ~9 minutes across 400 `ArrowLeft` presses (`Home` had no
 *   effect at all) — nowhere near a genuine zero-result window, and what little movement was
 *   achieved had no visible effect on the result count. The dialog/tab-switch clicks themselves
 *   were fully reliable across every one of this pass's runs — the old "Radix dialog animation
 *   intercepts clicks" finding did not reproduce and is retired from this scenario's reason.
 * - **CIN-060, re-investigated across both guest AND a genuinely logged-in session, multiple
 *   independent runs each**: clicking a real showtime button produces no observable state change
 *   of any kind — no URL navigation, no `role="dialog"`, no new heading, no new fixed/absolute
 *   container beyond ones already on the page, no booking-related text. Whatever "popup" the
 *   sheet refers to was not reproduced in either auth state this pass.
 * - **CIN-040/041/042: the prior "not reliably reproducible via geolocation mocking alone" finding
 *   was a sequencing gap, not a technique failure** — see `LocationHelper.DELHI_GEOLOCATION`'s doc
 *   comment for the full, now-successful reproduction (a real `role="dialog"`, "Not Now"/"Switch
 *   To Current City", each confirmed via the real `cityDetails` cookie to actually retain/update
 *   the saved city).
 */
export class CinemasListingDetailPage {
  constructor(private page: Page) {}

  readonly cinemasNavLink = () => this.page.getByRole('link', { name: 'Cinemas', exact: true });
  readonly allCinemasHeading = () => this.page.getByRole('heading', { name: 'All Cinemas', exact: true });
  readonly cinemaCountText = () => this.page.getByText(/^\d+ Cinemas?$/i);

  readonly cinemaCards = () => this.page.getByRole('heading', { level: 2 }).filter({ hasNotText: 'All Cinemas' });
  // Grounded 2026-08-21 (bug fix): scoped per-card via `role="listitem"` (3 confirmed present,
  // one per cinema) rather than a page-wide `.first()` — toggling a favorite re-sorts/re-renders
  // the list, so an index-based locator can silently point at a *different* cinema's icon after
  // the click than the one that was actually clicked.
  readonly cinemaListItems = () => this.page.getByRole('listitem');

  /**
   * BUG FIX (2026-09-07, CIN-005 first real logged-in test run): confirmed live that a plain
   * index into `cinemaListItems()` (0/1/2) is not reliably "the first 3 real cinema cards" once
   * genuinely logged in — one real run's index 2 resolved to "Hindi" (a language tag from some
   * other listitem-rendering page section, not a cinema card at all), matching this class's own
   * documented "other page sections render listitems too" finding. Filtering to only listitems
   * that actually contain the real favorite icon is a structural signal, not an index guess —
   * every genuine cinema card has one, and nothing else on this page does.
   */
  readonly realCinemaListItems = () => this.cinemaListItems().filter({ has: this.page.getByAltText(/not favorited|^favorited$/i) });

  readonly favoriteIconIn = (container: Locator) => container.getByAltText(/not favorited|^favorited$/i);
  // Grounded 2026-08-26: a real accessibility icon (`alt="wheelchair accessible"`) renders on
  // cinema cards that have accessible seating; hovering it opens a real `role="tooltip"` with a
  // concrete message ("Accessible Seats Available" + a companion-seating description) —
  // confirmed live, twice reproduced.
  readonly accessibilityIconIn = (container: Locator) => container.getByAltText('wheelchair accessible');
  readonly accessibilityIcons = () => this.page.getByAltText('wheelchair accessible');
  readonly loginToFavoritePrompt = () => this.page.getByText('Login to add cinema to your favorites?', { exact: true });
  readonly getDirectionsButton = () => this.page.getByRole('button', { name: 'Get Directions', exact: true });
  readonly amenitiesHeading = () => this.page.getByRole('heading', { name: 'Amenities', exact: true });
  readonly otherCinemasNearbyHeading = () => this.page.getByRole('heading', { name: 'Other cinemas nearby', exact: true });
  readonly showCountBadge = () => this.page.getByText(/^\d+ Shows?$/i);

  readonly dateButtons = () => this.page.getByRole('button').filter({ hasText: /^\d{1,2}[A-Za-z]{3}$/ });
  readonly showtimeButtons = () => this.page.getByRole('button').filter({ hasText: /\d{1,2}:\d{2}\s*(AM|PM)/i });
  readonly bookMovieTabButton = () => this.page.getByRole('button', { name: 'Book Movie', exact: true });
  readonly viewMovieDetailsTabButton = () => this.page.getByRole('button', { name: 'View Movie Details', exact: true });
  readonly movieHeadingsInCinema = () => this.page.getByRole('heading', { level: 3 });

  // Grounded 2026-08-25: hovering a showtime button opens a real `role="tooltip"` listing each
  // seat category with its price and availability (e.g. "Executive\n₹140.00\nAVAILABLE") —
  // confirmed reliable across two independent hover attempts on the confirmed-good cinema.
  readonly seatCategoryPriceTooltip = () => this.page.getByRole('tooltip');

  // Grounded 2026-08-26 (CIN-025/026/027/065/067/068/069/071/072 pass, two independent headless
  // runs): whichever of the chip strip's buttons currently renders ("Filter"/"Genre"/"Show
  // Time"/"Price Range"/"Sort By" — the exact visible set is itself flaky, see class doc
  // comment) opens the *same* "FILTER BY" `role="dialog"`, with real `role="button"` tabs in
  // this confirmed, reproducible, non-alphabetical order: Genre, Accessibility, Showtime, Price
  // Range, Languages, Sort By. Each tab's options render as real `role="checkbox"` inputs
  // (confirmed: Genre showed Comedy/Drama/Social as `<label><input type="checkbox">` pairs).
  //
  // Re-grounded 2026-08-31 (CIN-012/013/014/015/016/017/024 pass, three independent headless
  // runs on `inox-megaplex-inorbit-mall`): the dialog actually opens with **seven** tabs, not
  // six — "Experiences" is the first tab (left of Genre), reliably visible across all three
  // attempts, with 4 real checkbox options (Kiddles/ONYX DINER/MX4D/ScreenX). The 2026-08-21
  // "Experiences chip fails toBeVisible" finding was about the *page-level* chip strip, not
  // this dialog tab — once the dialog is open via any other chip, its own "Experiences" tab is
  // solid. Also confirmed: **no "Distance" tab exists** on this per-cinema Detail dialog (0/3
  // attempts) — distance filtering isn't a Cinema Detail feature; see CIN-011's fixme reason.
  readonly filterChip = (name: string) => this.page.getByRole('button', { name, exact: true }).first();
  readonly filterByDialog = () => this.page.getByRole('dialog');
  readonly filterByDialogTab = (
    name: 'Experiences' | 'Genre' | 'Accessibility' | 'Showtime' | 'Price Range' | 'Languages' | 'Sort By',
  ) => this.filterByDialog().getByRole('button', { name, exact: true });
  readonly filterByDialogOptions = () => this.filterByDialog().getByRole('checkbox');
  // Grounded 2026-08-26: the checkbox `<input>` itself is deliberately visually hidden
  // (`opacity-0 absolute`, a custom-styled-checkbox pattern) — Playwright correctly reports it
  // as not visible even though it's real and clickable. Its wrapping `<label>` (which renders
  // the visible checkmark box + option text, e.g. "Comedy") is the real visible-to-user signal.
  readonly filterByDialogOptionLabels = () => this.filterByDialog().locator('label').filter({ has: this.page.getByRole('checkbox') });

  /**
   * Grounded 2026-09-06 (dedicated Map View investigation — see class doc comment addendum and
   * the spec file's own note on CIN-004/018/019/038/039/050/051/066/073): the "Map View" toggle
   * button, when it renders, opens a real Google Map (`.gm-style` — confirmed live via
   * `window.google.maps` being defined AND real `.gm-style` container divs appearing, not just
   * an iframe/placeholder) plus its own filter-chip strip (Distance/Date/Showtimes/Genre/
   * Languages/Format & Experience — a DIFFERENT strip than the per-cinema "FILTER BY" dialog's
   * tabs) and a "Scroll to map" accessibility link.
   */
  readonly mapViewButton = () => this.page.getByRole('button', { name: /map view/i });
  readonly mapContainer = () => this.page.locator('.gm-style');
  readonly mapDistanceChip = () => this.page.getByRole('button', { name: 'Distance', exact: true });
  /**
   * Grounded 2026-09-06: clicking "Distance" opens NOT a `role="dialog"` (confirmed 0 matches)
   * but an inline panel with two real ARIA range-slider handles (`role="slider"`,
   * `aria-label="Accessibility label"` — a genuine, if unhelpful, accessible name). Confirmed
   * live: the min-handle reports `aria-valuemin="0"`; the max-handle reports
   * `aria-valuemax="25"` — the real, CMS-managed 0–25km range CIN-066 claims. Keyboard-focusing
   * the max-handle and pressing ArrowLeft repeatedly (a real, accessible slider interaction, not
   * a synthetic DOM hack) reliably shrinks the range below the nearest known cinema's real
   * distance and produces a genuine "No Cinema Found"/"No cinemas found" message.
   */
  readonly mapDistanceSliderHandles = () => this.page.locator('[role="slider"]');
  readonly noCinemasFoundMessage = () => this.page.getByText(/no cinemas? found/i);

  /**
   * Grounded 2026-09-07 (CIN-031/056/057/058/060 movie-card investigation): the movie carousel
   * is a Swiper instance, `.movies-carousel.cinemas-slider`, whose `.swiper-slide` children
   * always number 5 on this build regardless of how many real movies are showing — Swiper pads
   * the rest with empty clone slides (confirmed live via a full slide-by-slide `innerText` dump:
   * only slides with a genuinely non-empty heading are real movies). A plain, non-forced click
   * on a slide's own `role="heading"` succeeded reliably in this pass's live runs — unlike a
   * click on the card/poster area, which is what the old CIN-031/056/057 fixme reasons'
   * "Swiper-sibling interception" finding was actually about. Clicking the heading is the fix.
   */
  readonly movieCarouselContainer = () => this.page.locator('.movies-carousel.cinemas-slider');
  readonly movieCardSlides = () => this.movieCarouselContainer().locator('.swiper-slide');
  readonly movieCardHeadingAt = (index: number) => this.movieCardSlides().nth(index).getByRole('heading').first();

  /**
   * CIN-054: grounded 2026-09-07 — confirmed live via bounding boxes that the page-level
   * "Experiences" filter chip renders above (smaller Y, ends before the carousel's own Y starts)
   * the movie-card carousel, on a cinema confirmed to have real shows.
   */
  readonly experiencesChip = () => this.page.getByRole('button', { name: 'Experiences', exact: true }).first();

  /**
   * CIN-040/041/042: grounded 2026-09-07 (see `LocationHelper.DELHI_GEOLOCATION`'s doc comment
   * for the full finding) — a real `role="dialog"` confirmed live, heading text "Change your
   * city?", body "Your current city seems to be {city}. Shall we update?", with real "Not Now"/
   * "Switch To Current City" buttons. Not scoped via `getByRole('heading', ...)` since (matching
   * this file's own established pattern for non-standard dialog headings elsewhere) the heading
   * text renders as plain dialog content, not a distinct heading role.
   */
  readonly changeCityDialog = () => this.page.getByRole('dialog').filter({ hasText: 'Change your city?' });
  readonly switchToCurrentCityButton = () => this.page.getByRole('button', { name: 'Switch To Current City', exact: true });
  readonly notNowCityButton = () => this.page.getByRole('button', { name: 'Not Now', exact: true });

  async goto(baseUrl: string, city: string): Promise<void> {
    await this.page.goto(`${baseUrl}/cinemas/${city}`);
  }
}
