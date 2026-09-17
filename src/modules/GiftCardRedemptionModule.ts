import { Page, expect } from '@playwright/test';
import { GiftCardRedemptionPage } from '@pages/GiftCardRedemptionPage';
import { Logger } from '@utils/Logger';

/**
 * Orchestrates the home page as the common anchor for Gift Card Redemption scenarios — see
 * GiftCardRedemptionPage for what was checked and ruled out. No admin redemption-report surface
 * exists anywhere on this app.
 */
export class GiftCardRedemptionModule {
  private redemptionPage: GiftCardRedemptionPage;

  constructor(private page: Page) {
    this.redemptionPage = new GiftCardRedemptionPage(page);
  }

  async open(): Promise<void> {
    Logger.info('Opening the home page (no admin Gift Card Redemption screen exists)');
    await this.redemptionPage.goto();
  }

  async assertNoRedemptionTable(): Promise<void> {
    await expect(this.redemptionPage.redemptionTable()).toHaveCount(0);
  }

  async assertNoSearchFields(): Promise<void> {
    await expect(this.redemptionPage.bookingIdSearch()).toHaveCount(0);
    await expect(this.redemptionPage.phoneSearch()).toHaveCount(0);
    await expect(this.redemptionPage.emailSearch()).toHaveCount(0);
    await expect(this.redemptionPage.gcNumberSearch()).toHaveCount(0);
  }

  async assertNoFilters(): Promise<void> {
    await expect(this.redemptionPage.chainFilter()).toHaveCount(0);
    await expect(this.redemptionPage.platformFilter()).toHaveCount(0);
    await expect(this.redemptionPage.redemptionStatusFilter()).toHaveCount(0);
    await expect(this.redemptionPage.dateRangeFilter()).toHaveCount(0);
  }

  async assertNoExportCsv(): Promise<void> {
    await expect(this.redemptionPage.exportCsvButton()).toHaveCount(0);
  }
}
