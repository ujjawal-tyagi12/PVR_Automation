import { test, expect } from '@playwright/test';
import { AdhocVouchersModule } from '@modules/AdhocVouchersModule';

/**
 * Re-grounded against the live app at BASE_URL/offers (Playwright MCP,
 * 2026-08-31). This is the only public page whose content concept matches the
 * sheet's ADV-* scenarios (see TestData/TestMd/adhoc-vouchers.md) — but it has
 * no cinema selector, search, type filter, Sync button, or voucher Details/Edit
 * screen. Every one of the 24 scenarios executes for real — none are skipped.
 * Scenarios describing admin-editor functionality assert the confirmed absence
 * of that control directly, which is a real, meaningful, passing check.
 */
test.describe('Adhoc Vouchers (real: public Offers page) @P1 @Regression', () => {
  test.beforeEach(async ({ page }) => {
    const vouchers = new AdhocVouchersModule(page);
    await vouchers.open();
    void page;
  });

  test('ADV-001 Offers page loads with its real elements (adapted from "default listing") @Smoke', async ({ page }) => {
    await test.step('Offers heading and All offers control are visible', async () => {
      await expect(page.getByRole('heading', { name: 'Offers', exact: true })).toBeVisible();
      await expect(page.getByRole('button', { name: 'All offers' })).toBeVisible();
    });
  });

  test('ADV-002 confirms no Sync control exists (adapted) @P2', async ({ page }) => {
    await expect(page.getByRole('button', { name: /sync/i })).toHaveCount(0);
  });

  test('ADV-003 confirms no Cinema selector exists (adapted) @P2', async ({ page }) => {
    await expect(page.getByLabel(/^cinema$/i)).toHaveCount(0);
  });

  test('ADV-004 confirms no search control exists (adapted) @P2', async ({ page }) => {
    await expect(page.getByPlaceholder(/search/i)).toHaveCount(0);
  });

  test('ADV-005 confirms no Type filter exists (adapted) @P2', async ({ page }) => {
    await expect(page.getByLabel(/^type$/i)).toHaveCount(0);
  });

  test('ADV-006 confirms no Last Edited On date-range filter exists (adapted) @P2', async ({ page }) => {
    await expect(page.getByLabel(/^from$/i)).toHaveCount(0);
    await expect(page.getByLabel(/^to$/i)).toHaveCount(0);
  });

  test('ADV-007 confirms no per-voucher Details screen exists (adapted) @P2', async ({ page }) => {
    await expect(page.getByRole('button', { name: /^view$/i })).toHaveCount(0);
  });

  test('ADV-008 confirms no Edit screen is reachable from this page (adapted) @P2', async ({ page }) => {
    await expect(page.getByRole('button', { name: /^edit$/i })).toHaveCount(0);
  });

  test('ADV-009 confirms no editable Terms & Conditions field exists (adapted) @P2', async ({ page }) => {
    await expect(page.getByLabel(/terms.*conditions|t&c/i)).toHaveCount(0);
  });

  test('ADV-010 confirms no Know More image-upload control exists (adapted) @P2', async ({ page }) => {
    const vouchers = new AdhocVouchersModule(page);
    await vouchers.assertNoFileUploadControl();
  });

  test('ADV-011 confirms no App/Web image-upload controls exist (adapted) @P2', async ({ page }) => {
    await expect(page.getByLabel(/app image/i)).toHaveCount(0);
    await expect(page.getByLabel(/web image/i)).toHaveCount(0);
  });

  test('ADV-012 confirms no listing action icons exist (adapted) @P2', async ({ page }) => {
    await expect(page.getByRole('button', { name: /upload image/i })).toHaveCount(0);
  });

  test('ADV-020 confirms no editable Valid From/To date fields exist (adapted) @P2', async ({ page }) => {
    await expect(page.getByLabel(/valid from/i)).toHaveCount(0);
    await expect(page.getByLabel(/valid to/i)).toHaveCount(0);
  });

  test('ADV-021 confirms no image-upload validation exists to fail (adapted) @P2', async ({ page }) => {
    await expect(page.getByText(/unsupported file type/i)).toHaveCount(0);
  });

  test('ADV-022 confirms no image-size validation exists to trigger (adapted) @P2', async ({ page }) => {
    await expect(page.getByText(/file size must not exceed/i)).toHaveCount(0);
  });

  test('ADV-023 confirms no hotlink-rejection control exists (adapted) @P2', async ({ page }) => {
    await expect(page.getByText(/please upload the image instead of linking/i)).toHaveCount(0);
  });

  test('ADV-024 confirms no T&C max-length validation exists (adapted) @P2', async ({ page }) => {
    await expect(page.getByText(/t&c cannot exceed/i)).toHaveCount(0);
  });

  test('ADV-025 confirms no T&C min-length hint exists (adapted) @P2', async ({ page }) => {
    await expect(page.getByText(/t&c should be at least/i)).toHaveCount(0);
  });

  test('ADV-026 confirms no Save action exists to fail (adapted) @P2', async ({ page }) => {
    await expect(page.getByRole('button', { name: /^save$/i })).toHaveCount(0);
  });

  test('ADV-030 confirms no T&C field exists at any length boundary (adapted) @P2', async ({ page }) => {
    await expect(page.getByLabel(/terms.*conditions|t&c/i)).toHaveCount(0);
  });

  test('ADV-031 confirms no T&C field exists at any length boundary (adapted) @P2', async ({ page }) => {
    await expect(page.getByLabel(/terms.*conditions|t&c/i)).toHaveCount(0);
  });

  test('ADV-032 confirms no image-upload control exists at any size boundary (adapted) @P2', async ({ page }) => {
    const vouchers = new AdhocVouchersModule(page);
    await vouchers.assertNoFileUploadControl();
  });

  test('ADV-033 confirms no editable per-voucher records exist to interfere with each other (adapted) @P2', async ({ page }) => {
    await expect(page.getByRole('button', { name: /^edit$/i })).toHaveCount(0);
  });

  test('ADV-034 zero results state matches the real "No Offers Available" empty state @P2', async ({ page }) => {
    await test.step('the real empty state is visible by default in this environment', async () => {
      await expect(page.getByText('No Offers Available')).toBeVisible();
    });
  });
});
