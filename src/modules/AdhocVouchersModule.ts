import { Page, expect } from '@playwright/test';
import { AdhocVouchersPage } from '@pages/AdhocVouchersPage';
import { Logger } from '@utils/Logger';

/**
 * Grounded against the live app at BASE_URL/offers. Orchestrates the real,
 * public, mostly-empty offers page — see AdhocVouchersPage for what was verified.
 */
export class AdhocVouchersModule {
  private vouchersPage: AdhocVouchersPage;

  constructor(private page: Page) {
    this.vouchersPage = new AdhocVouchersPage(page);
  }

  async open(): Promise<void> {
    // Geolocation is pre-granted in playwright.config.ts, so the "Enable Location" gate never appears.
    Logger.info('Opening the public Offers page');
    await this.vouchersPage.goto();
  }

  async clickAllOffers(): Promise<void> {
    await this.vouchersPage.allOffersButton().click();
  }

  async assertNoFileUploadControl(): Promise<void> {
    await expect(this.vouchersPage.fileUploadInput()).toHaveCount(0);
  }
}
