import { test } from '@playwright/test';
import { SplashScreenModule } from '@modules/SplashScreenModule';

/**
 * Grounded against the live app at BASE_URL (direct Playwright probe, 2026-09-21) — see
 * TestData/TestMd/splash-screen.md. No web equivalent of the native app-store version-gate
 * concept exists on this app; the one Web-tagged sheet row is adapted to confirm that absence
 * directly rather than skipped.
 *
 * @hritik
 */
test.describe('Splash Screen (adapted: no web version-gate concept exists) @P2 @Regression', () => {
  test.describe.configure({ retries: 2 });

  test.beforeEach(async ({ page }) => {
    const splash = new SplashScreenModule(page);
    await splash.open();
    void page;
  });

  test('APP-007 confirms no version-gate/update-prompt concept exists on the web platform (adapted) @Smoke', async ({ page }) => {
    const splash = new SplashScreenModule(page);
    await splash.assertNoVersionGate();
  });
});
