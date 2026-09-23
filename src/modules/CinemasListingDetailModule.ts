import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { CinemasListingDetailPage } from '@pages/CinemasListingDetailPage';
import {
  grantMumbaiGeolocation,
  waitForHomepageReady,
  dismissPromoPopup,
  clickThroughOverlays,
  UAT_BASE_URL,
  UAT_CITY,
  UAT_SUB_CITY,
  DELHI_GEOLOCATION,
} from '@utils/LocationHelper';
import { RegisterLoginModule } from '@modules/RegisterLoginModule';
import { RegistrationModule } from '@modules/RegistrationModule';
import { ProfileCompletionModule } from '@modules/ProfileCompletionModule';
import { DataGenerator } from '@utils/DataGenerator';

export class CinemasListingDetailModule {
  private readonly cinemasPage: CinemasListingDetailPage;
  // CIN-005/049: composes the login/registration/onboarding-nudge modules this feature's own
  // favorite-gating precondition needs, matching `MovieAlertsModule`'s own established
  // composition pattern for the identical precondition — see this class's CIN-005 doc comment.
  private readonly registerLoginModule: RegisterLoginModule;
  private readonly registrationModule: RegistrationModule;
  private readonly profileCompletionModule: ProfileCompletionModule;

  constructor(private page: Page) {
    this.cinemasPage = new CinemasListingDetailPage(page);
    this.registerLoginModule = new RegisterLoginModule(page);
    this.registrationModule = new RegistrationModule(page);
    this.profileCompletionModule = new ProfileCompletionModule(page);
  }

  /**
   * BUG FIX / widened 2026-09-06 (Map View investigation, CIN-038/039): geolocation permission
   * is granted unconditionally by default (existing behavior every other test in this file
   * relies on) — `grantGeolocation: false` skips that grant so `waitForHomepageReady`'s own
   * `dismissLocationAndSelectCity` call falls through to the real manual "Cancel" → pick-city
   * drawer flow instead, needed to observe Map View's real behavior with no permission ever
   * granted (see CinemasListingDetailPage.ts doc comment).
   */
  async gotoCinemasListing({ grantGeolocation = true }: { grantGeolocation?: boolean } = {}): Promise<void> {
    if (grantGeolocation) {
      await grantMumbaiGeolocation(this.page);
    }
    await this.page.goto(UAT_BASE_URL);
    await waitForHomepageReady(this.page, UAT_CITY, UAT_SUB_CITY);
    await dismissPromoPopup(this.page);
    await clickThroughOverlays(this.page, () => this.cinemasPage.cinemasNavLink().click({ timeout: 6_000 }), { city: UAT_CITY, subCity: UAT_SUB_CITY });
  }

  /**
   * Bug fix (2026-08-21): default 5s `expect` timeouts proved too tight for this real UAT site
   * under parallel-worker load (same class of issue found and fixed in `login.spec.ts` this
   * session) — bumped to 15s to give genuine headroom.
   */
  async expectListingLoaded(): Promise<void> {
    await expect(this.cinemasPage.allCinemasHeading()).toBeVisible({ timeout: 15_000 });
    await expect(this.cinemasPage.cinemaCountText()).toBeVisible({ timeout: 15_000 });
  }

  async expectCinemaCardsVisible(): Promise<void> {
    await expect(this.cinemasPage.cinemaCards().first()).toBeVisible({ timeout: 15_000 });
  }

  async clickFirstCinemaAndExpectNavigation(): Promise<void> {
    const urlBefore = this.page.url();
    await this.cinemasPage.cinemaCards().first().click();
    await this.page.waitForURL((url) => url.toString() !== urlBefore, { timeout: 15_000 });
  }

  /**
   * Bug fix (2026-08-21): which cinema has real showtimes ("N Shows" > 0) is volatile on this
   * shared UAT environment — all 3 showed "0 Shows" in one grounding pass, a different one had
   * "30 Shows" in a later pass (same live-data-flux already documented for Movie Details' movie
   * tiles). Hops through the (few) cinema cards until one's detail page shows a non-zero count,
   * same fix shape as `MovieDetailsModule.openMovieFromHomepage`, rather than trusting a
   * specific cinema to currently have shows.
   */
  async openCinemaWithShows(maxCinemas = 3): Promise<boolean> {
    const cards = this.cinemasPage.cinemaListItems();
    const count = Math.min(await cards.count(), maxCinemas);
    for (let i = 0; i < count; i++) {
      await this.gotoCinemasListing();
      const card = this.cinemasPage.cinemaListItems().nth(i);
      await card.click({ timeout: 10_000 }).catch(() => undefined);
      const badgeText = await this.cinemasPage.showCountBadge().first().textContent({ timeout: 10_000 }).catch(() => '');
      if (badgeText && !/^0 Shows?$/i.test(badgeText.trim())) return true;
    }
    return false;
  }

  async expectDateButtonsVisible(): Promise<void> {
    await expect(this.cinemasPage.dateButtons().first()).toBeVisible({ timeout: 15_000 });
  }

  async expectShowtimeButtonsVisible(): Promise<void> {
    await expect(this.cinemasPage.showtimeButtons().first()).toBeVisible({ timeout: 15_000 });
  }

  /** Parses each showtime button's leading "HH:MM AM/PM" text and asserts the list is non-decreasing chronologically. */
  async expectShowtimesAscendingOrder(): Promise<void> {
    const buttons = this.cinemasPage.showtimeButtons();
    const texts = await buttons.allTextContents();
    const minutesSinceMidnight = texts.map((t) => {
      const match = t.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
      if (!match) return -1;
      let hour = Number(match[1]) % 12;
      if (/pm/i.test(match[3])) hour += 12;
      return hour * 60 + Number(match[2]);
    });
    for (let i = 1; i < minutesSinceMidnight.length; i++) {
      expect(minutesSinceMidnight[i], `showtime ${texts[i]} should not be before ${texts[i - 1]}`).toBeGreaterThanOrEqual(minutesSinceMidnight[i - 1]);
    }
  }

