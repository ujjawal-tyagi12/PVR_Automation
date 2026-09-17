import { Page } from '@playwright/test';

/**
 * Grounded against the live app at BASE_URL (Playwright MCP, 2026-08-31). This
 * is an admin-side cross-customer booking lookup (any customer's booking by
 * Track ID/Phone/Email), distinct from the customer-facing "My Bookings" (own
 * bookings only, behind customer login). No public admin equivalent exists.
 * See TestData/TestMd/booking-management-reports.md.
 */
export class BookingManagementReportsPage {
  constructor(private page: Page) {}

  trackIdSearchType = () => this.page.getByLabel(/search type/i);
  filterPopupButton = () => this.page.getByRole('button', { name: /^filter$/i });
  resetFilterButton = () => this.page.getByRole('button', { name: /^reset$/i });
  utmParametersHeading = () => this.page.getByText(/utm parameters/i);
  exportCsvButton = () => this.page.getByRole('button', { name: /export csv/i });
  paymentResponseJsonButton = () => this.page.getByRole('button', { name: /view (request|response)/i });
  surchargeAmountText = () => this.page.getByText(/surcharge amount/i);
  bookingIdLabel = () => this.page.getByText(/^booking id$/i);
  paginationNextButton = () => this.page.getByRole('button', { name: /^next$/i });

  async goto(): Promise<void> {
    await this.page.goto('/');
  }
}
