import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { ComingSoonPage } from '@pages/ComingSoonPage';
import { dismissPromoPopup, grantMumbaiGeolocation, UAT_BASE_URL } from '@utils/LocationHelper';
import { Logger } from '@utils/Logger';

/**
 * Ticket: requirements/coming-soon.md — reconciled 2026-09-01 from the `TC_Web_147–176` sheet
 * (superseding the earlier `TC_App`/`M6-website.pdf`-sourced ticket — see the ticket's own Source
 * section for why). Grounded 2026-09-01 against UAT (`inox-uat-web.pvrinox.com`), Mumbai-All — see
 * `ComingSoonPage.ts`'s class doc comment for the full live-grounding trail (movie names, filter
 * mechanics, the "Filter By" modal, the real image-fallback/empty-week states used instead of
 * mocking, and every documented sheet-vs-live discrepancy).
 */
export class ComingSoonModule {
  private readonly comingSoonPage: ComingSoonPage;

  constructor(private page: Page) {
    this.comingSoonPage = new ComingSoonPage(page);
  }

  /**
   * Direct-URL navigation, matching this repo's established pattern (`OffersModule.ts`,
   * `CuratedShowsModule.gotoCuratedShows`) rather than clicking through the homepage — see
   * `coming-soon.md`'s Test coverage note for why the sheet's own "View All" CTA (`CMS-001`) isn't
   * reliably reproducible live (no "Coming Soon" section currently renders on the homepage at
   * all).
   */
  async gotoComingSoon(): Promise<void> {
    Logger.info('Opening /coming-soon on UAT with Mumbai geolocation granted');
    await grantMumbaiGeolocation(this.page);
    await this.comingSoonPage.goto(UAT_BASE_URL);
    await dismissPromoPopup(this.page);
    await expect(this.comingSoonPage.pageHeading()).toBeVisible({ timeout: 20_000 });
  }

  // ---- Page layout / filter section ----

  async expectPageLayoutVisible(): Promise<void> {
    await expect(this.comingSoonPage.pageHeading()).toBeVisible();
    await expect(this.comingSoonPage.filterTriggerButton()).toBeVisible();
    await expect(this.comingSoonPage.searchInput()).toBeVisible();
  }

  /** CMS-003: the Year/Month/Week filter bar — asserted via a real month tab and a real week tab,
   * both confirmed live `<button>` elements. */
  async expectFilterSectionVisible(): Promise<void> {
    await expect(this.comingSoonPage.monthTab('Sep')).toBeVisible();
    await expect(this.comingSoonPage.weekTab('Week 39')).toBeVisible();
  }

  /** CMS-004: default listing spans the full year, not just the nearest week — confirmed live via
   * both the near (Week 39/Sep) and far (Week 52/Dec) sections rendering simultaneously with no
   * filter applied. */
  async expectDefaultListingShowsFullYear(): Promise<void> {
    await expect(this.comingSoonPage.weekSectionHeading('Week 39')).toBeVisible({ timeout: 15_000 });
    await expect(this.comingSoonPage.weekSectionHeading('Week 52')).toBeVisible();
  }

  async selectMonth(label: string): Promise<void> {
    await this.comingSoonPage.clickMonthTab(label);
  }

  async selectWeek(label: string): Promise<void> {
    await this.comingSoonPage.clickWeekTab(label);
  }

  /** CMS-010: `Oct`/`Week 40` currently has zero movies live — see `ComingSoonPage.ts` class doc
   * comment for the live-data-drift caveat. */
  async selectEmptyMonthAndExpectMessage(monthLabel: string): Promise<void> {
    await this.selectMonth(monthLabel);
    await expect(this.comingSoonPage.noMoviesThisWeekMessage()).toBeVisible({ timeout: 10_000 });
  }

  // ---- Genre chips (main bar) ----

  async selectGenreChip(name: string): Promise<void> {
    await this.comingSoonPage.clickGenreChip(name);
  }

  /** CMS-008: confirmed live — a selected chip gains a `border-(--brand-primary)` class the
   * unselected ones don't have. */
  async expectGenreChipSelected(name: string): Promise<void> {
    await expect(this.comingSoonPage.genreChip(name)).toHaveClass(/brand-primary/);
  }