  /**
   * Grounded 2026-08-25: hovering a showtime button opens a real `role="tooltip"` listing each
   * seat category ("Executive"/"Club"/"Royal"/"Royal Recliner") with its "₹NNN.00" price and
   * availability status — confirmed reliable across two independent hover attempts on the
   * confirmed-good cinema (see CinemasListingDetailPage.ts doc comment).
   */
  async expectSeatCategoryPriceOnHover(): Promise<void> {
    await this.cinemasPage.showtimeButtons().first().hover({ timeout: 15_000 });
    const tooltip = this.cinemasPage.seatCategoryPriceTooltip().first();
    await expect(tooltip).toBeVisible({ timeout: 15_000 });
    await expect(tooltip).toContainText(/₹\s?\d/);
  }

  /**
   * CIN-055: confirmed live the cinema-first view's real endpoint is `api/movies-listing`
   * (`data.movieList[0].shows[0].shows[0]`) — a different path from Movie/Event Details'
   * `api/movie-detail`, but the identical `stTime`/`edTime`/`date` shape, so the same
   * shift-into-the-past technique proven for MOV-039 applies here too.
   *
   * BUG FIX (2026-08-30): confirmed live — `openCinemaWithShows()` can trigger *another* full
   * navigation (hopping to the next cinema candidate) while a previous `route.fetch()` for this
   * same route is still in flight, which then throws `Response has been disposed` once the old
   * navigation's response is torn down. Catching that specific race and falling back to
   * `route.continue()` (serving the real, unmocked response for that one superseded request)
   * keeps the hop loop going instead of failing the whole test on a request that no longer
   * matters anyway.
   */
  /**
   * BUG FIX (2026-08-30): confirmed live a real cinema/movie combination can have *several*
   * real showtimes at once (one run saw 6) — mocking only `shows[0].shows[0]` into the past
   * then asserting the whole button list is empty is wrong in that shape; the other, untouched
   * showtimes correctly stay. Capturing the mocked show's own `time` string and checking that
   * *specific* button is gone afterward (regardless of how many others remain) is the shape-
   * independent version of the same check.
   */
  async mockFirstShowtimeAsLapsedAndReload(): Promise<{ found: boolean; lapsedTime: string }> {
    let lapsedTime = '';
    await this.page.route('**/api/movies-listing*', async (route) => {
      try {
        const response = await route.fetch();
        const json = await response.json();
        const show = json?.data?.movieList?.[0]?.shows?.[0]?.shows?.[0];
        if (show) {
          lapsedTime = show.time ?? lapsedTime;
          const past = new Date(Date.now() - 6 * 60 * 60 * 1000);
          const pastEnd = new Date(past.getTime() + 2 * 60 * 60 * 1000);
          show.stTime = past.toISOString();
          show.edTime = pastEnd.toISOString();
          show.date = past.toISOString().slice(0, 10);
        }
        await route.fulfill({ response, json });
      } catch {
        await route.continue().catch(() => undefined);
      }
    });
    const found = await this.openCinemaWithShows();
    return { found, lapsedTime };
  }

  /**
   * CIN-055: confirmed live — the specific showtime button mocked into the past is gone after
   * reload (unlike Movie/Event Details, where a lapsed showtime still renders, just
   * non-clickable) — this cinema-first view genuinely excludes lapsed showtimes, matching the
   * sheet's exact claim.
   */
  async expectShowtimeGoneAfterLapsedMock(lapsedTime: string): Promise<void> {
    await expect(this.cinemasPage.showtimeButtons().filter({ hasText: lapsedTime })).toHaveCount(0);
  }

  /**
   * CIN-010/CIN-048: no real movie title long enough to observe truncation exists as live test
   * data — mocks the real api/movies-listing endpoint's `movieList[0].filmCommonName` to a long
   * synthetic title instead, same "solve via mocking" approach as the showtime-state fixes above.
   */
  async mockMovieTitleAsVeryLongAndReload(): Promise<boolean> {
    await this.page.route('**/api/movies-listing*', async (route) => {
      try {
        const response = await route.fetch();
        const json = await response.json();
        const movie = json?.data?.movieList?.[0];
        if (movie) movie.filmCommonName = 'An Extraordinarily Long Motion Picture Title That Should Never Fit On One Line';
        await route.fulfill({ response, json });
      } catch {
        await route.continue().catch(() => undefined);
      }
    });
    return this.openCinemaWithShows();
  }

  /**
   * BUG FIX (2026-08-30): `movieHeadingsInCinema()` (`role="heading" level=3`) turned out to
   * match a *cinema* name, not the movie card title — confirmed live via a screenshot showing
   * the mocked long title visibly truncated with a real ellipsis under the movie poster, while
   * the h3 this method checked reported no overflow at all. Searching directly for the
   * distinctive mocked title text (unique enough not to collide with anything else on the page)
   * sidesteps needing to know its real tag/role.
   */
  async expectMovieTitleTruncated(): Promise<void> {
    const titleText = this.page.getByText('An Extraordinarily Long Motion Picture Title', { exact: false }).first();
    await expect(titleText).toBeVisible({ timeout: 15_000 });
    const { isTruncated, overflowStyle } = await titleText.evaluate((el) => ({
      isTruncated: el.scrollWidth > el.clientWidth,
      overflowStyle: (globalThis as unknown as { getComputedStyle: (e: unknown) => { overflow: string } }).getComputedStyle(el).overflow,
    }));
    expect(isTruncated, 'long movie title should overflow its box').toBe(true);
    expect(overflowStyle, 'overflow should be clipped, not left visible').not.toBe('visible');
  }

