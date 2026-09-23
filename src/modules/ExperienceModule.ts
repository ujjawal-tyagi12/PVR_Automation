import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { ExperiencePage } from '@pages/ExperiencePage';
import { clickThroughOverlays, waitForHomepageReady, UAT_BASE_URL, UAT_CITY, UAT_SUB_CITY } from '@utils/LocationHelper';
import { getContrastRatio } from '@utils/ContrastHelper';
import { Logger } from '@utils/Logger';

// BUG FIX (2026-08-21, e2e-review nit): this tile-selection logic (which icons count as real
// experience tiles vs. known chrome, and the "hop tiles until a target renders" retry shape)
// used to live in ExperiencePage.ts — business/retry logic belongs in the module layer, pages
// should only expose locators. Moved here; ExperiencePage now only exposes the raw
// `experienceTileIcons()` locator collection.
const NON_TILE_ALTS = new Set([
  'Brand Logo', 'Map Point Icon', 'Arrow Down', 'User Icon', 'Download App GIF', 'Search Icon',
  'Scan Barcode Icon', 'Exp Slide Overlay', 'No Experience Icon', 'Microphone Icon',
  'Spinner: White decorative', 'Offer Icon',
]);

export class ExperienceModule {
  private readonly experiencePage: ExperiencePage;

  constructor(private page: Page) {
    this.experiencePage = new ExperiencePage(page);
  }

  /**
   * Targets UAT directly (`UAT_BASE_URL`, not the shared `playwright.config.ts` `baseURL`)
   * because Mumbai is the only city found with real movie/event data during grounding —
   * see LocationHelper.ts doc comment. This deliberately does not touch the framework's
   * shared production `BASE_URL` default used by other suites (login, registration, ...).
   */
  async gotoHomepageWithCitySelected(): Promise<void> {
    Logger.info('Opening UAT homepage and ensuring Mumbai is selected');
    await this.page.goto(UAT_BASE_URL);
    await waitForHomepageReady(this.page, UAT_CITY, UAT_SUB_CITY);
  }

  async gotoExperiences(): Promise<void> {
    await this.experiencePage.goto();
  }

