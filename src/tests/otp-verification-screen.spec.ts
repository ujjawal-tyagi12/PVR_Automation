import { test } from '@playwright/test';
import { OtpVerificationModule } from '@modules/OtpVerificationModule';

/**
 * Grounded against the live app at BASE_URL (direct Playwright probe, 2026-09-21) — see
 * TestData/TestMd/otp-verification-screen.md. The real OTP surface is the header account-icon
 * → Login "Verify Phone Number" dialog, the same dialog already grounded for
 * admin-login.spec.ts / register-login-screens.spec.ts.
 *
 * @hritik
 */
test.describe('OTP Verification Screen (real: phone+OTP dialog) @P0 @Regression', () => {
  test.describe.configure({ retries: 2 });

  test.beforeEach(async ({ page }) => {
    const otp = new OtpVerificationModule(page);
    await otp.open();
    void page;
  });

  test('APP-026 real correct-OTP verification proceeds to the registration screen @Smoke', async ({ page }) => {
    const otp = new OtpVerificationModule(page);
    await otp.requestOtpForFreshNumber();
    await otp.enterCorrectOtpAndAssertProceeds();
    void page;
  });

  test('APP-027 real incorrect-OTP entry is rejected with a clear error @Smoke', async ({ page }) => {
    const otp = new OtpVerificationModule(page);
    await otp.requestOtpForFreshNumber();
    await otp.enterIncorrectOtpAndAssertRejected();
    void page;
  });

  test('APP-028 confirms no distinct OTP-expired message exists beyond the generic invalid-OTP error (adapted) @P1', async ({
    page,
  }) => {
    const otp = new OtpVerificationModule(page);
    await otp.requestOtpForFreshNumber();
    await otp.assertNoDistinctExpiryMessageExists();
    void page;
  });

  test('APP-029 real resend stays disabled with a countdown during cooldown @Smoke', async ({ page }) => {
    const otp = new OtpVerificationModule(page);
    await otp.requestOtpForFreshNumber();
    await otp.assertResendDisabledDuringCooldown();
    void page;
  });

  test('APP-030 real resend succeeds once the cooldown elapses @P1', async ({ page }) => {
    test.setTimeout(150000);
    const otp = new OtpVerificationModule(page);
    await otp.requestOtpForFreshNumber();
    await otp.resendAfterCooldownSucceeds();
    void page;
  });

  test('APP-031 real repeated OTP requests get throttled @P1', async ({ page }) => {
    const otp = new OtpVerificationModule(page);
    const phone = await otp.requestOtpForFreshNumber();
    await otp.assertRepeatedOtpRequestsGetThrottled(phone);
  });

  test('APP-033 real OTP field restricts input to numeric, 6-digit entry @P2', async ({ page }) => {
    const otp = new OtpVerificationModule(page);
    await otp.requestOtpForFreshNumber();
    await otp.assertOtpFieldRestrictsInput();
    void page;
  });
});