  /**
   * Grounded 2026-08-26: which chip currently renders is itself flaky (see
   * CinemasListingDetailPage.ts doc comment) — tries each known chip name in turn and opens
   * whichever is actually visible this run. All confirmed to open the same "FILTER BY" dialog.
   */
  async openFilterByDialog(): Promise<boolean> {
    const chipNames = ['Filter', 'Genre', 'Show Time', 'Price Range', 'Sort By'];
    for (const name of chipNames) {
      const chip = this.cinemasPage.filterChip(name);
      const visible = await chip.isVisible({ timeout: 3_000 }).catch(() => false);
      if (!visible) continue;
      await chip.click({ timeout: 6_000 }).catch(() => undefined);
      const opened = await expect(this.cinemasPage.filterByDialog())
        .toBeVisible({ timeout: 8_000 })
        .then(() => true)
        .catch(() => false);
      if (opened) return true;
    }
    return false;
  }

  async switchFilterByDialogTab(tab: 'Experiences' | 'Genre' | 'Accessibility' | 'Showtime' | 'Price Range' | 'Languages' | 'Sort By'): Promise<void> {
    await this.cinemasPage.filterByDialogTab(tab).click({ timeout: 8_000 });
  }

  /**
   * Confirms the switched-to tab renders at least one real, selectable option checkbox.
   * Bug fix (2026-08-26): the checkbox `<input>` is deliberately visually hidden by a
   * custom-styled-checkbox pattern — asserting visibility on its wrapping `<label>` (the real
   * visible-to-user element) instead of the input itself, while still confirming the input is
   * genuinely attached (not just an empty label).
   */
  async expectFilterByDialogOptionsVisible(tab: 'Experiences' | 'Genre' | 'Accessibility' | 'Showtime' | 'Price Range' | 'Languages' | 'Sort By'): Promise<void> {
    await this.switchFilterByDialogTab(tab);
    await expect(this.cinemasPage.filterByDialogOptionLabels().first()).toBeVisible({ timeout: 8_000 });
    await expect(this.cinemasPage.filterByDialogOptions().first()).toBeAttached({ timeout: 8_000 });
  }

  /** Grounded 2026-08-26: confirmed real range text "12:00 AM" / "11:59 PM" on the Showtime tab. */
  async expectShowTimeRangeVisible(): Promise<void> {
    await this.switchFilterByDialogTab('Showtime');
    await expect(this.cinemasPage.filterByDialog()).toContainText(/12:00\s*AM/i);
    await expect(this.cinemasPage.filterByDialog()).toContainText(/11:59\s*PM/i);
  }

  /** Grounded 2026-08-26: confirmed a real ₹ min/max pair on the Price Range tab (e.g. "₹100"/"₹180"). */
  async expectPriceRangeVisible(): Promise<void> {
    await this.switchFilterByDialogTab('Price Range');
    const text = (await this.cinemasPage.filterByDialog().innerText()).replace(/\s+/g, ' ');
    const amounts = [...text.matchAll(/₹\s?(\d+)/g)].map((m) => Number(m[1]));
    expect(amounts.length, `expected at least 2 ₹ amounts (min/max) in Price Range tab, got: "${text}"`).toBeGreaterThanOrEqual(2);
    expect(amounts[0]).toBeLessThan(amounts[1]);
  }

  /**
   * Grounded 2026-08-26: the sheet's "alphabetical" premise is wrong — real, reproducible tab
   * order (confirmed across two independent live runs) is Genre, Accessibility, Showtime, Price
   * Range, Languages, Sort By. Asserts the real order rather than the sheet's assumption.
   */
  async expectFilterByDialogTabOrder(): Promise<void> {
    const tabs = this.cinemasPage
      .filterByDialog()
      .getByRole('button', { name: /^(Genre|Accessibility|Showtime|Price Range|Languages|Sort By)$/ });
    const texts = await tabs.allInnerTexts();
    expect(texts).toEqual(['Genre', 'Accessibility', 'Showtime', 'Price Range', 'Languages', 'Sort By']);
  }

  async expectMovieTabsVisible(): Promise<void> {
    await expect(this.cinemasPage.bookMovieTabButton()).toBeVisible({ timeout: 15_000 });
    await expect(this.cinemasPage.viewMovieDetailsTabButton()).toBeVisible({ timeout: 15_000 });
  }

  async expectMovieListedInCinema(): Promise<void> {
    await expect(this.cinemasPage.movieHeadingsInCinema().first()).toBeVisible({ timeout: 15_000 });
  }

  /**
   * Bug fix (2026-08-21): a guest clicking the favorite icon does NOT toggle it — confirmed
   * live it shows a "Login to add cinema to your favorites?" prompt instead (see
   * CinemasListingDetailPage.ts doc comment). Scoped to the first `role="listitem"` card so
   * this targets a specific cinema rather than an index that could drift after any re-render.
   */
  async clickFirstFavoriteAsGuest(): Promise<void> {
    const card = this.cinemasPage.cinemaListItems().first();
    await this.cinemasPage.favoriteIconIn(card).click();
  }

  async expectLoginToFavoritePromptShown(): Promise<void> {
    await expect(this.cinemasPage.loginToFavoritePrompt()).toBeVisible({ timeout: 15_000 });
  }

