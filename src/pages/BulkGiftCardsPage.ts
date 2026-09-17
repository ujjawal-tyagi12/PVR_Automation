import { Page } from '@playwright/test';

/**
 * Grounded against the live app at BASE_URL/bulk-gift-cards (Playwright MCP,
 * 2026-09-01) — the real "Bulk Gift Card" menu item under header > More. This is
 * the customer/B2B-facing request form (Name/Email/Mobile/Location/Company
 * Name/Message + Get OTP), which genuinely matches the sheet's BGR-* submission
 * fields. It is NOT the admin reports listing described in BGR-001–BGR-019
 * (login as Admin → Reports → Bulk Gift Cards) nor the Static Management
 * per-Brand/Country banner editor described in BGCS-001–BGCS-032 (login →
 * Static Management) — neither has a reachable equivalent anywhere on this app,
 * checked directly against this page and the account sidebar. See
 * TestData/TestMd/bulk-gift-cards.md.
 */
export class BulkGiftCardsPage {
  constructor(private page: Page) {}

  nameInput = () => this.page.getByRole('textbox', { name: /enter your name/i });
  emailInput = () => this.page.getByRole('textbox', { name: /enter your email/i });
  phoneInput = () => this.page.getByRole('textbox', { name: /enter phone number/i });
  locationInput = () => this.page.getByRole('textbox', { name: /enter your location/i });
  companyNameInput = () => this.page.getByRole('textbox', { name: /enter your company name/i });
  messageInput = () => this.page.getByRole('textbox', { name: /^message$/i });
  copyToSelfCheckbox = () => this.page.getByRole('checkbox', { name: /copy to self/i });
  getOtpButton = () => this.page.getByRole('button', { name: /get otp/i });

  filterButton = () => this.page.getByRole('button', { name: /^filter$/i });
  resetButton = () => this.page.getByRole('button', { name: /^reset$/i });
  exportCsvButton = () => this.page.getByRole('button', { name: /export csv/i });
  sortIconButton = () => this.page.getByRole('button', { name: /sort/i });
  pageSizeSelect = () => this.page.getByLabel(/records per page|page size/i);
  addButton = () => this.page.getByRole('button', { name: /^add$/i });
  editIconButton = () => this.page.getByRole('button', { name: /^edit$/i });
  deleteButton = () => this.page.getByRole('button', { name: /^delete$/i });
  saveButton = () => this.page.getByRole('button', { name: /^save$/i });
  imageUploadInput = () => this.page.locator('input[type="file"]');
  brandCountryHeading = () => this.page.getByRole('heading', { name: /pvr india|pvr sri lanka|inox india|inox sri lanka/i });

  async goto(): Promise<void> {
    await this.page.goto('/bulk-gift-cards');
  }
}
