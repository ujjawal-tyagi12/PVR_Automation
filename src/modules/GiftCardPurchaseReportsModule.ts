import { Page, expect } from '@playwright/test';
import { GiftCardPurchaseReportsPage } from '@pages/GiftCardPurchaseReportsPage';
import { Logger } from '@utils/Logger';

/**
 * Orchestrates the home page as the common anchor for Gift Card Purchase Reports scenarios —
 * see GiftCardPurchaseReportsPage for what was checked and ruled out. No admin reports surface
 * exists anywhere on this app.
 */
export class GiftCardPurchaseReportsModule {
  private reportsPage: GiftCardPurchaseReportsPage;

  constructor(private page: Page) {
    this.reportsPage = new GiftCardPurchaseReportsPage(page);
  }

  async open(): Promise<void> {
    Logger.info('Opening the home page (no admin Gift Card Purchase Reports screen exists)');
    await this.reportsPage.goto();
  }

  async assertNoReportTable(): Promise<void> {
    await expect(this.reportsPage.reportTable()).toHaveCount(0);
    await expect(this.reportsPage.detailsLink()).toHaveCount(0);
  }

  async assertNoSearchFields(): Promise<void> {
    await expect(this.reportsPage.trackIdSearch()).toHaveCount(0);
    await expect(this.reportsPage.phoneSearch()).toHaveCount(0);
    await expect(this.reportsPage.emailSearch()).toHaveCount(0);
  }

  async assertNoFilters(): Promise<void> {
    await expect(this.reportsPage.chainFilter()).toHaveCount(0);
    await expect(this.reportsPage.platformFilter()).toHaveCount(0);
    await expect(this.reportsPage.statusFilter()).toHaveCount(0);
    await expect(this.reportsPage.paymentStatusFilter()).toHaveCount(0);
    await expect(this.reportsPage.dateRangeFilter()).toHaveCount(0);
  }

  async assertNoQuantityInfoPopup(): Promise<void> {
    await expect(this.reportsPage.quantityInfoButton()).toHaveCount(0);
  }

  async assertNoExportCsv(): Promise<void> {
    await expect(this.reportsPage.exportCsvButton()).toHaveCount(0);
  }
}
