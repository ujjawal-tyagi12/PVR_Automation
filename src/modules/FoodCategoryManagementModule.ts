import { Page, expect } from '@playwright/test';
import { FoodCategoryManagementPage } from '@pages/FoodCategoryManagementPage';
import { Logger } from '@utils/Logger';

/**
 * Orchestrates the real, public food-ordering menu at /food/menu — see
 * FoodCategoryManagementPage for what was verified and what has no reachable admin equivalent
 * (the Food Category Management CRUD table).
 */
export class FoodCategoryManagementModule {
  private categoryPage: FoodCategoryManagementPage;

  constructor(private page: Page) {
    this.categoryPage = new FoodCategoryManagementPage(page);
  }

  async open(): Promise<void> {
    Logger.info('Opening the real public food-ordering menu (no admin Food Category table exists)');
    await this.categoryPage.goto();
    await expect(this.categoryPage.orderFoodHeading()).toBeVisible();
  }

  async assertRealCategoryChipsVisible(): Promise<void> {
    await expect(this.categoryPage.allCategoryChip()).toBeVisible();
    await expect(this.categoryPage.categoryChip('Combos')).toBeVisible();
  }

  async assertNoAdminCategoryControls(): Promise<void> {
    await expect(this.categoryPage.categoryTable()).toHaveCount(0);
    await expect(this.categoryPage.syncButton()).toHaveCount(0);
    await expect(this.categoryPage.editButton()).toHaveCount(0);
  }

  async assertNoAdminEditFormFields(): Promise<void> {
    await expect(this.categoryPage.sequenceField()).toHaveCount(0);
    await expect(this.categoryPage.fileUploadInput()).toHaveCount(0);
  }
}