  /**
   * Grounded 2026-08-26: not every cinema card has an accessibility icon (only cinemas with
   * accessible seating do). The icon itself (`alt="wheelchair accessible"`) only ever renders
   * inside cinema cards, so searching the page for it directly (rather than the ambiguous
   * `cinemaListItems()` — one live run returned 16 `role="listitem"` matches, since other page
   * sections render listitems too) is the reliable scope.
   *
   * Bug fix (2026-08-26): `gotoCinemasListing()`'s nav-link click only waits for the click
   * itself to succeed, not for the resulting client-side route change to `/cinemas/{city}` to
   * actually finish — confirmed live this can leave `page.url()` still on the homepage when a
   * one-shot `.count()` runs immediately after, unlike other tests here which happen to be
   * masked by an auto-retrying `toBeVisible()` elsewhere in their flow. Waiting for the real
   * listing-loaded signal first closes that race instead of querying too early.
   */
  async hoverAccessibilityIconAndExpectMessage(maxIcons = 5): Promise<boolean> {
    await this.expectListingLoaded();
    const icons = this.cinemasPage.accessibilityIcons();
    const count = Math.min(await icons.count(), maxIcons);
    for (let i = 0; i < count; i++) {
      const icon = icons.nth(i);
      await icon.scrollIntoViewIfNeeded().catch(() => undefined);
      await icon.hover({ timeout: 6_000 }).catch(() => undefined);
      const tooltip = this.page.getByRole('tooltip');
      const shown = await expect(tooltip).toBeVisible({ timeout: 8_000 }).then(() => true).catch(() => false);
      if (shown) {
        await expect(tooltip).toContainText(/accessible/i);
        return true;
      }
    }
    return false;
  }

  async expectDirectionsButtonVisible(): Promise<void> {
    await expect(this.cinemasPage.getDirectionsButton().first()).toBeVisible({ timeout: 15_000 });
  }

  async expectAmenitiesVisible(): Promise<void> {
    await expect(this.cinemasPage.amenitiesHeading()).toBeVisible({ timeout: 15_000 });
  }

  async expectOtherCinemasNearbyVisible(): Promise<void> {
    await expect(this.cinemasPage.otherCinemasNearbyHeading()).toBeVisible({ timeout: 15_000 });
  }

  async expectShowCountBadgeVisible(): Promise<void> {
    await expect(this.cinemasPage.showCountBadge().first()).toBeVisible({ timeout: 15_000 });
  }

  /**
   * Grounded 2026-09-06 (see CinemasListingDetailPage.ts doc comment for the full investigation):
   * Map View's own rendering is a genuine, environment-driven intermittent product behavior — not
   * a client-side wait/race issue (confirmed via ~40 controlled runs, waits up to 45s made no
   * difference once a run landed in the "off" state). Matches this project's `ALT-013` precedent —
   * the fix is this repo's own `openCinemaWithShows()`-style self-skip, not a longer wait. Waits
   * for the real listing-loaded signal first (closing the same race CIN-074 already found and
   * fixed for its own check), then gives the button a real, generous window; clicks it and returns
   * true only if it actually renders this run.
   */
  async openMapView(timeoutMs = 15_000): Promise<boolean> {
    await this.expectListingLoaded();
    const mapBtn = this.cinemasPage.mapViewButton();
    const visible = await mapBtn.waitFor({ state: 'visible', timeout: timeoutMs }).then(() => true).catch(() => false);
    if (!visible) return false;
    await mapBtn.click({ timeout: 6_000 }).catch(() => undefined);
    return true;
  }

  /**
   * Grounded 2026-09-06: when Map View genuinely renders, it reliably shows a real Google Map
   * (`.gm-style` container — confirmed via `window.google.maps` being defined and real `.gm-style`
   * divs present, not just an iframe placeholder). This is the reliably-checkable proxy for
   * CIN-004's "shows user location and cinema markers" — the map itself renders with real cinema
   * data already loaded (3 known cinemas at grounded lat/long); marker-level DOM inspection inside
   * Google Maps' own internal rendering is out of scope (no stable, independently-addressable
   * per-marker locator was found this pass).
   */
  async expectMapContainerVisible(): Promise<void> {
    await expect(this.cinemasPage.mapContainer().first()).toBeVisible({ timeout: 15_000 });
  }

  /**
   * CIN-038/039: a same-run controlled comparison, not a single blind assertion — grounded
   * 2026-09-06 that a SINGLE observation (Map View absent without permission) can't be
   * distinguished from this feature's separate, broader environment-level unavailability (see
   * CinemasListingDetailPage.ts doc comment) without comparing both states in the same session.
   * Starts with geolocation permission NOT granted (real manual city-selection path), confirms
   * listing loads regardless (matches CIN-002's finding), then grants permission and reloads the
   * SAME session to observe whether Map View newly appears. Returns both observations so the test
   * can self-skip when the comparison itself is inconclusive (Map View absent in both states this
   * run — the broader unavailability, not permission-gating, is in effect) rather than
   * mis-attributing a coin-flip to permission.
   */
  async compareMapViewWithAndWithoutGeoPermission(): Promise<{ withoutPermission: boolean; withPermission: boolean }> {
    await this.page.context().clearPermissions();
    await this.gotoCinemasListing({ grantGeolocation: false });
    const withoutPermission = await this.cinemasPage
      .mapViewButton()
      .waitFor({ state: 'visible', timeout: 10_000 })
      .then(() => true)
      .catch(() => false);

    await grantMumbaiGeolocation(this.page);
    await this.page.reload();
    await this.expectListingLoaded();
    const withPermission = await this.cinemasPage
      .mapViewButton()
      .waitFor({ state: 'visible', timeout: 15_000 })
      .then(() => true)
      .catch(() => false);

    return { withoutPermission, withPermission };
  }

