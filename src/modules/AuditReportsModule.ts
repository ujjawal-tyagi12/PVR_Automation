import { Page, expect } from '@playwright/test';
import { AuditReportsPage } from '@pages/AuditReportsPage';
import { Logger } from '@utils/Logger';

/**
 * Grounded against the live app at BASE_URL. No audit-log surface exists
 * anywhere on this app — see AuditReportsPage for what was checked.
 */
export class AuditReportsModule {
  private auditPage: AuditReportsPage;

  constructor(private page: Page) {
    this.auditPage = new AuditReportsPage(page);
  }

  async open(): Promise<void> {
    Logger.info('Opening home page (closest checked real page — no audit-log surface exists)');
    await this.auditPage.goto();
  }

  async assertNoPreDataLogSurface(): Promise<void> {
    await expect(this.auditPage.preDataLogText()).toHaveCount(0);
  }
}
