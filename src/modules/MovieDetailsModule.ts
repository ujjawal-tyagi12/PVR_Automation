import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { MovieDetailsPage } from '@pages/MovieDetailsPage';
import { HomeScreenPage } from '@pages/HomeScreenPage';
import { grantMumbaiGeolocation, waitForHomepageReady, dismissPromoPopup, UAT_BASE_URL, UAT_CITY, UAT_SUB_CITY } from '@utils/LocationHelper';

export class MovieDetailsModule {
  private readonly movieDetailsPage: MovieDetailsPage;
  private readonly homeScreenPage: HomeScreenPage;
  private selectedMovieTitle = '';

  constructor(private page: Page) {
    this.movieDetailsPage = new MovieDetailsPage(page);
    this.homeScreenPage = new HomeScreenPage(page);
  }

  /** The title of whichever movie `openMovieFromHomepage` actually landed on — see its doc comment for why this can't be hardcoded. */
  getSelectedMovieTitle(): string {
    return this.selectedMovieTitle;
  }

  /**
   * Bug fix (2026-08-21): originally hardcoded a filter for "Spider-Man" (the one movie
   * confirmed to have real showtimes during initial grounding — "6 Shows IN 1 Cinema"), but
   * the homepage's movie carousel genuinely rotates its content between page loads (same class
   * of live-data-rotation already documented for `ExperiencePage.ts`'s tiles) — a later run hit
   * the full 180s test timeout because "Spider-Man" simply wasn't in that load's tile set at
   * all. Most other movies are also confirmed to sit in a "0 Shows" state (see
   * `CinemasListingDetailPage.ts`). Fixed the same way `ExperiencePage.selectTileWithMovies()`
   * handles the identical problem: hop through tiles in order until one's detail page actually
   * shows a non-zero show count, rather than trusting a specific title to still be present.
   */
  async openMovieFromHomepage(maxTiles = 6, { grantGeolocation = true }: { grantGeolocation?: boolean } = {}): Promise<void> {
    if (grantGeolocation) await grantMumbaiGeolocation(this.page);
    await this.page.goto(UAT_BASE_URL);
    await waitForHomepageReady(this.page, UAT_CITY, UAT_SUB_CITY);
    await dismissPromoPopup(this.page);

    const tiles = this.homeScreenPage.movieTiles();
    const count = Math.min(await tiles.count(), maxTiles);
    for (let i = 0; i < count; i++) {
      const tile = tiles.nth(i);
      const title = (await tile.textContent().catch(() => '')) ?? '';
      await tile.scrollIntoViewIfNeeded().catch(() => undefined);
      await tile.click({ timeout: 20_000 }).catch(() => undefined);
      await dismissPromoPopup(this.page);
      // Bug fix (2026-08-21): the page chrome (nav/header) renders immediately but movie
      // content stays a gray skeleton placeholder for a real, variable stretch (confirmed via
      // screenshot) — this is the "real content loaded" signal, same pattern as
      // `waitForHomepageReady`'s "Now Showing" heading, and also how this loop confirms the
      // clicked movie actually has showtimes before treating it as the anchor.
      const hasShows = await this.movieDetailsPage.showCountText()
        .waitFor({ state: 'visible', timeout: 15_000 })
        .then(() => true)
        .catch(() => false);
      if (hasShows) {
        this.selectedMovieTitle = title;
        return;
      }
      await this.page.goBack().catch(() => undefined);
      await waitForHomepageReady(this.page, UAT_CITY, UAT_SUB_CITY).catch(() => undefined);
    }
  }

  async expectOnBookMovieTabByDefault(): Promise<void> {
    await expect(this.movieDetailsPage.bookMovieTabButton()).toBeVisible({ timeout: 15_000 });
  }

  /** Uses whichever movie `openMovieFromHomepage` actually landed on, rather than a hardcoded title. */
  async expectSelectedMovieHeaderVisible(): Promise<void> {
    await expect(this.movieDetailsPage.movieTitleHeading(this.selectedMovieTitle)).toBeVisible({ timeout: 15_000 });
  }

