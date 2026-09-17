import { Page } from '@playwright/test';

/**
 * Grounded against the live app at BASE_URL (Playwright MCP, 2026-08-31). An
 * admin action audit log is inherently internal/back-office; no such surface
 * exists anywhere on this public app. See TestData/TestMd/audit-reports.md.
 */
export class AuditReportsPage {
  constructor(private page: Page) {}

  preDataLogText = () => this.page.getByText(/pre data log/i);

  async goto(): Promise<void> {
    await this.page.goto('/');
  }
}
