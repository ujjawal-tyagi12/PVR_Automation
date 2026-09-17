import { Page } from '@playwright/test';

/**
 * Grounded against the live app at BASE_URL (direct Playwright probe, 2026-09-10). No admin
 * redemption-report surface — a table of redemptions by Booking ID/Phone/Email/GC Number with
 * Chain/Platform/Redemption Status/Purchased Date filters and CSV export — exists anywhere on
 * this unauthenticated app; the real gift-card purchase flow is itself login-gated. Grounded
 * against the home page as the anchor.
 */
export class GiftCardRedemptionPage {
  constructor(private page: Page) {}

  redemptionTable = () => this.page.getByRole('table');
  bookingIdSearch = () => this.page.getByRole('textbox', { name: /booking id/i });
  phoneSearch = () => this.page.getByRole('textbox', { name: /phone/i });
  emailSearch = () => this.page.getByRole('textbox', { name: /email/i });
  gcNumberSearch = () => this.page.getByRole('textbox', { name: /gc number/i });
  chainFilter = () => this.page.getByRole('combobox', { name: /chain/i });
  platformFilter = () => this.page.getByRole('combobox', { name: /platform/i });
  redemptionStatusFilter = () => this.page.getByRole('combobox', { name: /redemption status/i });
  dateRangeFilter = () => this.page.getByLabel(/purchased date/i);
  exportCsvButton = () => this.page.getByRole('button', { name: /export csv/i });

  async goto(): Promise<void> {
    await this.page.goto('/');
  }
}
