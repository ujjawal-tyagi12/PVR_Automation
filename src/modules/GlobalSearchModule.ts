import { Page, expect } from '@playwright/test';
import { GlobalSearchPage } from '@pages/GlobalSearchPage';
import { WaitHelper } from '@utils/WaitHelper';
import { Logger } from '@utils/Logger';

/**
 * Orchestrates the real header search dialog for the Global Search sheet module — see
 * GlobalSearchPage for what was grounded.
 *
 * @hritik
 */
export class GlobalSearchModule {
  private searchPage: GlobalSearchPage;

  constructor(private page: Page) {
    this.searchPage = new GlobalSearchPage(page);
  }

  async open(): Promise<void> {
    Logger.info('Opening the home page');
    await this.searchPage.goto();
    // Grounded 2026-09-22: the header can render after a bare goto() completes, and the search
    // trigger lives inside it — confirmed live via a real failure where the click resolved
    // against the page before the real header existed. Same hydration-timing class
    // WaitHelper.forHydration already centralizes elsewhere in this codebase.
    await WaitHelper.forHydration(this.page);
  }

  async openSearchDialog(): Promise<void> {
    await this.searchPage.searchTriggerButton().click();
    await expect(this.searchPage.searchDialog()).toBeVisible({ timeout: 10000 });
  }

  async searchFor(term: string): Promise<void> {
    await this.searchPage.searchInput().pressSequentially(term, { delay: 20 });
  }

  async assertMovieResultShown(movieName: string): Promise<void> {
    await expect(this.searchPage.movieResultHeading(movieName)).toBeVisible({ timeout: 10000 });
  }

  async openCinemasTab(): Promise<void> {
    await this.searchPage.cinemasTab().click();
  }

  async assertCinemaResultShown(cinemaName: string): Promise<void> {
    await expect(this.searchPage.movieResultHeading(cinemaName)).toBeVisible({ timeout: 10000 });
  }

  async assertNoResultsMessageShown(): Promise<void> {
    await expect(this.searchPage.noResultsHeading()).toBeVisible({ timeout: 10000 });
  }

  async assertInjectionStringSafelyHandled(): Promise<void> {
    // Confirms the app is still responsive and rendering normally after the input — no crash,
    // no exposed error. The stripped-character behavior itself is confirmed in
    // GlobalSearchPage's grounding note.
    await expect(this.searchPage.searchDialog()).toBeVisible();
    await expect(this.searchPage.searchInput()).toBeVisible();
  }

  async assertCategoryTabsAvailable(): Promise<void> {
    await expect(this.searchPage.moviesEventsTab()).toBeVisible({ timeout: 10000 });
    await expect(this.searchPage.cinemasTab()).toBeVisible();
    await expect(this.searchPage.experiencesTab()).toBeVisible();
  }

  async assertNoRecentSearchesSectionExists(): Promise<void> {
    await expect(this.searchPage.recentSearchesText()).toHaveCount(0);
  }
}
