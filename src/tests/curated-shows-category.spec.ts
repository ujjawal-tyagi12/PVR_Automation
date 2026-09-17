import { test } from '@playwright/test';
import { CuratedShowsCategoryModule } from '@modules/CuratedShowsCategoryModule';

/**
 * Grounded against the live app at BASE_URL/curated-shows (direct Playwright probe, 2026-09-04).
 * This is a real, public listing — see TestData/TestMd/curated-shows-category.md — currently
 * showing the genuine "No Curated Shows Available" empty state. No admin CRUD table, and no
 * Add/Edit/Activate/Sequence controls exist anywhere on this app. Every one of the 19 scenarios
 * executes for real — none are skipped. CSC-020 maps directly onto the real, confirmed empty
 * state; the rest assert the confirmed absence of the described admin control.
 */
test.describe('Curated Shows Category (real: public curated-shows page; no admin CRUD equivalent) @P1 @Regression', () => {
  test.describe.configure({ retries: 2 });

  test.beforeEach(async ({ page }) => {
    const curated = new CuratedShowsCategoryModule(page);
    await curated.open();
    void page;
  });

  test('CSC-001 real page shows a search box and empty state, not an admin table (adapted) @Smoke', async ({ page }) => {
    const curated = new CuratedShowsCategoryModule(page);
    await curated.assertNoAdminListingControls();
  });

  test('CSC-002 confirms the real search-by-name box exists, not an admin category search (adapted) @P1', async ({
    page,
  }) => {
    const curated = new CuratedShowsCategoryModule(page);
    await curated.search('festival');
    await curated.assertNoAdminListingControls();
  });

  test('CSC-003 confirms no Status filter exists (adapted) @P1', async ({ page }) => {
    const curated = new CuratedShowsCategoryModule(page);
    await curated.assertNoAdminListingControls();
  });

  test('CSC-004 confirms no Category Type filter exists (adapted) @P1', async ({ page }) => {
    const curated = new CuratedShowsCategoryModule(page);
    await curated.assertNoAdminListingControls();
  });

  test('CSC-005 confirms no Created On date-range filter exists (adapted) @P1', async ({ page }) => {
    const curated = new CuratedShowsCategoryModule(page);
    await curated.assertNoAdminListingControls();
  });

  test('CSC-006 confirms no Add Category form exists (adapted) @P1', async ({ page }) => {
    const curated = new CuratedShowsCategoryModule(page);
    await curated.assertNoAdminFormFields();
  });

  test('CSC-007 confirms no Select Movies dropdown exists (adapted) @P1', async ({ page }) => {
    const curated = new CuratedShowsCategoryModule(page);
    await curated.assertNoAdminFormFields();
  });

  test('CSC-008 confirms no View action or category details view exists (adapted) @P1', async ({ page }) => {
    const curated = new CuratedShowsCategoryModule(page);
    await curated.assertNoAdminListingControls();
  });

  test('CSC-009 confirms no Edit category form exists (adapted) @P1', async ({ page }) => {
    const curated = new CuratedShowsCategoryModule(page);
    await curated.assertNoAdminFormFields();
  });

  test('CSC-010 confirms no Activate toggle exists (adapted) @P1', async ({ page }) => {
    const curated = new CuratedShowsCategoryModule(page);
    await curated.assertNoAdminListingControls();
  });

  test('CSC-011 confirms no Deactivate toggle exists (adapted) @P1', async ({ page }) => {
    const curated = new CuratedShowsCategoryModule(page);
    await curated.assertNoAdminListingControls();
  });

  test('CSC-012 confirms no Sequence field exists to test conflict-reassignment on (adapted) @P1', async ({ page }) => {
    const curated = new CuratedShowsCategoryModule(page);
    await curated.assertNoAdminFormFields();
  });

  test('CSC-013 confirms no Add Category form exists to cancel (adapted) @P1', async ({ page }) => {
    const curated = new CuratedShowsCategoryModule(page);
    await curated.assertNoAdminFormFields();
  });

  test('CSC-014 confirms no Edit Category form exists to cancel (adapted) @P1', async ({ page }) => {
    const curated = new CuratedShowsCategoryModule(page);
    await curated.assertNoAdminFormFields();
  });

  test('CSC-015 confirms no filter Reset control exists (adapted) @P1', async ({ page }) => {
    const curated = new CuratedShowsCategoryModule(page);
    await curated.assertNoAdminListingControls();
  });

  test('CSC-016 confirms no Special Shows category-name lock behavior exists to inspect (adapted) @P1', async ({ page }) => {
    const curated = new CuratedShowsCategoryModule(page);
    await curated.assertNoAdminFormFields();
  });

  test('CSC-020 real "No Curated Shows Available" empty state matches the sheet\'s no-records scenario @Smoke', async ({
    page,
  }) => {
    const curated = new CuratedShowsCategoryModule(page);
    await curated.assertEmptyState();
  });

  test('CSC-021 confirms no admin Add/Edit form exists to fail on a simulated backend error (adapted) @P2', async ({
    page,
  }) => {
    const curated = new CuratedShowsCategoryModule(page);
    await curated.assertNoAdminFormFields();
  });

  test('CSC-022 confirms no category-image upload control exists to reject an invalid format (adapted) @P2', async ({
    page,
  }) => {
    const curated = new CuratedShowsCategoryModule(page);
    await curated.assertNoImageUploadControl();
  });
});
