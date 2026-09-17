import { Page, expect } from '@playwright/test';
import { InvestorSupportPage } from '@pages/InvestorSupportPage';
import { Logger } from '@utils/Logger';
import { WaitHelper } from '@utils/WaitHelper';

/**
 * Orchestrates the real, public Investor Support tab at /investors-section?tab=financials&
 * subtype=investor-support — see InvestorSupportPage for what was verified and what has no
 * reachable admin equivalent (the Analyst Coverage / Investor Support CRUD table).
 */
export class InvestorSupportModule {
  private investorSupportPage: InvestorSupportPage;

  constructor(private page: Page) {
    this.investorSupportPage = new InvestorSupportPage(page);
  }

  async open(): Promise<void> {
    Logger.info('Opening the real public Investor Support tab (no Analyst Coverage table exists)');
    await this.investorSupportPage.goto();
    await WaitHelper.forHydration(this.page);
    await expect(this.investorSupportPage.investorSupportTab()).toBeVisible({ timeout: 20000 });
  }

  async assertComingSoonPlaceholder(): Promise<void> {
    await expect(this.investorSupportPage.comingSoonText()).toBeVisible();
  }

  async assertNoAnalystCoverageTab(): Promise<void> {
    await expect(this.investorSupportPage.analystCoverageTab()).toHaveCount(0);
  }

  async assertNoDataTable(): Promise<void> {
    await expect(this.investorSupportPage.dataTable()).toHaveCount(0);
  }

  async assertNoSearchOrFilters(): Promise<void> {
    await expect(this.investorSupportPage.searchInput()).toHaveCount(0);
    await expect(this.investorSupportPage.statusFilter()).toHaveCount(0);
  }

  async assertNoAdminForm(): Promise<void> {
    await expect(this.investorSupportPage.addButton()).toHaveCount(0);
    await expect(this.investorSupportPage.editButton()).toHaveCount(0);
    await expect(this.investorSupportPage.categoryField()).toHaveCount(0);
    await expect(this.investorSupportPage.typeField()).toHaveCount(0);
  }
}
