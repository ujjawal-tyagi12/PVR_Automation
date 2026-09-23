import type { Page } from '@playwright/test';

/**
 * Grounded 2026-09-01 against UAT (`inox-uat-web.pvrinox.com`), Mumbai-All, via headless
 * Playwright driven from Bash/Node (Playwright MCP's interactive browser tool does not launch in
 * this sandbox — see the `pvr-inox-grounding-technique` project memory; scratchpad
 * `ground-curated-*.js` scripts hold the raw diagnostics this comment summarizes).
 *
 * **Live empty-state finding, RE-CONFIRMED today (2026-09-01)**: `/curated-shows` for Mumbai-All
 * still returns the empty state — heading "No Curated Shows Available", a fixed message
 * paragraph, and a **`<button>` labeled "Back to Homepage"** (not a link, no `href` — a client
 * router push). Note the sheet's own expected-result copy says "Let's Go" CTA; the real live
 * button text is "Back to Homepage" — a genuine sheet-vs-live wording mismatch, not a bug (the
 * CTA exists and functions identically: it redirects home). The real backing API,
 * `GET /api/curated-shows?cityId={id}`, was checked directly for **every** UAT city that has a
 * cinema (11 distinct `cityId`s, including Mumbai's `1`) — all 11 return `curatedShows: []`. This
 * is a platform-wide empty state right now, not a Mumbai-specific gap.
 *
 * **Content-present UI, grounded via `page.route()` mocking of the real API** (see
 * `curatedShowsData.ts` for how the mock shape was derived: real field names extracted directly
 * from the shipped Next.js bundle, not guessed): a mocked non-empty `curatedShows[]` genuinely
 * renders — a `categoryDisplayName` heading, a `subHeading` line, a "Learn More" text-link
 * trigger (this build's real implementation of the sheet's "info icon" — there is no separate
 * icon element), and movie cards (also real headings) showing certificate/genre/language and a
 * correctly runtime-formatted duration ("2h 8m" from `runningTime: 128`). "Learn More" opens a
 * real `role="dialog"` titled "About Curated Shows" showing the category's `subHeading` +
 * `description` (HTML) + a banner reusing `webImage`/`webImageLight`, with a real
 * `button[data-slot="drawer-close"]` Close control — same `data-slot` pattern
 * `CitySelectionPage.ts` already documents for its own drawer.
 *
 * **Real findings that don't match the sheet's assumptions** (all confirmed live, not guessed):
 * - **No "See All" control exists anywhere in the shipped code.** Movies render inside a
 *   `curated-movie-swiper` (a Swiper.js horizontal carousel with prev/next arrows), not a link to
 *   a full-listing page. TC_Web_092/093 (CSH-017/018) are `test.fixme` for this reason.
 * - **RESOLVED 2026-09-07 (was: "clicking a (mocked) movie card does not navigate").** The
 *   original finding was real but the theory was wrong: reading the actual shipped `onClick`
 *   handler source (`node.onclick.toString()` / React fiber props on the `cursor-pointer` card
 *   div — not a guess) showed `()=>{if(h)return void h();if(c?.filmId){...router.push(...)}}` — it
 *   no-ops whenever `movie.filmId` is falsy, and the original mock (`curatedShowsData.ts`) never
 *   set that field (only `filmCommonCode`, a different field). Adding `filmId` makes the real
 *   click genuinely navigate to `/moviesessions/{city}/{slug}/{filmId}` (confirmed live, including
 *   with a real currently-showing UAT film id, which rendered a fully working session page — not
 *   guessed). A second real field, `categoryName` (distinct from `categoryDisplayName`, confirmed
 *   via its own call site), feeds a `?curatedType=` param on that URL for `'Special Shows'`
 *   categories. See `curatedShowsData.ts`'s class doc comment for the full grounding trail.
 *   CSH-019/034/044 are real, passing tests now; CSH-035 asserts the `curatedType` param persists
 *   on the resulting URL (the only observable effect of that param — no visible on-page filter
 *   badge exists); CSH-036 remains `test.fixme` — no "headsup" string/dialog exists anywhere on the
 *   real `/moviesessions` page, confirmed live even with `curatedType` set and a showtime clicked.
 * - **No admin enable/disable flag, category sequence field, personalization/"Recommended" tag,
 *   or Upcoming/Re-release date-filtering logic was found anywhere in the real bundled source**
 *   searched (4 chunks, ~296KB combined) for this page. CSH-014/015/024/025/026/029/030 are
 *   `test.fixme` for this reason — category *order* IS testable (DOM order mirrors the mocked
 *   array order, which is the closest real mechanism to "sequence" that exists), but admin
 *   enable/disable toggles and personalization are not.
 * - **Voice search partially reacts, unlike `CitySelectionPage`'s own earlier "no reaction"
 *   finding.** With microphone permission forced to `'denied'` (via `page.addInitScript`
 *   overriding `navigator.permissions.query`), clicking the mic button fires a real native
 *   `alert()`: "Microphone permission is blocked. Please enable it in browser settings." — caught
 *   live via `page.on('dialog')`. With permission granted, `webkitSpeechRecognition` exists even
 *   headless, so no alert fires, but no visible UI reacts either (matches the earlier
 *   `CitySelectionPage` finding for the *recognized-result* portion) — only the denied-permission
 *   path is asserted as real.
 * - **Search with no match reuses the exact same "No Curated Shows Available" top-level empty
 *   state**, not a separate "No Result Found!" search state (that text exists in the bundled
 *   source, e.g. from an m-site variant, but was not reached from this desktop flow live).
 * - **An aborted `/api/curated-shows` call (real internet-disconnection simulation, matching
 *   `OffersModule.ts`'s established `route.abort('internetdisconnected')` pattern) falls back to
 *   the exact same empty-state UI** — no distinct error message, no crash. The sheet's expected
 *   result ("Error message displayed") doesn't hold; the real, gracefully-degraded behavior is
 *   asserted instead (CSH-037).
 * - **A fresh context with no geolocation permission granted blocks on the real "Enable Location"
 *   modal** (heading "Enable Location", Cancel/Enable buttons) before any curated-shows content
 *   loads — confirmed live, matches the sheet's CSH-045 expectation directly.
 * - **The "Curated Shows" homepage nav entry (TC_Web_076/077) was not reliably reproducible.** A
 *   "Curated Shows" *button* (not a link) does sometimes render inside what looks like a
 *   homepage quick-filter strip, but clicking the header's "More" control plus scrolling failed
 *   to reveal or reach it across 3 repeated live attempts. CSH-001/002 are `test.fixme` for this
 *   instability; every other scenario here uses this repo's established direct-URL navigation
 *   pattern (`page.goto(baseUrl + '/curated-shows')`), matching `OffersPage.ts`/`EventListingPage.ts`.
 */
