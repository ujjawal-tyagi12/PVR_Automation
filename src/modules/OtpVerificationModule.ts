import { Page, expect } from '@playwright/test';
import { OtpVerificationPage } from '@pages/OtpVerificationPage';
import { AdminLoginModule, randomPhoneNumber, VALID_OTP } from '@modules/AdminLoginModule';
import { WaitHelper } from '@utils/WaitHelper';
import { Logger } from '@utils/Logger';

/**
 * Orchestrates the real, public phone+OTP dialog for the OTP Verification Screen sheet module.
 * Composes AdminLoginModule (read-only — no changes to it) for the shared OTP mechanics already
 * proven live there, instead of re-grounding the same dialog a second time.
 *
 * @hritik
 */
export class OtpVerificationModule {
  private otpPage: OtpVerificationPage;
  private adminLogin: AdminLoginModule;

  constructor(private page: Page) {
    this.otpPage = new OtpVerificationPage(page);
    this.adminLogin = new AdminLoginModule(page);
  }

  async open(): Promise<void> {
    Logger.info('Opening the home page');
    await this.adminLogin.open();
  }

  async requestOtpForFreshNumber(): Promise<string> {
    const phone = randomPhoneNumber();
    Logger.info(`Requesting OTP for fresh number ${phone}`);
    await this.adminLogin.requestOtp(phone);
    return phone;
  }

  async enterCorrectOtpAndAssertProceeds(): Promise<void> {
    await this.adminLogin.enterOtp(VALID_OTP);
    // A fresh number always proceeds to the real registration screen on successful
    // verification — the groundable "next step" signal for a brand-new number.
    await expect(this.page.getByRole('heading', { name: "Let's get to know you better!" })).toBeVisible({
      timeout: 20000,
    });
  }

  async enterIncorrectOtpAndAssertRejected(): Promise<void> {
    await this.adminLogin.enterOtp('000000');
    await expect(this.otpPage.invalidOtpText()).toBeVisible({ timeout: 10000 });
  }

  /** Grounded 2026-09-21: the real configured OTP validity duration (Admin > Global
   * Configuration) isn't reachable without admin access, and the UAT bypass code doesn't follow
   * normal expiry rules anyway, so waiting out a real expiry isn't practically groundable here.
   * The closest real, confirmed signal: the app shows one generic invalid-OTP message for any
   * wrong entry, with no distinct "OTP expired" message observed anywhere live. */
  async assertNoDistinctExpiryMessageExists(): Promise<void> {
    await this.adminLogin.enterOtp('111111');
    await expect(this.otpPage.invalidOtpText()).toBeVisible({ timeout: 10000 });
    await expect(this.otpPage.expiredOtpText()).toHaveCount(0);
  }

  async assertResendDisabledDuringCooldown(): Promise<void> {
    await this.adminLogin.assertResendDisabled();
  }

  async resendAfterCooldownSucceeds(): Promise<void> {
    await this.adminLogin.resendOtp();
  }

  /** Grounded 2026-09-21 via direct probe: after a few repeated Get OTP requests for the same
   * number, the button disables with a real throttle message — "OTP already sent. Try again
   * after 1 minute" — the real, reachable spam-prevention signal on this app (observed after 3
   * requests; the sheet's own "maximum requests" framing matches this real throttle). */
  async assertRepeatedOtpRequestsGetThrottled(phone: string): Promise<void> {
    // Grounded 2026-09-21 (real failure on an automated run): a click on Get OTP during the
    // throttle window doesn't visibly disable the button first — it just re-shows "OTP already
    // sent..." on the same phone-entry screen without navigating anywhere. The message text
    // itself, not button-enabled state, is the real throttle signal.
    for (let i = 0; i < 5; i += 1) {
      if (await this.otpPage.editPhoneNumberLink().isVisible().catch(() => false)) {
        await this.otpPage.editPhoneNumberLink().click();
      }
      if (await this.otpPage.otpAlreadySentText().isVisible().catch(() => false)) break;
      Logger.info(`Requesting OTP attempt ${i + 1} for ${phone}`);
      await this.otpPage.getOtpButton().click();
      await WaitHelper.forCondition(async () => {
        const onOtpScreen = await this.page
          .getByRole('heading', { name: 'Verify Phone Number' })
          .isVisible()
          .catch(() => false);
        const throttled = await this.otpPage.otpAlreadySentText().isVisible().catch(() => false);
        return onOtpScreen || throttled;
      }, 8000).catch(() => undefined);
    }
    await expect(this.otpPage.otpAlreadySentText()).toBeVisible({ timeout: 10000 });
    await expect(this.otpPage.getOtpButton()).toBeDisabled();
  }

  /** Grounded 2026-09-21 via direct probe: typing "ab12cd34567890" into the OTP field yields
   * "123456" — non-numeric characters are silently filtered and entry is capped at 6 digits. */
  async assertOtpFieldRestrictsInput(): Promise<void> {
    const input = this.otpPage.otpInput();
    await input.click();
    await input.pressSequentially('ab12cd34567890', { delay: 15 });
    await expect(input).toHaveValue('123456');
  }
}
