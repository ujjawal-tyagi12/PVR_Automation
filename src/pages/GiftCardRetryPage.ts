import { Page } from '@playwright/test';

/**
 * Grounded against the live app at BASE_URL (direct Playwright probe, 2026-09-10). No admin
 * gift-card retry surface — Track ID search, a per-denomination status table, Retry/Refund
 * actions — exists anywhere on this unauthenticated app. Grounded against the home page as the
 * anchor.
 */
export class GiftCardRetryPage {
  constructor(private page: Page) {}

  trackIdSearch = () => this.page.getByRole('textbox', { name: /track id/i });
  denominationTable = () => this.page.getByRole('table');
  retryButton = () => this.page.getByRole('button', { name: /^retry$/i });
  refundButton = () => this.page.getByRole('button', { name: /^refund$/i });
  summaryMetrics = () => this.page.getByText(/pending|generated|failed/i);

  async goto(): Promise<void> {
    await this.page.goto('/');
  }
}
