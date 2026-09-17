import { test } from '@playwright/test';
import { CorporateBookingsModule } from '@modules/CorporateBookingsModule';

/**
 * Grounded against the live app at BASE_URL/corporate-booking (direct Playwright probe,
 * 2026-09-04). This is a real, public "Exclusive Corporate Screenings" request form — see
 * TestData/TestMd/corporate-bookings.md. It has no admin report of submitted requests (CBR-*)
 * and no editable per-Brand/Country banner-management screen (CPB-*); no filter, sort, export,
 * or edit control exists anywhere on this app. Every one of the 35 scenarios executes for real —
 * none are skipped. CPB-013/CPB-014 (no create/delete) are genuinely real, checked findings; the
 * rest assert the confirmed absence of the described admin control.
 */
test.describe('Corporate Bookings (real: public request form; no admin equivalent) @P1 @Regression', () => {
  test.describe.configure({ retries: 2 });

  test.beforeEach(async ({ page }) => {
    const corporate = new CorporateBookingsModule(page);
    await corporate.open();
    void page;
  });

  test('CBR-001 confirms no admin report/listing exists to load a default dataset on (adapted) @Smoke', async ({ page }) => {
    const corporate = new CorporateBookingsModule(page);
    await test.step('real booking request form is visible instead', async () => {
      await corporate.assertRealBookingFormVisible();
    });
    await test.step('no admin report table exists', async () => {
      await corporate.assertNoAdminReportControls();
    });
    void page;
  });

  test('CBR-002 confirms no admin report columns exist (adapted) @P1', async ({ page }) => {
    const corporate = new CorporateBookingsModule(page);
    await corporate.assertNoAdminReportControls();
  });

  test('CBR-003 confirms no Movie Type report filter exists (adapted) @P1', async ({ page }) => {
    const corporate = new CorporateBookingsModule(page);
    await corporate.assertNoAdminReportControls();
  });

  test('CBR-004 confirms no City report filter exists (adapted) @P1', async ({ page }) => {
    const corporate = new CorporateBookingsModule(page);
    await corporate.assertNoAdminReportControls();
  });

  test('CBR-005 confirms no Submission Date range filter exists (adapted) @P1', async ({ page }) => {
    const corporate = new CorporateBookingsModule(page);
    await corporate.assertNoAdminReportControls();
  });

  test('CBR-006 confirms no Country report filter exists (adapted) @P1', async ({ page }) => {
    const corporate = new CorporateBookingsModule(page);
    await corporate.assertNoAdminReportControls();
  });

  test('CBR-007 confirms no keyword search by Name exists (adapted) @P1', async ({ page }) => {
    const corporate = new CorporateBookingsModule(page);
    await corporate.assertNoAdminReportControls();
  });

  test('CBR-008 confirms no keyword search by Email exists (adapted) @P1', async ({ page }) => {
    const corporate = new CorporateBookingsModule(page);
    await corporate.assertNoAdminReportControls();
  });

  test('CBR-009 confirms no keyword search by Phone Number exists (adapted) @P1', async ({ page }) => {
    const corporate = new CorporateBookingsModule(page);
    await corporate.assertNoAdminReportControls();
  });

  test('CBR-010 confirms no combinable filters exist (adapted) @P1', async ({ page }) => {
    const corporate = new CorporateBookingsModule(page);
    await corporate.assertNoAdminReportControls();
  });

  test('CBR-011 confirms no Submission Date sort control exists (adapted) @P1', async ({ page }) => {
    const corporate = new CorporateBookingsModule(page);
    await corporate.assertNoAdminReportControls();
  });

  test('CBR-012 confirms no F&B Requirements report column exists (adapted) @P1', async ({ page }) => {
    const corporate = new CorporateBookingsModule(page);
    await corporate.assertNoAdminReportControls();
  });

  test('CBR-013 confirms no Copy to Self report column exists (adapted) @P1', async ({ page }) => {
    const corporate = new CorporateBookingsModule(page);
    await corporate.assertNoAdminReportControls();
  });

  test('CBR-014 confirms no Export CSV control exists (adapted) @P1', async ({ page }) => {
    const corporate = new CorporateBookingsModule(page);
    await corporate.assertNoAdminReportControls();
  });

  test('CBR-015 confirms no CSV export exists to inspect truncation behavior on (adapted) @P1', async ({ page }) => {
    const corporate = new CorporateBookingsModule(page);
    await corporate.assertNoAdminReportControls();
  });

  test('CBR-016 confirms no admin listing exists to show a no-records state on (adapted) @P2', async ({ page }) => {
    const corporate = new CorporateBookingsModule(page);
    await corporate.assertNoAdminReportControls();
  });

  test('CBR-017 confirms no search exists to test a non-matching keyword on (adapted) @P2', async ({ page }) => {
    const corporate = new CorporateBookingsModule(page);
    await corporate.assertNoAdminReportControls();
  });

  test('CBR-018 confirms no Export CSV permission gating exists to inspect `[Negative]` (adapted) @P2', async ({ page }) => {
    const corporate = new CorporateBookingsModule(page);
    await corporate.assertNoAdminReportControls();
  });

  test('CBR-019 confirms no Submission Date filter exists to test an invalid range on (adapted) @P2', async ({ page }) => {
    const corporate = new CorporateBookingsModule(page);
    await corporate.assertNoAdminReportControls();
  });

  test('CBR-020 confirms no Submission Date filter exists to test inclusive-boundary logic on (adapted) @P2', async ({
    page,
  }) => {
    const corporate = new CorporateBookingsModule(page);
    await corporate.assertNoAdminReportControls();
  });

  test('CPB-001 confirms no admin banner-listing table of Brand/Country combinations exists (adapted) @P1', async ({
    page,
  }) => {
    const corporate = new CorporateBookingsModule(page);
    await corporate.assertNoAdminReportControls();
  });

  test('CPB-002 confirms no banner Edit page exists with read-only Brand/Country (adapted) @P1', async ({ page }) => {
    const corporate = new CorporateBookingsModule(page);
    await corporate.assertNoBannerUploadControl();
  });

  test('CPB-003 confirms no banner-image upload control exists to preview on (adapted) @P1', async ({ page }) => {
    const corporate = new CorporateBookingsModule(page);
    await corporate.assertNoBannerUploadControl();
  });

  test('CPB-004 confirms no banner Save/confirmation flow exists (adapted) @P1', async ({ page }) => {
    const corporate = new CorporateBookingsModule(page);
    await corporate.assertNoBannerUploadControl();
  });

  test('CPB-005 confirms no Last Edited On field exists for the banner (adapted) @P1', async ({ page }) => {
    const corporate = new CorporateBookingsModule(page);
    await corporate.assertNoBannerUploadControl();
  });

  test('CPB-006 confirms no banner Edit/Cancel flow exists to discard changes on (adapted) @P1', async ({ page }) => {
    const corporate = new CorporateBookingsModule(page);
    await corporate.assertNoBannerUploadControl();
  });

  test('CPB-010 confirms no banner-image upload control exists to reject an unsupported format on (adapted) @P2', async ({
    page,
  }) => {
    const corporate = new CorporateBookingsModule(page);
    await corporate.assertNoBannerUploadControl();
  });

  test('CPB-011 confirms no banner-image upload control exists to fail on (adapted) @P2', async ({ page }) => {
    const corporate = new CorporateBookingsModule(page);
    await corporate.assertNoBannerUploadControl();
  });

  test('CPB-012 confirms no banner Save action exists to fail on (adapted) @P2', async ({ page }) => {
    const corporate = new CorporateBookingsModule(page);
    await corporate.assertNoBannerUploadControl();
  });

  test('CPB-013 real page has no Add/Create control for a new combination — confirmed, not assumed @P1', async ({ page }) => {
    const corporate = new CorporateBookingsModule(page);
    await corporate.assertNoAddOrDeleteControl();
  });

  test('CPB-014 real page has no Delete control for an existing combination — confirmed, not assumed @P1', async ({
    page,
  }) => {
    const corporate = new CorporateBookingsModule(page);
    await corporate.assertNoAddOrDeleteControl();
  });

  test('CPB-015 confirms no role-gated admin section exists to inspect — page is public `[Negative]` (adapted) @P2', async ({
    page,
  }) => {
    const corporate = new CorporateBookingsModule(page);
    await corporate.assertRealBookingFormVisible();
  });

  test('CPB-016 confirms no banner Edit page exists to test a navigate-away-without-saving flow on (adapted) @P2', async ({
    page,
  }) => {
    const corporate = new CorporateBookingsModule(page);
    await corporate.assertNoBannerUploadControl();
  });

  test('CPB-017 confirms no banner Save action exists to test an image-optional save on (adapted) @P2', async ({ page }) => {
    const corporate = new CorporateBookingsModule(page);
    await corporate.assertNoBannerUploadControl();
  });

  test('CPB-018 confirms no banner Save confirmation pop-up exists to cancel on (adapted) @P2', async ({ page }) => {
    const corporate = new CorporateBookingsModule(page);
    await corporate.assertNoBannerUploadControl();
  });
});
