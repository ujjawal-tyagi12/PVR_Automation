import { Page } from '@playwright/test';

/**
 * Grounded against the live app at BASE_URL (direct Playwright probe, 2026-09-10). Purchasing a
 * gift card from the real /gift-cards page is gated behind a phone/OTP login (confirmed live),
 * and no admin reports surface — a table of purchase transactions by Track ID/Phone/Email with
 * Chain/Platform/Status/Payment Status filters and CSV export — exists anywhere on this
 * unauthenticated app. Grounded against the home page as the anchor.
 */
export class GiftCardPurchaseReportsPage {
  constructor(private page: Page) {}

  reportTable = () => this.page.getByRole('table');
  trackIdSearch = () => this.page.getByRole('textbox', { name: /track id/i });
  phoneSearch = () => this.page.getByRole('textbox', { name: /phone/i });
  emailSearch = () => this.page.getByRole('textbox', { name: /email/i });
  chainFilter = () => this.page.getByRole('combobox', { name: /chain/i });
  platformFilter = () => this.page.getByRole('combobox', { name: /platform/i });
  statusFilter = () => this.page.getByRole('combobox', { name: /^status$/i });
  paymentStatusFilter = () => this.page.getByRole('combobox', { name: /payment status/i });
  dateRangeFilter = () => this.page.getByLabel(/purchased date/i);
  quantityInfoButton = () => this.page.getByRole('button', { name: /quantity/i });
  exportCsvButton = () => this.page.getByRole('button', { name: /export csv/i });
  detailsLink = () => this.page.getByRole('link', { name: /view details/i });

  async goto(): Promise<void> {
    await this.page.goto('/');
  }
}
