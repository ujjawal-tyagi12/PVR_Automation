import { test } from '@playwright/test';
import { CitySelectionModule } from '@modules/CitySelectionModule';

/**
 * Grounded against the live app at BASE_URL (direct Playwright probe, 2026-09-22) — see
 * TestData/TestMd/city-selection.md.
 *
 * @hritik
 */
test.describe('City Selection (real: Select Your City dialog) @P0 @Regression', () => {
  test.describe.configure({ retries: 2 });

  test.beforeEach(async ({ page }) => {
    const city = new CitySelectionModule(page);
    await city.open();
    void page;
  });

  test('APP-051 real search-and-select applies the city app-wide @Smoke', async ({ page }) => {
    const city = new CitySelectionModule(page);
    await city.openCityDialog();
    await city.searchAndSelectCity('Pune');
    await city.assertCityAppliedAppWide('Pune');
    void page;
  });

  test('APP-052 real no-results message for an unmatched city search @P2 [Negative]', async ({ page }) => {
    const city = new CitySelectionModule(page);
    await city.openCityDialog();
    await city.searchNonExistentCity();
    await city.assertNoResultsMessageShown();
    void page;
  });

  test('APP-053 real Popular cities quick-select section is shown @P2', async ({ page }) => {
    const city = new CitySelectionModule(page);
    await city.openCityDialog();
    await city.assertPopularCitiesShown();
    void page;
  });

  test('APP-054 real city selection persists across reload @P1', async ({ page }) => {
    const city = new CitySelectionModule(page);
    await city.openCityDialog();
    await city.searchAndSelectCity('Pune');
    await city.assertCityPersistsAcrossReload('Pune');
    void page;
  });

  test('APP-055 real manually selected city wins over auto-detected geolocation on conflict @P2', async ({ page }) => {
    const city = new CitySelectionModule(page);
    await city.openCityDialog();
    await city.searchAndSelectCity('Pune');
    // Geolocation permission is still granted (Mumbai) at reload time — the manual selection
    // winning here is the real, groundable conflict-resolution behavior.
    await city.assertCityPersistsAcrossReload('Pune');
    void page;
  });
});
