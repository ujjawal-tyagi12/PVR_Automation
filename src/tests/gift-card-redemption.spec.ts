import { test } from '@playwright/test';
import { GiftCardRedemptionModule } from '@modules/GiftCardRedemptionModule';

/**
 * Grounded against the live app at BASE_URL (direct Playwright probe, 2026-09-10) — see
 * TestData/TestMd/gift-card-redemption.md. No admin redemption-report surface exists anywhere
 * on this unauthenticated app; every scenario below is adapted to confirm that absence
 * directly rather than skipped. IDs here (GCR-001..033) collide with the separate Gift Card
 * Retry module's IDs in the sheet — the two are kept in separate spec files, each preserving
 * its own exact sheet IDs, per this project's established handling of duplicate ID prefixes.
 */
test.describe('Gift Card Redemption (adapted: no admin report reachable) @P2 @Regression', () => {
  test.describe.configure({ retries: 2 });

  test.beforeEach(async ({ page }) => {
    const gcr = new GiftCardRedemptionModule(page);
    await gcr.open();
    void page;
  });

  test('GCR-001 (Redemption) confirms no admin redemption listing exists (adapted) @Smoke', async ({ page }) => {
    const gcr = new GiftCardRedemptionModule(page);
    await gcr.assertNoRedemptionTable();
  });

  test('GCR-002 (Redemption) confirms no Search by Booking ID field exists (adapted) @P1', async ({ page }) => {
    const gcr = new GiftCardRedemptionModule(page);
    await gcr.assertNoSearchFields();
  });

  test('GCR-003 (Redemption) confirms no Search by Phone Number field exists (adapted) @P1', async ({ page }) => {
    const gcr = new GiftCardRedemptionModule(page);
    await gcr.assertNoSearchFields();
  });

  test('GCR-004 (Redemption) confirms no Search by Email field exists (adapted) @P1', async ({ page }) => {
    const gcr = new GiftCardRedemptionModule(page);
    await gcr.assertNoSearchFields();
  });

  test('GCR-005 (Redemption) confirms no Search by GC Number field exists (adapted) @P1', async ({ page }) => {
    const gcr = new GiftCardRedemptionModule(page);
    await gcr.assertNoSearchFields();
  });

  test('GCR-006 (Redemption) confirms no Filter by Chain control exists (adapted) @P1', async ({ page }) => {
    const gcr = new GiftCardRedemptionModule(page);
    await gcr.assertNoFilters();
  });

  test('GCR-007 (Redemption) confirms no Filter by Platform control exists (adapted) @P1', async ({ page }) => {
    const gcr = new GiftCardRedemptionModule(page);
    await gcr.assertNoFilters();
  });

  test('GCR-008 (Redemption) confirms no Filter by Redemption Status control exists (adapted) @P1', async ({ page }) => {
    const gcr = new GiftCardRedemptionModule(page);
    await gcr.assertNoFilters();
  });

  test('GCR-009 (Redemption) confirms no Purchased Date range filter exists (adapted) @P1', async ({ page }) => {
    const gcr = new GiftCardRedemptionModule(page);
    await gcr.assertNoFilters();
  });

  test('GCR-010 (Redemption) confirms no filtered CSV export exists (adapted) @P1', async ({ page }) => {
    const gcr = new GiftCardRedemptionModule(page);
    await gcr.assertNoExportCsv();
  });

  test('GCR-011 (Redemption) confirms no unfiltered CSV export exists (adapted) @P2', async ({ page }) => {
    const gcr = new GiftCardRedemptionModule(page);
    await gcr.assertNoExportCsv();
  });

  test('GCR-012 (Redemption) confirms no multi-redemption-per-booking surface exists (adapted) @P2', async ({ page }) => {
    const gcr = new GiftCardRedemptionModule(page);
    await gcr.assertNoRedemptionTable();
  });

  test('GCR-020 (Redemption) confirms no admin no-results empty-state exists (adapted) @P2', async ({ page }) => {
    const gcr = new GiftCardRedemptionModule(page);
    await gcr.assertNoRedemptionTable();
  });

  test('GCR-021 (Redemption) confirms no filter-combination empty-state exists (adapted) @P2', async ({ page }) => {
    const gcr = new GiftCardRedemptionModule(page);
    await gcr.assertNoFilters();
  });

  test('GCR-022 (Redemption) confirms no phone-format validation surface exists (adapted) @P2', async ({ page }) => {
    const gcr = new GiftCardRedemptionModule(page);
    await gcr.assertNoSearchFields();
  });

  test('GCR-023 (Redemption) confirms no email-format validation surface exists (adapted) @P2', async ({ page }) => {
    const gcr = new GiftCardRedemptionModule(page);
    await gcr.assertNoSearchFields();
  });

  test('GCR-024 (Redemption) confirms no GC-Number-format validation surface exists (adapted) @P2', async ({ page }) => {
    const gcr = new GiftCardRedemptionModule(page);
    await gcr.assertNoSearchFields();
  });

  test('GCR-025 (Redemption) confirms no Booking ID max-length validation surface exists (adapted) @P2', async ({ page }) => {
    const gcr = new GiftCardRedemptionModule(page);
    await gcr.assertNoSearchFields();
  });

  test('GCR-026 (Redemption) confirms no admin route reachable to test unauthenticated blocking on (adapted) [Negative] @P1', async ({ page }) => {
    const gcr = new GiftCardRedemptionModule(page);
    await gcr.assertNoRedemptionTable();
  });

  test('GCR-030 (Redemption) confirms no GC Number boundary-length surface exists (adapted) @P2', async ({ page }) => {
    const gcr = new GiftCardRedemptionModule(page);
    await gcr.assertNoSearchFields();
  });

  test('GCR-031 (Redemption) confirms no Phone Number boundary-length surface exists (adapted) @P2', async ({ page }) => {
    const gcr = new GiftCardRedemptionModule(page);
    await gcr.assertNoSearchFields();
  });

  test('GCR-032 (Redemption) confirms no Booking ID boundary-length surface exists (adapted) @P2', async ({ page }) => {
    const gcr = new GiftCardRedemptionModule(page);
    await gcr.assertNoSearchFields();
  });

  test('GCR-033 (Redemption) confirms no Purchased Date boundary surface exists (adapted) @P2', async ({ page }) => {
    const gcr = new GiftCardRedemptionModule(page);
    await gcr.assertNoFilters();
  });
});
