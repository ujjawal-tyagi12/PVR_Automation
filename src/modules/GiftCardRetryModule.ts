import { Page, expect } from '@playwright/test';
import { GiftCardRetryPage } from '@pages/GiftCardRetryPage';
import { Logger } from '@utils/Logger';

/**
 * Orchestrates the home page as the common anchor for Gift Card Retry scenarios — see
 * GiftCardRetryPage for what was checked and ruled out. No admin retry surface exists anywhere
 * on this app.
 */
export class GiftCardRetryModule {
  private retryPage: GiftCardRetryPage;

  constructor(private page: Page) {
    this.retryPage = new GiftCardRetryPage(page);
  }

  async open(): Promise<void> {
    Logger.info('Opening the home page (no admin Gift Card Retry screen exists)');
    await this.retryPage.goto();
  }

  async assertNoTrackIdSearch(): Promise<void> {
    await expect(this.retryPage.trackIdSearch()).toHaveCount(0);
  }

  async assertNoDenominationTable(): Promise<void> {
    await expect(this.retryPage.denominationTable()).toHaveCount(0);
    await expect(this.retryPage.summaryMetrics()).toHaveCount(0);
  }

  async assertNoRetryOrRefundActions(): Promise<void> {
    await expect(this.retryPage.retryButton()).toHaveCount(0);
    await expect(this.retryPage.refundButton()).toHaveCount(0);
  }
}
