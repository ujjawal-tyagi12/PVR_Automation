import type { Page } from '@playwright/test';

/**
 * Grounded 2026-09-01 against UAT (`inox-uat-web.pvrinox.com`), Mumbai-All, via headless
 * Playwright driven from Bash/Node (Playwright MCP's interactive browser tool does not launch in
 * this sandbox — see the `pvr-inox-grounding-technique` project memory; scratchpad
 * `ground-coming-soon-*.js` scripts hold the raw diagnostics this comment summarizes).
 *
 * **Real, live listing, confirmed 2026-09-01**: `/coming-soon` for Mumbai-All shows a weekly-
 * grouped listing — "Jana Nayagan" in Week 39 (25 Sep - 01 Oct), and four movies in Week 52 (25
 * Dec - 31 Dec): "Varanasi (film)", "King (2026 film)", "MISSION: IMPOSSIBLE - THE FINAL
 * RECKONING", "PROJECT HAIL MARY" — all real, no mocking needed. Above the Year/Month/Week bar
 * sits a "Filter" trigger (opens a Genre+Language modal) and a row of quick genre chips
 * (Action/Adventure/Animation/Crime/Musical/Science Fiction/Thriller — confirmed alphabetical).
 *
 * **No separate JSON API backs this page's movie list** (unlike `CuratedShowsPage.ts`'s
 * `GET /api/curated-shows`) — a full network trace during page load showed only
 * `auth/session`/`get-city-list`/`detect-city`/`experience-listing-image`/`config-user` calls; the
 * movie data is baked into the server-rendered/RSC payload directly. So the two scenarios that
 * would typically need `page.route()` mocking instead use real, currently-live UAT data states:
 * - **Empty week/month**: Oct (Week 40) currently has zero movies — clicking it (or the "Oct"
 *   month tab) shows a real `<p>` "No Upcoming Movies Found for this week" message.
 * - **Image fallback**: "Jana Nayagan" currently has no uploaded poster — its card shows a real
 *   fallback graphic (`/assets/pvr/aaaaa.svg`, the shipped placeholder asset) instead of a photo.
 * Both are flagged as a live-data-drift risk if UAT content changes — if "Jana Nayagan" gets a
 * real poster or Oct gets a movie, `ComingSoonModule.ts`'s corresponding methods will need a new
 * live example (see each method's own doc comment).
 *
 * **The "Filter" trigger has no clean accessible name.** Its computed a11y name mixes an icon alt
 * with the "Filter" text label, so `getByRole('button', { name: 'Filter' })` matches nothing —
 * confirmed live. Targeted instead via `locator('button').filter({ hasText: 'Filter' })`.
 *
 * **The "Filter By" modal** (Genre/Language tabs, checkboxes, "Clear All" / a dynamically-labeled
 * "Show N Result(s)" button — e.g. `"Show 1 Result"`/`"Show 3 Results"`, confirmed live, NOT a
 * fixed "Show Results" string) is the real mechanism `TC_Web_165`/`166` (language filter /
 * multi-filter combination) map onto — language has no quick-chip equivalent on the main bar, only
 * genre does. The modal's genre/language checkboxes are visually hidden (`opacity-0`) native
 * `<input type="checkbox">` elements styled via a sibling — clicked via their visible label text,
 * not `getByRole('checkbox')` directly (confirmed live: a direct checkbox-role click times out as
 * "not visible").
 *
 * **Selecting a quick genre chip toggles a `border-(--brand-primary)` class** (confirmed via a
 * before/after `class` attribute diff) — the real "selected filter highlight" mechanism
 * (`TC_Web_154`). Clicking the SAME chip again removes it — the real "reset filter" mechanism
 * (`TC_Web_155`); there is no separate Reset/Clear control on the main bar (only the modal's own
 * "Clear All", a distinct UI path).
 *
 * **Selecting a genre that only matches a later week/month auto-jumps the listing there**
 * (`TC_Web_153`, confirmed live: selecting "Musical" — which only matches a Week 52/Dec movie —
 * immediately shows Week 52 instead of the default Week 39).
 *
 * **"Same date, random order" (`TC_Web_168`) does NOT hold live.** 3 independent fresh-context
 * loads all rendered the four Week-52 (same release date) movies in the exact same order —
 * `Varanasi (film)`, `King (2026 film)`, `Mission: Impossible`, `Project Hail Mary` — never
 * shuffled. The real behavior is a stable, repeatable order, not per-load randomization.
 *
 * **Movie cards are themselves `<button>` elements** wrapping a poster image, title, and
 * metadata; clicking one navigates to `/coming-soon/{id}`, a real movie detail page (confirmed
 * live — unlike `CuratedShowsPage.ts`'s own unresolved card-click finding). A sticky filter bar
 * (`comming_soon_sticky`, the real class name) can intercept a card click after scrolling —
 * `force: true` after `scrollIntoViewIfNeeded()` reliably works around it, live-confirmed.
 *
 * **Hovering a movie card never renders a trailer.** Grounded across all 5 currently-listed
 * movies (real posters and the placeholder-fallback one alike), hovering for 8+ seconds each never
 * produced a `<video>`/`<iframe>` anywhere in the card subtree. Trailer playback is real, but only
 * exists on the movie DETAIL page (a `Watch Trailer` button + a `Trailers` section, confirmed live
 * after navigating) — the same "no trailer on the listing card" finding `CuratedShowsPage.ts`
 * documents for its own listing.
 *
 * **`TC_Web_175`/`176` (Set Alert/Delete Alert button visible) do not exist on the listing card at
 * all** — confirmed via a full card-DOM dump (no "Alert" text/button anywhere in the card
 * subtree). The real "Set Alert" button lives on the movie DETAIL page instead (confirmed live:
 * visible even as a guest; clicking it opens a real phone-number login drawer — "Welcome! Enter
 * your phone number to proceed" — since setting an alert requires login, per
 * `movie-alerts.md`). "Delete Alert" needs a pre-existing alert, unreachable without completing
 * that separate, not-yet-implemented flow — see `coming-soon.md`'s Test coverage section.
 *
 * **Mic-denied fires a real native `alert()`**, confirmed live via `page.on('dialog')`: "Microphone
 * permission is blocked. Please enable it in your browser settings." — note the wording differs
 * slightly from `CuratedShowsPage.ts`'s own denied-mic alert ("...browser settings." vs "...your
 * browser settings."), a genuine per-module copy difference, not a typo in either doc comment.
 */