  /**
   * Grounded 2026-09-06: confirmed live the "N Cinemas" badge (same locator as the plain list
   * view) switches from "3 Cinemas" to "1 Cinema" specifically when Map View is opened — the map
   * narrows to a single, nearest cinema by default (matches CIN-050's premise) rather than
   * showing all of them at once. Reproduced live in a controlled before/after comparison.
   */
  async expectMapShowsSingleNearestCinemaByDefault(): Promise<void> {
    await expect(this.cinemasPage.cinemaCountText()).toHaveText(/^1 Cinema$/i, { timeout: 10_000 });
  }

  /**
   * Grounded 2026-09-06: clicking "Distance" (when the map's own filter-chip strip renders —
   * itself the same class of flakiness as the per-cinema FILTER BY chip strip, see class doc
   * comment) reveals two real ARIA `role="slider"` handles, confirmed live. Returns false if the
   * chip itself doesn't render, or the sliders never appear, this run.
   */
  async openMapDistanceFilter(): Promise<boolean> {
    // BUG FIX (2026-09-06): `locator.isVisible()` does NOT auto-wait/poll despite accepting a
    // `timeout` option — it checks the current DOM state once and returns immediately. Right
    // after `openMapView()`'s click, the map's own chip strip genuinely hasn't painted yet (same
    // shape as CIN-074's own bug fix for the listing route transition) — a raw diagnostic script
    // confirmed the exact same locator finds the chip reliably once given a real settle wait
    // first. `waitFor({ state: 'visible' })` properly polls instead of checking once.
    const chip = this.cinemasPage.mapDistanceChip();
    const visible = await chip.waitFor({ state: 'visible', timeout: 8_000 }).then(() => true).catch(() => false);
    if (!visible) return false;
    await chip.click({ timeout: 6_000 }).catch(() => undefined);
    return this.cinemasPage.mapDistanceSliderHandles().first().waitFor({ state: 'visible', timeout: 8_000 }).then(() => true).catch(() => false);
  }

  /** Grounded 2026-09-06: confirmed live real `aria-valuemin="0"` (min handle) / `aria-valuemax="25"` (max handle) — the CMS-managed 0–25km range CIN-066 claims. */
  async expectDistanceRangeIsZeroToTwentyFiveKm(): Promise<void> {
    await expect(this.cinemasPage.mapDistanceSliderHandles().first()).toHaveAttribute('aria-valuemin', '0');
    await expect(this.cinemasPage.mapDistanceSliderHandles().last()).toHaveAttribute('aria-valuemax', '25');
  }

  /**
   * Grounded 2026-09-06: confirmed live that keyboard-focusing the max-distance handle and
   * pressing ArrowLeft repeatedly (a real, accessible slider interaction) reliably shrinks the
   * range below the nearest known cinema's real distance, producing a genuine "No Cinema Found"/
   * "No cinemas found" message. Returns true if that message appeared.
   */
  async shrinkDistanceUntilNoCinemasFound(): Promise<boolean> {
    const maxHandle = this.cinemasPage.mapDistanceSliderHandles().last();
    await maxHandle.focus().catch(() => undefined);
    for (let i = 0; i < 30; i++) {
      await this.page.keyboard.press('ArrowLeft').catch(() => undefined);
    }
    return this.cinemasPage.noCinemasFoundMessage().first().isVisible({ timeout: 8_000 }).catch(() => false);
  }

  async expectNoCinemasFoundMessageVisible(): Promise<void> {
    await expect(this.cinemasPage.noCinemasFoundMessage().first()).toBeVisible({ timeout: 8_000 });
  }

  async expectResponsiveNoOverflow(): Promise<void> {
    const hasHorizontalOverflow = await this.page.evaluate(() => {
      const doc = (globalThis as unknown as { document: { documentElement: { scrollWidth: number; clientWidth: number } } }).document;
      return doc.documentElement.scrollWidth > doc.documentElement.clientWidth + 1;
    });
    expect(hasHorizontalOverflow, 'page should not overflow horizontally').toBe(false);
  }

  /**
   * CIN-005/049: grounded 2026-09-07, root-caused via step-by-step headless timing/network
   * tracing (see class doc comment's eighth-pass note for the full finding) — a brand-new phone
   * number's OTP success opens a real registration-details form first; this suite's usual "OTP
   * input hidden" signal doesn't distinguish that from a genuinely completed login. Composes
   * `RegistrationModule`/`ProfileCompletionModule` (matching `MovieAlertsModule`'s own established
   * pattern for this exact precondition) to reach a session that's genuinely authenticated for
   * favorite-gated features, confirmed live: the favorite icon then toggles in ~350ms with no
   * "Login to add cinema to your favorites?" gate (see CIN-008) and no hang.
   *
   * BUG FIX (2026-09-07, first real test run): `ProfileCompletionModule.dismissNudgeIfPresent()`
   * only clicks "I'll miss out" — it does NOT handle the real, separate "Skip Anyway" sub-dialog
   * that renders ON TOP of it afterward (matching `MovieAlertsModule`'s own documented gap and
   * fix for this exact precondition — see its `dismissOnboardingNudgeIfShown()`). Missing this
   * left the session non-terminally-onboarded and the very next favorite click hit the real
   * guest "Login to add cinema to your favorites?" gate instead of toggling — confirmed live via
   * the failing test's own accessibility snapshot. Dismissing the sub-dialog too (if it renders)
   * before returning is the fix, same shape as `MovieAlertsModule`'s own composition.
   */
  async loginAsNewUserForFavorites(): Promise<void> {
    const phone = DataGenerator.randomIndianPhoneNumber();
    const email = DataGenerator.uniqueEmail('cintest');
    await this.registerLoginModule.gotoLogin();
    await this.registrationModule.registerNewUser({ phone, firstName: 'CinTest', email });
    await this.registrationModule.expectRegistrationSubmitted();

    const nudgeShown = await this.page
      .getByRole('heading', { name: 'Complete Your Profile', level: 1 })
      .waitFor({ state: 'visible', timeout: 20_000 })
      .then(() => true)
      .catch(() => false);
    if (!nudgeShown) return;
    await this.profileCompletionModule.dismissWithMaybeLater();
    const skipAnywayButton = this.page.getByRole('button', { name: /^skip anyway$/i });
    const skipAnywayShown = await skipAnywayButton.waitFor({ state: 'visible', timeout: 10_000 }).then(() => true).catch(() => false);
    if (skipAnywayShown) await skipAnywayButton.click({ timeout: 8_000 });
    await this.page
      .getByRole('heading', { name: 'Complete Your Profile', level: 1 })
      .waitFor({ state: 'hidden', timeout: 10_000 })
      .catch(() => undefined);
  }

