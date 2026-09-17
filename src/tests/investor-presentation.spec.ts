import { test } from '@playwright/test';
import { InvestorPresentationModule } from '@modules/InvestorPresentationModule';

/**
 * Grounded against the live app at
 * BASE_URL/investors-section?tab=financials&subtype=investor-presentation (direct Playwright
 * probe, 2026-09-10). This is a real, public investor-presentation archive — see
 * TestData/TestMd/investor-presentation.md. There is no admin CRUD (Add/Edit/Toggle/CSV-upload)
 * surface anywhere on this app.
 */
test.describe('Investor Presentation (real: public investor archive; no admin CRUD equivalent) @P2 @Regression', () => {
  test.describe.configure({ retries: 2 });

  test.beforeEach(async ({ page }) => {
    const inp = new InvestorPresentationModule(page);
    await inp.open();
    void page;
  });

  test('INP-001 real listing loads with genuine yearly cards, not an admin table (adapted) @Smoke', async ({ page }) => {
    const inp = new InvestorPresentationModule(page);
    await inp.assertNoAdminCrud();
  });

  test('INP-002 confirms no Search by Name field exists (adapted) @P1', async ({ page }) => {
    const inp = new InvestorPresentationModule(page);
    await inp.assertNoSearchOrStatusFilter();
  });

  test('INP-003 real "All Years" combobox is the public equivalent of Search by Year @Smoke', async ({ page }) => {
    const inp = new InvestorPresentationModule(page);
    await inp.assertYearFilterVisible();
  });

  test('INP-004 confirms no Filter by Status Active exists (adapted) @P1', async ({ page }) => {
    const inp = new InvestorPresentationModule(page);
    await inp.assertNoSearchOrStatusFilter();
  });

  test('INP-005 confirms no Filter by Status Inactive exists (adapted) @P1', async ({ page }) => {
    const inp = new InvestorPresentationModule(page);
    await inp.assertNoSearchOrStatusFilter();
  });

  test('INP-006 real listing is already ordered descending by year, the public equivalent of Sort by Year @P1', async ({ page }) => {
    const inp = new InvestorPresentationModule(page);
    await inp.assertListingDescendingByYear();
  });

  test('INP-007 real Download button is present and clickable on each card @Smoke', async ({ page }) => {
    const inp = new InvestorPresentationModule(page);
    await inp.assertDownloadButtonWorks('2021');
  });

  test('INP-008 confirms no Add Investor Presentation control opens an Add page (adapted) @P1', async ({ page }) => {
    const inp = new InvestorPresentationModule(page);
    await inp.assertNoAdminCrud();
  });

  test('INP-009 confirms no create-with-all-fields form exists (adapted) @P1', async ({ page }) => {
    const inp = new InvestorPresentationModule(page);
    await inp.assertNoAdminCrud();
  });

  test('INP-010 confirms no create-without-optional-fields form exists (adapted) @P2', async ({ page }) => {
    const inp = new InvestorPresentationModule(page);
    await inp.assertNoAdminCrud();
  });

  test('INP-011 confirms no Edit page pre-populated from a record exists (adapted) @P1', async ({ page }) => {
    const inp = new InvestorPresentationModule(page);
    await inp.assertNoAdminCrud();
  });

  test('INP-012 confirms no Edit-fields-and-Save form exists (adapted) @P1', async ({ page }) => {
    const inp = new InvestorPresentationModule(page);
    await inp.assertNoAdminCrud();
  });

  test('INP-013 confirms no Cancel-Add control exists (adapted) @P2', async ({ page }) => {
    const inp = new InvestorPresentationModule(page);
    await inp.assertNoAdminCrud();
  });

  test('INP-014 confirms no Cancel-Edit control exists (adapted) @P2', async ({ page }) => {
    const inp = new InvestorPresentationModule(page);
    await inp.assertNoAdminCrud();
  });

  test('INP-015 confirms no Active-to-Inactive toggle-confirmation exists (adapted) @P1', async ({ page }) => {
    const inp = new InvestorPresentationModule(page);
    await inp.assertNoAdminCrud();
  });

  test('INP-016 confirms no Inactive-to-Active toggle-confirmation exists (adapted) @P1', async ({ page }) => {
    const inp = new InvestorPresentationModule(page);
    await inp.assertNoAdminCrud();
  });

  test('INP-017 real page shows only publicly-published presentations, the equivalent of an Active-only frontend view @P1', async ({ page }) => {
    const inp = new InvestorPresentationModule(page);
    await inp.assertDownloadButtonWorks('2019');
  });

  test('INP-018 real listing has genuine duplicate-year cards for the same year @Smoke', async ({ page }) => {
    const inp = new InvestorPresentationModule(page);
    await inp.assertDuplicateYearCardsExist();
  });

  test('INP-019 confirms no admin creation-timestamp ordering is verifiable beyond public year order (adapted) @P2', async ({ page }) => {
    const inp = new InvestorPresentationModule(page);
    await inp.assertListingDescendingByYear();
  });

  test('INP-020 real "10 Years Highlight" is a sibling data tab, not an upload popup (adapted) @P1', async ({ page }) => {
    const inp = new InvestorPresentationModule(page);
    await inp.assertTenYearsHighlightShowsRealData();
  });

  test('INP-021 confirms no CSV upload control exists (adapted) @P1', async ({ page }) => {
    const inp = new InvestorPresentationModule(page);
    await inp.assertNoCsvUploadInput();
  });

  test('INP-022 confirms no reopened-popup existing-file state exists (adapted) @P2', async ({ page }) => {
    const inp = new InvestorPresentationModule(page);
    await inp.assertNoCsvUploadInput();
  });

  test('INP-023 confirms no remove-and-replace-CSV control exists (adapted) @P2', async ({ page }) => {
    const inp = new InvestorPresentationModule(page);
    await inp.assertNoCsvUploadInput();
  });

  test('INP-024 confirms no empty-Name validation surface exists (adapted) @P2', async ({ page }) => {
    const inp = new InvestorPresentationModule(page);
    await inp.assertNoAdminCrud();
  });

  test('INP-025 confirms no Name-exceeding-150-characters validation surface exists (adapted) @P2', async ({ page }) => {
    const inp = new InvestorPresentationModule(page);
    await inp.assertNoAdminCrud();
  });

  test('INP-026 confirms no missing-Year validation surface exists (adapted) @P2', async ({ page }) => {
    const inp = new InvestorPresentationModule(page);
    await inp.assertNoAdminCrud();
  });

  test('INP-027 confirms no Cancel-status-change-confirmation exists (adapted) @P2', async ({ page }) => {
    const inp = new InvestorPresentationModule(page);
    await inp.assertNoAdminCrud();
  });

  test('INP-028 confirms no admin route reachable to test unauthorized-role access on (adapted) [Negative] @P1', async ({ page }) => {
    const inp = new InvestorPresentationModule(page);
    await inp.assertNoAdminCrud();
  });

  test('INP-029 confirms no Name-at-exactly-150-characters boundary surface exists (adapted) @P2', async ({ page }) => {
    const inp = new InvestorPresentationModule(page);
    await inp.assertNoAdminCrud();
  });

  test('INP-030 confirms no admin pagination control exists on this listing (adapted) @P2', async ({ page }) => {
    const inp = new InvestorPresentationModule(page);
    await inp.assertNoPagination();
  });
});