export class CuratedShowsPage {
  constructor(private page: Page) {}

  readonly pageHeading = () => this.page.getByRole('heading', { name: 'Curated Shows', exact: true });

  // Empty state (real, grounded live — see class doc comment).
  readonly noCuratedShowsHeading = () => this.page.getByRole('heading', { name: 'No Curated Shows Available', exact: true });
  readonly noCuratedShowsMessage = () => this.page.getByText(/thank you for your interest in our curated shows/i);
  readonly backToHomepageButton = () => this.page.getByRole('button', { name: /back to homepage/i });

  // Search.
  readonly searchInput = () => this.page.getByPlaceholder('Search for movies, festivals...');
  readonly micButton = () => this.page.locator('button').filter({ has: this.page.getByAltText(/microphone icon/i) });

  // Categories / movies (both render as real headings — see class doc comment).
  readonly categoryHeading = (name: string) => this.page.getByRole('heading', { name, exact: true });
  readonly movieHeading = (name: string) => this.page.getByRole('heading', { name, exact: true });
  /** CSH-019/034/044: the whole movie card is a real `cursor-pointer` div wrapping a genuine
   * `onClick` navigation handler — see class doc comment for the resolved click-handler finding.
   * Matches `ComingSoonPage.movieCard`'s own ancestor-lookup pattern (that card is a `<button>`
   * instead, but the "find the clickable ancestor from the heading" shape is the same). */
  readonly movieCard = (name: string) => this.movieHeading(name).locator('xpath=ancestor::div[contains(concat(" ", normalize-space(@class), " "), " cursor-pointer ")][1]');
  readonly learnMoreLinks = () => this.page.getByText('Learn More');
  readonly learnMoreTrigger = (categoryIndex = 0) => this.learnMoreLinks().nth(categoryIndex);
  // BUG FIX (2026-09-01, live run): the shipped bundle also has an `alt="Category Banner"` image
  // (grep-matched during grounding), but that belongs to a different component than the one
  // actually rendered on `/curated-shows` — confirmed live the real element here has
  // `alt="Background"` instead (2 per category: one inline, one for the "Learn More" popup
  // preview), driven by the mocked category's `webImage`/`webImageLight` fields — the closest
  // real, field-driven element to the sheet's "promotional banner".
  readonly categoryBannerImages = () => this.page.getByAltText('Background');
  readonly categoryBannerImage = (index = 0) => this.categoryBannerImages().nth(index);
  // Grounded 2026-09-01: the real class name (`curated-movie-swiper`) extracted directly from the
  // shipped bundle — movies render in a Swiper.js horizontal carousel, not a "See All" listing.
  readonly movieCarousel = (index = 0) => this.page.locator('.curated-movie-swiper').nth(index);