  async expectShowCountTextVisible(): Promise<void> {
    await expect(this.movieDetailsPage.showCountText()).toBeVisible({ timeout: 15_000 });
  }

  async expectWatchTrailerCtaVisible(): Promise<void> {
    await expect(this.movieDetailsPage.watchTrailerButton()).toBeVisible({ timeout: 15_000 });
  }

  async expectShareButtonVisible(): Promise<void> {
    await expect(this.movieDetailsPage.shareButton()).toBeVisible({ timeout: 15_000 });
  }

  async expectDateSelectorDefaultsToday(): Promise<void> {
    const firstDate = this.movieDetailsPage.dateButtons().first();
    await expect(firstDate).toBeVisible({ timeout: 15_000 });
    // Grounded 2026-08-21: today's date button is the first in the list (no separate
    // "selected"/"active" ARIA state was confirmed — position is the reliable signal).
  }

  async searchCinema(keyword: string): Promise<void> {
    await this.movieDetailsPage.cinemaSearchInput().fill(keyword);
  }

  async expectCinemaSearchInputVisible(): Promise<void> {
    await expect(this.movieDetailsPage.cinemaSearchInput()).toBeVisible({ timeout: 15_000 });
  }

  async expectPickupYourTimeCtaVisible(): Promise<void> {
    await expect(this.movieDetailsPage.pickupYourTimeCta()).toBeVisible({ timeout: 15_000 });
  }

  /** Clicks the first available showtime and confirms the booking/seat-selection page loads. */
  async clickFirstShowtimeAndExpectBookingRedirect(): Promise<void> {
    const urlBefore = this.page.url();
    await this.movieDetailsPage.showtimeButtons().first().click({ timeout: 15_000 });
    await this.page.waitForURL((url) => url.toString() !== urlBefore, { timeout: 15_000 });
    await expect(this.movieDetailsPage.bookingDetailsHeading()).toBeVisible({ timeout: 15_000 });
  }

  /**
   * MOV-019/021: opens Pickup Your Time, picks a language + a time (Minutes and AM/PM columns
   * only — see `MovieDetailsPage.ts`'s doc comment for why the Hour column is skipped), and
   * clicks "Next". Grounded 2026-09-09: on the current live build this is NOT a "submit a
   * preference and get notified" feature despite its requirements-doc description — there is no
   * distinct submission API call (only the same `moviesessions` page-data POST any direct visit
   * to that URL triggers) and no confirmation/success message. "Next" simply navigates the
   * browser straight to that movie's `/moviesessions/...` showtimes page. Confirmed identical
   * for both a logged-in session (via `RegisterLoginModule.loginWithPhoneAndOtp`) and a guest
   * session — no login gate exists on this flow either, contradicting the requirements doc's
   * "guest is redirected to login" expectation (see MOV-021).
   */
  async submitPickupYourTimePreference(): Promise<void> {
    await this.movieDetailsPage.pickupYourTimeCta().click({ timeout: 15_000 });
    await this.movieDetailsPage.pickupYourTimeLanguageOption('English').click({ timeout: 10_000 });
    await this.movieDetailsPage.pickupYourTimeSelectTimeTrigger().click({ timeout: 10_000 });
    await this.movieDetailsPage.timePickerMinuteOption('30').click({ timeout: 10_000 });
    await this.movieDetailsPage.timePickerPeriodOption('AM').click({ timeout: 10_000 });
    await expect(this.movieDetailsPage.pickupYourTimeNextButton()).toBeEnabled({ timeout: 10_000 });
    await this.movieDetailsPage.pickupYourTimeNextButton().click({ timeout: 10_000, force: true });
  }

