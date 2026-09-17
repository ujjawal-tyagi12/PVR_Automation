import { Page, expect } from '@playwright/test';
import { BulkGiftCardsPage } from '@pages/BulkGiftCardsPage';
import { Logger } from '@utils/Logger';

/**
 * Orchestrates the real, public Bulk Gift Card request form — see
 * BulkGiftCardsPage for what was verified and what has no reachable admin
 * equivalent (the reports listing and the Static Management banner editor).
 */
export class BulkGiftCardsModule {
  private giftCardsPage: BulkGiftCardsPage;

  constructor(private page: Page) {
    this.giftCardsPage = new BulkGiftCardsPage(page);
  }

  async open(): Promise<void> {
    Logger.info('Opening the public Bulk Gift Card request form');
    await this.giftCardsPage.goto();
    await expect(this.giftCardsPage.nameInput()).toBeVisible();
  }

  async assertRequestFormFieldsVisible(): Promise<void> {
    await expect(this.giftCardsPage.nameInput()).toBeVisible();
    await expect(this.giftCardsPage.emailInput()).toBeVisible();
    await expect(this.giftCardsPage.phoneInput()).toBeVisible();
    await expect(this.giftCardsPage.locationInput()).toBeVisible();
    await expect(this.giftCardsPage.companyNameInput()).toBeVisible();
    await expect(this.giftCardsPage.messageInput()).toBeVisible();
    await expect(this.giftCardsPage.copyToSelfCheckbox()).toBeVisible();
  }

  async assertNoReportsListingControl(): Promise<void> {
    await expect(this.giftCardsPage.filterButton()).toHaveCount(0);
    await expect(this.giftCardsPage.resetButton()).toHaveCount(0);
    await expect(this.giftCardsPage.exportCsvButton()).toHaveCount(0);
    await expect(this.giftCardsPage.sortIconButton()).toHaveCount(0);
    await expect(this.giftCardsPage.pageSizeSelect()).toHaveCount(0);
  }

  async assertNoStaticManagementControl(): Promise<void> {
    await expect(this.giftCardsPage.brandCountryHeading()).toHaveCount(0);
    await expect(this.giftCardsPage.editIconButton()).toHaveCount(0);
    await expect(this.giftCardsPage.addButton()).toHaveCount(0);
    await expect(this.giftCardsPage.deleteButton()).toHaveCount(0);
  }

  async assertNoImageUploadControl(): Promise<void> {
    await expect(this.giftCardsPage.imageUploadInput()).toHaveCount(0);
  }
}