  /** CMS-009: real reset mechanism — clicking the SAME already-selected chip again deselects it
   * and returns to the unfiltered listing (no separate Reset control exists on the main bar). */
  async deselectGenreChipAndExpectFullListingRestored(name: string): Promise<void> {
    await this.comingSoonPage.clickGenreChip(name);
    await expect(this.comingSoonPage.genreChip(name)).not.toHaveClass(/brand-primary/);
    await expect(this.comingSoonPage.weekSectionHeading('Week 39')).toBeVisible({ timeout: 10_000 });
  }

  /** CMS-007: selecting a genre that only matches a later week auto-jumps the listing there —
   * confirmed live (`Musical` only matches a Week 52 movie; selecting it jumps straight to Week
   * 52 from the default Week 39 view). */
  async expectGenreFilterShowsOnlyMatchingWeek(genre: string, expectedWeekLabel: string, movieName: string): Promise<void> {
    await this.selectGenreChip(genre);
    await expect(this.comingSoonPage.weekSectionHeading(expectedWeekLabel)).toBeVisible({ timeout: 10_000 });
    await expect(this.comingSoonPage.movieHeading(movieName)).toBeVisible();
  }

  /** CMS-017: confirmed live — the real chip order (Action, Adventure, Animation, Crime, Musical,
   * Science Fiction, Thriller) is already alphabetical. */
  async expectGenreChipsAlphabetical(expectedOrder: string[]): Promise<void> {
    for (const name of expectedOrder) {
      await expect(this.comingSoonPage.genreChip(name)).toBeVisible();
    }
    const boxes = await Promise.all(expectedOrder.map((name) => this.comingSoonPage.genreChip(name).boundingBox()));
    const xs = boxes.map((box) => box?.x ?? 0);
    const sortedXs = [...xs].sort((a, b) => a - b);
    expect(xs).toEqual(sortedXs);
  }

  // ---- "Filter By" modal (Genre + Language tabs) ----

  async openFilterDialog(): Promise<void> {
    await this.comingSoonPage.clickFilterTrigger();
    await expect(this.comingSoonPage.filterDialog()).toBeVisible({ timeout: 10_000 });
  }

  async switchFilterDialogToLanguageTab(): Promise<void> {
    await this.comingSoonPage.filterDialogLanguageTab().click();
  }

  /** Clicks a genre/language option's visible label — the underlying `<input type="checkbox">` is
   * visually hidden (`opacity-0`), confirmed live to reject a direct role-based click as "not
   * visible". */
  async toggleFilterDialogOption(name: string): Promise<void> {
    await this.comingSoonPage.filterDialogOption(name).click({ force: true });
  }

  /** The modal's submit button has a dynamic label ("Show 1 Result", "Show 3 Results", …) —
   * `ComingSoonPage.filterDialogShowResultsButton` matches it via regex, not an exact string. */
  async submitFilterDialog(): Promise<void> {
    await this.comingSoonPage.filterDialogShowResultsButton().click();
    await expect(this.comingSoonPage.filterDialog()).toBeHidden({ timeout: 10_000 });
  }

  async clearFilterDialog(): Promise<void> {
    await this.comingSoonPage.filterDialogClearAllButton().click();
  }

  /** CMS-019: language has no quick-chip equivalent on the main bar — the "Filter By" modal's
   * Language tab is the only real mechanism for this. */
  async applyLanguageFilter(language: string): Promise<void> {
    await this.openFilterDialog();
    await this.switchFilterDialogToLanguageTab();
    await this.toggleFilterDialogOption(language);
    await this.submitFilterDialog();
  }

  /** CMS-020: confirmed live — selecting `Musical` (genre) + `Hindi` (language) together via the
   * modal correctly narrows the listing to the one movie matching both (`Varanasi (film)`). */
  async applyGenreAndLanguageFilter(genre: string, language: string): Promise<void> {
    await this.openFilterDialog();
    await this.toggleFilterDialogOption(genre);
    await this.switchFilterDialogToLanguageTab();
    await this.toggleFilterDialogOption(language);
    await this.submitFilterDialog();
  }

  // ---- Search ----

  async search(keyword: string): Promise<void> {
    await this.comingSoonPage.search(keyword);
  }

  async expectMovieVisible(name: string): Promise<void> {
    await expect(this.comingSoonPage.movieHeading(name)).toBeVisible({ timeout: 10_000 });
  }

