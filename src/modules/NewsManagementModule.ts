import { Page, expect } from '@playwright/test';
import { NewsManagementPage } from '@pages/NewsManagementPage';
import { Logger } from '@utils/Logger';
import { WaitHelper } from '@utils/WaitHelper';

/**
 * Orchestrates the real, public news listing at /news — see NewsManagementPage for what was
 * verified and what has no reachable admin equivalent (the News Management CRUD table).
 */
export class NewsManagementModule {
  private newsPage: NewsManagementPage;

  constructor(private page: Page) {
    this.newsPage = new NewsManagementPage(page);
  }

  async open(): Promise<void> {
    Logger.info('Opening the real public news listing (no admin News Management table exists)');
    await this.newsPage.goto();
    // Same hydration gate as the other real, public listing modules — does not mask the
    // currently-broken JS chunk on this specific page (see news-management.spec.ts grounding
    // notes): if that chunk stays broken, hydration genuinely never completes and this still
    // correctly times out and fails, same as before.
    await WaitHelper.forHydration(this.page);
    await expect(this.newsPage.pageHeading()).toBeVisible({ timeout: 20000 });
  }

  async assertRealYearMonthFiltersVisible(): Promise<void> {
    await expect(this.newsPage.yearFilter()).toBeVisible();
    await expect(this.newsPage.monthFilter()).toBeVisible();
  }

  async assertCategoryChipFilters(category: string): Promise<void> {
    const chip = this.newsPage.categoryChip(category);
    await expect(chip).toBeVisible();
    await chip.click();
  }

  async assertRealNewsCardVisible(title: string): Promise<void> {
    await expect(this.newsPage.newsCard(title)).toBeVisible();
  }

  async assertNoAdminTable(): Promise<void> {
    await expect(this.newsPage.newsTable()).toHaveCount(0);
    await expect(this.newsPage.brandCountryTab()).toHaveCount(0);
  }

  async assertNoAdminForm(): Promise<void> {
    await expect(this.newsPage.addButton()).toHaveCount(0);
    await expect(this.newsPage.editButton()).toHaveCount(0);
    await expect(this.newsPage.titleField()).toHaveCount(0);
    await expect(this.newsPage.sourceField()).toHaveCount(0);
    await expect(this.newsPage.sequenceField()).toHaveCount(0);
  }

  async assertNoActivateDeactivateOrDelete(): Promise<void> {
    await expect(this.newsPage.activateButton()).toHaveCount(0);
    await expect(this.newsPage.deactivateButton()).toHaveCount(0);
    await expect(this.newsPage.deleteButton()).toHaveCount(0);
  }

  async assertNoImageUpload(): Promise<void> {
    await expect(this.newsPage.imageUploadInput()).toHaveCount(0);
  }
}
