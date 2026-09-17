import { Page, expect } from '@playwright/test';
import { FoodItemsManagementPage } from '@pages/FoodItemsManagementPage';
import { Logger } from '@utils/Logger';

/**
 * Orchestrates the real, public food-ordering menu at /food/menu — see FoodItemsManagementPage
 * for what was verified and what has no reachable admin equivalent (the Food Items Management
 * CRUD/reporting table).
 */
export class FoodItemsManagementModule {
  private itemsPage: FoodItemsManagementPage;

  constructor(private page: Page) {
    this.itemsPage = new FoodItemsManagementPage(page);
  }

  async open(): Promise<void> {
    Logger.info('Opening the real public food-ordering menu (no admin Food Items table exists)');
    await this.itemsPage.goto();
    await expect(this.itemsPage.orderFoodHeading()).toBeVisible();
  }

  async searchItem(query: string): Promise<void> {
    Logger.info(`Searching food items for "${query}"`);
    await this.itemsPage.search(query);
  }

  async assertItemVisible(name: string): Promise<void> {
    await expect(this.itemsPage.itemHeading(name)).toBeVisible();
  }

  async assertNoResultsFound(): Promise<void> {
    await expect(this.itemsPage.noResultHeading()).toBeVisible();
  }

  async assertRealAllergenInfoAvailable(): Promise<void> {
    await expect(this.itemsPage.allergenInfoButton()).toBeVisible();
  }

  async assertNoAdminItemControls(): Promise<void> {
    await expect(this.itemsPage.itemTable()).toHaveCount(0);
    await expect(this.itemsPage.syncButton()).toHaveCount(0);
    await expect(this.itemsPage.exportCsvButton()).toHaveCount(0);
  }

  async assertNoAddEditDeleteControls(): Promise<void> {
    await expect(this.itemsPage.addButton()).toHaveCount(0);
    await expect(this.itemsPage.editButton()).toHaveCount(0);
    await expect(this.itemsPage.deleteButton()).toHaveCount(0);
  }

  async assertNoAdminInfoPopups(): Promise<void> {
    await expect(this.itemsPage.priceInfoButton()).toHaveCount(0);
    await expect(this.itemsPage.addOnsInfoButton()).toHaveCount(0);
  }
}
