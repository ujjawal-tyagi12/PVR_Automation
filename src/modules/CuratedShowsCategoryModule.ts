import { Page, expect } from '@playwright/test';
import { CuratedShowsCategoryPage } from '@pages/CuratedShowsCategoryPage';
import { Logger } from '@utils/Logger';

/**
 * Orchestrates the real, public Curated Shows listing at /curated-shows — see
 * CuratedShowsCategoryPage for what was verified and what has no reachable admin equivalent (the
 * Curated Shows Category CRUD table).
 */
export class CuratedShowsCategoryModule {
  private curatedPage: CuratedShowsCategoryPage;

  constructor(private page: Page) {
    this.curatedPage = new CuratedShowsCategoryPage(page);
  }

  async open(): Promise<void> {
    Logger.info('Opening the real public Curated Shows page (no admin Category Management table exists)');
    await this.curatedPage.goto();
    await expect(this.curatedPage.pageHeading()).toBeVisible();
  }

  async search(query: string): Promise<void> {
    Logger.info(`Searching Curated Shows for "${query}"`);
    await this.curatedPage.search(query);
  }

  async assertEmptyState(): Promise<void> {
    await expect(this.curatedPage.emptyStateHeading()).toBeVisible();
    await expect(this.curatedPage.backToHomepageButton()).toBeVisible();
  }

  async assertNoAdminListingControls(): Promise<void> {
    await expect(this.curatedPage.addCategoryButton()).toHaveCount(0);
    await expect(this.curatedPage.editIconButton()).toHaveCount(0);
    await expect(this.curatedPage.viewIconButton()).toHaveCount(0);
    await expect(this.curatedPage.filterButton()).toHaveCount(0);
  }

  async assertNoAdminFormFields(): Promise<void> {
    await expect(this.curatedPage.categoryNameField()).toHaveCount(0);
    await expect(this.curatedPage.displayNameField()).toHaveCount(0);
    await expect(this.curatedPage.sequenceField()).toHaveCount(0);
    await expect(this.curatedPage.selectMoviesDropdown()).toHaveCount(0);
  }

  async assertNoImageUploadControl(): Promise<void> {
    await expect(this.curatedPage.fileUploadInput()).toHaveCount(0);
  }
}
