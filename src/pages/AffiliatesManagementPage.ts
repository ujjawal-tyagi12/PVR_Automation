import { Page } from '@playwright/test';

/**
 * Grounded against the live app at BASE_URL (Playwright MCP, 2026-08-31). No page
 * anywhere on this app manages "affiliate" accounts (Name/Username/Password/Class
 * restriction) as described in TestData/TestMd/affiliates-management.md. The
 * closest thematically-related page, /corporate-booking, is a bulk-screening
 * request form (City/Cinema/Date/Movie/Seats) with no relation to account
 * management — checked directly, not assumed. There is no admin CRUD surface to
 * ground this module against.
 */
export class AffiliatesManagementPage {
  constructor(private page: Page) {}

  corporateBookingHeading = () => this.page.getByRole('heading', { name: 'Exclusive Corporate Screenings' });

  async goto(): Promise<void> {
    await this.page.goto('/corporate-booking');
  }
}