export class ComingSoonPage {
  constructor(private page: Page) {}

  readonly pageHeading = () => this.page.getByRole('heading', { name: 'Coming Soon', exact: true });

  // Search.
  readonly searchInput = () => this.page.getByPlaceholder('Search for upcoming Movies');
  readonly micButton = () => this.page.locator('button').filter({ has: this.page.getByAltText(/microphone/i) });
  readonly noSearchResultsHeading = () => this.page.getByRole('heading', { name: 'Movies Not Found!', exact: true });

  // Quick genre chips + Year/Month/Week bar (all real `<button>` elements, confirmed live).
  readonly genreChip = (name: string) => this.page.getByRole('button', { name, exact: true });
  readonly monthTab = (label: string) => this.page.getByRole('button', { name: label, exact: true });
  readonly weekTab = (label: string) => this.page.getByRole('button', { name: label, exact: true });
  // BUG WORKAROUND (2026-09-01, live-grounded): the heading's raw textContent has no space before
  // the pipe ("Week 39|25 Sep..."), but Playwright's accessible-name computation inserts one
  // between the child text nodes ("Week 39 | 25 Sep...") — `\s*` accounts for both.
  readonly weekSectionHeading = (weekLabel: string) => this.page.getByRole('heading', { name: new RegExp(`^${weekLabel}\\s*\\|`) });
  readonly noMoviesThisWeekMessage = () => this.page.getByText('No Upcoming Movies Found for this week', { exact: true });