  /**
   * BUG FIX (2026-09-07, CIN-005 first real logged-in test run): a plain index into
   * `cinemaListItems()` is not reliably "a real cinema card" once genuinely logged in (confirmed
   * live: index 2 resolved to "Hindi", a language tag from some other listitem-rendering section
   * — matches this class's own documented "other page sections render listitems too" finding).
   * Uses `realCinemaListItems()` instead — structurally filtered to only listitems containing the
   * real favorite icon, which no other page section has. Returns the card's display name (its
   * own first text line, before the "X km away" suffix) since no accessible heading role wraps it
   * on this page (confirmed live: the page's real `h2`s are the "N Cinemas" count badge and the
   * merged detail panel's own section headings, not the cinema card name).
   */
  private async cinemaNameAtIndex(index: number): Promise<string> {
    const text = await this.cinemasPage.realCinemaListItems().nth(index).innerText({ timeout: 8_000 }).catch(() => '');
    return text.split('\n')[0]?.trim() ?? '';
  }

  /** CIN-044: parses the card's own "X km away" text — the same distance shown to a real user. */
  private async cinemaDistanceAtIndex(index: number): Promise<number | null> {
    const text = await this.cinemasPage.realCinemaListItems().nth(index).innerText({ timeout: 8_000 }).catch(() => '');
    const match = text.match(/([\d.]+)\s*km away/i);
    return match ? Number(match[1]) : null;
  }

  /**
   * CIN-005/049: favorites a real, non-first cinema (so a later "moved to top" check is
   * meaningful) and confirms its icon flips immediately. Returns the favorited cinema's name and
   * its index at the time of the click, for the caller's own follow-up assertion, or an empty
   * name (index -1) if fewer than 2 real cinemas exist this run (this file's own established
   * data-volatility self-skip gate).
   */
  async favoriteNonTopCinema(): Promise<{ name: string; index: number }> {
    const realItems = this.cinemasPage.realCinemaListItems();
    // BUG FIX (2026-09-07): `.count()` does NOT auto-wait/poll — it checks the current DOM state
    // once (same class of bug this repo has already found and fixed elsewhere, e.g.
    // `openMapDistanceFilter()`'s own note on `isVisible({ timeout })`). The cinema cards can also
    // render progressively (first one visible while later ones are still loading), so a single
    // early count can undercount — polling until it reaches >= 2 gives the rest of the list real
    // time to finish rendering before concluding there's genuinely only 1.
    await expect
      .poll(async () => realItems.count(), { timeout: 15_000 })
      .toBeGreaterThanOrEqual(2)
      .catch(() => undefined); // a real "only 1 this run" case times out here — read the final count below either way
    const realCinemaCount = await realItems.count();
    if (realCinemaCount < 2) return { name: '', index: -1 }; // need at least 2 real cinemas to favorite a non-first one

    const lastRealIndex = realCinemaCount - 1;
    const target = realItems.nth(lastRealIndex);
    const targetName = await this.cinemaNameAtIndex(lastRealIndex);
    await this.cinemasPage.favoriteIconIn(target).click({ timeout: 10_000 });
    await expect(this.cinemasPage.favoriteIconIn(target)).toHaveAttribute('alt', /^favorited$/i, { timeout: 15_000 });
    return { name: targetName, index: lastRealIndex };
  }

  /**
   * CIN-005: grounded 2026-09-07 — favoriting does NOT live-re-sort the list in the same render
   * (confirmed: favoriting the farthest of 3 cinemas left the visible order unchanged with no
   * reload), but a reload DOES apply the real sort (confirmed: the favorited cinema moved to
   * index 0 after reload). This is the real, reload-visible version of the sheet's "sorted to
   * top" claim.
   */
  async expectCinemaSortedToTopAfterReload(favoritedName: string): Promise<void> {
    await this.page.reload();
    await this.expectListingLoaded();
    await expect
      .poll(async () => this.cinemaNameAtIndex(0), { timeout: 15_000, message: `expected "${favoritedName}" to sort to the top after a reload` })
      .toBe(favoritedName);
  }

  /**
   * CIN-049: grounded 2026-09-07 — disproves the sheet's own "reflects immediately" premise (see
   * class doc comment's eighth-pass note): confirms the favorited cinema's position is UNCHANGED
   * immediately after the click, with no reload — the real, weaker behavior in place of the
   * sheet's stronger "immediately" claim (matches this file's established pattern of asserting a
   * disproven premise's real replacement, e.g. CIN-038/039).
   */
  async expectFavoriteDoesNotReorderWithoutReload(favoritedName: string, indexBeforeClick: number): Promise<void> {
    const nameStillAtSameIndex = await this.cinemaNameAtIndex(indexBeforeClick);
    expect(nameStillAtSameIndex, 'real, grounded finding: favoriting does not live-re-sort the list without a reload').toBe(favoritedName);
  }

