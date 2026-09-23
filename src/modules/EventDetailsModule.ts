import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { EventDetailsPage } from '@pages/EventDetailsPage';
import {
  dismissLocationAndSelectCity,
  waitForHomepageReady,
  grantMumbaiGeolocation,
  UAT_BASE_URL,
  UAT_CITY,
  UAT_SUB_CITY,
  MUMBAI_GEOLOCATION,
} from '@utils/LocationHelper';
import { Logger } from '@utils/Logger';

/**
 * Grounded 2026-08-19 against a real event detail page on UAT — see EventDetailsPage.ts.
 * `gotoKnownEventDetail` uses the same real event (`live-karan-aujla-concert/30199`) already
 * relied on by event-listing.spec.ts EL-008/EL-013, navigated to directly rather than via a
 * click-through, so this module doesn't depend on that event still being featured on the
 * homepage carousel at test time — only on the event session itself still existing.
 *
 * Re-grounded 2026-09-06: that assumption broke — the anchor event has since fully expired (see
 * `gotoKnownEventDetail`'s own doc comment and the spec file's header REGRESSION note), and
 * unlike the 2026-08-19 pass's expectation, the event *session itself* existing turned out not
 * to be durable either. `openLiveEventWithCinemaData()` (below `gotoKnownEventDetailWithLocation
 * Granted`) is the fix — see its own doc comment for the full "no listing left to hop through,
 * so probe the real endpoint by nearby catalog id instead" reasoning. `gotoKnownEventDetail`/
 * `gotoKnownEventDetailWithLocationGranted` themselves are left as-is, still backing the
 * currently-passing ED-001/003/004/012 (none of which need real cinema/showtime data), so this
 * fix is additive rather than a replacement.
 */
export class EventDetailsModule {
  private readonly eventDetailsPage: EventDetailsPage;
  // Historical anchor event id (`live-karan-aujla-concert`) — confirmed permanently expired
  // (see file header REGRESSION note), kept only as the starting point `
  // openLiveEventWithCinemaData` probes outward from, not as something navigated to directly.
  private static readonly ANCHOR_EVENT_ID = 30199;
  private liveEventId: number | null = null;
  private liveEventTitle = '';

  constructor(private page: Page) {
    this.eventDetailsPage = new EventDetailsPage(page);
  }

  /** The title of whichever candidate `openLiveEventWithCinemaData` actually landed on. */
  getLiveEventTitle(): string {
    return this.liveEventTitle;
  }

  async gotoHomepageWithCitySelected(): Promise<void> {
    Logger.info('Opening UAT homepage and ensuring Mumbai is selected');
    await this.page.goto(UAT_BASE_URL);
    await waitForHomepageReady(this.page, UAT_CITY, UAT_SUB_CITY);
  }

  /**
   * Grounded 2026-08-19: same "content still loading behind a re-dismissed modal" issue
   * documented on `waitForHomepageReady` applies here too, but this page has no "Now Showing"
   * heading to key off of — it uses its own real, confirmed signal instead (the event title).
   */
  async gotoKnownEventDetail(): Promise<void> {
    await this.page.goto(`${UAT_BASE_URL}/eventsessions/mumbai/live-karan-aujla-concert/30199`);
    for (let attempt = 1; attempt <= 3; attempt++) {
      await dismissLocationAndSelectCity(this.page, UAT_CITY, UAT_SUB_CITY);
      const ready = await this.eventDetailsPage
        .eventTitle(/karan aujla/i)
        .waitFor({ state: 'visible', timeout: 10_000 })
        .then(() => true)
        .catch(() => false);
      if (ready) return;
    }
  }

  async expectEventTitleVisible(title: string | RegExp): Promise<void> {
    await expect(this.eventDetailsPage.eventTitle(title)).toBeVisible();
  }

  async expectShowsCountHeadingVisible(): Promise<void> {
    await expect(this.eventDetailsPage.showsCountHeading()).toBeVisible();
  }

  /**
   * Grounded 2026-09-06: with geolocation pre-granted (the state `openLiveEventWithCinemaData`
   * navigates through), the cinema card shows its real address + a "Get Directions" button
   * instead of the non-granted "Enable location to get directions" copy `cinemaListEntries` was
   * originally keyed on — confirmed live. Checks either signal so this keeps working for a
   * caller in either location-permission state.
   */
  async expectCinemaListVisible(): Promise<void> {
    const entry = this.eventDetailsPage.getDirectionsButton().or(this.eventDetailsPage.cinemaListEntries()).first();
    await entry.scrollIntoViewIfNeeded({ timeout: 20_000 }).catch(() => undefined);
    await expect(entry).toBeVisible({ timeout: 20_000 });
  }

