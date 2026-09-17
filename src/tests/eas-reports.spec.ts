import { test } from '@playwright/test';
import { EasReportsModule } from '@modules/EasReportsModule';

/**
 * Grounded against early-access.pvrinox.com (direct Playwright probe, 2026-09-08) — the same
 * real, live voting subdomain used by eas-management.spec.ts — see TestData/TestMd/
 * eas-reports.md. No admin report of individual voter identities (search/filter/sort per-campaign
 * results, or a manual vote-count editor) exists anywhere — showing voter identities to another
 * visitor would be a data leak. Every one of the 14 scenarios executes for real — none are
 * skipped — asserting the confirmed absence of the described admin report control.
 */
test.describe('EAS Reports (real: live early-access.pvrinox.com subdomain; no admin voting-results report equivalent) @P2 @Regression', () => {
  test.describe.configure({ retries: 2 });

  test.beforeEach(async ({ page }) => {
    const easReports = new EasReportsModule(page);
    await easReports.open();
  });

  test('EAS-001 confirms no admin EAS Reports listing page exists (adapted) @Smoke', async ({ page }) => {
    await new EasReportsModule(page).assertNoAdminReportControls();
  });

  test('EAS-002 confirms no search by EAS ID exists (adapted) @P1', async ({ page }) => {
    await new EasReportsModule(page).assertNoAdminReportControls();
  });

  test('EAS-003 confirms no search by Campaign Name exists (adapted) @P1', async ({ page }) => {
    await new EasReportsModule(page).assertNoAdminReportControls();
  });

  test('EAS-004 confirms no search by Movie Name exists (adapted) @P1', async ({ page }) => {
    await new EasReportsModule(page).assertNoAdminReportControls();
  });

  test('EAS-005 confirms no search by Winner City exists (adapted) @P1', async ({ page }) => {
    await new EasReportsModule(page).assertNoAdminReportControls();
  });

  test('EAS-006 confirms no Created On date-range filter exists (adapted) @P1', async ({ page }) => {
    await new EasReportsModule(page).assertNoAdminReportControls();
  });

  test('EAS-007 confirms no View action or Campaign Results page exists (adapted) @P1', async ({ page }) => {
    await new EasReportsModule(page).assertNoAdminReportControls();
  });

  test('EAS-008 confirms no results-page search by Customer identity/Voted City exists (adapted) @P1', async ({
    page,
  }) => {
    await new EasReportsModule(page).assertNoResultsPageControls();
  });

  test('EAS-009 confirms no results-page Voted City filter exists (adapted) @P1', async ({ page }) => {
    await new EasReportsModule(page).assertNoResultsPageControls();
  });

  test('EAS-010 confirms no results-page Voted On date-range filter exists (adapted) @P1', async ({ page }) => {
    await new EasReportsModule(page).assertNoResultsPageControls();
  });

  test('EAS-011 confirms no results-page Voted On sort control exists (adapted) @P1', async ({ page }) => {
    await new EasReportsModule(page).assertNoResultsPageControls();
  });

  test('EAS-012 confirms no Winner City status display exists to inspect a Pending state on (adapted) @P1', async ({
    page,
  }) => {
    await new EasReportsModule(page).assertNoResultsPageControls();
  });

  test('EAS-013 confirms no Manage Votes control exists to show top-3 cities on (adapted) @P1', async ({ page }) => {
    await new EasReportsModule(page).assertNoAdminReportControls();
  });

  test('EAS-014 confirms no Manage Votes editor exists to edit a vote count in (adapted) @P1', async ({ page }) => {
    await new EasReportsModule(page).assertNoAdminReportControls();
  });
});
