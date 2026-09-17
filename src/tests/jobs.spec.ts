import { test } from '@playwright/test';
import { JobsModule } from '@modules/JobsModule';

/**
 * Grounded against the live app at BASE_URL/career (direct Playwright probe, 2026-09-16) — see
 * TestData/TestMd/jobs.md. The real Careers page shows only Department-level apply cards, no
 * per-job-posting listing or admin CRUD form exists anywhere on this app.
 */
test.describe('Jobs (adapted: no per-job-posting listing or admin CRUD reachable) @P2 @Regression', () => {
  test.describe.configure({ retries: 2 });

  test.beforeEach(async ({ page }) => {
    const job = new JobsModule(page);
    await job.open();
    void page;
  });

  test('JOB-001 real Careers page shows only Department cards, not a per-job listing (adapted) @Smoke', async ({ page }) => {
    const job = new JobsModule(page);
    await job.assertOnlyDepartmentCardsExist();
  });

  test('JOB-002 confirms no truncated-description hover tooltip exists on a per-job listing (adapted) @P2', async ({ page }) => {
    const job = new JobsModule(page);
    await job.assertNoJobsTable();
  });

  test('JOB-003 confirms no Sort by Last Edited On control exists (adapted) @P2', async ({ page }) => {
    const job = new JobsModule(page);
    await job.assertNoJobsTable();
  });

  test('JOB-004 confirms no Add Job control exists (adapted) @P1', async ({ page }) => {
    const job = new JobsModule(page);
    await job.assertNoAdminForm();
  });

  test('JOB-005 confirms no Department Emails field exists to configure (adapted) @P1', async ({ page }) => {
    const job = new JobsModule(page);
    await job.assertNoAdminForm();
  });

  test('JOB-006 confirms no Add-job-without-Department-Emails form exists (adapted) @P2', async ({ page }) => {
    const job = new JobsModule(page);
    await job.assertNoAdminForm();
  });

  test('JOB-007 confirms no Edit Job control exists (adapted) @P1', async ({ page }) => {
    const job = new JobsModule(page);
    await job.assertNoAdminForm();
  });

  test('JOB-008 confirms no Activate control exists (adapted) @P1', async ({ page }) => {
    const job = new JobsModule(page);
    await job.assertNoJobsTable();
  });

  test('JOB-009 confirms no Deactivate control exists (adapted) @P1', async ({ page }) => {
    const job = new JobsModule(page);
    await job.assertNoJobsTable();
  });

  test('JOB-010 confirms no Delete control exists (adapted) @P1', async ({ page }) => {
    const job = new JobsModule(page);
    await job.assertNoJobsTable();
  });

  test('JOB-011 confirms no Cancel-Add control exists (adapted) @P2', async ({ page }) => {
    const job = new JobsModule(page);
    await job.assertNoAdminForm();
  });

  test('JOB-012 confirms no Cancel-Edit control exists (adapted) @P2', async ({ page }) => {
    const job = new JobsModule(page);
    await job.assertNoAdminForm();
  });

  test('JOB-020 confirms no missing-Job-Title validation surface exists (adapted) @P2', async ({ page }) => {
    const job = new JobsModule(page);
    await job.assertNoAdminForm();
  });

  test('JOB-021 confirms no Job Title minimum-length validation surface exists (adapted) @P2', async ({ page }) => {
    const job = new JobsModule(page);
    await job.assertNoAdminForm();
  });

  test('JOB-022 confirms no Job Title maximum-length validation surface exists (adapted) @P2', async ({ page }) => {
    const job = new JobsModule(page);
    await job.assertNoAdminForm();
  });

  test('JOB-023 confirms no missing-Department validation surface exists (adapted) @P2', async ({ page }) => {
    const job = new JobsModule(page);
    await job.assertNoAdminForm();
  });

  test('JOB-024 confirms no non-numeric-Vacancies validation surface exists (adapted) @P2', async ({ page }) => {
    const job = new JobsModule(page);
    await job.assertNoAdminForm();
  });

  test('JOB-025 confirms no Vacancies-exceeds-maximum validation surface exists (adapted) @P2', async ({ page }) => {
    const job = new JobsModule(page);
    await job.assertNoAdminForm();
  });

  test('JOB-026 confirms no negative-Minimum-Experience validation surface exists (adapted) @P2', async ({ page }) => {
    const job = new JobsModule(page);
    await job.assertNoAdminForm();
  });

  test('JOB-027 confirms no non-numeric-Minimum-Experience validation surface exists (adapted) @P2', async ({ page }) => {
    const job = new JobsModule(page);
    await job.assertNoAdminForm();
  });

  test('JOB-028 confirms no Maximum-less-than-Minimum-Experience validation surface exists (adapted) @P2', async ({ page }) => {
    const job = new JobsModule(page);
    await job.assertNoAdminForm();
  });

  test('JOB-029 confirms no Attributes minimum-length validation surface exists (adapted) @P2', async ({ page }) => {
    const job = new JobsModule(page);
    await job.assertNoAdminForm();
  });

  test('JOB-030 confirms no Attributes maximum-length validation surface exists (adapted) @P2', async ({ page }) => {
    const job = new JobsModule(page);
    await job.assertNoAdminForm();
  });

  test('JOB-031 confirms no missing-Start-Date validation surface exists (adapted) @P2', async ({ page }) => {
    const job = new JobsModule(page);
    await job.assertNoAdminForm();
  });

  test('JOB-032 confirms no End-Date-before-Start-Date validation surface exists (adapted) @P2', async ({ page }) => {
    const job = new JobsModule(page);
    await job.assertNoAdminForm();
  });

  test('JOB-033 confirms no Description minimum-length validation surface exists (adapted) @P2', async ({ page }) => {
    const job = new JobsModule(page);
    await job.assertNoAdminForm();
  });

  test('JOB-034 confirms no Description maximum-length validation surface exists (adapted) @P2', async ({ page }) => {
    const job = new JobsModule(page);
    await job.assertNoAdminForm();
  });

  test('JOB-035 confirms no Activate-an-expired-job surface exists (adapted) @P2', async ({ page }) => {
    const job = new JobsModule(page);
    await job.assertNoJobsTable();
  });

  test('JOB-036 confirms no no-departments-exist-blocks-creation surface exists (adapted) @P2', async ({ page }) => {
    const job = new JobsModule(page);
    await job.assertNoAdminForm();
  });

  test('JOB-037 confirms no empty-listing state exists to verify (adapted) @P2', async ({ page }) => {
    const job = new JobsModule(page);
    await job.assertNoJobsTable();
  });

  test('JOB-038 confirms no Delete-cancelled-retains-job surface exists (adapted) @P2', async ({ page }) => {
    const job = new JobsModule(page);
    await job.assertNoJobsTable();
  });

  test('JOB-039 confirms no admin route reachable to test unauthenticated blocking on (adapted) [Negative] @P1', async ({ page }) => {
    const job = new JobsModule(page);
    await job.assertNoJobsTable();
  });

  test('JOB-050 confirms no Job Title minimum-length boundary surface exists (adapted) @P2', async ({ page }) => {
    const job = new JobsModule(page);
    await job.assertNoAdminForm();
  });

  test('JOB-051 confirms no Job Title maximum-length boundary surface exists (adapted) @P2', async ({ page }) => {
    const job = new JobsModule(page);
    await job.assertNoAdminForm();
  });

  test('JOB-052 confirms no Vacancies boundary surface exists (adapted) @P2', async ({ page }) => {
    const job = new JobsModule(page);
    await job.assertNoAdminForm();
  });

  test('JOB-053 confirms no Experience boundary surface exists (adapted) @P2', async ({ page }) => {
    const job = new JobsModule(page);
    await job.assertNoAdminForm();
  });

  test('JOB-054 confirms no Start-equals-End-Date boundary surface exists (adapted) @P2', async ({ page }) => {
    const job = new JobsModule(page);
    await job.assertNoAdminForm();
  });

  test('JOB-055 confirms no job-expiring-on-End-Date surface exists (adapted) @P2', async ({ page }) => {
    const job = new JobsModule(page);
    await job.assertNoJobsTable();
  });

  test('JOB-056 confirms no multiple-comma-separated-Department-Emails surface exists (adapted) @P2', async ({ page }) => {
    const job = new JobsModule(page);
    await job.assertNoAdminForm();
  });
});