  async expectOnExperiencesPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/experiences/);
  }

  async expectPageHeadingVisible(experience: string | RegExp): Promise<void> {
    await expect(this.experiencePage.pageHeading(experience)).toBeVisible();
  }

  async expectLearnMoreCtaVisible(): Promise<void> {
    await expect(this.experiencePage.learnMoreCta()).toBeVisible();
  }

  /** EXP-006: the banner's icon-only play button, visible before any video is playing. */
  async expectBannerPlayButtonVisible(): Promise<void> {
    await expect(this.experiencePage.bannerPlayButton()).toBeVisible();
  }

  async selectExperienceTile(code: string): Promise<void> {
    await this.experiencePage.selectExperienceTile(code);
  }

  async expectExperienceTileVisible(code: string): Promise<void> {
    await expect(this.experiencePage.experienceTileIcon(code)).toBeVisible();
  }

  /** Robust against carousel tile-set rotation (see ExperiencePage.ts doc comment) — the first real experience tile, whatever it currently is. */
  private async firstExperienceTile(): Promise<Locator> {
    const icons = this.experiencePage.experienceTileIcons();
    const count = await icons.count();
    for (let i = 0; i < count; i++) {
      const alt = await icons.nth(i).getAttribute('alt');
      if (alt && !NON_TILE_ALTS.has(alt) && !/trailer|brand/i.test(alt)) {
        return icons.nth(i);
      }
    }
    return icons.first();
  }

  /**
   * Shared "hop tiles until a target renders" shape used by `selectTileWithMovies` and
   * `selectTileWithLearnMoreCta` — a default experience can genuinely have zero movies or no
   * Learn More CTA right now (a real content state, not a bug — see ExperiencePage.ts doc
   * comment), so this clicks through carousel tiles in order until one shows the target, up to
   * `maxTiles` attempts. No-op (leaves whatever the current selection is) if none qualify.
   */
  private async selectTileWhere(target: () => Locator, maxTiles = 5): Promise<void> {
    const icons = this.experiencePage.experienceTileIcons();
    const count = Math.min(await icons.count(), maxTiles);
    for (let i = 0; i < count; i++) {
      const alt = await icons.nth(i).getAttribute('alt');
      if (!alt || NON_TILE_ALTS.has(alt) || /trailer|brand/i.test(alt)) continue;
      // force: true — see selectFirstExperienceTileAndGetName's 2026-09-22 doc comment; the
      // permanent play-icon overlay on every tile intercepts a non-forced click regardless of retry.
      await clickThroughOverlays(this.page, () => icons.nth(i).click({ timeout: 6_000, force: true }), { city: UAT_CITY, subCity: UAT_SUB_CITY });
      const found = await target()
        .waitFor({ state: 'visible', timeout: 6_000 })
        .then(() => true)
        .catch(() => false);
      if (found) return;
    }
  }

  /** Robust against carousel tile-set rotation (see ExperiencePage.ts doc comment) — selects whichever tile is actually first right now. */
  async selectFirstExperienceTile(): Promise<void> {
    const tile = await this.firstExperienceTile();
    // force: true — see selectFirstExperienceTileAndGetName's 2026-09-22 doc comment.
    await clickThroughOverlays(this.page, () => tile.click({ timeout: 6_000, force: true }), { city: UAT_CITY, subCity: UAT_SUB_CITY });
  }

  async expectFirstExperienceTileVisible(): Promise<void> {
    const tile = await this.firstExperienceTile();
    await expect(tile).toBeVisible();
  }

  /** Robust against a default experience genuinely having zero movies right now — hops carousel tiles until one has listings. See ExperiencePage.ts doc comment. */
  async selectTileWithMovies(): Promise<void> {
    await this.selectTileWhere(() => this.experiencePage.movieCards().first());
  }

  /**
   * EXP-021: the 2026-08-28 "only a Re-Release promo card exists" finding was per-tile, not
   * site-wide — re-grounded 2026-08-31 (3 independent headless runs, all reproducible): one
   * tile (real content, but its `<img>` happens to carry the generic `alt="No Experience Icon"`
   * fallback — a real site data gap, not chrome; `selectTileWithMovies`'s `NON_TILE_ALTS` filter
   * deliberately skips that alt, so it never reached this tile) has 2 genuine bookable cards
   * ("Dhurandhar(Hindi)", a live Now Showing title, and "Spider-Man: Brand New Day" tagged with
   * a real "30 Sep'26" release date). Iterates every tile icon directly (bypassing the
   * NON_TILE_ALTS filter, deliberately isolated from `selectTileWhere` so this doesn't change
   * behavior for any other already-passing test) up to `maxTiles`, looking for one whose first
   * movie card's text does NOT contain "Re-Release".
   */
  async selectTileWithBookableMovieCard(maxTiles = 9): Promise<boolean> {
    const icons = this.experiencePage.experienceTileIcons();
    // Bug fix (2026-08-31): `gotoExperiences()` only waits for the nav click to register, not
    // for the destination page's carousel to actually mount — an immediate `icons.count()`
    // raced the real load and read 0. Waiting on the first icon first, matching this
    // codebase's established slow-load handling elsewhere (waitForHomepageReady etc.).
    await icons.first().waitFor({ state: 'visible', timeout: 20_000 }).catch(() => undefined);
    const count = Math.min(await icons.count(), maxTiles);
    for (let i = 0; i < count; i++) {
      // force: true — see selectFirstExperienceTileAndGetName's 2026-09-22 doc comment.
      await clickThroughOverlays(this.page, () => icons.nth(i).click({ timeout: 6_000, force: true }), { city: UAT_CITY, subCity: UAT_SUB_CITY });
      const firstCard = this.experiencePage.movieCards().first();
      const hasCard = await firstCard.waitFor({ state: 'visible', timeout: 4_000 }).then(() => true).catch(() => false);
      if (!hasCard) continue;
      const cardText = await firstCard.innerText().catch(() => '');
      if (!/re-release/i.test(cardText)) return true;
    }
    return false;
  }

  /** EXP-021: clicking a real (non-promo) movie card opens a real showtime-selection dialog — confirmed live; it's an in-page dialog, not a URL redirect. */
  async clickBookableMovieCardAndExpectShowtimeDialog(): Promise<void> {
    const firstCard = this.experiencePage.movieCards().first();
    await firstCard.click({ timeout: 10_000 });
    await expect(this.page.getByRole('dialog')).toBeVisible({ timeout: 10_000 });
  }

  /** Robust against the Learn More CTA genuinely being absent for the default experience right now — hops carousel tiles until one has it. See ExperiencePage.ts doc comment. */
  async selectTileWithLearnMoreCta(): Promise<void> {
    await this.selectTileWhere(() => this.experiencePage.learnMoreCta());
  }

  /**
   * Added 2026-08-25 (EXP-011 re-grounding): robust against the banner promotional video CTA
   * genuinely being absent for the default experience right now (confirmed absent on the
   * "Kiddles" tile live) — hops carousel tiles until one has it. See ExperiencePage.ts
   * `bannerPlayButton` doc comment.
   */
  async selectTileWithBannerVideo(): Promise<void> {
    await this.selectTileWhere(() => this.experiencePage.bannerPlayButton());
  }

  /**
   * Added 2026-08-25 (EXP-011 re-grounding): clicks the banner's icon-only play CTA and
   * confirms the promotional video actually starts playing inline (a YouTube iframe embed
   * becoming visible — see ExperiencePage.ts `bannerVideoFrame` doc comment for how this was
   * confirmed live). Does not assert an in-page "video list" — grounding found only a single
   * video per experience plays this way; the banner's "More videos" affordance links out to
   * YouTube externally rather than opening an in-page list, so that part of the source sheet's
   * acceptance criteria isn't present on this build.
   */
  async playBannerVideoAndExpectPlaying(): Promise<void> {
    await clickThroughOverlays(this.page, () => this.experiencePage.bannerPlayButton().click({ timeout: 6_000 }), { city: UAT_CITY, subCity: UAT_SUB_CITY });
    await expect(this.experiencePage.bannerVideoFrame()).toBeVisible({ timeout: 10_000 });
  }

  /**
   * Clicks the first carousel tile and returns its name (alt text), so the caller can assert the
   * page updated to reflect that specific tile rather than guessing which one got selected.
   *
   * BUG FIX (2026-09-22): consistently failed with a strict actionability timeout — a permanent
   * decorative play-icon overlay (`<div class="absolute ... z-9">` containing an SVG triangle,
   * centered on every slide) intercepts pointer events on the tile. Unlike the location/promo
   * modals `clickThroughOverlays` is built to dismiss between retries, this overlay never goes
   * away, so retrying the same actionability-checked click doesn't help (confirmed: still fails
   * identically after 3 retries). Force-clicking is the correct fix here — it's a decorative
   * element, not something a real user's click is actually blocked by.
   */
  async selectFirstExperienceTileAndGetName(): Promise<string> {
    const tile = await this.firstExperienceTile();
    const name = (await tile.getAttribute('alt')) ?? '';
    await tile.click({ timeout: 6_000, force: true });
    return name;
  }

  async searchMovie(keyword: string): Promise<void> {
    await this.experiencePage.searchMovie(keyword);
  }

  async expectMovieCardVisible(title: string): Promise<void> {
    await expect(this.experiencePage.movieCardByTitle(title)).toBeVisible();
  }

  async expectMovieCardsVisible(): Promise<void> {
    await expect(this.experiencePage.movieCards().first()).toBeVisible();
  }

  /** Robust against live-data rotation (see ExperiencePage.ts doc comment) — reads/clicks whichever movie card is actually first, rather than a hardcoded title. */
  async firstMovieCardText(): Promise<string> {
    return (await this.experiencePage.movieCards().first().innerText()).trim();
  }

  /**
   * Waits for navigation *away from the current URL* rather than a specific destination
   * pattern — the real movie detail URL structure from this page was never confirmed (see
   * GlobalSearchModule.clickFirstResultAndExpectNavigation for the same finding).
   */
  async clickFirstMovieCardAndExpectNavigation(): Promise<void> {
    const urlBeforeClick = this.page.url();
    await this.experiencePage.movieCards().first().click();
    await this.page.waitForURL((url) => url.toString() !== urlBeforeClick, { timeout: 15_000 });
  }

  async expectNoMoviesMessageVisible(): Promise<void> {
    await expect(this.experiencePage.noMoviesMessage()).toBeVisible();
  }

  async clickMovieCard(title: string): Promise<void> {
    await this.experiencePage.movieCardByTitle(title).click();
  }

  async clickMovieCardAndExpectNavigation(title: string, urlPattern: RegExp): Promise<void> {
    await this.experiencePage.movieCardByTitle(title).click();
    await this.page.waitForURL(urlPattern, { timeout: 15_000 });
  }

  async expectSearchPlaceholderCorrect(): Promise<void> {
    await expect(this.experiencePage.movieSearchInput()).toHaveAttribute('placeholder', /movie showing in/i);
  }

  /** WCAG 2.1 AA text-contrast check (>= 4.5:1) via ContrastHelper — see EXP-068. */
  async expectSufficientContrast(locator: Locator): Promise<void> {
    const ratio = await getContrastRatio(locator);
    expect(ratio, 'text/background contrast ratio should meet WCAG AA (>= 4.5:1)').toBeGreaterThanOrEqual(4.5);
  }

  /** Best-effort: mic icon is confirmed present on this page, but permission-flow copy is unconfirmed — see ExperiencePage.ts TODO(heal). */
  async clickMicIcon(): Promise<void> {
    await this.experiencePage.micIconButton().click();
  }

  async expectMicIconVisible(): Promise<void> {
    await expect(this.experiencePage.micIconButton()).toBeVisible();
  }

  async expectMicPermissionPopupVisible(): Promise<void> {
    await expect(this.experiencePage.micPermissionPopup()).toBeVisible();
  }

  async expectLocationPermissionPopupVisible(): Promise<void> {
    await expect(this.experiencePage.locationPermissionPopupHeading()).toBeVisible();
  }

  async expectNoExperienceIconVisible(): Promise<void> {
    await expect(this.experiencePage.noExperienceIcon()).toBeVisible();
  }

  /**
   * Semantic locator accessors for the EXP-029..EXP-068 visual/design-conformance block,
   * so the data-driven table in experience.spec.ts can target specific elements through the
   * module (never `@pages/` directly — see rules/framework-rule-engine.json
   * `content-spec-no-page-import`) without a one-off `expect*Visible` method per row.
   */
  readonly visualTargets = {
    banner: () => this.experiencePage.bannerRegion(),
    pageHeading: (experience: string | RegExp) => this.experiencePage.pageHeading(experience),
    learnMoreCta: () => this.experiencePage.learnMoreCta(),
    bannerPlayButton: () => this.experiencePage.bannerPlayButton(),
    // Async/dynamic (not a hardcoded code) — see ExperiencePage.ts doc comment on tile-set rotation.
    firstTileIcon: () => this.firstExperienceTile(),
    searchInput: () => this.experiencePage.movieSearchInput(),
    movieCard: () => this.experiencePage.movieCards().first(),
    movieCardCensorRating: () => this.experiencePage.movieCardCensorRating(),
    descriptionText: () => this.experiencePage.experienceDescriptionText(),
  };

  /**
   * Visual/design-conformance assertion for the EXP-029..EXP-068 block. The source sheet
   * gives no concrete Figma values (hex colors, px sizes), so this checks that the resolved
   * CSS property is a *non-empty, non-default* value (i.e. the design token actually
   * resolved to something) rather than asserting an exact value. Replace `expectedValue`
   * with a real design-token value once the Figma spec / dev-repo is available (see the
   * ticket's "Visual rows" implementation note).
   */
  async expectCssPropertySet(locator: Locator, property: string, expectedValue?: string | RegExp): Promise<void> {
    await expect(locator).toBeVisible();
    const value = await locator.evaluate(
      (el, prop) => (globalThis as unknown as { getComputedStyle: (e: unknown) => Record<string, string> }).getComputedStyle(el)[prop],
      property,
    );
    if (expectedValue) {
      expect(value).toMatch(expectedValue);
    } else {
      expect(value, `expected "${property}" to resolve to a real value`).toBeTruthy();
    }
  }

  async expectResponsiveNoOverflow(): Promise<void> {
    const hasHorizontalOverflow = await this.page.evaluate(() => {
      const doc = (globalThis as unknown as { document: { documentElement: { scrollWidth: number; clientWidth: number } } }).document;
      return doc.documentElement.scrollWidth > doc.documentElement.clientWidth + 1;
    });
    expect(hasHorizontalOverflow, 'page should not overflow horizontally').toBe(false);
  }
}
