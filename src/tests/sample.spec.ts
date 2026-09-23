import { test, expect } from '@fixtures/index';
import { DataGenerator } from '@utils/DataGenerator';

/**
 * Grounded 2026-08-26: this is the framework's original scaffold reference (per CLAUDE.md's
 * "Keep the Sample* starter files as reference/until the first real feature is added") — a
 * generic Username/Password/"Log in" form (SamplePage.ts), not anything from the real PVR
 * product, which uses phone-number + OTP everywhere (see RegisterLoginPage.ts). It navigates to
 * the real baseURL and predictably times out waiting for a `getByLabel('Username')` field that
 * doesn't exist on this site. 17 real spec files now cover real features — this failure is a
 * known, harmless scaffold/product mismatch, not a real product regression. Left as a real test
 * (rather than `test.fixme()`) only because a file with zero real tests fails this repo's own
 * `content-spec-test-step` rule — converting it would trade one known-cosmetic failure for a
 * rules violation.
 */
test.describe('Sample login flow @P0 @Smoke', () => {
  test('user can log in with valid credentials', async ({ sampleModule, page }) => {
    await test.step('log in with valid credentials', async () => {
      await sampleModule.loginAs(DataGenerator.randomIndianPhoneNumber(), '12345');
    });

    await test.step('welcome heading is visible', async () => {
      await sampleModule.expectLoggedIn();
    });

    await expect(page).toHaveURL(/.+/);
  });
});