  // "Learn More" info popup — a real `role="dialog"` drawer, same `data-slot="drawer-close"`
  // pattern as `CitySelectionPage.ts`.
  readonly aboutDialog = () => this.page.getByRole('dialog');
  readonly aboutDialogHeading = () => this.aboutDialog().getByRole('heading', { name: 'About Curated Shows', exact: true });
  readonly aboutDialogCloseButton = () => this.aboutDialog().locator('button[data-slot="drawer-close"]');

  // Fresh-context location gating.
  readonly enableLocationHeading = () => this.page.getByRole('heading', { name: 'Enable Location', exact: true });

  async goto(baseUrl: string): Promise<void> {
    await this.page.goto(`${baseUrl}/curated-shows`);
  }

  async search(keyword: string): Promise<void> {
    await this.searchInput().fill(keyword);
  }

  async clearSearch(): Promise<void> {
    await this.searchInput().fill('');
  }

  async clickBackToHomepage(): Promise<void> {
    await this.backToHomepageButton().click();
  }

  async clickLearnMore(index = 0): Promise<void> {
    await this.learnMoreTrigger(index).click();
  }

  async closeAboutDialog(): Promise<void> {
    await this.aboutDialogCloseButton().click();
  }

  async clickMic(): Promise<void> {
    await this.micButton().click();
  }

  /** CSH-019/034/044: clicks the real clickable card ancestor (not just the heading/poster — see
   * class doc comment on why the earlier heading/poster-only click probes looked like a dead
   * handler while the underlying element was fine). */
  async clickMovieCard(name: string): Promise<void> {
    const card = this.movieCard(name);
    await card.scrollIntoViewIfNeeded();
    await card.click();
  }

  /** CSH-019/034/044: confirms the real client-side navigation to `/moviesessions/...` (the
   * "standard Book Movie flow") that the fixed `filmId` mock field now genuinely triggers. */
  async waitForMovieSessionsUrl(): Promise<void> {
    await this.page.waitForURL(/\/moviesessions\//, { timeout: 15_000 });
  }
}
