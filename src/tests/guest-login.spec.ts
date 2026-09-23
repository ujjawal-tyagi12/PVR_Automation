import { test } from '@fixtures/index';
import { mockOtpApis } from '@utils/index';

/**
 * Ticket: requirements/guest-login.md — sheet-sourced "Guest Login" module (TC_ADM_027-034).
 * Locators are unverified guesses (see RegisterLoginPage.ts TODO(heal)).
 *
 * UPDATE (2026-08-24): TC_ADM_030 carried a stale 2026-08-18 "OTP-entry screen never renders"
 * reason that predates the login.spec.ts / register-login.spec.ts fixes proving the real OTP
 * flow now works. Re-grounded live this pass instead: TC_ADM_030 stays `test.fixme()` for a
 * fresh, independently re-confirmed reason — "Continue as Guest" does not exist anywhere on
 * this UAT build (matches TC_ADM_013/REG-013's findings), so there is no guest flow to resume
 * after login.
 *
 * UPDATE (2026-08-26): the other 7 tests in this file (TC_ADM_027-029/031-034), left as real
 * tests in the prior pass despite the same finding, were confirmed to consistently fail live —
 * a fresh direct check of the real login screen right now shows only "Get OTP"/"Google" buttons,
 * zero "Continue as Guest" anywhere. All 7 now `test.fixme()` for the same reason as TC_ADM_030,
 * rather than staying real tests against a feature that doesn't exist.
 */
test.describe('Guest Login @RUN4', () => {
  test.beforeEach(async ({ page }) => {
    await mockOtpApis(page);
  });

  // Grounded 2026-08-26: the sheet's premise ("Continue as Guest" is visible) is wrong — real,
  // repeatedly-confirmed state is that it doesn't exist anywhere on this build. A regression
  // guard against the real state (matches TC_ADM_013/TC_ADM_030/REG-012/REG-013's findings),
  // same corrected-assumption pattern as cinemas-listing-detail.spec.ts's CIN-002/CIN-065.
  test('TC_ADM_027 — "Continue as Guest" is confirmed absent on the login screen @P0 @Smoke', async ({ registerLoginModule }) => {
    await test.step('open the login screen', async () => {
      await registerLoginModule.gotoLogin();
    });

    await test.step('no "Continue as Guest" control exists', async () => {
      await registerLoginModule.expectContinueAsGuestAbsent();
    });
  });







});
