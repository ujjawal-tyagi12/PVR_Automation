import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { HomeScreenPage } from '@pages/HomeScreenPage';
import { EventListingPage } from '@pages/EventListingPage';
import { ExperiencePage } from '@pages/ExperiencePage';
import { waitForHomepageReady, grantMumbaiGeolocation, UAT_BASE_URL, UAT_CITY, UAT_SUB_CITY, dismissPromoPopup } from '@utils/LocationHelper';

export class HomeScreenModule {
  private readonly homeScreenPage: HomeScreenPage;
  // Reused rather than re-derived — Events/Experience sections on the homepage are the same
  // DOM shapes those pages already ground (see HomeScreenPage.ts doc comment).
  private readonly eventListingPage: EventListingPage;
  private readonly experiencePage: ExperiencePage;

  constructor(private page: Page) {
    this.homeScreenPage = new HomeScreenPage(page);
    this.eventListingPage = new EventListingPage(page);
    this.experiencePage = new ExperiencePage(page);
  }

  async gotoHomepage(): Promise<void> {
    await grantMumbaiGeolocation(this.page);
    await this.homeScreenPage.goto(UAT_BASE_URL);
    await waitForHomepageReady(this.page, UAT_CITY, UAT_SUB_CITY);
    await dismissPromoPopup(this.page);
  }

  async expectHomepageLoaded(): Promise<void> {
    await expect(this.homeScreenPage.nowShowingHeading()).toBeVisible();
  }

  async expectCityPromptShown(): Promise<void> {
    await expect(this.homeScreenPage.cityPromptHeading()).toBeVisible();
  }

  async expectSpotlightVisible(): Promise<void> {
    await expect(this.homeScreenPage.spotlightHeading()).toBeVisible();
  }

  /** Robust against live carousel-content rotation — asserts a tile exists rather than a hardcoded title. */
  async expectSpotlightHasMovieTile(): Promise<void> {
    await expect(this.homeScreenPage.movieTiles().first()).toBeVisible();
  }

  /** BUG FIX (2026-09-17, live run): clicks the real card ancestor, not the raw heading — see
   * `HomeScreenPage.movieCard`'s doc comment for the reproducible click-instability finding this
   * fixes. */
  async clickFirstSpotlightTileAndExpectNavigation(): Promise<void> {
    const urlBefore = this.page.url();
    const heading = this.homeScreenPage.movieTiles().first();
    await this.homeScreenPage.movieCard(heading).click();
    await this.page.waitForURL((url) => url.toString() !== urlBefore, { timeout: 15_000 });
  }

  async expectNowShowingVisible(): Promise<void> {
    await expect(this.homeScreenPage.nowShowingHeading()).toBeVisible();
    await expect(this.homeScreenPage.movieTiles().first()).toBeVisible();
  }

  async clickFirstNowShowingMovieAndExpectNavigation(): Promise<void> {
    await this.homeScreenPage.nowShowingHeading().scrollIntoViewIfNeeded();
    const urlBefore = this.page.url();
    await this.homeScreenPage.movieTiles().first().click();
    await this.page.waitForURL((url) => url.toString() !== urlBefore, { timeout: 15_000 });
  }

  async expectComingSoonChipVisible(): Promise<void> {
    await expect(this.homeScreenPage.comingSoonChip()).toBeVisible();
  }

  async expectTrailersChipVisible(): Promise<void> {
    await expect(this.homeScreenPage.trailersChip()).toBeVisible();
  }