  async expectMovieHidden(name: string): Promise<void> {
    await expect(this.comingSoonPage.movieHeading(name)).toHaveCount(0);
  }

  /** CMS-014: confirmed live — a real, distinct "Movies Not Found!" heading (unlike Curated
   * Shows, which collapses a no-match search to its generic top-level empty state). */
  async searchWithNoMatchAndExpectNoResultsUi(keyword: string): Promise<void> {
    await this.search(keyword);
    await expect(this.comingSoonPage.noSearchResultsHeading()).toBeVisible({ timeout: 10_000 });
  }

  // ---- Voice search (mic) ----

  /** Must be called BEFORE `gotoComingSoon` — same `navigator.permissions.query` override
   * `CuratedShowsModule.forceMicrophonePermissionDenied` established, reused here since
   * Playwright's `grantPermissions` API has no direct way to force a *denied* (as opposed to
   * un-granted/prompt) state. */
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

  /** CMS-016: confirmed live real native `alert()` — "Microphone permission is blocked. Please
   * enable it in your browser settings." (note: this module's own wording differs slightly from
   * `CuratedShowsModule`'s — a genuine per-page copy difference, not a typo). A real `alert()`
   * blocks the page's JS thread synchronously, so the dialog must be raced alongside the click
   * (not awaited after it) — same fix `CuratedShowsModule.expectMicDeniedAlertShown` documents. */
  async expectMicDeniedAlertShown(): Promise<void> {
    let message: string | undefined;
    const dialogHandled = new Promise<void>((resolve) => {
      this.page.once('dialog', (dialog) => {
        message = dialog.message();
        void dialog.dismiss().then(resolve);
      });
    });
    await Promise.all([dialogHandled, this.comingSoonPage.clickMic()]);
    expect(message).toBe('Microphone permission is blocked. Please enable it in your browser settings.');
  }

  // ---- Movie cards ----

  async expectMovieCardMetadataVisible(name: string, genre: string, language: string): Promise<void> {
    await expect(this.comingSoonPage.movieHeading(name)).toBeVisible({ timeout: 10_000 });
    await expect(this.comingSoonPage.movieCardImage(name)).toBeVisible();
    await expect(this.comingSoonPage.movieCardMetaText(genre)).toBeVisible();
    await expect(this.comingSoonPage.movieCardMetaText(language)).toBeVisible();
  }

  /** CMS-024: "Jana Nayagan" currently has no uploaded poster live and renders the real fallback
   * graphic instead — see `ComingSoonPage.ts`'s class doc comment for the live-data-drift caveat
   * if this changes. */
  async expectImageFallbackVisible(name: string): Promise<void> {
    await expect(this.comingSoonPage.movieCardImage(name)).toBeVisible({ timeout: 10_000 });
  }

  /** CMS-025: the whole movie card is a real `<button>` that navigates to `/coming-soon/{id}` — a
   * genuine detail page, confirmed live (unlike `CuratedShowsModule`'s own unresolved card click). */
  async openMovieDetail(name: string): Promise<void> {
    await this.comingSoonPage.clickMovieCard(name);
    // BUG WORKAROUND (2026-09-01): wait for the real detail URL pattern BEFORE asserting on the
    // heading — see `ComingSoonPage.waitForMovieDetailUrl`'s doc comment for why.
    await this.comingSoonPage.waitForMovieDetailUrl();
    await expect(this.comingSoonPage.movieHeading(name)).toBeVisible({ timeout: 15_000 });
  }

  /** CMS-029: reinterpreted from a literal list-card check — confirmed live the real "Set Alert"
   * button only exists on the movie DETAIL page, not the Coming Soon listing card itself (no
   * "Alert" text/button anywhere in a full card-DOM dump). Visible even as a guest. */
  async expectSetAlertVisibleOnDetailPage(): Promise<void> {
    await expect(this.comingSoonPage.detailSetAlertButton()).toBeVisible({ timeout: 15_000 });
  }

  /** CMS-030: confirmed live — once a real alert exists (via `MovieAlertsModule`), the detail
   * page's alert CTA switches from "Set Alert" to "Delete Alert"/"Edit Alert". */
  async expectDeleteAlertVisibleOnDetailPage(): Promise<void> {
    await expect(this.comingSoonPage.detailDeleteAlertButton()).toBeVisible({ timeout: 15_000 });
  }
}
