import { Page } from '@playwright/test';

/**
 * Grounded against the live app at BASE_URL (Playwright MCP, 2026-08-31). No
 * page anywhere on this app references "APP100" (checked via site-wide text
 * search on the homepage) — this is an internal loyalty-app performance report
 * with no customer-facing equivalent. See TestData/TestMd/app100-cinema-performers-reports.md.
 */
export class App100CinemaPerformersReportsPage {
  constructor(private page: Page) {}

  app100AnyMention = () => this.page.getByText(/app100/i);

  async goto(): Promise<void> {
    await this.page.goto('/');
  }
}
