import { Page } from '@playwright/test';

/**
 * Grounded against the live app at BASE_URL (direct Playwright probe, 2026-09-09). No admin
 * notification-log surface exists anywhere on this app — checked the header nav, footer, every
 * "More" dropdown item, and /sitemap.xml directly (same method used for cities.spec.ts).
 * Looking up and resending another customer's OTP/notification history is not something a
 * public visitor can ever do on this app, by design. Grounded against the home page as the
 * anchor.
 */
export class EmailSmsActionPage {
  constructor(private page: Page) {}

  trackIdSearchInput = () => this.page.getByLabel(/track id/i);
  notificationTable = () => this.page.getByRole('table');
  resendEmailButton = () => this.page.getByRole('button', { name: /resend email/i });
  resendSmsButton = () => this.page.getByRole('button', { name: /resend sms/i });
  resendWhatsappButton = () => this.page.getByRole('button', { name: /resend whatsapp/i });
  purposeTypeCombobox = () => this.page.getByLabel(/purpose type/i);

  async goto(): Promise<void> {
    await this.page.goto('/');
  }
}
