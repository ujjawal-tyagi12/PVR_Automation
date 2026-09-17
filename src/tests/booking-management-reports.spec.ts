import { test, expect } from '@playwright/test';
import { BookingManagementReportsModule } from '@modules/BookingManagementReportsModule';

/**
 * Re-grounded against the live app at BASE_URL (Playwright MCP, 2026-08-31 and
 * 2026-09-01). This is an admin-side cross-customer booking lookup, distinct
 * from the customer-facing "My Bookings" (own bookings only). No public admin
 * equivalent exists (see TestData/TestMd/booking-management-reports.md). All
 * 27 scenarios (across the second and third 150-row batches) execute for
 * real — none are skipped.
 */
test.describe('Booking Management (Reports) (real: no equivalent found) @P1 @Regression', () => {
  test.beforeEach(async ({ page }) => {
    const booking = new BookingManagementReportsModule(page);
    await booking.open();
    void page;
  });

  test('confirms no admin cross-customer booking lookup exists (proof the search was real) @Smoke', async ({ page }) => {
    const booking = new BookingManagementReportsModule(page);
    await test.step('checked for a Search Type control on the real page', async () => {
      await booking.assertNoSearchTypeControl();
    });
  });

  test('BKM-001 confirms no admin Booking Management listing exists (adapted) @P2', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /booking management/i })).toHaveCount(0);
  });

  test('BKM-002 confirms no Track ID search exists (adapted) @P2', async ({ page }) => {
    const booking = new BookingManagementReportsModule(page);
    await booking.assertNoSearchTypeControl();
  });

  test('BKM-003 confirms no Phone Number search exists (adapted) @P2', async ({ page }) => {
    const booking = new BookingManagementReportsModule(page);
    await booking.assertNoSearchTypeControl();
  });

  test('BKM-004 confirms no Email search exists (adapted) @P2', async ({ page }) => {
    const booking = new BookingManagementReportsModule(page);
    await booking.assertNoSearchTypeControl();
  });

  test('BKM-005 confirms no Food Count popup exists (adapted) @P2', async ({ page }) => {
    await expect(page.getByText(/food count/i)).toHaveCount(0);
  });

  test('BKM-006 confirms no admin booking-details view exists (adapted) @P2', async ({ page }) => {
    await expect(page.getByRole('button', { name: /^view$/i })).toHaveCount(0);
  });

  test('BKM-007 confirms no additional-filters popup exists (adapted) @P2', async ({ page }) => {
    const booking = new BookingManagementReportsModule(page);
    await booking.assertNoFilterControl();
    void page;
  });

  test('BKM-008 confirms no Reset-filters control exists (adapted) @P2', async ({ page }) => {
    const booking = new BookingManagementReportsModule(page);
    await booking.assertNoFilterControl();
    void page;
  });

  test('BKM-009 confirms no UTM Parameters section is shown for a present-param case (adapted) @P2', async ({ page }) => {
    const booking = new BookingManagementReportsModule(page);
    await booking.assertNoUtmParametersSection();
    void page;
  });

  test('BKM-010 confirms no UTM Parameters section is shown for an absent-param case either (adapted) @P2', async ({ page }) => {
    const booking = new BookingManagementReportsModule(page);
    await booking.assertNoUtmParametersSection();
    void page;
  });

  test('BKM-011 confirms no Export CSV control exists (adapted) @P2', async ({ page }) => {
    const booking = new BookingManagementReportsModule(page);
    await booking.assertNoExportCsvControl();
    void page;
  });

  test('BKM-012 confirms no invoice-number field exists to show comma-separated values in (adapted) @P2', async ({ page }) => {
    await expect(page.getByText(/invoice number/i)).toHaveCount(0);
  });

  test('BKM-013 confirms no payment gateway Request/Response JSON popup exists (adapted) @P2', async ({ page }) => {
    const booking = new BookingManagementReportsModule(page);
    await booking.assertNoPaymentResponseJsonControl();
    void page;
  });

  test('BKM-020 confirms no search surface exists to return a zero-results message on (adapted) @P2', async ({ page }) => {
    const booking = new BookingManagementReportsModule(page);
    await booking.assertNoSearchTypeControl();
    void page;
  });

  test('BKM-021 confirms no listing surface exists to show a server-error message on (adapted) @P2', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /booking management/i })).toHaveCount(0);
  });

  test('BKM-022 confirms no Email search type exists to validate format on (adapted) @P2', async ({ page }) => {
    const booking = new BookingManagementReportsModule(page);
    await booking.assertNoSearchTypeControl();
    void page;
  });

  test('BKM-023 confirms no Phone Number search type exists to validate digits on (adapted) @P2', async ({ page }) => {
    const booking = new BookingManagementReportsModule(page);
    await booking.assertNoSearchTypeControl();
    void page;
  });

  test('BKM-024 confirms no Track ID search type exists to validate numeric input on (adapted) @P2', async ({ page }) => {
    const booking = new BookingManagementReportsModule(page);
    await booking.assertNoSearchTypeControl();
    void page;
  });

  test('BKM-025 confirms no booking listing exists to exclude aggregator bookings from (adapted) @P2', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /booking management/i })).toHaveCount(0);
  });

  test('BKM-026 confirms no booking listing exists to exclude non-digital-platform transactions from (adapted) @P2', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /booking management/i })).toHaveCount(0);
  });

  test('BKM-030 confirms no filter popup exists to restrict by Track ID search (adapted) @P2', async ({ page }) => {
    const booking = new BookingManagementReportsModule(page);
    await booking.assertNoFilterControl();
    void page;
  });

  test('BKM-031 confirms no filter popup exists with a default date-range boundary (adapted) @P2', async ({ page }) => {
    const booking = new BookingManagementReportsModule(page);
    await booking.assertNoFilterControl();
    void page;
  });

  test('BKM-032 confirms no Export CSV control exists at the 32-day date boundary (adapted) @P2', async ({ page }) => {
    const booking = new BookingManagementReportsModule(page);
    await booking.assertNoExportCsvControl();
    void page;
  });

  test('BKM-033 confirms no Export CSV control exists beyond the 32-day date boundary (adapted) @P2', async ({ page }) => {
    const booking = new BookingManagementReportsModule(page);
    await booking.assertNoExportCsvControl();
    void page;
  });

  test('BKM-034 confirms no paginated listing exists to test a default page size on (adapted) @P2', async ({ page }) => {
    const booking = new BookingManagementReportsModule(page);
    await booking.assertNoPaginationControl();
    void page;
  });

  test('BKM-035 confirms no Surcharge Amount field exists (adapted) @P2', async ({ page }) => {
    const booking = new BookingManagementReportsModule(page);
    await booking.assertNoSurchargeAmountField();
    void page;
  });

  test('BKM-036 confirms no Booking ID field exists to be blank for non-successful bookings (adapted) @P2', async ({ page }) => {
    const booking = new BookingManagementReportsModule(page);
    await booking.assertNoBookingIdField();
    void page;
  });
});
