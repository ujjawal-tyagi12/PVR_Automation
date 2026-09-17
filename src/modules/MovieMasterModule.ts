import { Page, expect } from '@playwright/test';
import { MovieMasterPage } from '@pages/MovieMasterPage';
import { Logger } from '@utils/Logger';
import { WaitHelper } from '@utils/WaitHelper';

/**
 * Orchestrates the real, public movie listing at /coming-soon (the same page grounded for
 * coming-soon.spec.ts) as the public equivalent of Movie Master — see MovieMasterPage for what
 * was verified and what has no reachable admin equivalent (the Movie Master CRUD table).
 */
export class MovieMasterModule {
  private movieMasterPage: MovieMasterPage;

  constructor(private page: Page) {
    this.movieMasterPage = new MovieMasterPage(page);
  }

  async open(): Promise<void> {
    Logger.info('Opening the real public movie listing (no admin Movie Master table exists)');
    await this.movieMasterPage.goto();
    await WaitHelper.forHydration(this.page);
    await expect(this.movieMasterPage.pageHeading()).toBeVisible({ timeout: 20000 });
  }

  async assertRealSearchWorks(query: string): Promise<void> {
    await this.movieMasterPage.searchInput().fill(query);
    await expect(this.movieMasterPage.searchInput()).toHaveValue(query);
  }

  async assertRealFilterPanelOpens(): Promise<void> {
    await this.movieMasterPage.filterButton().click();
    await expect(this.movieMasterPage.filterDialog()).toBeVisible();
  }

  async assertSearchNoMatchesShowsRealEmptyState(): Promise<void> {
    await this.movieMasterPage.searchInput().fill('zzzznonexistentqqq');
    await expect(this.movieMasterPage.moviesNotFoundHeading()).toBeVisible();
  }

  async assertNoAdminTable(): Promise<void> {
    await expect(this.movieMasterPage.movieTable()).toHaveCount(0);
    await expect(this.movieMasterPage.editButton()).toHaveCount(0);
  }

  async assertNoAdminSearchOrFilters(): Promise<void> {
    await expect(this.movieMasterPage.commonCodeSearch()).toHaveCount(0);
    await expect(this.movieMasterPage.movieIdSearch()).toHaveCount(0);
    await expect(this.movieMasterPage.releaseDateFilter()).toHaveCount(0);
  }

  async assertNoEditForm(): Promise<void> {
    await expect(this.movieMasterPage.metaTitleField()).toHaveCount(0);
    await expect(this.movieMasterPage.synopsisField()).toHaveCount(0);
    await expect(this.movieMasterPage.trailerUrlField()).toHaveCount(0);
    await expect(this.movieMasterPage.uploadImageButton()).toHaveCount(0);
  }

  async assertNoSyncOrExport(): Promise<void> {
    await expect(this.movieMasterPage.syncButton()).toHaveCount(0);
    await expect(this.movieMasterPage.exportCsvButton()).toHaveCount(0);
  }
}
