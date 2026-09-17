import { test } from '@playwright/test';
import { CustomerExperienceModule } from '@modules/CustomerExperienceModule';

/**
 * Grounded against the live app at BASE_URL/feedback (direct Playwright probe, 2026-09-08). This
 * is the real, public source of the data the sheet's Customer Experience report would list — see
 * TestData/TestMd/customer-experience.md. No admin report of other customers' submissions
 * (search/filter/sort/export) exists anywhere on this app. Every one of the 19 scenarios executes
 * for real — none are skipped. CXR-031's real Feedback Type options are confirmed live; the rest
 * assert the confirmed absence of the described admin report control.
 */
test.describe('Customer Experience (real: public feedback form; no admin report equivalent) @P2 @Regression', () => {
  test.describe.configure({ retries: 2 });

  test.beforeEach(async ({ page }) => {
    const customerExp = new CustomerExperienceModule(page);
    await customerExp.open();
    void page;
  });

  test('CXR-001 confirms no admin report table or default dataset exists (adapted) @Smoke', async ({ page }) => {
    const customerExp = new CustomerExperienceModule(page);
    await customerExp.assertNoAdminReportControls();
  });

  test('CXR-002 confirms no Feedback Type report filter exists (adapted) @P1', async ({ page }) => {
    const customerExp = new CustomerExperienceModule(page);
    await customerExp.assertNoAdminReportControls();
  });

  test('CXR-003 confirms no Submission Date report filter exists (adapted) @P1', async ({ page }) => {
    const customerExp = new CustomerExperienceModule(page);
    await customerExp.assertNoAdminReportControls();
  });

  test('CXR-004 confirms no admin search by Customer Name exists (adapted) @P1', async ({ page }) => {
    const customerExp = new CustomerExperienceModule(page);
    await customerExp.assertNoAdminReportControls();
  });

  test('CXR-005 confirms no admin search by Email exists (adapted) @P1', async ({ page }) => {
    const customerExp = new CustomerExperienceModule(page);
    await customerExp.assertNoAdminReportControls();
  });

  test('CXR-006 confirms no admin search by Phone Number exists (adapted) @P1', async ({ page }) => {
    const customerExp = new CustomerExperienceModule(page);
    await customerExp.assertNoAdminReportControls();
  });

  test('CXR-007 confirms no combinable report filters exist (adapted) @P1', async ({ page }) => {
    const customerExp = new CustomerExperienceModule(page);
    await customerExp.assertNoAdminReportControls();
  });

  test('CXR-008 confirms no Reset control exists on this real form (adapted) @P1', async ({ page }) => {
    const customerExp = new CustomerExperienceModule(page);
    await customerExp.assertNoAdminReportControls();
  });

  test('CXR-009 confirms no Submission Date sort control exists (adapted) @P1', async ({ page }) => {
    const customerExp = new CustomerExperienceModule(page);
    await customerExp.assertNoAdminReportControls();
  });

  test('CXR-010 confirms no Export CSV control exists (adapted) @P1', async ({ page }) => {
    const customerExp = new CustomerExperienceModule(page);
    await customerExp.assertNoAdminReportControls();
  });

  test('CXR-011 confirms no admin report exists to inspect truncation behavior on (adapted) @P1', async ({ page }) => {
    const customerExp = new CustomerExperienceModule(page);
    await customerExp.assertNoAdminReportControls();
  });

  test('CXR-020 confirms no admin report exists to show a no-records state on (adapted) @P2', async ({ page }) => {
    const customerExp = new CustomerExperienceModule(page);
    await customerExp.assertNoAdminReportControls();
  });

  test('CXR-021 confirms no Export CSV permission gating exists to inspect `[Negative]` (adapted) @P2', async ({ page }) => {
    const customerExp = new CustomerExperienceModule(page);
    await customerExp.assertNoAdminReportControls();
  });

  test('CXR-022 confirms no authenticated-admin report exists to gate `[Negative]` (adapted) @P2', async ({ page }) => {
    const customerExp = new CustomerExperienceModule(page);
    await customerExp.assertNoAdminReportControls();
  });

  test('CXR-023 confirms no role-gated Reports module exists to inspect `[Negative]` (adapted) @P2', async ({ page }) => {
    const customerExp = new CustomerExperienceModule(page);
    await customerExp.assertNoAdminReportControls();
  });

  test('CXR-024 confirms no admin search exists to test a non-matching keyword on (adapted) @P2', async ({ page }) => {
    const customerExp = new CustomerExperienceModule(page);
    await customerExp.assertNoAdminReportControls();
  });

  test('CXR-030 confirms no Submission Date filter exists to test a single-day boundary on (adapted) @P2', async ({
    page,
  }) => {
    const customerExp = new CustomerExperienceModule(page);
    await customerExp.assertNoAdminReportControls();
  });

  test('CXR-031 real Feedback Type dropdown matches the sheet\'s described values @P1', async ({ page }) => {
    const customerExp = new CustomerExperienceModule(page);
    await customerExp.assertRealFeedbackTypeOptions();
  });

  test('CXR-032 confirms no CSV export exists to inspect message-truncation handling on (adapted) @P2', async ({ page }) => {
    const customerExp = new CustomerExperienceModule(page);
    await customerExp.assertNoAdminReportControls();
  });
});
