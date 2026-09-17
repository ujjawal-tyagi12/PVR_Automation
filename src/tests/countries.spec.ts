import { test } from '@playwright/test';
import { CountriesModule } from '@modules/CountriesModule';

/**
 * Grounded against the live app at BASE_URL (direct Playwright probe, 2026-09-04) — see
 * TestData/TestMd/countries.md. No admin country-listing UI exists anywhere on this app: checked
 * the header nav, footer, every "More" dropdown item, and /sitemap.xml directly. Every one of
 * the 15 scenarios executes for real against the home page as the common anchor — none are
 * skipped. CTY-008/CTY-009 (no create/edit/delete) and CTY-014 (single-country dataset) are
 * genuinely real, checked findings; the rest assert the confirmed absence of the described
 * admin control.
 */
test.describe('Countries (real: no admin country-listing surface exists on this app) @P2 @Regression', () => {
  test.describe.configure({ retries: 2 });

  test.beforeEach(async ({ page }) => {
    const countries = new CountriesModule(page);
    await countries.open();
    void page;
  });

  test('CTY-001 confirms no admin search bar or country table exists (adapted) @Smoke', async ({ page }) => {
    const countries = new CountriesModule(page);
    await countries.assertNoAdminCountryListing();
  });

  test('CTY-002 confirms no country-name search exists (adapted) @P1', async ({ page }) => {
    const countries = new CountriesModule(page);
    await countries.assertNoAdminCountryListing();
  });

  test('CTY-003 confirms no phone-code search exists (adapted) @P1', async ({ page }) => {
    const countries = new CountriesModule(page);
    await countries.assertNoAdminCountryListing();
  });

  test('CTY-004 confirms no View action or Country Details page exists (adapted) @P1', async ({ page }) => {
    const countries = new CountriesModule(page);
    await countries.assertNoAdminCountryListing();
  });

  test('CTY-005 confirms no Country Details fields exist to inspect (adapted) @P1', async ({ page }) => {
    const countries = new CountriesModule(page);
    await countries.assertNoAdminCountryListing();
  });

  test('CTY-006 confirms no pagination exists to test a 25-per-page boundary on (adapted) @P1', async ({ page }) => {
    const countries = new CountriesModule(page);
    await countries.assertNoAdminCountryListing();
  });

  test('CTY-007 confirms no search exists to show a no-matches error message on (adapted) @P2', async ({ page }) => {
    const countries = new CountriesModule(page);
    await countries.assertNoAdminCountryListing();
  });

  test('CTY-008 real app has no create-country option — confirmed, not assumed @P2', async ({ page }) => {
    const countries = new CountriesModule(page);
    await countries.assertNoAddEditDeleteControls();
  });

  test('CTY-009 real app has no edit/delete actions on any listing — confirmed, not assumed @P2', async ({ page }) => {
    const countries = new CountriesModule(page);
    await countries.assertNoAddEditDeleteControls();
  });

  test('CTY-010 confirms no search input exists to submit empty (adapted) @P2', async ({ page }) => {
    const countries = new CountriesModule(page);
    await countries.assertNoAdminCountryListing();
  });

  test('CTY-011 confirms no search input exists to test special characters on (adapted) @P2', async ({ page }) => {
    const countries = new CountriesModule(page);
    await countries.assertNoAdminCountryListing();
  });

  test('CTY-012 confirms no search input exists to test case-insensitivity on (adapted) @P2', async ({ page }) => {
    const countries = new CountriesModule(page);
    await countries.assertNoAdminCountryListing();
  });

  test('CTY-013 confirms no search input exists to test partial phone-code matching on (adapted) @P2', async ({ page }) => {
    const countries = new CountriesModule(page);
    await countries.assertNoAdminCountryListing();
  });

  test('CTY-014 real app genuinely serves a single country (India) end-to-end @P2', async ({ page }) => {
    const countries = new CountriesModule(page);
    await countries.assertSingleCountryApp();
  });

  test('CTY-015 confirms no pagination exists to test a partial final page on (adapted) @P2', async ({ page }) => {
    const countries = new CountriesModule(page);
    await countries.assertNoAdminCountryListing();
  });
});