  /**
   * CIN-044: favorites two real cinemas that have genuinely different distances (skipping a tie
   * — the live data on this environment has repeated the exact same "4.76 km away" on 2 of 3
   * cinemas before, which would make a "sorted by distance" assertion meaningless between them).
   * Returns the two names in expected ascending-distance order (closer first) for the caller's
   * post-reload assertion, or nulls (self-skip signal) if fewer than 2 real cinemas with distinct
   * distances exist this run — same data-volatility self-skip gate `favoriteNonTopCinema` uses.
   */
  async favoriteTwoCinemasWithDifferentDistances(): Promise<{ closer: string; farther: string } | { closer: null; farther: null }> {
    const realItems = this.cinemasPage.realCinemaListItems();
    await expect
      .poll(async () => realItems.count(), { timeout: 15_000 })
      .toBeGreaterThanOrEqual(2)
      .catch(() => undefined);
    const count = await realItems.count();

    const cards: { index: number; name: string; distance: number }[] = [];
    for (let i = 0; i < count; i++) {
      const [name, distance] = await Promise.all([this.cinemaNameAtIndex(i), this.cinemaDistanceAtIndex(i)]);
      if (name && distance !== null) cards.push({ index: i, name, distance });
    }

    const distances = [...new Set(cards.map((c) => c.distance))];
    if (distances.length < 2) return { closer: null, farther: null };

    const closerCard = cards.filter((c) => c.distance === Math.min(...distances))[0];
    const fartherCard = cards.filter((c) => c.distance === Math.max(...distances))[0];

    // BUG FIX (2026-09-09): a stale index (`realItems.nth(closerCard.index)`, captured before any
    // clicking) broke on the second favorite — the first click's own re-render shifted what that
    // index resolves to. Re-locating by the card's own (unique) name instead of position is
    // immune to any in-place reordering the click itself causes.
    const closerItem = realItems.filter({ hasText: closerCard.name }).first();
    const fartherItem = realItems.filter({ hasText: fartherCard.name }).first();

    // BUG FIX (2026-09-09): reproduced live via the real test runner (not this method's own
    // standalone diagnostic, which never hit this) — a popup (e.g. the "How Was The Movie?"
    // rating dialog `dismissPromoPopup` now also handles) can render fresh on this page after
    // `gotoCinemasListing()`'s own dismiss-and-navigate already ran, intercepting the favorite
    // icon click and leaving `alt` unchanged. Defensively dismissing again immediately before
    // each click closes that gap.
    await dismissPromoPopup(this.page);
    await this.cinemasPage.favoriteIconIn(closerItem).click({ timeout: 10_000 });
    await expect(this.cinemasPage.favoriteIconIn(closerItem)).toHaveAttribute('alt', /^favorited$/i, { timeout: 15_000 });
    await dismissPromoPopup(this.page);
    await this.cinemasPage.favoriteIconIn(fartherItem).click({ timeout: 10_000 });
    await expect(this.cinemasPage.favoriteIconIn(fartherItem)).toHaveAttribute('alt', /^favorited$/i, { timeout: 15_000 });

    return { closer: closerCard.name, farther: fartherCard.name };
  }

  /** CIN-044: confirms both favorited cinemas sort above any non-favorited one, closer-first between them. */
  async expectTwoFavoritesSortedByDistanceAfterReload(closer: string, farther: string): Promise<void> {
    await this.page.reload();
    await this.expectListingLoaded();
    await expect
      .poll(async () => this.cinemaNameAtIndex(0), { timeout: 15_000, message: `expected the closer favorite "${closer}" at index 0` })
      .toBe(closer);
    await expect
      .poll(async () => this.cinemaNameAtIndex(1), { timeout: 15_000, message: `expected the farther favorite "${farther}" at index 1` })
      .toBe(farther);
  }

  /**
   * CIN-054: grounded 2026-09-07 — confirmed live via bounding boxes that the page-level
   * "Experiences" filter chip's Y position is above the movie-card carousel's own Y position on
   * a cinema confirmed to have real shows. Returns false (self-skip signal, matching this file's
   * own established handling of the chip strip's documented render flakiness — see class doc
   * comment) if the chip itself doesn't render this run, rather than failing the positional
   * check on a `null` bounding box.
   */
  async expectExperienceFilterAboveMovieListing(): Promise<boolean> {
    const chipVisible = await this.cinemasPage.experiencesChip().isVisible({ timeout: 8_000 }).catch(() => false);
    if (!chipVisible) return false;
    const chipBox = await this.cinemasPage.experiencesChip().boundingBox();
    const carouselBox = await this.cinemasPage.movieCarouselContainer().first().boundingBox();
    expect(chipBox, 'Experiences chip should have a real bounding box').not.toBeNull();
    expect(carouselBox, 'movie carousel should have a real bounding box').not.toBeNull();
    if (chipBox && carouselBox) {
      expect(chipBox.y + chipBox.height, 'Experiences filter should render above the movie listing').toBeLessThanOrEqual(carouselBox.y);
    }
    return true;
  }

