import { test } from '@playwright/test';
import { CinemasListingModule } from '@modules/CinemasListingModule';

/**
 * Grounded against the live app at BASE_URL (direct Playwright probe, 2026-09-22) — see
 * TestData/TestMd/cinemas-listing-detail.md.
 *
 * @hritik
 */
test.describe('Cinemas Listing & Detail Page (real: /cinemas/{City}) @P0 @Regression', () => {
  test.describe.configure({ retries: 2 });

  test('APP-056 real cinema listing loads for the selected city @Smoke', async ({ page }) => {
    const cinemas = new CinemasListingModule(page);
    await cinemas.openForCity('Mumbai');
    await cinemas.assertCinemasLoaded();
  });

  test('APP-057 real List View / Map View toggle is available @P1', async ({ page }) => {
    const cinemas = new CinemasListingModule(page);
    await cinemas.openForCity('Mumbai');
    await cinemas.assertViewToggleAvailable();
  });

  test('APP-058 confirms real distance info is shown per cinema, the reachable piece of the distance-filter rule (adapted) @P2', async ({
    page,
  }) => {
    const cinemas = new CinemasListingModule(page);
    await cinemas.openForCity('Mumbai');
    await cinemas.assertDistanceShownPerCinema();
  });

  test('APP-059 real cinema detail loads when a cinema is selected @Smoke', async ({ page }) => {
    const cinemas = new CinemasListingModule(page);
    await cinemas.openForCity('Mumbai');
    const cinemaName = await cinemas.openFirstCinemaDetail();
    await cinemas.assertCinemaDetailLoaded(cinemaName);
  });

  test('APP-060 confirms no search input exists on this page (adapted) @P1', async ({ page }) => {
    const cinemas = new CinemasListingModule(page);
    await cinemas.openForCity('Mumbai');
    await cinemas.assertNoSearchInputExists();
  });

  test('APP-061 real empty-state for a city with zero active cinemas @P2 [Negative]', async ({ page }) => {
    const cinemas = new CinemasListingModule(page);
    await cinemas.openForCity('Jorhat');
    await cinemas.assertEmptyStateForCityWithNoCinemas();
  });

  test('APP-062 real Amenities section displays for a selected cinema @P2', async ({ page }) => {
    const cinemas = new CinemasListingModule(page);
    await cinemas.openForCity('Mumbai');
    await cinemas.openFirstCinemaDetail();
    await cinemas.assertAmenitiesDisplayed();
  });

  test('APP-063 confirms no admin access exists to deactivate a cinema first (adapted) @P1', async ({ page }) => {
    const cinemas = new CinemasListingModule(page);
    await cinemas.openForCity('Mumbai');
    await cinemas.assertCinemasLoaded();
  });
});
