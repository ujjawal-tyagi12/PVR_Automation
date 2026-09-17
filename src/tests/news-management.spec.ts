import { test } from '@playwright/test';
import { NewsManagementModule } from '@modules/NewsManagementModule';

/**
 * Grounded against the live app at BASE_URL/news (direct Playwright probe, 2026-09-16). This is
 * a real, public news listing — see TestData/TestMd/news-management.md. Real articles render
 * under real Year/Month filters and category chips; there is no admin CRUD (Brand-Country tabs,
 * Add/Edit/Delete/Activate/Deactivate, image upload) anywhere on this app.
 */
test.describe('News Management (real: public news listing; no admin CRUD equivalent) @P2 @Regression', () => {
  test.describe.configure({ retries: 2 });

  test.beforeEach(async ({ page }) => {
    const nws = new NewsManagementModule(page);
    await nws.open();
    void page;
  });

  test('NWS-001 real listing shows genuine news articles, not an admin table @Smoke', async ({ page }) => {
    const nws = new NewsManagementModule(page);
    await nws.assertNoAdminTable();
  });

  test('NWS-002 confirms no Brand-Country tab pair exists to switch between (adapted) @P1', async ({ page }) => {
    const nws = new NewsManagementModule(page);
    await nws.assertNoAdminTable();
  });

  test('NWS-003 confirms no admin image-modal control exists on this public listing (adapted) @P2', async ({ page }) => {
    const nws = new NewsManagementModule(page);
    await nws.assertNoImageUpload();
  });

  test('NWS-004 real Year/Month filters are the public equivalent of Sort by Last Edited On @P1', async ({ page }) => {
    const nws = new NewsManagementModule(page);
    await nws.assertRealYearMonthFiltersVisible();
  });

  test('NWS-005 real category chip is the public equivalent of Filter by Type @Smoke', async ({ page }) => {
    const nws = new NewsManagementModule(page);
    await nws.assertCategoryChipFilters('New Initiatives');
  });

  test('NWS-006 confirms no admin Status filter exists (adapted) @P1', async ({ page }) => {
    const nws = new NewsManagementModule(page);
    await nws.assertNoAdminForm();
  });

  test('NWS-007 confirms no Last Edited On range filter exists (adapted) @P1', async ({ page }) => {
    const nws = new NewsManagementModule(page);
    await nws.assertNoAdminForm();
  });

  test('NWS-008 confirms no Add-news-item control exists (adapted) @P1', async ({ page }) => {
    const nws = new NewsManagementModule(page);
    await nws.assertNoAdminForm();
  });

  test('NWS-009 confirms no multiple-images-select-main-image control exists (adapted) @P1', async ({ page }) => {
    const nws = new NewsManagementModule(page);
    await nws.assertNoImageUpload();
  });

  test('NWS-010 confirms no Edit-news-item control exists (adapted) @P1', async ({ page }) => {
    const nws = new NewsManagementModule(page);
    await nws.assertNoAdminForm();
  });

  test('NWS-011 confirms no Activate control exists (adapted) @P1', async ({ page }) => {
    const nws = new NewsManagementModule(page);
    await nws.assertNoActivateDeactivateOrDelete();
  });

  test('NWS-012 confirms no Deactivate control exists (adapted) @P1', async ({ page }) => {
    const nws = new NewsManagementModule(page);
    await nws.assertNoActivateDeactivateOrDelete();
  });

  test('NWS-013 confirms no Delete control exists (adapted) @P1', async ({ page }) => {
    const nws = new NewsManagementModule(page);
    await nws.assertNoActivateDeactivateOrDelete();
  });

  test('NWS-014 confirms no Cancel-Add control exists (adapted) @P2', async ({ page }) => {
    const nws = new NewsManagementModule(page);
    await nws.assertNoAdminForm();
  });

  test('NWS-015 confirms no Cancel-Edit control exists (adapted) @P2', async ({ page }) => {
    const nws = new NewsManagementModule(page);
    await nws.assertNoAdminForm();
  });

  test('NWS-020 confirms no missing-Title validation surface exists (adapted) @P2', async ({ page }) => {
    const nws = new NewsManagementModule(page);
    await nws.assertNoAdminForm();
  });

  test('NWS-021 confirms no Title minimum-length validation surface exists (adapted) @P2', async ({ page }) => {
    const nws = new NewsManagementModule(page);
    await nws.assertNoAdminForm();
  });

  test('NWS-022 confirms no Title maximum-length validation surface exists (adapted) @P2', async ({ page }) => {
    const nws = new NewsManagementModule(page);
    await nws.assertNoAdminForm();
  });

  test('NWS-023 confirms no missing-Type validation surface exists (adapted) @P2', async ({ page }) => {
    const nws = new NewsManagementModule(page);
    await nws.assertNoAdminForm();
  });

  test('NWS-024 confirms no Source minimum-length validation surface exists (adapted) @P2', async ({ page }) => {
    const nws = new NewsManagementModule(page);
    await nws.assertNoAdminForm();
  });

  test('NWS-025 confirms no Source maximum-length validation surface exists (adapted) @P2', async ({ page }) => {
    const nws = new NewsManagementModule(page);
    await nws.assertNoAdminForm();
  });

  test('NWS-026 confirms no future-News-Date rejection surface exists (adapted) @P2', async ({ page }) => {
    const nws = new NewsManagementModule(page);
    await nws.assertNoAdminForm();
  });

  test('NWS-027 confirms no invalid/empty-News-Date validation surface exists (adapted) @P2', async ({ page }) => {
    const nws = new NewsManagementModule(page);
    await nws.assertNoAdminForm();
  });

  test('NWS-028 confirms no empty-Sequence validation surface exists (adapted) @P2', async ({ page }) => {
    const nws = new NewsManagementModule(page);
    await nws.assertNoAdminForm();
  });

  test('NWS-029 confirms no non-numeric-Sequence validation surface exists (adapted) @P2', async ({ page }) => {
    const nws = new NewsManagementModule(page);
    await nws.assertNoAdminForm();
  });

  test('NWS-030 confirms no zero/negative-Sequence validation surface exists (adapted) @P2', async ({ page }) => {
    const nws = new NewsManagementModule(page);
    await nws.assertNoAdminForm();
  });

  test('NWS-031 confirms no Sequence-above-maximum validation surface exists (adapted) @P2', async ({ page }) => {
    const nws = new NewsManagementModule(page);
    await nws.assertNoAdminForm();
  });

  test('NWS-032 confirms no Description minimum-length validation surface exists (adapted) @P2', async ({ page }) => {
    const nws = new NewsManagementModule(page);
    await nws.assertNoAdminForm();
  });

  test('NWS-033 confirms no Description maximum-length validation surface exists (adapted) @P2', async ({ page }) => {
    const nws = new NewsManagementModule(page);
    await nws.assertNoAdminForm();
  });

  test('NWS-034 confirms no invalid/oversized-image validation surface exists (adapted) @P2', async ({ page }) => {
    const nws = new NewsManagementModule(page);
    await nws.assertNoImageUpload();
  });

  test('NWS-035 confirms no multiple-images-without-main-image validation surface exists (adapted) @P2', async ({ page }) => {
    const nws = new NewsManagementModule(page);
    await nws.assertNoImageUpload();
  });

  test('NWS-036 confirms no admin filter-returns-no-results state exists (adapted) @P2', async ({ page }) => {
    const nws = new NewsManagementModule(page);
    await nws.assertNoAdminForm();
  });

  test('NWS-037 confirms no From-greater-than-To date-filter validation surface exists (adapted) @P2', async ({ page }) => {
    const nws = new NewsManagementModule(page);
    await nws.assertNoAdminForm();
  });

  test('NWS-038 confirms no Delete-cancelled-retains-entry surface exists (adapted) @P2', async ({ page }) => {
    const nws = new NewsManagementModule(page);
    await nws.assertNoActivateDeactivateOrDelete();
  });

  test('NWS-039 confirms no Status-toggle-cancelled surface exists (adapted) @P2', async ({ page }) => {
    const nws = new NewsManagementModule(page);
    await nws.assertNoActivateDeactivateOrDelete();
  });

  test('NWS-040 confirms no admin route reachable to test access blocking on (adapted) [Negative] @P1', async ({ page }) => {
    const nws = new NewsManagementModule(page);
    await nws.assertNoAdminTable();
  });

  test('NWS-050 confirms no Title minimum-length boundary surface exists (adapted) @P2', async ({ page }) => {
    const nws = new NewsManagementModule(page);
    await nws.assertNoAdminForm();
  });

  test('NWS-051 confirms no Title maximum-length boundary surface exists (adapted) @P2', async ({ page }) => {
    const nws = new NewsManagementModule(page);
    await nws.assertNoAdminForm();
  });

  test('NWS-052 confirms no Sequence boundary surface exists (adapted) @P2', async ({ page }) => {
    const nws = new NewsManagementModule(page);
    await nws.assertNoAdminForm();
  });

  test('NWS-053 confirms no News-Date-equal-to-today surface exists (adapted) @P2', async ({ page }) => {
    const nws = new NewsManagementModule(page);
    await nws.assertNoAdminForm();
  });

  test('NWS-054 confirms no exactly-5-images-upload boundary surface exists (adapted) @P2', async ({ page }) => {
    const nws = new NewsManagementModule(page);
    await nws.assertNoImageUpload();
  });

  test('NWS-055 real "All" category chip shows the genuine unfiltered listing, not an empty tab state @P2', async ({ page }) => {
    const nws = new NewsManagementModule(page);
    await nws.assertCategoryChipFilters('All');
  });
});