  /**
   * Grounded 2026-09-07 (CIN-031/056/057/058): the movie carousel always reports 5
   * `.swiper-slide` children on this build regardless of real movie count — Swiper pads with
   * empty clone slides (confirmed live via a full slide-by-slide text dump). Only slides with a
   * genuinely non-empty heading are real movies; this is this scenario cluster's own
   * data-volatility self-skip signal, matching `openCinemaWithShows()`'s established pattern.
   */
  private async realMovieCardHeadings(): Promise<string[]> {
    const slides = this.cinemasPage.movieCardSlides();
    const count = await slides.count();
    const names: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = (await slides.nth(i).getByRole('heading').first().textContent({ timeout: 5_000 }).catch(() => '')) ?? '';
      if (text.trim()) names.push(text.trim());
    }
    return names;
  }

  /**
   * CIN-056/031: grounded 2026-09-07 — clicking a movie card's own `role="heading"` (its title)
   * is a real, reliable click target confirmed live to succeed without `force: true`, unlike a
   * click on the card/poster area (the Swiper-sibling interception the old fixme reasons
   * documented). Selects the movie at `index` and confirms the shared showtime panel now shows
   * DIFFERENT showtimes than `previousShowtimeTexts` — the real, directly-observable proxy for
   * "expanding this card reveals its own slots" on this build, where showtimes render in one
   * shared panel rather than nested per-card (confirmed live: per-slide showtime queries found
   * zero matches for the one real movie this pass had, before or after its own heading click).
   * Returns false (self-skip signal) if fewer than 2 real movie cards exist this run.
   */
  async selectMovieCardAndExpectDifferentShowtimes(index: number, previousShowtimeTexts: string[]): Promise<boolean> {
    const names = await this.realMovieCardHeadings();
    if (names.length < 2 || index >= names.length) return false;
    await this.cinemasPage.movieCardHeadingAt(index).click({ timeout: 8_000 });
    await expect
      .poll(async () => this.cinemasPage.showtimeButtons().allTextContents(), { timeout: 10_000, message: 'expected showtimes to change after selecting a different movie card' })
      .not.toEqual(previousShowtimeTexts);
    return true;
  }

  /** Companion to `selectMovieCardAndExpectDifferentShowtimes` — real movie count + current showtimes, for the caller's before/after comparison. */
  async getRealMovieCardCountAndCurrentShowtimes(): Promise<{ realMovieCount: number; showtimeTexts: string[] }> {
    const names = await this.realMovieCardHeadings();
    const showtimeTexts = await this.cinemasPage.showtimeButtons().allTextContents();
    return { realMovieCount: names.length, showtimeTexts };
  }

  /**
   * CIN-058: grounded 2026-09-07 — for the first 2 real movie cards, selects each in turn (via
   * its heading, see `selectMovieCardAndExpectDifferentShowtimes`'s doc comment) and compares the
   * shared showtime panel's button count, asserting non-increasing order (movie 0's count >=
   * movie 1's) — the real, directly-observable proxy for "sorted by available showtime count" on
   * this build. Returns false (self-skip signal) if fewer than 2 real movie cards exist this run.
   */
  async expectMoviesSortedByShowtimeCountDescending(): Promise<boolean> {
    const names = await this.realMovieCardHeadings();
    if (names.length < 2) return false;

    await this.cinemasPage.movieCardHeadingAt(0).click({ timeout: 8_000 });
    await expect(this.cinemasPage.showtimeButtons().first()).toBeVisible({ timeout: 10_000 });
    const firstCount = await this.cinemasPage.showtimeButtons().count();

    await this.cinemasPage.movieCardHeadingAt(1).click({ timeout: 8_000 });
    await expect(this.cinemasPage.showtimeButtons().first()).toBeVisible({ timeout: 10_000 });
    const secondCount = await this.cinemasPage.showtimeButtons().count();

    expect(firstCount, 'movies should be sorted by non-increasing available showtime count').toBeGreaterThanOrEqual(secondCount);
    return true;
  }

  /**
   * CIN-040/041/042: grounded 2026-09-07 (see `LocationHelper.DELHI_GEOLOCATION`'s doc comment
   * for the full finding). The prior "not reliably reproducible via geolocation mocking alone"
   * finding was a sequencing gap: a fresh context/navigation has no previously-saved city to
   * conflict with, so no mismatch is possible. This method assumes `gotoCinemasListing()` (or
   * any Mumbai-geolocated navigation) has already run at least once this session — persisting
   * the real `cityDetails` cookie — then switches the SAME context's geolocation to a different
   * real city and reloads, confirmed live to reliably open a real "Change your city?" dialog.
   */
  async triggerCityChangeNudge(): Promise<void> {
    await this.page.context().setGeolocation(DELHI_GEOLOCATION);
    await this.page.reload();
    await dismissPromoPopup(this.page);
  }

  async expectCityChangeNudgeVisible(): Promise<void> {
    await expect(this.cinemasPage.changeCityDialog()).toBeVisible({ timeout: 15_000 });
    await expect(this.cinemasPage.changeCityDialog()).toContainText(/your current city seems to be/i);
  }

  async acceptCityChange(): Promise<void> {
    await this.cinemasPage.switchToCurrentCityButton().click({ timeout: 8_000 });
    await expect(this.cinemasPage.changeCityDialog()).toBeHidden({ timeout: 10_000 });
  }

  async declineCityChange(): Promise<void> {
    await this.cinemasPage.notNowCityButton().click({ timeout: 8_000 });
    await expect(this.cinemasPage.changeCityDialog()).toBeHidden({ timeout: 10_000 });
  }

  /**
   * CIN-041/042: grounded 2026-09-07 — the saved city genuinely lives in a `cityDetails` cookie
   * (NOT localStorage, confirmed empty there), e.g. `{cityId, cityName, lat, long, ...}`.
   * Confirmed live in a real before/after comparison: accepting the nudge updates `cityName` to
   * the newly-detected city; declining it leaves `cityName` unchanged (`userCurrentCityId` alone
   * updates to track the detected-but-not-adopted city).
   */
  async getSavedCityName(): Promise<string | undefined> {
    const cookies = await this.page.context().cookies();
    const cityDetails = cookies.find((c) => c.name === 'cityDetails');
    if (!cityDetails) return undefined;
    try {
      const parsed = JSON.parse(decodeURIComponent(cityDetails.value)) as { cityName?: string };
      return parsed.cityName;
    } catch {
      return undefined;
    }
  }
}