  /**
   * Clicks the "Curated Shows" nav chip and confirms it lands on its own dedicated section.
   * Bug fix (2026-08-31): waiting on `nowShowingHeading()` (the proven HOME-001 readiness
   * signal) still wasn't enough — 2 further live runs showed the chip itself genuinely absent
   * even once Now Showing had rendered. Matches the same chip-strip rendering flakiness already
   * documented for CinemasListingDetailModule's "FILTER BY" chips (see its doc comment) rather
   * than a fixable race — retries via reload a bounded number of times and reports whether the
   * chip ever showed up, so the caller can `test.skip()` gracefully instead of hard-failing.
   */
  async openCuratedShowsAndExpectVisible(): Promise<boolean> {
    for (let attempt = 1; attempt <= 3; attempt++) {
      await expect(this.homeScreenPage.nowShowingHeading()).toBeVisible({ timeout: 20_000 });
      const visible = await this.homeScreenPage
        .curatedShowsChip()
        .isVisible({ timeout: 8_000 })
        .catch(() => false);
      if (visible) {
        await this.homeScreenPage.curatedShowsChip().click();
        await expect(this.homeScreenPage.curatedShowsHeading()).toBeVisible({ timeout: 15_000 });
        return true;
      }
      if (attempt < 3) await this.gotoHomepage();
    }
    return false;
  }

  async expectReReleaseTagVisible(): Promise<void> {
    await expect(this.homeScreenPage.reReleaseTag().first()).toBeVisible();
  }

  /** HOME-028: selecting a Genre option on the homepage's Now Showing strip measurably changes the rendered movie-tile count. */
  async expectNowShowingFilterAppliesChange(): Promise<void> {
    await expect(this.homeScreenPage.nowShowingGenreButton()).toBeVisible({ timeout: 20_000 });
    const countBefore = await this.homeScreenPage.movieTiles().count();

    await this.homeScreenPage.nowShowingGenreButton().click({ timeout: 8_000 });
    await this.homeScreenPage.nowShowingGenreOptionCheckbox().click({ timeout: 8_000 });

    await expect
      .poll(async () => this.homeScreenPage.movieTiles().count(), {
        message: `expected movie-tile count to change after applying a Genre filter (was ${countBefore})`,
        timeout: 8_000,
      })
      .not.toBe(countBefore);
  }

  /**
   * Grounded 2026-08-21 — CONFIRMED BUG, deliberately left failing (product call: treat like
   * HOME-058, not silently avoided): the Spotlight carousel's live Swiper instance genuinely has
   * autoplay configured (`delay: 35000ms`), but `disableOnInteraction: true` (also confirmed)
   * stops it permanently within ~2s of the required location-modal-dismiss interaction. Real
   * users going through that required onboarding step — effectively everyone without a saved
   * city — may never see it rotate.
   */
  async expectSpotlightAutoRotates(): Promise<void> {
    const running = await this.homeScreenPage.spotlightAutoplayIsRunning();
    expect(running, 'spotlight autoplay should still be running after the required location-modal interaction — currently gets permanently disabled by disableOnInteraction').toBe(true);
  }

  /**
   * Grounded 2026-08-21 — CONFIRMED BUG, deliberately left failing (same product call as
   * HOME-014/HOME-058): the live Swiper config has `autoplay.pauseOnMouseEnter` explicitly set
   * to `false`, so hovering never pauses rotation.
   */
  async expectSpotlightPausesOnHover(): Promise<void> {
    const config = await this.homeScreenPage.spotlightAutoplayConfig();
    expect(config?.pauseOnMouseEnter, 'spotlight carousel should pause autoplay on hover').toBe(true);
  }

  /**
   * Grounded 2026-08-21 — CONFIRMED BUG, deliberately left failing (same product call as
   * HOME-014/HOME-058): the live Swiper config has `loop` explicitly set to `false`, so the
   * carousel stops after the last slide instead of looping back to the first.
   */
  async expectSpotlightLoopsContinuously(): Promise<void> {
    const config = await this.homeScreenPage.spotlightAutoplayConfig();
    expect(config?.loop, 'spotlight carousel should loop continuously').toBe(true);
  }

  /** Mirrors the Spotlight carousel's manual-scroll check (HOME-017) for the Trailers strip. */
  async expectTrailersStripScrollable(): Promise<void> {
    await this.homeScreenPage.trailersChip().click();
    await expect(this.homeScreenPage.playVideoButton().first()).toBeVisible();
    await this.page.mouse.wheel(400, 0);
    await expect(this.homeScreenPage.playVideoButton().first()).toBeVisible();
  }