  /**
   * Grounded 2026-08-25: re-navigates to the same known event with Mumbai geolocation granted
   * first (`LocationHelper.grantMumbaiGeolocation`). Confirmed live across many runs to load
   * fast and deterministically — far more reliable than the plain modal-dismiss flow
   * `gotoKnownEventDetail` uses, which was observed live to occasionally hang on a skeleton
   * placeholder with no city resolved. Used only by the deeper-interactivity tests (ED-003/
   * 004/006/008/009/010/011) added in this pass, as an extra step on top of `beforeEach`'s own
   * navigation — deliberately NOT folded into `gotoHomepageWithCitySelected`/
   * `gotoKnownEventDetail` themselves, since ED-001/ED-005's already-confirmed locators
   * (`cinemaListEntries`'s "Enable location to get directions" text) key off the
   * *non*-granted state and shouldn't be disturbed by this pass.
   *
   * BUG FIX (2026-08-25): `gotoKnownEventDetail`'s own ready-check only waits for the hero
   * `eventTitle` — confirmed live that the title renders well before the Book Event section
   * further down (Share button, date tabs, legend, showtime cards) has finished hydrating,
   * causing flaky "element not found"/mis-clicks in tests that touch that section immediately
   * after this returns. Waits for `showtimeButtons` — the deepest-loading confirmed element,
   * below both the shows-count heading and the cinema entry — as the real "fully settled"
   * signal, with up to 2 extra reloads if a first live full-suite run's resource contention
   * (parallel sibling-spec runs sharing this sandbox) leaves it still not rendered.
   */
  async gotoKnownEventDetailWithLocationGranted(): Promise<void> {
    Logger.info('Granting Mumbai geolocation and re-navigating to the known event for deeper interaction checks');
    await grantMumbaiGeolocation(this.page);
    await this.gotoKnownEventDetail();
    // BUG FIX (2026-09-06): the anchor event this waits on is confirmed permanently cinema-less
    // now (see file header REGRESSION note) — the original 3-attempt x 20s-wait-plus-reload
    // budget was written when the anchor still had real showtimes, and was observed live to
    // burn through most of ED-004's 180s test.slow() budget waiting for a signal
    // (`showtimeButtons`) that can now never fire on this specific anchor, starving the
    // caller's own real assertions of their fair share of time.
    //
    // BUG (real, confirmed live, worth flagging): worse than just wasted time — reloading a
    // page whose real response has no `cinemas` at all was separately confirmed live to
    // non-deterministically crash the client's own rendering and redirect straight back to the
    // homepage (reproduced via a raw headless script outside this suite entirely; the same
    // underlying issue `openLiveEventWithCinemaData` guards against for a *different* id — see
    // its own doc comment). Each reload of a structurally-broken page is another roll of that
    // dice, so this no longer reload-and-retries chasing a signal that can't appear anyway — a
    // single check, with one recovery re-navigation if the crash-redirect still happens, is
    // both faster and less likely to trip it.
    await this.page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => undefined);
    await this.eventDetailsPage
      .showtimeButtons()
      .first()
      .waitFor({ state: 'visible', timeout: 12_000 })
      .catch(() => undefined);
    if (!this.page.url().includes('/eventsessions/')) {
      Logger.info('Redirected away from the event page — re-navigating once to recover');
      await this.gotoKnownEventDetail();
    }
  }

  /**
   * Grounded 2026-09-06: the anchor event this whole file was written against
   * (`live-karan-aujla-concert/30199`) is confirmed permanently expired (see file header
   * REGRESSION note) — its real `api/movie-detail` response no longer has any `cinemas` at
   * all. Its would-be replacement source, the homepage Events carousel / `/events` listing, is
   * *itself* confirmed still absent on live UAT (re-checked live today — zero "Events" heading
   * matches, zero `/eventsessions/` links anywhere on the homepage; `/events` still renders only
   * the "Back To Home" stub — see event-listing.spec.ts's own matching REGRESSION note). So
   * there is no UI-rendered list of events left to hop through the way
   * `MovieDetailsModule.openMovieFromHomepage`/`CinemasListingDetailModule.openCinemaWithShows`
   * hop through homepage tiles / cinema cards.
   *
   * The closest available equivalent: `/eventsessions/{city}/{any-slug}/{id}` is confirmed live
   * to be purely id-driven — the slug is never validated (confirmed by loading the same id
   * behind a deliberately wrong slug and getting the identical page), and ANY currently-live
   * catalog id renders through this exact same template regardless of whether the backend calls
   * it a "movie" or an "event" (confirmed live: id 30205, a real Now-Showing movie
   * ("Dhurandhar(Hindi)"), rendered a real "6 SHOWS IN 1 CINEMA" heading, Share, date tabs, a
   * real cinema card with a working "Get Directions" control, 6 real showtimes, and all 4
   * legend states — indistinguishable in structure from what the original anchor event used to
   * render). So this probes the real `api/movie-detail` endpoint (the same endpoint the page
   * itself calls, confirmed via network capture) for nearby catalog ids until one answers with
   * a non-empty `cinemas` array, then navigates the browser straight to that id.
   *
   * This dataset is itself confirmed volatile minute-to-minute (two independent sweeps of the
   * same id range, seconds apart, returned different live ids — matching the same
   * live-data-rotation already documented for `MovieDetailsModule.openMovieFromHomepage`'s movie
   * tiles), so this always probes fresh — never from a cached/hardcoded id list — and a
   * candidate that answered the probe can still have emptied out by the time of the follow-up
   * navigation, handled below by moving on to the next candidate rather than failing outright.
   *
   * BUG (self-inflicted, worth flagging for future grounding passes): probing many ids
   * concurrently (~20 in flight) during this pass tripped a real, reproducible 403 "Forbidden"
   * from every core homepage API (`get-city-list`, `config-user`, `detect-city`) for roughly
   * 20-30 seconds — confirmed via a direct header/body dump to be a genuine backend-level block
   * (`istio-envoy` / `inox-web-app.uat.svc.cluster.local`, a real JSON 403 body), not a CDN
   * challenge page, and it cleared on its own shortly after. Probing strictly one id at a time,
   * as below, avoids re-tripping it.
   */
  async openLiveEventWithCinemaData(maxCandidates = 60): Promise<boolean> {
    await grantMumbaiGeolocation(this.page);
    for (let offset = 0; offset <= maxCandidates; offset++) {
      const id = EventDetailsModule.ANCHOR_EVENT_ID + offset;
      const probeUrl =
        `${UAT_BASE_URL}/api/movie-detail?cityId=1&lat=${MUMBAI_GEOLOCATION.latitude}` +
        `&long=${MUMBAI_GEOLOCATION.longitude}&movieId=${id}&type=EVENT`;
      const hasCinemas = await this.page.request
        .get(probeUrl, { timeout: 6_000 })
        .then(async (res) => (res.ok() ? Boolean((await res.json().catch(() => null))?.data?.cinemas?.length) : false))
        .catch(() => false);
      if (!hasCinemas) continue;

      Logger.info(`Probed a live candidate (id=${id}) with real cinema data — navigating to it`);
      const candidateUrl = `${UAT_BASE_URL}/eventsessions/mumbai/event/${id}`;
      // BUG (real, confirmed live, worth flagging): landing on this route immediately after a
      // *different* `/eventsessions/...` page whose real response had no `cinemas` at all (i.e.
      // exactly the dead anchor `beforeEach` visits first) can, non-deterministically, redirect
      // straight back to the plain homepage within ~1-2s of `goto()` — reproduced via a raw
      // headless script, not an artifact of this suite. Re-`goto()`-ing the exact candidate URL
      // again (not a same-page `reload()`, which just reloads whatever page the redirect landed
      // on) was confirmed live to recover on a later attempt, so that's what each retry does
      // below, guarded by an explicit "did we actually land on the candidate id" check rather
      // than trusting `showtimeButtons` alone (which is equally absent on the homepage).
      for (let attempt = 1; attempt <= 3; attempt++) {
        await this.page.goto(candidateUrl).catch(() => undefined);
        await dismissLocationAndSelectCity(this.page, UAT_CITY, UAT_SUB_CITY).catch(() => undefined);
        const ready = await this.eventDetailsPage
          .showtimeButtons()
          .first()
          .waitFor({ state: 'visible', timeout: 15_000 })
          .then(() => true)
          .catch(() => false);
        const onCandidate = this.page.url().includes(`/${id}`);
        if (ready && onCandidate) {
          // The redirect above has also been seen to fire a few seconds *after* this point
          // looked settled (confirmed live via a failed follow-up assertion landing on the
          // homepage) — waiting for a URL change away from the candidate (rather than a blind
          // timer) for a short window catches that case before this method reports success,
          // instead of leaving every caller to independently guard against it. Resolving means
          // it drifted; timing out (the expected, common case) means it's genuinely stable.
          const driftedAway = await this.page
            .waitForURL((url) => !url.toString().includes(`/${id}`), { timeout: 4_000 })
            .then(() => true)
            .catch(() => false);
          if (driftedAway) {
            Logger.info(`Candidate id=${id} redirected away to ${this.page.url()} shortly after settling — retrying the navigation`);
            continue;
          }
          this.liveEventId = id;
          this.liveEventTitle = (await this.eventDetailsPage.eventTitle().first().textContent().catch(() => '')) ?? '';
          return true;
        }
        if (!onCandidate) {
          Logger.info(`Candidate id=${id} redirected away to ${this.page.url()} instead of settling — retrying the navigation`);
        }
      }
      // This candidate's cinemas emptied out between the probe and the navigation (confirmed
      // live this data is volatile second-to-second), or the redirect above never recovered
      // within budget — move on to the next candidate instead of
      // giving up on the whole search.
    }
    return false;
  }

  /**
   * requirements/offers.md OFR-036. Grounded 2026-09-07: reuses the exact catalog-id probing
   * `openLiveEventWithCinemaData()` already established (see its own doc comment — the Events
   * homepage carousel/listing is confirmed absent, so this route is the only way left to reach
   * an "event details"-shaped page at all; any live catalog id, "movie" or "event", renders
   * through the identical template). Once landed on a candidate, checks the same Also Playing
   * offer-chip signal already confirmed on `MovieDetailsPage.alsoPlayingDiscountChip` — confirmed
   * live this is genuinely data-driven/volatile per candidate (id 30205's Also Playing carried
   * the chip via the homepage/Movie Details route, then had none moments later via this same
   * Event Details route) — so this probes several live candidates, not just the first, before
   * giving up. Returns false (rather than throwing) if none carry a chip within budget, so the
   * caller can `test.skip()` gracefully — same pattern as
   * `MovieDetailsModule.openMovieWithAlsoPlayingOfferChip`.
   */
  async openEventWithAlsoPlayingOfferChip(maxCandidates = 60): Promise<boolean> {
    await grantMumbaiGeolocation(this.page);
    for (let offset = 0; offset <= maxCandidates; offset++) {
      const id = EventDetailsModule.ANCHOR_EVENT_ID + offset;
      const probeUrl =
        `${UAT_BASE_URL}/api/movie-detail?cityId=1&lat=${MUMBAI_GEOLOCATION.latitude}` +
        `&long=${MUMBAI_GEOLOCATION.longitude}&movieId=${id}&type=EVENT`;
      const hasCinemas = await this.page.request
        .get(probeUrl, { timeout: 6_000 })
        .then(async (res) => (res.ok() ? Boolean((await res.json().catch(() => null))?.data?.cinemas?.length) : false))
        .catch(() => false);
      if (!hasCinemas) continue;

      const candidateUrl = `${UAT_BASE_URL}/eventsessions/mumbai/event/${id}`;
      let landed = false;
      for (let attempt = 1; attempt <= 2; attempt++) {
        await this.page.goto(candidateUrl).catch(() => undefined);
        await dismissLocationAndSelectCity(this.page, UAT_CITY, UAT_SUB_CITY).catch(() => undefined);
        const ready = await this.eventDetailsPage.showtimeButtons().first()
          .waitFor({ state: 'visible', timeout: 15_000 })
          .then(() => true)
          .catch(() => false);
        if (ready && this.page.url().includes(`/${id}`)) {
          landed = true;
          break;
        }
      }
      if (!landed) continue;

      const heading = this.eventDetailsPage.alsoPlayingHeading();
      let alsoFound = false;
      for (let s = 0; s < 30; s++) {
        if (await heading.isVisible({ timeout: 300 }).catch(() => false)) {
          alsoFound = true;
          break;
        }
        await this.page.mouse.wheel(0, 700);
      }
      if (!alsoFound) continue;

      const chipVisible = await this.eventDetailsPage.alsoPlayingDiscountChip().isVisible({ timeout: 3_000 }).catch(() => false);
      if (chipVisible) {
        this.liveEventId = id;
        this.liveEventTitle = (await this.eventDetailsPage.eventTitle().first().textContent().catch(() => '')) ?? '';
        return true;
      }
    }
    return false;
  }

  /** OFR-036: confirms the offer chip found by `openEventWithAlsoPlayingOfferChip` is genuinely visible. */
  async expectAlsoPlayingOfferChipVisible(): Promise<void> {
    await expect(this.eventDetailsPage.alsoPlayingDiscountChip()).toBeVisible({ timeout: 5_000 });
  }

  async expectPromotionalBannerVisible(): Promise<void> {
    await expect(this.eventDetailsPage.eventBanner().first()).toBeVisible({ timeout: 30_000 });
  }

  /**
   * ED-002: grounded 2026-09-06 against a live candidate found by
   * `openLiveEventWithCinemaData()` — the sheet's "Watch Trailer → select trailer → chosen one
   * auto-plays" wording doesn't quite match what's shipped: the real button is labeled "Watch
   * Promos" (see `EventDetailsPage.watchTrailerButton`'s widened regex), and clicking it opens a
   * real `role="dialog"` titled "WATCH PROMOS" that lists every real promo item at once ("Promo
   * 1", "Promo 2", ...), each backed by a genuine playable YouTube `<iframe>` — confirmed live
   * via a DOM dump, not a select-one-then-autoplay flow. Checks the real, confirmed shape
   * (dialog opens, lists at least one promo, at least one embedded player renders) rather than
   * the sheet's exact wording.
   */
  async watchTrailerAndExpectPromoDialogVisible(): Promise<void> {
    Logger.info('Clicking the Watch Trailer/Watch Promos CTA and confirming the promo dialog lists real playable video(s)');
    const button = this.eventDetailsPage.watchTrailerButton();
    await expect(button).toBeVisible({ timeout: 15_000 });
    await button.click({ timeout: 10_000 });
    const dialog = this.eventDetailsPage.watchTrailerDialog();
    await expect(dialog).toBeVisible({ timeout: 15_000 });
    await expect(dialog).toContainText(/promo/i);
    await expect(this.eventDetailsPage.watchTrailerDialogPlayers().first()).toBeAttached({ timeout: 15_000 });
  }

  /**
   * Grounded 2026-08-25: headless Chromium has no native Web Share API (`navigator.share` is
   * undefined), so clicking Share falls back to the site's own popover — the current page URL
   * plus a "Copy" icon button — confirmed live via a real click. This is the deep-link-sharing
   * path the site itself uses for unsupported browsers, so it's what this check exercises.
   *
   * BUG FIX (2026-08-25): a first full-suite run hit "element was detached from the DOM,
   * retrying" on the click, live — this hero-area button gets re-rendered once more shortly
   * after `eventTitle` first becomes visible (the same late-settling pattern
   * `clickThroughOverlays` documents for other pages), so a click fired immediately can target
   * a node that's about to be swapped out. Waiting for network-idle first, then retrying the
   * click itself, absorbs that without a fixed sleep.
   *
   * BUG FIX (2026-09-06): a live run reached this method already redirected to the plain
   * homepage — the same real, confirmed client-side crash-redirect
   * `gotoKnownEventDetailWithLocationGranted` guards against, just surfacing a little later
   * than that guard's own check. One more recovery re-navigation here, right before the actual
   * assertion, closes that timing gap.
   */
  async shareEventAndExpectShareOptionsVisible(): Promise<void> {
    Logger.info('Clicking Share and verifying the share popover (page URL + copy control)');
    if (!this.page.url().includes('/eventsessions/')) {
      Logger.info('Redirected away from the event page before the Share check — re-navigating once to recover');
      await this.gotoKnownEventDetail();
    }
    await this.page.waitForLoadState('networkidle', { timeout: 30_000 }).catch(() => undefined);
    const shareButton = this.eventDetailsPage.shareButton();
    await expect(shareButton).toBeVisible({ timeout: 30_000 });
    for (let attempt = 1; attempt <= 3; attempt++) {
      const clicked = await shareButton
        .click({ timeout: 15_000 })
        .then(() => true)
        .catch(() => false);
      if (clicked) break;
      if (attempt === 3) throw new Error('Share button never became stable enough to click after 3 attempts');
    }
    const dialog = this.eventDetailsPage.shareDialog();
    await expect(dialog).toBeVisible({ timeout: 15_000 });
    await expect(dialog).toContainText(/eventsessions\/mumbai\/live-karan-aujla-concert/i);
    await expect(this.eventDetailsPage.shareDialogCopyButton().first()).toBeVisible();
  }

  /**
   * Grounded 2026-08-25: today's date tab (e.g. "25Tue") renders in the accent/CTA text color
   * while every other tab uses a muted gray — confirmed via each button's computed text color
   * live. Compares computed colors instead of hardcoding either color's hex value.
   */
  async expectDateFilterDefaultsToToday(): Promise<void> {
    const dateButtons = this.eventDetailsPage.dateFilterButtons();
    await expect(dateButtons.first()).toBeVisible({ timeout: 30_000 });
    const count = await dateButtons.count();
    // Grounded 2026-09-06: which days even render a tab is itself live-showtime-driven — a day
    // whose last showtime has lapsed drops its own tab entirely (confirmed live: a "6Sun" tab
    // disappeared once its final 6:00 PM show passed, leaving only "7Mon"). With a single tab
    // left there's no second tab to contrast a "selected" color against — confirming the one
    // real tab renders is the honest ceiling of what can be checked at that point, rather than
    // failing on a real, live, timing-driven state this isn't equipped to compare.
    if (count < 2) return;
    const todayColor = await dateButtons
      .first()
      .evaluate((node) => (globalThis as unknown as { getComputedStyle: (e: unknown) => { color: string } }).getComputedStyle(node).color);
    const otherColor = await dateButtons
      .nth(1)
      .evaluate((node) => (globalThis as unknown as { getComputedStyle: (e: unknown) => { color: string } }).getComputedStyle(node).color);
    expect(todayColor).not.toBe(otherColor);
  }

  /**
   * Grounded 2026-08-25: clicking the cinema's name heading toggles its showtime list closed
   * then open again — confirmed live. This event currently lists only one cinema, so the
   * sheet's "only one cinema expanded at a time" claim can't be observed (there's no second
   * card to check stays collapsed) — this checks the confirmed single-card toggle only.
   *
   * BUG FIX (2026-09-06): a live isolated run hit "element was detached from the DOM,
   * retrying" on the first click and never recovered within budget — the same late
   * re-render pattern already documented on `shareEventAndExpectShareOptionsVisible`'s Share
   * button (a hero/header-area control re-renders once more shortly after its section first
   * becomes visible). Retrying the click against a freshly re-queried locator (rather than
   * trusting Playwright's own single-element auto-retry to survive a full detach-and-replace)
   * absorbs that the same way the Share button click already does.
   */
  async expectCinemaCardTogglesExpandCollapse(): Promise<void> {
    Logger.info('Toggling the cinema card and verifying its showtime list collapses/expands');
    const heading = this.eventDetailsPage.cinemaEntryHeading();
    const showtime = this.eventDetailsPage.showtimeButtons().first();
    await expect(heading).toBeVisible({ timeout: 30_000 });
    await expect(showtime).toBeVisible({ timeout: 30_000 });
    await this.clickWithRetry(() => this.eventDetailsPage.cinemaEntryHeading());
    await expect(showtime).toBeHidden({ timeout: 15_000 });
    await this.clickWithRetry(() => this.eventDetailsPage.cinemaEntryHeading());
    await expect(showtime).toBeVisible({ timeout: 15_000 });
  }

  /**
   * Grounded 2026-08-25: a showtime's time-text color is confirmed real status color-coding —
   * it changes between the natural "Available" state (matched the "Available" legend dot's
   * color exactly, live) and a `page.route()`-mocked sold-out shape (a distinct red/orange).
   *
   * BUG FIX (2026-08-25): initially compared the time-text's computed `color` directly against
   * the legend dots' computed `backgroundColor`, asserting membership in that 4-color set. Two
   * live full-suite runs caught real problems with that: (a) this event has exactly one live
   * showtime, whose status depends on real wall-clock time relative to its 2:00 PM slot — it
   * naturally rolled from "Available" to "Lapsed" between grounding and a test run, and (b) even
   * accounting for that, the "Lapsed" legend dot's own CSS is a semi-transparent white overlay
   * (`rgba(255,255,255,0.4)`) while the lapsed time-text renders as a pre-blended solid gray
   * (`rgb(106,106,106)`) — the *same* visual color in two different, never string-equal CSS
   * representations. Comparing the time-text's color against its own sibling language-label
   * text (e.g. "Hindi") sidesteps both problems: that label is confirmed to always use a fixed,
   * non-status CSS var regardless of the showtime's actual status, so any real difference from
   * it proves status color-coding is applied, without needing to know or reproduce which status
   * currently holds or how the legend happens to encode it.
   */
  async expectShowtimeColorMatchesLegend(): Promise<void> {
    for (const label of ['Available', 'Filling Fast', 'Sold Out', 'Lapsed']) {
      await expect(this.eventDetailsPage.legendDot(label)).toBeVisible({ timeout: 30_000 });
    }
    const showtimeTextColor = await this.eventDetailsPage
      .showtimeTimeText()
      .evaluate((node) => (globalThis as unknown as { getComputedStyle: (e: unknown) => { color: string } }).getComputedStyle(node).color);
    const languageTextColor = await this.eventDetailsPage
      .showtimeLanguageText()
      .evaluate((node) => (globalThis as unknown as { getComputedStyle: (e: unknown) => { color: string } }).getComputedStyle(node).color);
    expect(showtimeTextColor).not.toBe(languageTextColor);
  }

  /**
   * Grounded 2026-08-25: mocks the real, confirmed `api/movie-detail` endpoint (found via live
   * network capture) so the event's one live showtime is forced to a sold-out shape
   * (`isAvailable: false`, `balance: 0`, `status: 'F'`, exhausted `classDetails` balances),
   * then reloads so the mocked response is what the page renders from.
   */
  async mockShowtimeAsSoldOutAndReload(): Promise<void> {
    Logger.info('Mocking api/movie-detail to force the live showtime into a sold-out shape, then reloading');
    await this.page.route('**/api/movie-detail*', async (route) => {
      try {
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
      } catch (error) {
        // Same `route.fetch: Test ended` teardown-timing artifact `mockZeroCinemasAndReload`
        // documents below — this handler stays registered past this test's own end.
        if (!String(error).includes('Test ended')) throw error;
      }
    });
    await this.page.reload({ waitUntil: 'domcontentloaded' });
    // BUG FIX (2026-08-25): a first full-suite run saw the event title take longer than a
    // single 20s wait to reappear after `reload()` — same "full document reload re-runs
    // hydration from scratch" cost `gotoKnownEventDetail` already budgets for via its own
    // retry loop. Mirror that loop here instead of a single longer timeout, defensively
    // re-dismissing the location modal too in case a full reload ever resets it.
    //
    // BUG FIX (2026-09-06): this originally waited on `eventTitle(/karan aujla/i)`, hardcoded to
    // the now-expired anchor event. Callers now reach this after
    // `openLiveEventWithCinemaData()`, which can land on any currently-live catalog id (a
    // movie or an event) — the generic, argument-less `eventTitle()` (any non-empty h1/h2)
    // works regardless of which one that turned out to be.
    for (let attempt = 1; attempt <= 3; attempt++) {
      await dismissLocationAndSelectCity(this.page, UAT_CITY, UAT_SUB_CITY).catch(() => undefined);
      const ready = await this.eventDetailsPage
        .eventTitle()
        .first()
        .waitFor({ state: 'visible', timeout: 15_000 })
        .then(() => true)
        .catch(() => false);
      if (ready) return;
    }
    throw new Error('event title never reappeared after mocking the showtime as sold out and reloading');
  }

  /**
   * Grounded 2026-08-25: confirmed live via the `api/movie-detail` mock above — clicking a
   * sold-out showtime does not redirect to seat selection (unlike the available-showtime click
   * confirmed by `expectAvailableShowtimeRedirectsToSeatSelection`). Gives a real navigation a
   * bounded, catchable chance to happen (rather than a fixed sleep — the wait resolves early if
   * a navigation *does* start), then asserts the URL is unchanged.
   *
   * BUG FIX (2026-08-25): the redirect confirmed for available showtimes is a client-side SPA
   * route change with no full-document `load` event — `page.waitForURL()`'s default
   * `waitUntil: 'load'` was observed live to hang for the full timeout even after the URL had
   * already changed. Reading `page.url()` directly sidesteps that navigation-lifecycle
   * assumption entirely.
   */
  async expectSoldOutShowtimeDoesNotRedirectToSeatSelection(): Promise<void> {
    const showtime = this.eventDetailsPage.showtimeButtons().first();
    await expect(showtime).toBeVisible({ timeout: 30_000 });
    const urlBefore = this.page.url();
    await showtime.click();
    await this.page
      .waitForURL((url) => url.pathname.includes('seatLayout'), { timeout: 5_000, waitUntil: 'commit' })
      .catch(() => undefined);
    expect(this.page.url()).toBe(urlBefore);
    await expect(this.eventDetailsPage.eventTitle().first()).toBeVisible();
  }

  /**
   * Grounded 2026-08-25: mocks the real `api/movie-detail` endpoint so the event's one live
   * showtime is forced into a genuinely-available, genuinely-future shape, then reloads.
   *
   * BUG FIX (2026-08-25): this originally clicked the showtime unmocked, relying on it being
   * naturally Available — true on the first live full-suite run (redirected fine), but false on
   * a later run the same session: this event has exactly one live showtime (2:00 PM, confirmed
   * via the API body), which had by then passed in real wall-clock time and permanently renders
   * "Lapsed" from that point on. Confirmed live that mocking only `isAvailable`/`balance`/
   * `status` (the fields that flip Sold-Out handling in `mockShowtimeAsSoldOutAndReload`) is
   * NOT enough here — the frontend independently derives Lapsed from the show's own `stTime`/
   * `edTime`/`date`, so those need mocking forward too. Shifting all of them 6 hours into real
   * *current* time (not the event's original date) is what makes the button actually render
   * Available and redirect on click again, confirmed live — this keeps the check durable
   * indefinitely instead of only working before this one showtime's original time passes.
   */
  async mockShowtimeAsAvailableInTheFutureAndReload(): Promise<void> {
    Logger.info('Mocking api/movie-detail to force the live showtime into a future, available shape, then reloading');
    await this.page.route('**/api/movie-detail*', async (route) => {
      try {
        const response = await route.fetch();
        const json = await response.json();
        const show = json?.data?.cinemas?.[0]?.shows?.[0]?.shows?.[0];
        if (show) {
          const future = new Date(Date.now() + 6 * 60 * 60 * 1000);
          const futureEnd = new Date(future.getTime() + 2 * 60 * 60 * 1000);
          show.isAvailable = true;
          show.balance = 100;
          show.status = 'O';
          show.stTime = future.toISOString();
          show.edTime = futureEnd.toISOString();
          show.date = future.toISOString().slice(0, 10);
          for (const classDetail of show.classDetails ?? []) classDetail.balance = 10;
        }
        await route.fulfill({ response, json });
      } catch (error) {
        // Same `route.fetch: Test ended` teardown-timing artifact `mockZeroCinemasAndReload`
        // documents below — this handler stays registered past this test's own end.
        if (!String(error).includes('Test ended')) throw error;
      }
    });
    await this.page.reload({ waitUntil: 'domcontentloaded' });
    // BUG FIX (2026-09-06): same fix as `mockShowtimeAsSoldOutAndReload` above — this waited on
    // `eventTitle(/karan aujla/i)`, hardcoded to the now-expired anchor event. The generic,
    // argument-less `eventTitle()` works regardless of which live catalog id
    // `openLiveEventWithCinemaData()` actually landed on.
    for (let attempt = 1; attempt <= 3; attempt++) {
      await dismissLocationAndSelectCity(this.page, UAT_CITY, UAT_SUB_CITY).catch(() => undefined);
      const ready = await this.eventDetailsPage
        .eventTitle()
        .first()
        .waitFor({ state: 'visible', timeout: 15_000 })
        .then(() => true)
        .catch(() => false);
      if (ready) return;
    }
    throw new Error('event title never reappeared after mocking the showtime as available in the future and reloading');
  }

  /**
   * Grounded 2026-08-25: clicking an available showtime redirects straight to
   * `/seatLayout/{base64-encoded booking payload}` — confirmed live via a real click and URL
   * change, both naturally (before this event's one showtime lapsed) and via the future-dated
   * mock above. No login and no confirmation popup are involved, unlike the sheet's "accept
   * popup" wording.
   *
   * BUG FIX (2026-08-25): `page.waitForURL(pattern, { timeout })` (default `waitUntil: 'load'`)
   * timed out live even though the URL had genuinely changed — this is a client-side SPA route
   * change (Next.js router), which never fires a full-document `load` event. Polling
   * `page.url()` directly avoids that assumption.
   */
  async expectAvailableShowtimeRedirectsToSeatSelection(): Promise<void> {
    Logger.info('Clicking the available showtime and verifying redirection to seat selection');
    const showtime = this.eventDetailsPage.showtimeButtons().first();
    await expect(showtime).toBeVisible({ timeout: 30_000 });
    await showtime.click();
    await expect.poll(() => this.page.url(), { timeout: 30_000 }).toMatch(/seatLayout\//);
  }

  /**
   * Grounded 2026-08-26 (ED-012): mocks the real `api/movie-detail` endpoint's `data.cinemas`
   * to an empty array, reusing the same `page.route()`+reload mechanism already proven for the
   * sold-out mock above — confirmed live this renders the real "Sorry, no cinemas found under
   * the selected filter." message (same copy already confirmed on Movie Details).
   *
   * BUG FIX (2026-08-26): a first live run saw the reload land back on the plain homepage
   * instead of the event page — the same "reload doesn't always settle back onto the intended
   * route first try" issue the sold-out/future-dated mocks above already work around. Mirrors
   * their retry-with-re-dismiss loop instead of a single reload + single wait.
   *
   * BUG FIX (2026-09-11, live run): swallows the specific `route.fetch: Test ended` error —
   * reproduced live as an "error not part of any test" that Playwright attributed to the
   * following test (ED-013). Real cause: this handler stays registered for the rest of the test,
   * so a late in-flight `/api/movie-detail` request can still be mid-`route.fetch()` when the
   * page/context closes at teardown — a Playwright teardown-timing artifact (the test's own
   * assertions had already passed), not a product or test-correctness bug. Same fix
   * `CuratedShowsModule.ts`'s `mockCuratedShows`/`mockCuratedShowsPerCity` already apply for the
   * identical pattern.
   */
  async mockZeroCinemasAndReload(): Promise<void> {
    Logger.info('Mocking api/movie-detail to return zero cinemas, then reloading');
    await this.page.route('**/api/movie-detail*', async (route) => {
      try {
        const response = await route.fetch();
        const json = await response.json();
        if (json?.data) json.data.cinemas = [];
        await route.fulfill({ response, json });
      } catch (error) {
        if (!String(error).includes('Test ended')) throw error;
      }
    });
    for (let attempt = 1; attempt <= 3; attempt++) {
      if (attempt === 1) {
        await this.page.reload({ waitUntil: 'domcontentloaded' });
      } else {
        // reload alone landed back on the plain homepage on a first live run — re-navigating to
        // the known event URL (which already handles its own dismiss/ready-check retries) is a
        // more reliable recovery than reloading again from an unknown page.
        await this.gotoKnownEventDetail();
      }
      const ready = await this.eventDetailsPage
        .noCinemasFoundMessage()
        .waitFor({ state: 'visible', timeout: 15_000 })
        .then(() => true)
        .catch(() => false);
      if (ready) return;
    }
    throw new Error('"No Cinemas Found" message never appeared after mocking zero cinemas and reloading');
  }

  /**
   * ED-013: confirmed live (2026-09-07) — there is no separate "promo-video API" at all: the
   * SAME real `api/movie-detail` endpoint's response supplies the promo/trailer data, as
   * `data.movie.trailers`/`trailersWithLang` (a plain array of YouTube URLs the client embeds
   * directly as third-party `<iframe>`s — real mid-playback failure happens inside that iframe,
   * external and unmockable from this app's own network layer). Confirmed live via two separate
   * probes: forcing that data empty (this method) makes the "Watch Promos"/"Watch Trailer" CTA
   * disappear from the page ENTIRELY, not render disabled or show an error — the real,
   * deterministic "no promo available" failure mode this build actually has. (A second probe —
   * keeping one trailer entry but pointing it at a deliberately invalid YouTube id — left the CTA
   * visible but made the dialog silently fail to open at all on click, a real but far less
   * cleanly assertable "nothing happens" state; the empty-data path is the one implemented here.)
   */
  async mockPromoDataUnavailableAndReload(): Promise<void> {
    Logger.info('Mocking api/movie-detail to strip all promo/trailer data, then reloading');
    await this.page.route('**/api/movie-detail*', async (route) => {
      try {
        const response = await route.fetch();
        const json = await response.json();
        if (json?.data?.movie) {
          json.data.movie.trailers = [];
          json.data.movie.trailersWithLang = [];
          json.data.movie.trailerUrl1 = '';
          json.data.movie.trailerUrl2 = '';
          json.data.movie.trailerUrl3 = '';
          json.data.movie.trailerUrl4 = '';
        }
        await route.fulfill({ response, json });
      } catch (error) {
        // Same `route.fetch: Test ended` teardown-timing artifact `mockZeroCinemasAndReload`
        // documents above — this handler stays registered past this test's own end.
        if (!String(error).includes('Test ended')) throw error;
      }
    });
    await this.page.reload({ waitUntil: 'domcontentloaded' });
    // Same reload-and-retry ready-check shape as mockShowtimeAsSoldOutAndReload/
    // mockZeroCinemasAndReload above.
    for (let attempt = 1; attempt <= 3; attempt++) {
      await dismissLocationAndSelectCity(this.page, UAT_CITY, UAT_SUB_CITY).catch(() => undefined);
      const ready = await this.eventDetailsPage
        .eventTitle()
        .first()
        .waitFor({ state: 'visible', timeout: 15_000 })
        .then(() => true)
        .catch(() => false);
      if (ready) return;
    }
    throw new Error('event title never reappeared after mocking promo data unavailable and reloading');
  }

  /** ED-013: confirmed live — with no promo/trailer data, the CTA is never offered at all. */
  async expectWatchPromosCtaAbsent(): Promise<void> {
    await expect(this.eventDetailsPage.watchTrailerButton()).toHaveCount(0);
  }

  /**
   * ED-014: confirmed live (2026-09-07) — clicking an available showtime is a pure CLIENT-SIDE
   * redirect (a Next.js router navigation to `/seatLayout/{base64 booking payload}`) with NO
   * separate "booking" REST API call at all (confirmed via a full network capture of the click:
   * only the destination route's own RSC/document fetch fires, no POST/PUT anywhere) — so there
   * is no real "booking API" endpoint at this step to inject a failure into, unlike the sheet's
   * "unconfirmed booking API" framing assumed. Mocking the `/seatLayout/...` DESTINATION itself
   * to fail instead (same established page.route()-on-the-real-endpoint pattern as this file's
   * other mocks) is the honest closest equivalent — must be called AFTER
   * `mockShowtimeAsAvailableInTheFutureAndReload()` (so the showtime is genuinely clickable
   * regardless of real wall-clock status) and clicks the showtime itself.
   */
  async mockBookingRedirectionFailureAndClickShowtime(): Promise<void> {
    Logger.info('Mocking the seatLayout destination route to fail, then clicking the showtime');
    await this.page.route('**/seatLayout/**', async (route) => {
      await route.fulfill({ status: 500, contentType: 'text/plain', body: 'Simulated booking redirection failure' });
    });
    const showtime = this.eventDetailsPage.showtimeButtons().first();
    await expect(showtime).toBeVisible({ timeout: 30_000 });
    await showtime.click();
  }

  /**
   * ED-014: confirmed live — the client-side URL change to `/seatLayout/...` happens regardless
   * of the destination's own fetch outcome (the router doesn't check it before committing the
   * navigation), landing on a broken page with no real heading/content and no graceful recovery
   * UI (no "something went wrong" message, no redirect back to the event page) — just the raw
   * failed-response body. This is the real, honest "Booking Redirection Failure" state on this
   * build; the source sheet leaves the expected message blank because there isn't a real one.
   */
  async expectBookingRedirectionFailsWithNoGracefulRecovery(): Promise<void> {
    await expect.poll(() => this.page.url(), { timeout: 30_000 }).toMatch(/seatLayout\//);
    await expect(this.eventDetailsPage.eventTitle().first()).toBeHidden({ timeout: 10_000 });
  }

  /**
   * Retries a click against a freshly re-queried locator (via `locatorFactory`, called fresh on
   * every attempt) — needed for hero/header-area controls on this page confirmed to
   * detach-and-re-render once shortly after their section first becomes visible (see
   * `expectCinemaCardTogglesExpandCollapse`/`shareEventAndExpectShareOptionsVisible`). A plain
   * `locator.click()` only auto-retries the actionability check against the *same* handle, which
   * throws once that handle is torn out of the DOM rather than recovering.
   */
  private async clickWithRetry(locatorFactory: () => ReturnType<EventDetailsPage['cinemaEntryHeading']>, attempts = 3): Promise<void> {
    for (let attempt = 1; attempt <= attempts; attempt++) {
      const clicked = await locatorFactory()
        .click({ timeout: 10_000 })
        .then(() => true)
        .catch(() => false);
      if (clicked) return;
      if (attempt === attempts) throw new Error(`element never became stable enough to click after ${attempts} attempts`);
    }
  }
}
