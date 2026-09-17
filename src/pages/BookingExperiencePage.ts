import { Page } from '@playwright/test';

/**
 * Grounded against the live app at BASE_URL (Playwright MCP, 2026-08-31). An
 * aggregated customer-feedback report exposing PII (IP/Device ID/Phone) is
 * inherently internal; no such surface exists anywhere on this public app. See
 * TestData/TestMd/booking-experience.md.
 */
export class BookingExperiencePage {
  constructor(private page: Page) {}

  starRatingFilter = () => this.page.getByLabel(/star rating/i);

  async goto(): Promise<void> {
    await this.page.goto('/');
  }
}