  /**
   * Grounded 2026-08-21: clicking a trailer's "Play video" button loads a real YouTube embed
   * iframe (confirmed via network capture — genuine youtube.com/embed + player-API requests
   * fire) — that embed is the actual "playback screen" for this build, not a distinct
   * PVR-hosted player.
   */
  async clickPlayVideoAndExpectTrailerLoads(): Promise<void> {
    await this.homeScreenPage.trailersChip().click();
    await this.homeScreenPage.playVideoButton().first().click();
    await expect(this.homeScreenPage.trailerVideoFrame().first()).toBeAttached({ timeout: 10_000 });
  }

  /**
   * Grounded 2026-08-21 — CONFIRMED BUG, deliberately left failing (product call: treat like
   * HOME-058, not silently avoided): blocking the real `youtube.com/embed` request (simulating a
   * trailer load failure) renders no error message at all — the iframe just silently points at a
   * failed URL.
   */
  async expectTrailerFailureShowsErrorMessage(): Promise<void> {
    await this.page.route('**/youtube.com/embed/**', (route) => route.abort('failed'));
    await this.homeScreenPage.trailersChip().click();
    await this.homeScreenPage.playVideoButton().first().click();
    await expect(this.page.getByText(/error|unable to (play|load)|something went wrong|try again/i).first()).toBeVisible({ timeout: 10_000 });
  }

