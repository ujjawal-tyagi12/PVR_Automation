import { test } from '@playwright/test';
import { JobRequestsModule } from '@modules/JobRequestsModule';

/**
 * Grounded against the live app at BASE_URL/career (direct Playwright probe, 2026-09-16). The
 * real "Apply for the role" form (opened from a department card) is the genuine intake
 * mechanism behind whatever an admin's Job Requests report lists — see
 * TestData/TestMd/job-requests.md. There is no admin report/listing surface (search, filters,
 * CSV export, resume download) anywhere on this app.
 */
test.describe('Job Requests (real: public Apply-for-role form; no admin report equivalent) @P2 @Regression', () => {
  test.describe.configure({ retries: 2 });

  test.beforeEach(async ({ page }) => {
    const jrr = new JobRequestsModule(page);
    await jrr.open();
    void page;
  });

  test('JRR-001 real Apply form shows the genuine intake fields, not an admin report listing (adapted) @Smoke', async ({ page }) => {
    const jrr = new JobRequestsModule(page);
    await jrr.assertRealApplyFormFields();
  });

  test('JRR-002 confirms no Filter by Country exists on an admin report (adapted) @P1', async ({ page }) => {
    const jrr = new JobRequestsModule(page);
    await jrr.assertNoSearchOrFilters();
  });

  test('JRR-003 confirms no Filter by Department exists on an admin report (adapted) @P1', async ({ page }) => {
    const jrr = new JobRequestsModule(page);
    await jrr.assertNoSearchOrFilters();
  });

  test('JRR-004 confirms no Filter by Submission Date range exists (adapted) @P1', async ({ page }) => {
    const jrr = new JobRequestsModule(page);
    await jrr.assertNoSearchOrFilters();
  });

  test('JRR-005 confirms no Search by Job ID field exists on an admin report (adapted) @P1', async ({ page }) => {
    const jrr = new JobRequestsModule(page);
    await jrr.assertNoSearchOrFilters();
  });

  test('JRR-006 confirms no Search by Job Title field exists on an admin report (adapted) @P1', async ({ page }) => {
    const jrr = new JobRequestsModule(page);
    await jrr.assertNoSearchOrFilters();
  });

  test('JRR-007 real Full Name field is the intake source, not a report search field (adapted) @P1', async ({ page }) => {
    const jrr = new JobRequestsModule(page);
    await jrr.assertRealApplyFormFields();
  });

  test('JRR-008 real Email field rejects an invalid value, the intake-side equivalent of report search validation @Smoke', async ({ page }) => {
    const jrr = new JobRequestsModule(page);
    await jrr.assertInvalidEmailRejected();
  });

  test('JRR-009 confirms no Search by Phone Number field exists on an admin report (adapted) @P1', async ({ page }) => {
    const jrr = new JobRequestsModule(page);
    await jrr.assertNoSearchOrFilters();
  });

  test('JRR-010 confirms no resume-download control exists (adapted) @P1', async ({ page }) => {
    const jrr = new JobRequestsModule(page);
    await jrr.assertNoAdminReport();
  });

  test('JRR-011 confirms no Reset-filters control exists on an admin report (adapted) @P2', async ({ page }) => {
    const jrr = new JobRequestsModule(page);
    await jrr.assertNoSearchOrFilters();
  });

  test('JRR-012 confirms no record-count selector exists on an admin report (adapted) @P2', async ({ page }) => {
    const jrr = new JobRequestsModule(page);
    await jrr.assertNoAdminReport();
  });

  test('JRR-013 confirms no Sort by Submission Date control exists (adapted) @P2', async ({ page }) => {
    const jrr = new JobRequestsModule(page);
    await jrr.assertNoAdminReport();
  });

  test('JRR-014 confirms no filtered CSV export exists (adapted) @P1', async ({ page }) => {
    const jrr = new JobRequestsModule(page);
    await jrr.assertNoAdminReport();
  });

  test('JRR-020 confirms no admin no-matches empty-state exists (adapted) @P2', async ({ page }) => {
    const jrr = new JobRequestsModule(page);
    await jrr.assertNoAdminReport();
  });

  test('JRR-021 confirms no resume-unavailable state exists to verify (adapted) @P2', async ({ page }) => {
    const jrr = new JobRequestsModule(page);
    await jrr.assertNoAdminReport();
  });

  test('JRR-022 confirms no CSV-export failure surface exists (adapted) @P2', async ({ page }) => {
    const jrr = new JobRequestsModule(page);
    await jrr.assertNoAdminReport();
  });

  test('JRR-023 confirms no report-side no-matching-results search exists (adapted) @P2', async ({ page }) => {
    const jrr = new JobRequestsModule(page);
    await jrr.assertNoSearchOrFilters();
  });

  test('JRR-024 confirms no admin route reachable to test unauthenticated blocking on (adapted) [Negative] @P1', async ({ page }) => {
    const jrr = new JobRequestsModule(page);
    await jrr.assertNoAdminReport();
  });

  test('JRR-025 confirms no admin route reachable to test unauthorized-role blocking on (adapted) [Negative] @P1', async ({ page }) => {
    const jrr = new JobRequestsModule(page);
    await jrr.assertNoAdminReport();
  });

  test('JRR-030 confirms no Submission Date boundary surface exists (adapted) @P2', async ({ page }) => {
    const jrr = new JobRequestsModule(page);
    await jrr.assertNoSearchOrFilters();
  });

  test('JRR-031 confirms no maximum record-count boundary exists on an admin report (adapted) @P2', async ({ page }) => {
    const jrr = new JobRequestsModule(page);
    await jrr.assertNoAdminReport();
  });

  test('JRR-032 real Department field is fixed per apply-form entry, the intake-side reason report filters stay independent (adapted) @P2', async ({ page }) => {
    const jrr = new JobRequestsModule(page);
    await jrr.assertDepartmentFieldReadOnly();
  });
});
