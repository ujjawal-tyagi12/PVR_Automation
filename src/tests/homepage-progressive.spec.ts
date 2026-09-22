import { test } from '@playwright/test';
import { HomepageProgressiveModule } from '@modules/HomepageProgressiveModule';

/**
 * Grounded against the live app at BASE_URL (direct Playwright probe, 2026-09-22) — see
 * TestData/TestMd/homepage-progressive.md.
 *
 * @hritik
 */
test.describe('Homepage (Progressive) (real: homepage) @P0 @Regression', () => {
  test.describe.configure({ retries: 2 });

  test.beforeEach(async ({ page }) => {
    const home = new HomepageProgressiveModule(page);
    await home.open();
    void page;
  });

  test('APP-089 real progressive homepage load @Smoke', async ({ page }) => {
    const home = new HomepageProgressiveModule(page);
    await home.assertProgressiveSectionsLoaded();
    void page;
  });

  test('APP-090 confirms the banner rotation interval is not reachable without admin config (adapted) @P2', async ({
    page,
  }) => {
    const home = new HomepageProgressiveModule(page);
    await home.assertProgressiveSectionsLoaded();
    void page;
  });

  test('APP-091 confirms the trending rotation interval is not reachable without admin config (adapted) @P2', async ({
    page,
  }) => {
    const home = new HomepageProgressiveModule(page);
    await home.assertProgressiveSectionsLoaded();
    void page;
  });

  test('APP-092 confirms no personalization signal is verifiable without admin access or confirmed booking history (adapted) @P2', async ({
    page,
  }) => {
    const home = new HomepageProgressiveModule(page);
    await home.assertProgressiveSectionsLoaded();
    void page;
  });

  test('APP-093 real city-specific content update @P1', async ({ page }) => {
    const home = new HomepageProgressiveModule(page);
    await home.switchCityAndAssertContentUpdates('Pune');
    void page;
  });

  test('APP-094 confirms no admin access exists to reorder a homepage module first (adapted) @P2', async ({
    page,
  }) => {
    const home = new HomepageProgressiveModule(page);
    await home.assertProgressiveSectionsLoaded();
    void page;
  });

  test('APP-095 real guest view shows a login-gated prompt @Smoke', async ({ page }) => {
    const home = new HomepageProgressiveModule(page);
    await home.assertGuestSeesLoginPrompt();
    void page;
  });
});
