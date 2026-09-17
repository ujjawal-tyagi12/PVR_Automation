import { Page, expect } from '@playwright/test';
import { ComingSoonPage } from '@pages/ComingSoonPage';
import { Logger } from '@utils/Logger';
import { WaitHelper } from '@utils/WaitHelper';

/**
 * Orchestrates the real, public Coming Soon listing at /coming-soon — see ComingSoonPage for
 * what was verified and what has no reachable admin equivalent (the Coming Soon Movies
 * Management CRUD table).
 */
export class ComingSoonModule {
  private comingSoonPage: ComingSoonPage;

  constructor(private page: Page) {
    this.comingSoonPage = new ComingSoonPage(page);
  }

  async open(): Promise<void> {
    Logger.info('Opening the real public Coming Soon page (no admin Movies Management table exists)');
    await this.comingSoonPage.goto();
    // This page's client-side hydration is occasionally slower than the default 10s expect
    // timeout under live load (same confirmed pattern as GiftCardMasterModule's initial
    // page-load check) — a generous explicit timeout here avoids a flaky first assertion.
    await WaitHelper.forHydration(this.page);
    await expect(this.comingSoonPage.pageHeading()).toBeVisible({ timeout: 20000 });
  }

  async searchMovie(query: string): Promise<void> {
    Logger.info(`Searching Coming Soon for "${query}"`);
    await this.comingSoonPage.search(query);
  }

  async assertMovieVisible(name: string): Promise<void> {
    await expect(this.comingSoonPage.movieHeading(name)).toBeVisible();
  }

  async assertMovieNotVisible(name: string): Promise<void> {
    await expect(this.comingSoonPage.movieHeading(name)).toHaveCount(0);
  }

  async assertNoMoviesFound(): Promise<void> {
    await expect(this.comingSoonPage.moviesNotFoundHeading()).toBeVisible();
  }

  async openFilter(): Promise<void> {
    Logger.info('Opening the FILTER BY panel');
    await this.comingSoonPage.openFilter();
  }

  async openFilterAndClearAll(): Promise<void> {
    Logger.info('Opening the FILTER BY panel and clearing it');
    await this.comingSoonPage.openFilter();
    await expect(this.comingSoonPage.clearAllButton()).toBeVisible();
    await this.comingSoonPage.clearAllButton().click();
  }

  async assertNoAdminListingControls(): Promise<void> {
    await expect(this.comingSoonPage.syncButton()).toHaveCount(0);
    await expect(this.comingSoonPage.viewIconButton()).toHaveCount(0);
    await expect(this.comingSoonPage.editIconButton()).toHaveCount(0);
    await expect(this.comingSoonPage.exportCsvButton()).toHaveCount(0);
  }

  async assertNoAdminEditFormFields(): Promise<void> {
    await expect(this.comingSoonPage.synopsisSourceField()).toHaveCount(0);
    await expect(this.comingSoonPage.metaTitleField()).toHaveCount(0);
    await expect(this.comingSoonPage.metaDescriptionField()).toHaveCount(0);
    await expect(this.comingSoonPage.adultDescriptionField()).toHaveCount(0);
  }

  async assertNoImageUploadControl(): Promise<void> {
    await expect(this.comingSoonPage.fileUploadInput()).toHaveCount(0);
  }

  async assertNoActivateDeactivateControls(): Promise<void> {
    await expect(this.comingSoonPage.activateButton()).toHaveCount(0);
    await expect(this.comingSoonPage.deactivateButton()).toHaveCount(0);
  }
}
