import { Page, expect } from '@playwright/test';
import { App100ErrorReportsPage } from '@pages/App100ErrorReportsPage';
import { Logger } from '@utils/Logger';

/**
 * Grounded against the live app at BASE_URL. No APP100 surface exists anywhere
 * on this app — see App100ErrorReportsPage for what was checked.
 */
export class App100ErrorReportsModule {
  private reportsPage: App100ErrorReportsPage;

  constructor(private page: Page) {
    this.reportsPage = new App100ErrorReportsPage(page);
  }

  async open(): Promise<void> {
    Logger.info('Opening home page (closest checked real page — no APP100 surface exists)');
    await this.reportsPage.goto();
  }

  async assertNoApp100Surface(): Promise<void> {
    await expect(this.reportsPage.app100AnyMention()).toHaveCount(0);
  }
}
