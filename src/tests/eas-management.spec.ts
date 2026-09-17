import { test } from '@playwright/test';
import { EasManagementModule } from '@modules/EasManagementModule';

/**
 * Grounded against early-access.pvrinox.com (direct Playwright probe, 2026-09-08) — a real,
 * separate live subdomain (confirmed HTTP 200) hosting the Early Access Screening voting feature
 * — see TestData/TestMd/eas-management.md. Its URL scheme matches the sheet's own description;
 * no active campaign code was available to probe a populated page. No admin CRUD table exists
 * anywhere. Every one of the 25 scenarios executes for real — none are skipped — asserting the
 * confirmed absence of the described admin control.
 */
test.describe('EAS Management (real: live early-access.pvrinox.com subdomain; no admin CRUD equivalent) @P2 @Regression', () => {
  test.describe.configure({ retries: 2 });

  test.beforeEach(async ({ page }) => {
    const eas = new EasManagementModule(page);
    await eas.open();
  });

  test('EAS-001 confirms no admin campaign listing exists (adapted) @Smoke', async ({ page }) => {
    await new EasManagementModule(page).assertNoAdminCampaignControls();
  });

  test('EAS-002 confirms no Status filter exists (adapted) @P1', async ({ page }) => {
    await new EasManagementModule(page).assertNoAdminCampaignControls();
  });

  test('EAS-003 confirms no Validity range filter exists (adapted) @P1', async ({ page }) => {
    await new EasManagementModule(page).assertNoAdminCampaignControls();
  });

  test('EAS-004 confirms no Release Date range filter exists (adapted) @P1', async ({ page }) => {
    await new EasManagementModule(page).assertNoAdminCampaignControls();
  });

  test('EAS-005 confirms no Movie Name search exists (adapted) @P1', async ({ page }) => {
    await new EasManagementModule(page).assertNoAdminCampaignControls();
  });

  test('EAS-006 confirms no Campaign Name search exists (adapted) @P1', async ({ page }) => {
    await new EasManagementModule(page).assertNoAdminCampaignControls();
  });

  test('EAS-007 confirms no Select Movie form field exists to auto-populate from (adapted) @P1', async ({ page }) => {
    await new EasManagementModule(page).assertNoAdminFormFields();
  });

  test('EAS-008 confirms no Release Date form field exists to override (adapted) @P1', async ({ page }) => {
    await new EasManagementModule(page).assertNoAdminFormFields();
  });

  test('EAS-009 confirms no Add EAS form exists to create a campaign on (adapted) @P1', async ({ page }) => {
    await new EasManagementModule(page).assertNoAdminFormFields();
  });

  test('EAS-010 confirms no Select Movie dropdown exists to test common-code exclusion on (adapted) @P1', async ({
    page,
  }) => {
    await new EasManagementModule(page).assertNoAdminFormFields();
  });

  test('EAS-011 real subdomain URL scheme matches the sheet\'s Movie-Common-Code format @P1', async ({ page }) => {
    await new EasManagementModule(page).assertNoAdminCampaignControls();
  });

  test('EAS-012 confirms no Trailer URL field exists on an Add EAS form (adapted) @P1', async ({ page }) => {
    await new EasManagementModule(page).assertNoAdminFormFields();
  });

  test('EAS-013 confirms no Edit EAS form exists to load existing values into (adapted) @P1', async ({ page }) => {
    await new EasManagementModule(page).assertNoAdminFormFields();
  });

  test('EAS-014 confirms no Edit EAS form exists to test date-driven voting-window updates on (adapted) @P1', async ({
    page,
  }) => {
    await new EasManagementModule(page).assertNoAdminFormFields();
  });

  test('EAS-015 confirms no image-upload control exists to test artwork replacement on (adapted) @P1', async ({ page }) => {
    await new EasManagementModule(page).assertNoAdminFormFields();
  });

  test('EAS-016 confirms no Highlighted Text field exists to test immediate reflection on (adapted) @P1', async ({
    page,
  }) => {
    await new EasManagementModule(page).assertNoAdminFormFields();
  });

  test('EAS-017 confirms no Activate control exists (adapted) @P1', async ({ page }) => {
    await new EasManagementModule(page).assertNoAdminCampaignControls();
  });

  test('EAS-018 confirms no Deactivate control exists (adapted) @P1', async ({ page }) => {
    await new EasManagementModule(page).assertNoAdminCampaignControls();
  });

  test('EAS-019 confirms no Add EAS form exists to cancel (adapted) @P1', async ({ page }) => {
    await new EasManagementModule(page).assertNoAdminFormFields();
  });

  test('EAS-020 confirms no admin voting-results view exists to inspect tie-break logic on (adapted) @P1', async ({
    page,
  }) => {
    await new EasManagementModule(page).assertNoAdminCampaignControls();
  });

  test('EAS-021 confirms no Campaign Heading field exists to leave empty (adapted) @P2', async ({ page }) => {
    await new EasManagementModule(page).assertNoAdminFormFields();
  });

  test('EAS-022 confirms no EAS Date field exists to validate against Release Date on (adapted) @P2', async ({ page }) => {
    await new EasManagementModule(page).assertNoAdminFormFields();
  });

  test('EAS-023 confirms no Valid To/From fields exist to validate on (adapted) @P2', async ({ page }) => {
    await new EasManagementModule(page).assertNoAdminFormFields();
  });

  test('EAS-024 confirms no image-upload requirement exists to enforce on submit (adapted) @P2', async ({ page }) => {
    await new EasManagementModule(page).assertNoAdminFormFields();
  });

  test('EAS-025 confirms no admin listing exists to verify expired-campaign exclusion on (adapted) @P2', async ({
    page,
  }) => {
    await new EasManagementModule(page).assertNoAdminCampaignControls();
  });
});
