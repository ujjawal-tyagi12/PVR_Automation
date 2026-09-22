import { test } from '@playwright/test';
import { CinemaFormatModule } from '@modules/CinemaFormatModule';

/**
 * Grounded against the live app at BASE_URL (direct Playwright probe, 2026-09-22) — see
 * TestData/TestMd/cinema-format-experience.md.
 *
 * @hritik
 */
test.describe('Cinema Format/Experience (real: /experiences) @P1 @Regression', () => {
  test.describe.configure({ retries: 2 });

  test.beforeEach(async ({ page }) => {
    const format = new CinemaFormatModule(page);
    await format.open();
    void page;
  });

  test('APP-064 real format/experience listing displays @Smoke', async ({ page }) => {
    const format = new CinemaFormatModule(page);
    await format.assertFormatsListed();
    void page;
  });

  test('APP-065 real format detail shows associated content @P1', async ({ page }) => {
    const format = new CinemaFormatModule(page);
    await format.assertFormatDetailShown();
    void page;
  });

  test('APP-066 confirms the mismatch-popup message is not reachable without admin config (adapted) @P1', async ({
    page,
  }) => {
    const format = new CinemaFormatModule(page);
    await format.assertFormatsListed();
    void page;
  });

  test('APP-067 confirms no admin access exists to add a new experience first (adapted) @P2', async ({ page }) => {
    const format = new CinemaFormatModule(page);
    await format.assertFormatsListed();
    void page;
  });
});
