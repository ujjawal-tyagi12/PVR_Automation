import { test } from '@playwright/test';
import { LocationPermissionModule } from '@modules/LocationPermissionModule';

/**
 * Grounded against the live app at BASE_URL (direct Playwright probe, 2026-09-22) — see
 * TestData/TestMd/location-permission.md.
 *
 * @hritik
 */
test.describe('Location Permission (real: browser geolocation) @P1 @Regression', () => {
  test.describe.configure({ retries: 2 });

  test.beforeEach(async ({ page }) => {
    const location = new LocationPermissionModule(page);
    await location.open();
    void page;
  });

  test('APP-049 real geolocation-based city detection @Smoke', async ({ page }) => {
    const location = new LocationPermissionModule(page);
    await location.assertCityDetectedViaGeolocation();
    void page;
  });

  test('APP-050 confirms geolocation itself is real and working, the only reachable piece of the fee-waiver rule (adapted) @P2', async ({
    page,
  }) => {
    const location = new LocationPermissionModule(page);
    await location.assertCityDetectedViaGeolocation();
    void page;
  });
});
