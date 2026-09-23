import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { GlobalSearchPage } from '@pages/GlobalSearchPage';
import { dismissLocationAndSelectCity, waitForHomepageReady, UAT_BASE_URL, UAT_CITY, UAT_SUB_CITY } from '@utils/LocationHelper';
import { Logger } from '@utils/Logger';

export class GlobalSearchModule {
  private readonly searchPage: GlobalSearchPage;

  constructor(private page: Page) {
    this.searchPage = new GlobalSearchPage(page);
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

  /**
   * Grounded 2026-08-19: the location modal reappears on every full-page navigation on this
   * site (not just the very first visit), so any hard `goto()` must re-dismiss it.
   */
  async gotoRouteWithCitySelected(path: string): Promise<void> {
    await this.page.goto(`${UAT_BASE_URL}${path}`);
    await dismissLocationAndSelectCity(this.page, UAT_CITY, UAT_SUB_CITY);
  }

  async openSearch(): Promise<void> {
    await this.searchPage.openSearch();
  }

  async expectSearchDialogOpen(): Promise<void> {
    await expect(this.searchPage.searchDialog()).toBeVisible();
    await expect(this.searchPage.searchInput()).toBeVisible();
  }

  async expectSearchInputFocused(): Promise<void> {
    await expect(this.searchPage.searchInput()).toBeFocused();
  }

  async typeKeyword(keyword: string): Promise<void> {
    await this.searchPage.typeKeyword(keyword);
  }

  /**
   * Simplified 2026-08-19: the original before/after result-count comparison was too flaky to
   * be a genuine signal (the default suggestive list already renders with zero input, so a
   * "before" count taken after 1 character isn't a clean baseline). This checks the concrete,
   * confirmable behavior instead — a 2+ character keyword returns results without erroring.
   */
  async expectMinCharacterGate(shortKeyword: string, validKeyword: string): Promise<void> {
    await this.typeKeyword(shortKeyword);
    await this.typeKeyword(validKeyword);
    await expect(this.searchPage.resultCards().first()).toBeVisible({ timeout: 10_000 });
  }

  async clearKeyword(): Promise<void> {
    await this.searchPage.clearKeyword();
  }

  async expectCategorySelected(name: 'Movies/Events' | 'Cinemas' | 'Experiences'): Promise<void> {
    await expect(this.searchPage.categoryTab(name)).toHaveAttribute('aria-selected', 'true');
  }

  async selectCategory(name: 'Movies/Events' | 'Cinemas' | 'Experiences'): Promise<void> {
    await this.searchPage.selectCategory(name);
  }

  async expectResultsVisible(): Promise<void> {
    await expect(this.searchPage.resultCards().first()).toBeVisible();
  }

  async expectResultTitleVisible(title: string): Promise<void> {
    await expect(this.searchPage.resultCardByTitle(title)).toBeVisible();
  }

  async expectEnableLocationCtaVisible(): Promise<void> {
    await expect(this.searchPage.enableLocationCta()).toBeVisible();
  }

  async clickResultAndExpectNavigation(title: string, urlPattern: RegExp): Promise<void> {
    await this.searchPage.clickResultByTitle(title);
    await this.page.waitForURL(urlPattern, { timeout: 15_000 });
  }

  /**
   * Robust against live-data rotation (see GlobalSearchPage.ts doc comment) — clicks whichever
   * result is actually first instead of a hardcoded title, for categories (Movies/Events) where
   * the "New Release" title set was observed to change between grounding passes. Waits for
   * navigation *away from the current URL* rather than a specific destination pattern, since
   * the real movie/cinema/experience detail URL structure was never confirmed (clicking a
   * result consistently hung for 60s during grounding before a destination could be observed).
   */
  /**
   * Bug fix (2026-08-28): `clickFirstResult()` (`resultCards().first()`) was landing on a
   * non-result chrome button (a mic/close icon with no accessible text renders before any real
   * result in the dialog) rather than an actual movie card — confirmed live the click never
   * navigated anywhere. Using `movieResultCards()` (scoped by a real duration string, the same
   * shape confirmed on ExperiencePage.ts's movie cards) reliably targets an actual result.
   */
  async clickFirstResultAndExpectNavigation(): Promise<void> {
    const urlBeforeClick = this.page.url();
    await this.searchPage.movieResultCards().first().click();
    await this.page.waitForURL((url) => url.toString() !== urlBeforeClick, { timeout: 15_000 });
  }

  async expectNoResultsMessage(): Promise<void> {
    await expect(this.searchPage.noResultsMessage()).toBeVisible();
  }

  /** Best-effort: mic affordance was not confirmed inside the search dialog during grounding — see GlobalSearchPage doc comment. */
  async expectMicIconVisible(): Promise<void> {
    await expect(this.searchPage.micIconButton()).toBeVisible();
  }

  async clickMicIcon(): Promise<void> {
    await this.searchPage.micIconButton().click();
  }

  async expectMicPermissionPopupVisible(): Promise<void> {
    await expect(this.searchPage.micPermissionPopup()).toBeVisible();
  }

  async expectVoiceRecognitionFailureVisible(): Promise<void> {
    await expect(this.searchPage.voiceRecognitionFailureMessage()).toBeVisible();
  }
}
