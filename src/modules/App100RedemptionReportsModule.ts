import { Page, expect } from '@playwright/test';
import { App100RedemptionReportsPage } from '@pages/App100RedemptionReportsPage';
import { Logger } from '@utils/Logger';

/**
 * Grounded against the live app at BASE_URL. No APP100 surface exists anywhere
 * on this app — see App100RedemptionReportsPage for what was checked.
 */
export class App100RedemptionReportsModule {
  private reportsPage: App100RedemptionReportsPage;

  constructor(private page: Page) {
    this.reportsPage = new App100RedemptionReportsPage(page);
  }

  async open(): Promise<void> {
    Logger.info('Opening home page (closest checked real page — no APP100 surface exists)');
    await this.reportsPage.goto();
  }

  async assertNoApp100Surface(): Promise<void> {
    await expect(this.reportsPage.app100AnyMention()).toHaveCount(0);
  }
}