  /** Confirmed real outcome of "Next" — see `submitPickupYourTimePreference`'s doc comment. */
  async expectRedirectedToMovieSessionsPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/moviesessions\//, { timeout: 15_000 });
  }

  async expectMovieDetailsTabContent(): Promise<void> {
    await this.movieDetailsPage.movieDetailsTabButton().click({ timeout: 10_000 });
    await expect(this.movieDetailsPage.ratingsHeading()).toBeVisible({ timeout: 15_000 });
    await expect(this.movieDetailsPage.synopsisHeading()).toBeVisible({ timeout: 15_000 });
    await expect(this.movieDetailsPage.castHeading()).toBeVisible({ timeout: 15_000 });
    await expect(this.movieDetailsPage.trailersHeading()).toBeVisible({ timeout: 15_000 });
  }

  async expectAlsoPlayingVisible(): Promise<void> {
    await expect(this.movieDetailsPage.alsoPlayingHeading()).toBeVisible({ timeout: 15_000 });
  }

  /**
   * requirements/offers.md OFR-034. Grounded 2026-09-07: `MovieDetailsPage.alsoPlayingDiscountChip`
   * is genuinely data-driven and volatile on two independent axes (confirmed live) — which movie
   * carries it, and which load of that SAME movie. Hops through homepage tiles (same shape as
   * `openMovieFromHomepage`) and, for each anchor movie with real showtimes, reloads its Also
   * Playing section a bounded number of times before moving to the next anchor — covering both
   * axes instead of assuming either the first movie or the first load has the chip. Returns
   * false (rather than throwing) if no chip turns up within this run's budget, so the caller can
   * `test.skip()` gracefully — same pattern as `clickFirstCastMemberAndExpectNavigation`.
   */
  async openMovieWithAlsoPlayingOfferChip(maxTiles = 8, maxReloadsPerAnchor = 3): Promise<boolean> {
    await grantMumbaiGeolocation(this.page);
    await this.page.goto(UAT_BASE_URL);
    await waitForHomepageReady(this.page, UAT_CITY, UAT_SUB_CITY);
    await dismissPromoPopup(this.page);

    const tiles = this.homeScreenPage.movieTiles();
    const count = Math.min(await tiles.count(), maxTiles);
    for (let i = 0; i < count; i++) {
      const tile = tiles.nth(i);
      const title = (await tile.textContent().catch(() => '')) ?? '';
      await tile.scrollIntoViewIfNeeded().catch(() => undefined);
      await tile.click({ timeout: 8_000, force: true }).catch(() => undefined);
      await dismissPromoPopup(this.page);

      const hasShows = await this.movieDetailsPage.showCountText()
        .waitFor({ state: 'visible', timeout: 15_000 })
        .then(() => true)
        .catch(() => false);
      if (!hasShows) {
        await this.page.goBack().catch(() => undefined);
        await waitForHomepageReady(this.page, UAT_CITY, UAT_SUB_CITY).catch(() => undefined);
        continue;
      }

      for (let attempt = 1; attempt <= maxReloadsPerAnchor; attempt++) {
        const heading = this.movieDetailsPage.alsoPlayingHeading();
        let alsoFound = false;
        for (let s = 0; s < 30; s++) {
          if (await heading.isVisible({ timeout: 300 }).catch(() => false)) {
            alsoFound = true;
            break;
          }
          await this.page.mouse.wheel(0, 700);
        }
        const chipVisible = alsoFound && (await this.movieDetailsPage.alsoPlayingDiscountChip().isVisible({ timeout: 3_000 }).catch(() => false));
        if (chipVisible) {
          this.selectedMovieTitle = title;
          return true;
        }
        if (attempt < maxReloadsPerAnchor) {
          await this.page.reload({ waitUntil: 'domcontentloaded' });
          await this.movieDetailsPage.showCountText().waitFor({ state: 'visible', timeout: 15_000 }).catch(() => undefined);
        }
      }

      await this.page.goBack().catch(() => undefined);
      await waitForHomepageReady(this.page, UAT_CITY, UAT_SUB_CITY).catch(() => undefined);
    }
    return false;
  }

  /** OFR-034: confirms the offer chip found by `openMovieWithAlsoPlayingOfferChip` is genuinely visible. */
  async expectAlsoPlayingOfferChipVisible(): Promise<void> {
    await expect(this.movieDetailsPage.alsoPlayingDiscountChip()).toBeVisible({ timeout: 5_000 });
  }

  /**
   * MOV-047: clicking a cast member's card navigates to their real `/cast-detail/{id}/{movieId}`
   * profile page. Bug fix (2026-08-31): whether cast renders as clickable photo cards (real
   * `<a href="cast-detail">` links) or as a plain comma-separated text list with no links at
   * all is itself per-movie — confirmed live: "Raksha Bandhan" had 19 real cast links,
   * "Spider-Man: Brand New Day" (picked by `openMovieFromHomepage`'s rotating selection) had
   * zero, just plain text names. Returns whether a clickable cast link was found so the caller
   * can `test.skip()` gracefully instead of failing on a movie with no cast links this run.
   */
  async clickFirstCastMemberAndExpectNavigation(): Promise<boolean> {
    await this.movieDetailsPage.movieDetailsTabButton().click({ timeout: 10_000 });
    await expect(this.movieDetailsPage.castHeading()).toBeVisible({ timeout: 15_000 });
    await this.movieDetailsPage.castHeading().scrollIntoViewIfNeeded();

    const firstCastLink = this.movieDetailsPage.castMemberLinks().first();
    const hasLink = await firstCastLink.isVisible({ timeout: 8_000 }).catch(() => false);
    if (!hasLink) return false;

    await firstCastLink.click({ timeout: 10_000 });
    await expect(this.page).toHaveURL(/\/cast-detail\//, { timeout: 15_000 });
    return true;
  }

  async expectShowtimeButtonsVisible(): Promise<void> {
    await expect(this.movieDetailsPage.showtimeButtons().first()).toBeVisible({ timeout: 15_000 });
  }

  /**
   * Bug fix (2026-08-21), third pass: unlike `CinemasListingDetailModule`'s equivalent, only
   * "Experiences" was confirmed reliably visible on this movie-first view — "Filter",
   * "Recliner only", "Show Time", "Price Range", "Sort By" showed the same unreliable
   * visibility as the whole filter strip on Cinemas Listing (see that page's doc comment), so
   * they're deliberately not asserted on here.
   */
  async expectExperiencesFilterVisible(): Promise<void> {
    await expect(this.movieDetailsPage.experiencesFilterButton()).toBeVisible({ timeout: 15_000 });
  }

  async clickExperiencesFilter(): Promise<void> {
    await this.movieDetailsPage.experiencesFilterButton().click({ timeout: 10_000 });
  }

  /**
   * Opens the "FILTER BY" dialog via whichever chip currently renders — same flaky-chip-strip
   * pattern as `CinemasListingDetailModule.openFilterByDialog()`, mirrored here for MOV-013.
   */
  async openFilterByDialog(): Promise<boolean> {
    const chipNames = ['Filter', 'Showtime', 'Price Range', 'Sort By', 'Experiences'];
    for (const name of chipNames) {
      const chip = this.movieDetailsPage.filterChip(name);
      const visible = await chip.isVisible({ timeout: 3_000 }).catch(() => false);
      if (!visible) continue;
      await chip.click({ timeout: 6_000 }).catch(() => undefined);
      const opened = await expect(this.movieDetailsPage.filterByDialog())
        .toBeVisible({ timeout: 8_000 })
        .then(() => true)
        .catch(() => false);
      if (opened) return true;
    }
    return false;
  }

  /**
   * MOV-031: confirms the FILTER BY dialog's "Show Results" CTA carries no count before any
   * filter is applied, then updates to a real "Show N Results (In N Cinema)" the moment one is
   * — the confirmed real "applied filters" feedback signal (see MovieDetailsPage.ts doc
   * comment; there's no separate removable-chip list on this build).
   */
  async expectFilterCountUpdatesWhenApplied(): Promise<void> {
    const showResults = this.movieDetailsPage.filterByDialogShowResultsButton();
    const textBefore = await showResults.innerText();
    expect(textBefore.trim(), 'Show Results button should start with no count').toBe('Show Results');

    await this.movieDetailsPage.filterByDialogTab('Accessibility').click({ timeout: 8_000 });
    const firstLabel = this.movieDetailsPage.filterByDialog().locator('label').filter({ has: this.page.getByRole('checkbox') }).first();
    await firstLabel.click({ timeout: 8_000 });

    await expect(showResults).toHaveText(/^show \d+ results?/i, { timeout: 8_000 });
  }

  /**
   * MOV-030: grounded 2026-09-09 — without geolocation permission granted, the Distance tab's
   * "0 km"–"25 km" slider is replaced by a real "Turn on location to use the distance filter."
   * message (see MovieDetailsPage.ts doc comment) — the actual "Enable Location" CTA equivalent.
   * Must be called instead of `openMovieFromHomepage`'s default (which always grants
   * geolocation) — pass `{ grantGeolocation: false }`.
   */
  async expectEnableLocationMessageOnDistanceTab(): Promise<void> {
    const opened = await this.openFilterByDialog();
    expect(opened, 'FILTER BY dialog should have opened via one of the filter chips').toBe(true);
    await this.movieDetailsPage.filterByDialogTab('Distance').click({ timeout: 8_000 });
    await expect(this.movieDetailsPage.filterByDialogEnableLocationMessage()).toBeVisible({ timeout: 10_000 });
  }

  /**
   * MOV-013: selects a Languages filter option, then confirms "Clear All" genuinely cleared it.
   * Grounded 2026-08-31: "Clear All" closes the whole dialog immediately (not a same-dialog
   * reset) — so the only reliable way to confirm the selection was actually cleared, not just
   * that the dialog closed, is to re-open it and check the option's state persisted as
   * unchecked.
   */
  async selectAFilterThenClearAll(): Promise<void> {
    await this.movieDetailsPage.filterByDialogTab('Languages').click({ timeout: 8_000 });
    const firstLabel = this.movieDetailsPage.filterByDialog().locator('label').filter({ has: this.page.getByRole('checkbox') }).first();
    const firstOption = this.movieDetailsPage.filterByDialog().getByRole('checkbox').first();
    await firstLabel.click({ timeout: 8_000 });
    await expect(firstOption).toBeChecked({ timeout: 8_000 });

    await this.movieDetailsPage.filterByDialogClearAllButton().click({ timeout: 8_000 });
    await expect(this.movieDetailsPage.filterByDialog()).toBeHidden({ timeout: 8_000 });

    const reopened = await this.openFilterByDialog();
    expect(reopened, 'FILTER BY dialog should re-open after Clear All').toBe(true);
    await this.movieDetailsPage.filterByDialogTab('Languages').click({ timeout: 8_000 });
    await expect(firstOption).not.toBeChecked({ timeout: 8_000 });
  }

  /** MOV-023: a search term with no matching cinema shows a real, confirmed empty-state message. */
  async searchCinemaAndExpectNoResults(keyword: string): Promise<void> {
    await this.movieDetailsPage.cinemaSearchInput().fill(keyword);
    await expect(this.movieDetailsPage.noCinemasFoundMessage()).toBeVisible({ timeout: 15_000 });
  }

  /** MOV-027: a real promotional banner image (`Movie-Banner` or its `Fallback Banner`) renders on the Book Movie tab. */
  async expectPromoBannerVisible(): Promise<void> {
    await expect(this.movieDetailsPage.promoBanner().first()).toBeVisible({ timeout: 15_000 });
  }

  /**
   * MOV-025: mocks the real api/movie-detail endpoint's `data.movie.trailers`/`trailersWithLang`
   * to empty arrays (confirmed live shape: `trailers: ["https://youtube.com/..."]`) — solves
   * the "no real no-trailer movie exists as test data" blocker the same way MOV-014/015 solved
   * Sold Out for showtimes.
   */
  async mockMovieAsHavingNoTrailerAndReload(): Promise<void> {
    await this.page.route('**/api/movie-detail*', async (route) => {
      const response = await route.fetch();
      const json = await response.json();
      const movie = json?.data?.movie;
      if (movie) {
        movie.trailers = [];
        movie.trailersWithLang = [];
      }
      await route.fulfill({ response, json });
    });
    for (let attempt = 1; attempt <= 3; attempt++) {
      await this.page.reload({ waitUntil: 'domcontentloaded' });
      const ready = await this.movieDetailsPage
        .promoBanner()
        .first()
        .waitFor({ state: 'visible', timeout: 15_000 })
        .then(() => true)
        .catch(() => false);
      if (ready) return;
    }
    throw new Error('promo banner never reappeared after mocking the movie as trailer-less and reloading');
  }

  /** MOV-025: with no trailer data, "Watch Trailer" is gone and the poster/banner is the only visual, confirming the fallback. */
  async expectNoTrailerFallsBackToPoster(): Promise<void> {
    await expect(this.movieDetailsPage.watchTrailerButton()).toBeHidden({ timeout: 10_000 });
    await expect(this.movieDetailsPage.promoBanner().first()).toBeVisible();
  }

  /**
   * MOV-036: grounded 2026-08-25 — date and showtime buttons are already visible immediately
   * after landing on the Book Movie tab, with no separate "expand" click — confirms the first
   * (only, for the anchor movie) cinema card is expanded by default on load.
   */
  async expectCinemaCardExpandedByDefault(): Promise<void> {
    await expect(this.movieDetailsPage.dateButtons().first()).toBeVisible({ timeout: 15_000 });
    await expect(this.movieDetailsPage.showtimeButtons().first()).toBeVisible({ timeout: 15_000 });
  }

  /**
   * Grounded 2026-08-26: confirmed the real `api/movie-detail?...&type=MOVIE` response shape —
   * `data.cinemas[0].shows[0].shows[]`, each with `isAvailable`/`status`/`balance`/
   * `classDetails[].balance` — is identical in structure to the Event Details endpoint already
   * mocked by `EventDetailsModule.mockShowtimeAsSoldOutAndReload`. Reuses the same technique
   * here to solve MOV-014/MOV-015's shared "no real Sold Out showtime exists as test data"
   * blocker instead of needing one to occur naturally.
   */
  async mockFirstShowtimeAsSoldOutAndReload(): Promise<void> {
    await this.page.route('**/api/movie-detail*', async (route) => {
      const response = await route.fetch();
      const json = await response.json();
      const show = json?.data?.cinemas?.[0]?.shows?.[0]?.shows?.[0];
      if (show) {
        show.isAvailable = false;
        show.balance = 0;
        show.status = 'F';
        for (const classDetail of show.classDetails ?? []) classDetail.balance = 0;
      }
      await route.fulfill({ response, json });
    });
    // BUG FIX (2026-08-26): a single reload + single wait was observed live to occasionally
    // land on a still-loading blank/gray skeleton past the 20s budget (same "reload doesn't
    // always settle first try" issue `EventDetailsModule`'s mock methods already retry around)
    // — retrying the reload itself gives the page another chance to settle instead of failing
    // on what's usually a transient miss.
    for (let attempt = 1; attempt <= 3; attempt++) {
      await this.page.reload({ waitUntil: 'domcontentloaded' });
      const ready = await this.movieDetailsPage
        .showtimeButtons()
        .first()
        .waitFor({ state: 'visible', timeout: 15_000 })
        .then(() => true)
        .catch(() => false);
      if (ready) return;
    }
    throw new Error('showtime buttons never reappeared after mocking the first showtime as sold out and reloading');
  }

  /**
   * MOV-039: same real-endpoint mocking technique as `mockFirstShowtimeAsSoldOutAndReload`, but
   * shifts `stTime`/`edTime`/`date` into the past instead of flipping `isAvailable` — matches
   * EventDetailsModule's confirmed finding that the frontend derives "Lapsed" purely from
   * wall-clock time against the show's own times, not a separate status flag. Solves the "no
   * real lapsed showtime exists as test data" blocker the same way MOV-014/015 solved Sold Out.
   */
  async mockFirstShowtimeAsLapsedAndReload(): Promise<void> {
    await this.page.route('**/api/movie-detail*', async (route) => {
      const response = await route.fetch();
      const json = await response.json();
      const show = json?.data?.cinemas?.[0]?.shows?.[0]?.shows?.[0];
      if (show) {
        const past = new Date(Date.now() - 6 * 60 * 60 * 1000);
        const pastEnd = new Date(past.getTime() + 2 * 60 * 60 * 1000);
        show.stTime = past.toISOString();
        show.edTime = pastEnd.toISOString();
        show.date = past.toISOString().slice(0, 10);
      }
      await route.fulfill({ response, json });
    });
    for (let attempt = 1; attempt <= 3; attempt++) {
      await this.page.reload({ waitUntil: 'domcontentloaded' });
      const ready = await this.movieDetailsPage
        .showtimeButtons()
        .first()
        .waitFor({ state: 'visible', timeout: 15_000 })
        .then(() => true)
        .catch(() => false);
      if (ready) return;
    }
    throw new Error('showtime buttons never reappeared after mocking the first showtime as lapsed and reloading');
  }

  /** MOV-039: confirmed live — clicking a lapsed showtime does not navigate to booking. */
  async expectLapsedShowtimeDoesNotRedirect(): Promise<void> {
    const urlBefore = this.page.url();
    await this.movieDetailsPage.showtimeButtons().first().click();
    await this.page
      .waitForURL((url) => url.toString() !== urlBefore, { timeout: 5_000, waitUntil: 'commit' })
      .catch(() => undefined);
    expect(this.page.url()).toBe(urlBefore);
  }

  /**
   * MOV-014: confirmed live — the mocked sold-out showtime's time-text renders a distinct
   * red/orange (`rgb(253, 100, 70)`), while a real, still-Available sibling showtime stays the
   * natural green (`rgb(140, 213, 76)`) — a genuine, data-driven color difference, not a fixed
   * per-position style.
   */
  async expectSoldOutShowtimeColorDiffersFromAvailable(): Promise<void> {
    const buttons = this.movieDetailsPage.showtimeButtons();
    const count = await buttons.count();
    expect(count, 'need at least 2 showtimes to compare the mocked sold-out one against a real Available one').toBeGreaterThan(1);
    const soldOutColor = await this.movieDetailsPage
      .showtimeTimeText(0)
      .evaluate((node) => (globalThis as unknown as { getComputedStyle: (e: unknown) => { color: string } }).getComputedStyle(node).color);
    const availableColor = await this.movieDetailsPage
      .showtimeTimeText(1)
      .evaluate((node) => (globalThis as unknown as { getComputedStyle: (e: unknown) => { color: string } }).getComputedStyle(node).color);
    expect(soldOutColor).not.toBe(availableColor);
  }

  /**
   * MOV-015: confirmed live — clicking the mocked sold-out showtime does not navigate anywhere.
   * Gives a real navigation a bounded, catchable chance to happen (rather than a fixed sleep —
   * resolves early if a navigation *does* start), same pattern as
   * `EventDetailsModule.expectSoldOutShowtimeDoesNotRedirectToSeatSelection`.
   */
  async expectMockedSoldOutShowtimeDoesNotRedirect(): Promise<void> {
    const urlBefore = this.page.url();
    await this.movieDetailsPage.showtimeButtons().first().click();
    await this.page
      .waitForURL((url) => url.toString() !== urlBefore, { timeout: 5_000, waitUntil: 'commit' })
      .catch(() => undefined);
    expect(this.page.url()).toBe(urlBefore);
  }

  async expectResponsiveNoOverflow(): Promise<void> {
    const hasHorizontalOverflow = await this.page.evaluate(() => {
      const doc = (globalThis as unknown as { document: { documentElement: { scrollWidth: number; clientWidth: number } } }).document;
      return doc.documentElement.scrollWidth > doc.documentElement.clientWidth + 1;
    });
    expect(hasHorizontalOverflow, 'page should not overflow horizontally').toBe(false);
  }
}
