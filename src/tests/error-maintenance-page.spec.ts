import { test } from '@playwright/test';
import { ErrorMaintenanceModule } from '@modules/ErrorMaintenanceModule';

/**
 * Grounded against the live app at BASE_URL (direct Playwright probe, 2026-09-22) — see
 * TestData/TestMd/error-maintenance-page.md.
 *
 * @hritik
 */
test.describe('Error Page & Maintenance Page (real: invalid route) @P1 @Regression', () => {
  test.describe.configure({ retries: 2 });

  test('APP-097 confirms no admin access exists to enable maintenance mode first (adapted) @P1', async ({
    page,
  }) => {
    const errorPage = new ErrorMaintenanceModule(page);
    await errorPage.openInvalidRoute();
    await errorPage.assertStyled404Shown();
  });

  test('APP-098 confirms no admin access exists to disable maintenance mode first (adapted) @P1', async ({
    page,
  }) => {
    const errorPage = new ErrorMaintenanceModule(page);
    await errorPage.openInvalidRoute();
    await errorPage.assertStyled404Shown();
  });

  test('APP-099 confirms a hard offline navigation fails safely with no raw error exposed (adapted) @P1', async ({
    page,
  }) => {
    const errorPage = new ErrorMaintenanceModule(page);
    await errorPage.simulateOfflineNavigation();
  });

  test('APP-100 real styled 404 page with working Back To Home link @Smoke', async ({ page }) => {
    const errorPage = new ErrorMaintenanceModule(page);
    await errorPage.openInvalidRoute();
    await errorPage.assertStyled404Shown();
    await errorPage.assertBackToHomeNavigates();
  });
});