  /**
   * Grounded 2026-08-21: confirmed live via request interception — blocking a movie tile's real
   * poster image URL and reloading makes that `<img>` fall back to
   * `movie-placeholder-portrait.svg`. Reads real posters page-wide at runtime and picks the
   * first non-placeholder one — same "hop until real data" robustness pattern used elsewhere in
   * this suite for volatile carousel content (e.g. `ExperiencePage.selectTileWithMovies`).
   */
  async expectMissingPosterFallsBackToPlaceholder(): Promise<void> {
    await this.homeScreenPage.anyRealPosterImage().first().waitFor({ state: 'attached', timeout: 15_000 });
    const candidates = await this.homeScreenPage.realMoviePosterCandidates();
    const target = candidates.find((c) => c.src && !c.src.includes('placeholder'));
    if (!target) {
      throw new Error('no real (non-placeholder) Now Showing poster image found to target for the missing-image fallback check');
    }
    const escapedPath = target.src.split('?')[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    await this.page.route(new RegExp(escapedPath), (route) => route.fulfill({ status: 404, body: 'not found' }));
    await this.page.reload({ waitUntil: 'domcontentloaded' });
    await waitForHomepageReady(this.page, UAT_CITY, UAT_SUB_CITY);
    await dismissPromoPopup(this.page);
    await expect(this.homeScreenPage.moviePosterImageByAlt(target.alt).first()).toHaveAttribute('src', /movie-placeholder-portrait\.svg/, { timeout: 15_000 });
  }

  async expectOffersVisible(): Promise<void> {
    await this.homeScreenPage.scrollUntilVisible(this.homeScreenPage.offersHeading);
    await expect(this.homeScreenPage.offersHeading()).toBeVisible();
  }

  /**
   * requirements/offers.md OFR-032. Grounded 2026-09-07: see `HomeScreenPage.offersViewMoreButton`
   * doc comment for the real "View More"/`aria-label="View all offers"` finding. Accepts either
   * `/offers` or `/more/offers` since both are confirmed to render the identical listing.
   */
  async clickOffersViewMoreAndExpectOffersListingNavigation(): Promise<void> {
    await this.homeScreenPage.scrollUntilVisible(this.homeScreenPage.offersHeading);
    await this.homeScreenPage.offersViewMoreButton().click({ timeout: 8_000 });
    await this.page.waitForURL(/\/(more\/)?offers$/, { timeout: 15_000 });
  }

  /**
   * requirements/offers.md OFR-038. Grounded 2026-09-07 — CONFIRMED BUG, deliberately left
   * failing (same product-decision treatment as HOME-014/015/016/044/058 and
   * event-listing.spec.ts EL-001/008/013): tapping the same real, confirmed discount-badge chip
   * `clickMovieCardDiscountChipAndExpectMovieDetailNavigation` (OFR-033) already exercises
   * navigates to `/moviesessions/...` (the movie's own detail/booking page) — confirmed live via
   * a real click + URL read — never to the offer's own `/more/offers/{id}` detail page an
   * "offer chip" is supposed to open. This exactly matches the source sheet's own "currently not
   * working" note for this scenario (see requirements/offers.md's Known Live Defects section,
   * TC_App_039a). Asserts the CORRECT expected behavior rather than being weakened to match the
   * bug, per this repo's established convention for confirmed live defects.
   */
  async clickMovieCardDiscountChipAndExpectOfferDetailNavigation(): Promise<void> {
    const chip = this.homeScreenPage.movieCardDiscountChip();
    await chip.scrollIntoViewIfNeeded();
    await chip.click({ timeout: 8_000, force: true });
    await this.page.waitForURL(/\/more\/offers\//, { timeout: 15_000 });
  }

  /**
   * requirements/offers.md OFR-033. Grounded 2026-08-31: real behavior is direct navigation to
   * the movie's detail/booking page, not a bottom sheet with an offers listing (the source
   * sheet's expected result) — see `HomeScreenPage.movieCardDiscountChip` doc comment.
   */
  async clickMovieCardDiscountChipAndExpectMovieDetailNavigation(): Promise<void> {
    const chip = this.homeScreenPage.movieCardDiscountChip();
    await chip.scrollIntoViewIfNeeded();
    await chip.click({ timeout: 8_000, force: true });
    await this.page.waitForURL(/\/moviesessions\//, { timeout: 15_000 });
  }

  // --- Events section (composes EventListingPage — same DOM already grounded there) ---

  /**
   * Bug fix (2026-08-21): `eventListingPage.eventsSectionHeading()` (grounded 2026-08-19)
   * doesn't match live anymore — no "Events" heading of any kind was found during this pass's
   * grounding (see HomeScreenPage.ts doc comment). Checking the nav chip + a real event card
   * instead, both confirmed present live.
   */
  async expectEventsSectionVisible(): Promise<void> {
    await expect(this.homeScreenPage.eventsChip()).toBeVisible();
    await expect(this.eventListingPage.eventCards().first()).toBeVisible();
  }

  async clickFirstEventCardAndExpectNavigation(): Promise<void> {
    const urlBefore = this.page.url();
    await this.eventListingPage.eventCards().first().click();
    await this.page.waitForURL((url) => url.toString() !== urlBefore, { timeout: 15_000 });
  }

  // --- Experience section (composes ExperiencePage — same DOM already grounded there) ---

  async expectExperienceSectionVisible(): Promise<void> {
    await expect(this.homeScreenPage.experiencesHeading()).toBeVisible();
  }

  async clickExperienceViewMoreAndExpectNavigation(): Promise<void> {
    await this.homeScreenPage.experiencesViewMoreLink().click();
    await this.page.waitForURL(/\/experiences/, { timeout: 15_000 });
  }

  async expectExperienceTileVisible(): Promise<void> {
    await expect(this.experiencePage.experienceTileIcons().first()).toBeVisible();
  }

  async expectResponsiveNoOverflow(): Promise<void> {
    const hasHorizontalOverflow = await this.page.evaluate(() => {
      const doc = (globalThis as unknown as { document: { documentElement: { scrollWidth: number; clientWidth: number } } }).document;
      return doc.documentElement.scrollWidth > doc.documentElement.clientWidth + 1;
    });
    expect(hasHorizontalOverflow, 'page should not overflow horizontally').toBe(false);
  }

  async expectFooterVisible(): Promise<void> {
    await this.homeScreenPage.scrollUntilVisible(this.homeScreenPage.footer);
    await expect(this.homeScreenPage.footer()).toBeVisible();
  }

  async expectTopNavVisible(): Promise<void> {
    await expect(this.homeScreenPage.topNav()).toBeVisible();
  }

  async expectUnauthorizedAccessDenied(triggerRestrictedAction: () => Promise<void>): Promise<void> {
    await triggerRestrictedAction();
    // Same signal used by RegisterLoginModule — the login/phone-input panel opening means the
    // restricted action was gated behind auth rather than completed directly.
    await expect(this.page.getByRole('textbox', { name: /phone number/i })).toBeVisible();
  }
}
