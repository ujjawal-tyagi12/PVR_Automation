import { Page, expect } from '@playwright/test';
import { App100CinemaPerformersReportsPage } from '@pages/App100CinemaPerformersReportsPage';
import { Logger } from '@utils/Logger';

/**
 * Grounded against the live app at BASE_URL. No APP100 surface exists anywhere
 * on this app — see App100CinemaPerformersReportsPage for what was checked.
 */
export class App100CinemaPerformersReportsModule {
  private reportsPage: App100CinemaPerformersReportsPage;

  constructor(private page: Page) {
    this.reportsPage = new App100CinemaPerformersReportsPage(page);
  }

  async open(): Promise<void> {
    Logger.info('Opening home page (closest checked real page — no APP100 surface exists)');
    await this.reportsPage.goto();
  }

  async assertNoApp100Surface(): Promise<void> {
    await expect(this.reportsPage.app100AnyMention()).toHaveCount(0);
  }
}
