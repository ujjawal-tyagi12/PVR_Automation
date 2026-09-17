import { Page } from '@playwright/test';

/**
 * Grounded against the live app at BASE_URL (direct Playwright probe, 2026-09-08). No admin CRM
 * surface exists anywhere on this app — checked the header nav, footer, every "More" dropdown
 * item, and /sitemap.xml directly (same method used for cities.spec.ts). A public visitor can
 * never view or manage another customer's personal data on this app, by design. Grounded against
 * the home page as the anchor.
 */
export class CustomerManagementPage {
  constructor(private page: Page) {}

  customerSearchInput = () => this.page.getByRole('textbox', { name: /search.*customer/i });
  customerTable = () => this.page.getByRole('table');
  editCustomerButton = () => this.page.getByRole('button', { name: /edit.*customer/i });
  exportCsvButton = () => this.page.getByRole('button', { name: /export csv/i });
  statusToggle = () => this.page.getByRole('switch');

  async goto(): Promise<void> {
    await this.page.goto('/');
  }
}
