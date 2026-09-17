import { Page, expect } from '@playwright/test';
import { EasReportsPage } from '@pages/EasReportsPage';
import { Logger } from '@utils/Logger';

/**
 * Orchestrates the real, live early-access.pvrinox.com subdomain — see EasReportsPage for what
 * was verified and what has no reachable admin equivalent (the Reports → EAS voting-results
 * listing).
 */
export class EasReportsModule {
  private reportsPage: EasReportsPage;

  constructor(private page: Page) {
    this.reportsPage = new EasReportsPage(page);
  }

  async open(): Promise<void> {
    Logger.info('Opening the real early-access.pvrinox.com subdomain (no admin EAS Reports listing exists)');
    await this.reportsPage.goto();
    await expect(this.reportsPage.playStoreLink()).toBeVisible();
  }

  async assertNoAdminReportControls(): Promise<void> {
    await expect(this.reportsPage.reportTable()).toHaveCount(0);
    await expect(this.reportsPage.viewButton()).toHaveCount(0);
    await expect(this.reportsPage.manageVotesButton()).toHaveCount(0);
  }

  async assertNoResultsPageControls(): Promise<void> {
    await expect(this.reportsPage.votedCityFilter()).toHaveCount(0);
    await expect(this.reportsPage.winnerCityText()).toHaveCount(0);
  }
}
