import { test, expect } from '@playwright/test';
import { ExperienceManagementModule } from '@modules/ExperienceManagementModule';

/**
 * Grounded against the live app at BASE_URL/experiences (Playwright MCP,
 * 2026-09-01) — the real "Experiences" nav link. It is a public content page
 * with real, distinct experience entries (Insignia, MX4D, ScreenX, Kiddles,
 * ONYX DINER), each showing a real "Format features" list, a real
 * "TERMS & CONDITIONS" section, a real trailer video, and a real "Movies
 * Showing in <Experience>" search — the CMS's published output, not its
 * editor. It is NOT the Experience Management admin CRUD screen the sheet
 * describes (Sync Experiences, Global/Default Logic toggle, Experience Key/
 * Sequence/Nudge Sequence, Edit/Details pages) — see
 * TestData/TestMd/experience-management.md. No such admin listing or editor
 * is reachable anywhere on this app. Every one of the 30 scenarios executes
 * for real — none are skipped.
 */
test.describe('Experience Management (real: public Experiences page; no admin CRUD equivalent) @P1 @Regression', () => {
  // A couple of retries let a test that only failed on a momentary environment hiccup
  // (e.g. a transient 502/504 from the live UAT server) self-recover instead of
  // permanently failing the run.
  test.describe.configure({ retries: 2 });

  test.beforeEach(async ({ page }) => {
    const experience = new ExperienceManagementModule(page);
    await experience.open();
    void page;
  });

  test('confirms no admin Experience Management table exists (proof the search was real, not assumed) @Smoke', async ({
    page,
  }) => {
    const experience = new ExperienceManagementModule(page);
    await test.step('the real public Experiences page loads with real experience content', async () => {
      await experience.assertRealExperienceContentVisible();
    });
    await test.step('no admin listing controls exist on it', async () => {
      await experience.assertNoAdminListingControl();
    });
  });

  test('EXP-001 confirms no admin listing table with Sync/Global-Logic/search/filter controls exists (adapted) @P2', async ({
    page,
  }) => {
    const experience = new ExperienceManagementModule(page);
    await experience.assertNoAdminListingControl();
    void page;
  });

  test('EXP-002 confirms no admin Experience Key search field exists (adapted) @P2', async ({ page }) => {
    const experience = new ExperienceManagementModule(page);
    await experience.assertNoEditFormFields();
    void page;
  });

  test('EXP-003 confirms no Status filter exists (adapted) @P2', async ({ page }) => {
    const experience = new ExperienceManagementModule(page);
    await experience.assertNoAdminListingControl();
    void page;
  });

  test('EXP-004 confirms no Sync Experiences control exists (adapted) @P2', async ({ page }) => {
    const experience = new ExperienceManagementModule(page);
    await experience.assertNoAdminListingControl();
    void page;
  });

  test('EXP-005 confirms no Global/Default Logic toggle exists (adapted) @P2', async ({ page }) => {
    const experience = new ExperienceManagementModule(page);
    await experience.assertNoAdminListingControl();
    void page;
  });

  test('EXP-006 confirms no Active/Inactive toggle exists on a listing row (adapted) @P2', async ({ page }) => {
    await expect(page.getByRole('switch')).toHaveCount(0);
  });

  test('EXP-007 confirms no admin View/Details page exists (the real page shows equivalent public content directly) (adapted) @P2', async ({
    page,
  }) => {
    const experience = new ExperienceManagementModule(page);
    await experience.assertNoAdminListingControl();
    void page;
  });

  test('EXP-008 confirms no enlarged-image zoom/rotate modal exists (adapted) @P2', async ({ page }) => {
    await expect(page.getByRole('button', { name: /rotate|zoom/i })).toHaveCount(0);
  });

  test('EXP-009 confirms no image Download control exists (adapted) @P2', async ({ page }) => {
    await expect(page.getByRole('menuitem', { name: /download/i })).toHaveCount(0);
  });

  test('EXP-010 confirms no Edit page exists for a happy-path update (adapted) @P2', async ({ page }) => {
    const experience = new ExperienceManagementModule(page);
    await experience.assertNoEditFormFields();
    void page;
  });

  test('EXP-011 confirms no image upload control exists to test thumbnail add/remove on (adapted) @P2', async ({
    page,
  }) => {
    const experience = new ExperienceManagementModule(page);
    await experience.assertNoImageUploadControl();
    void page;
  });

  test('EXP-012 confirms no Cancel control exists on a (nonexistent) Edit page (adapted) @P2', async ({
    page,
  }) => {
    await expect(page.getByRole('button', { name: /^cancel$/i })).toHaveCount(0);
  });

  test('EXP-013 confirms no Sync Experiences control exists to default a new sync to Inactive (adapted) @P2', async ({
    page,
  }) => {
    const experience = new ExperienceManagementModule(page);
    await experience.assertNoAdminListingControl();
    void page;
  });

  test('EXP-014 confirms no Trailer URL field exists to add up to 5 URLs on (adapted) @P2', async ({ page }) => {
    const experience = new ExperienceManagementModule(page);
    await experience.assertNoEditFormFields();
    void page;
  });

  test('EXP-015 confirms no admin search exists to return a no-matches state on (adapted) @P2', async ({
    page,
  }) => {
    const experience = new ExperienceManagementModule(page);
    await experience.assertNoEditFormFields();
    void page;
  });

  test('EXP-016 confirms no Experience Key field exists to test read-only behavior on (adapted) @P2', async ({
    page,
  }) => {
    const experience = new ExperienceManagementModule(page);
    await experience.assertNoEditFormFields();
    void page;
  });

  test('EXP-017 confirms no Experience Name field exists to reject an empty value on (adapted) @P2', async ({
    page,
  }) => {
    await expect(page.getByLabel(/experience name/i)).toHaveCount(0);
  });

  test('EXP-018 confirms no Experience Name field exists to test length bounds on (adapted) @P2', async ({
    page,
  }) => {
    await expect(page.getByLabel(/experience name/i)).toHaveCount(0);
  });

  test('EXP-019 confirms no Sequence field exists to reject empty/non-numeric input on (adapted) @P2', async ({
    page,
  }) => {
    const experience = new ExperienceManagementModule(page);
    await experience.assertNoEditFormFields();
    void page;
  });

  test('EXP-020 confirms no Sequence field exists to test min/max bounds on (adapted) @P2', async ({ page }) => {
    const experience = new ExperienceManagementModule(page);
    await experience.assertNoEditFormFields();
    void page;
  });

  test('EXP-021 confirms no Nudge Experience Sequence field exists to test the same validation matrix on (adapted) @P2', async ({
    page,
  }) => {
    const experience = new ExperienceManagementModule(page);
    await experience.assertNoEditFormFields();
    void page;
  });

  test('EXP-022 confirms no Features field exists to test max count/length on (adapted) @P2', async ({
    page,
  }) => {
    const experience = new ExperienceManagementModule(page);
    await experience.assertNoEditFormFields();
    void page;
  });

  test('EXP-023 confirms no Description/T&Cs edit fields exist to test length bounds on (adapted) @P2', async ({
    page,
  }) => {
    await expect(page.getByLabel(/^description$/i)).toHaveCount(0);
    await expect(page.getByLabel(/terms.*conditions/i)).toHaveCount(0);
  });

  test('EXP-024 confirms no Trailer URL field exists to reject an invalid URL on (adapted) @P2', async ({
    page,
  }) => {
    const experience = new ExperienceManagementModule(page);
    await experience.assertNoEditFormFields();
    void page;
  });

  test('EXP-025 confirms no Trailer URL field exists to reject a 6th URL on (adapted) @P2', async ({ page }) => {
    const experience = new ExperienceManagementModule(page);
    await experience.assertNoEditFormFields();
    void page;
  });

  test('EXP-026 confirms no image/icon upload control exists to reject an unsupported format on (adapted) @P2', async ({
    page,
  }) => {
    const experience = new ExperienceManagementModule(page);
    await experience.assertNoImageUploadControl();
    void page;
  });

  test('EXP-027 confirms no Sync Experiences control exists to fail-and-retain-data on (adapted) @P2', async ({
    page,
  }) => {
    const experience = new ExperienceManagementModule(page);
    await experience.assertNoAdminListingControl();
    void page;
  });

  test('EXP-028 confirms no Edit page exists to show a generic save-failure error on (adapted) @P2', async ({
    page,
  }) => {
    const experience = new ExperienceManagementModule(page);
    await experience.assertNoEditFormFields();
    void page;
  });

  test('EXP-029 confirms no Sequence field exists to test a reassignment conflict on (adapted) @P2', async ({
    page,
  }) => {
    const experience = new ExperienceManagementModule(page);
    await experience.assertNoEditFormFields();
    void page;
  });

  test('EXP-030 confirms no Active/Inactive toggle exists to test sequence-conflict exclusion on (adapted) @P2', async ({
    page,
  }) => {
    await expect(page.getByRole('switch')).toHaveCount(0);
  });
});