  // "Filter" trigger + "Filter By" modal (see class doc comment for why these selectors are shaped this way).
  readonly filterTriggerButton = () => this.page.locator('button').filter({ hasText: 'Filter' }).first();
  readonly filterDialog = () => this.page.getByRole('dialog');
  readonly filterDialogGenreTab = () => this.filterDialog().getByRole('button', { name: 'Genre', exact: true });
  readonly filterDialogLanguageTab = () => this.filterDialog().getByRole('button', { name: 'Language', exact: true });
  readonly filterDialogOption = (name: string) => this.filterDialog().getByText(name, { exact: true });
  readonly filterDialogClearAllButton = () => this.filterDialog().getByRole('button', { name: 'Clear All', exact: true });
  readonly filterDialogShowResultsButton = () => this.filterDialog().getByRole('button', { name: /show \d+ results?/i });

  // Movie cards (the whole card is a real `<button>`, confirmed live). BUG WORKAROUND
  // (2026-09-01, live-grounded): both the Coming Soon list card and the movie detail page render
  // a duplicate (responsive-breakpoint) copy of the movie-name heading — `.first()` avoids a
  // strict-mode violation on every heading-based assertion below.
  readonly movieHeading = (name: string) => this.page.getByRole('heading', { name, exact: true }).first();
  readonly movieCard = (name: string) => this.movieHeading(name).locator('xpath=ancestor::button[1]');
  readonly movieCardImage = (name: string) => this.page.getByAltText(name, { exact: true }).first();
  readonly movieCardMetaText = (text: string) => this.page.getByText(text, { exact: true }).first();

  // Movie detail page (`/coming-soon/{id}`).
  readonly detailSetAlertButton = () => this.page.getByRole('button', { name: 'Set Alert', exact: true });
  readonly detailDeleteAlertButton = () => this.page.getByRole('button', { name: 'Delete Alert', exact: true });

  async goto(baseUrl: string): Promise<void> {
    await this.page.goto(`${baseUrl}/coming-soon`);
  }

  async search(keyword: string): Promise<void> {
    await this.searchInput().fill(keyword);
  }

  async clickMic(): Promise<void> {
    await this.micButton().click();
  }

  async clickFilterTrigger(): Promise<void> {
    await this.filterTriggerButton().click();
  }

  async clickGenreChip(name: string): Promise<void> {
    await this.genreChip(name).click();
  }

  async clickMonthTab(label: string): Promise<void> {
    await this.monthTab(label).click();
  }

  async clickWeekTab(label: string): Promise<void> {
    await this.weekTab(label).click();
  }

  async clickMovieCard(name: string): Promise<void> {
    const card = this.movieCard(name);
    await card.scrollIntoViewIfNeeded();
    // BUG WORKAROUND (2026-09-01, live-grounded): the sticky filter bar intercepts a plain click
    // after scrolling — force bypasses the (already-visually-correct) actionability check.
    await card.click({ force: true });
  }

  /** BUG WORKAROUND (2026-09-01, live-grounded — seen once under a full-suite parallel run, not
   * reproducible in isolation): asserting on the detail page's movie heading immediately after
   * `clickMovieCard` can resolve against a still-stale pre-navigation DOM and pass "too early"
   * before the SPA route actually finishes changing, matching the `sandbox-resource-constraints`
   * project memory's UAT-under-load flakiness. Waiting for the real `/coming-soon/{id}` URL
   * pattern first forces a genuine navigation-complete checkpoint before any heading assertion. */
  async waitForMovieDetailUrl(): Promise<void> {
    await this.page.waitForURL(/\/coming-soon\/\d+/, { timeout: 15_000 });
  }
}
