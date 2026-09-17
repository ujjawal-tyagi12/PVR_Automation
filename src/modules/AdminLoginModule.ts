import { Page, Locator, expect } from '@playwright/test';
import { AdminLoginPage } from '@pages/AdminLoginPage';
import { Logger } from '@utils/Logger';

/**
 * Grounded against the live app at BASE_URL. Orchestrates the real phone+OTP login
 * dialog (header account icon → Login) — see AdminLoginPage for what was verified
 * and TestData/TestMd/admin-login.md for how each original sheet scenario maps to
 * this real flow.
 */

/**
 * Test login credentials, sourced from .env.local (TEST_USERNAME/TEST_PASSWORD) — never
 * hardcoded. TEST_PASSWORD holds a genuine UAT test-mode OTP bypass code, verified against
 * fresh phone numbers on both BASE_URL and inox-uat-web.pvrinox.com as of 2026-09-15 — the
 * bypass code itself has rotated at least once (see .env.local). Note this validates OTP
 * *entry* only: TEST_USERNAME can independently be rate-limited at the "Get OTP" *request*
 * step from repeated use across a long session, which no bypass code fixes.
 */
export const TEST_PHONE = process.env.TEST_USERNAME as string;
export const VALID_OTP = process.env.TEST_PASSWORD as string;

/**
 * A fresh 10-digit Indian mobile number (starts 6-9) each call, so every OTP-requesting
 * test uses its own never-before-seen number instead of a shared one — avoiding the real
 * SMS-backend rate limit a shared TEST_PHONE hits under repeated automated runs.
 */
export function randomPhoneNumber(): string {
  const firstDigit = String(6 + Math.floor(Math.random() * 4));
  let rest = '';
  for (let i = 0; i < 9; i += 1) {
    rest += String(Math.floor(Math.random() * 10));
  }
  return firstDigit + rest;
}

export class AdminLoginModule {
  private loginPage: AdminLoginPage;

  constructor(private page: Page) {
    this.loginPage = new AdminLoginPage(page);
  }

  async open(): Promise<void> {
    // Geolocation is pre-granted in playwright.config.ts (Mumbai coordinates), so the app
    // auto-detects the city and the "Enable Location" gate never appears.
    Logger.info('Opening home page (Mumbai auto-detected via granted geolocation)');
    await this.loginPage.goto();
  }

  async openLoginDialog(): Promise<void> {
    Logger.info('Opening the login dialog');
    await this.loginPage.openAccountMenu();
    await this.loginPage.clickLogin();
  }

  async submitPhoneNumber(phone: string): Promise<void> {
    Logger.info(`Submitting phone number ${phone}`);
    await this.loginPage.fillPhoneNumber(phone);
  }

  async requestOtp(phone: string): Promise<void> {
    await this.openLoginDialog();
    await this.submitPhoneNumber(phone);
    await this.loginPage.clickGetOtp();
  }

  async enterOtp(otp: string): Promise<void> {
    Logger.info('Entering OTP');
    await this.loginPage.fillOtp(otp);
  }

  async resendOtp(): Promise<void> {
    Logger.info('Requesting OTP resend');
    await expect(this.loginPage.resendCodeButton()).toBeEnabled({ timeout: 130000 });
    await this.loginPage.clickResendCode();
  }

  async assertResendDisabled(): Promise<void> {
    await expect(this.loginPage.resendCodeButton()).toBeDisabled();
  }

  async loginWithPhone(phone: string, otp: string): Promise<void> {
    await this.requestOtp(phone);
    await expect(this.loginPage.verifyPhoneHeading()).toBeVisible();
    await this.enterOtp(otp);
  }

  /**
   * A brand-new phone number (as randomPhoneNumber() always produces) lands on a 3-step
   * registration flow right after a valid OTP: basic info -> preferences -> a profile
   * nudge. Each step is optional/conditional since only a genuinely new account sees it.
   *
   * Locator.isVisible() does NOT wait — Playwright's own types document its `timeout` option
   * as ignored, returning immediately. waitFor({ state: 'visible' }) is the real wait; each
   * step below uses that (via this helper) instead, which is what earlier silently broke
   * onboarding completion (the registration step was skipped before it had rendered).
   */
  private async waitVisible(locator: Locator, timeout: number): Promise<boolean> {
    return locator
      .waitFor({ state: 'visible', timeout })
      .then(() => true)
      .catch(() => false);
  }

  async completeNewUserOnboardingIfPresent(): Promise<void> {
    // TEST_PHONE has now logged in successfully many times across many fresh browser
    // contexts (each one a "new device" to the backend), so it can hit a real per-account
    // device cap right after OTP entry — confirmed live (2026-09-01). Continue through it
    // so the login this test needs still completes.
    if (await this.waitVisible(this.loginPage.deviceLimitHeading(), 10000)) {
      Logger.info('Device Limit Reached — continuing (logs out the oldest other device)');
      await this.loginPage.deviceLimitContinueButton().click();
    }

    if (await this.waitVisible(this.loginPage.registrationHeading(), 10000)) {
      Logger.info('Completing new-user registration step');
      await this.loginPage.firstNameInput().fill('Test');
      await this.loginPage.firstNameInput().press('Tab');
      await this.loginPage.registrationEmailInput().fill(`qa.${Date.now()}@example.com`);
      await this.loginPage.registrationEmailInput().press('Tab');
      // The form only enables Submit once its own onChange/onBlur validation has run —
      // pressing Tab above forces that, but this waits explicitly rather than assuming timing.
      await expect(this.loginPage.registrationSubmitButton()).toBeEnabled({ timeout: 10000 });
      await this.loginPage.registrationSubmitButton().click();
    }

    if (await this.waitVisible(this.loginPage.preferencesHeading(), 10000)) {
      Logger.info('Skipping the preferences step');
      await this.loginPage.illMissOutButton().click();
    }

    if (await this.waitVisible(this.loginPage.profileNudgeSkipButton(), 10000)) {
      Logger.info('Dismissing the profile-completion nudge');
      await this.loginPage.profileNudgeSkipButton().click();
    }

    // Checked both before and after the Google Wallet promo: this overlay fires on its own
    // timer and has been observed both preceding it and stacked on top of it, blocking clicks
    // on whatever is underneath either way.
    if (await this.waitVisible(this.loginPage.completeProfileHeading(), 10000)) {
      Logger.info('Dismissing the Complete Your Profile overlay');
      await this.loginPage.dismissCompleteProfileOverlay();
    }

    if (await this.waitVisible(this.loginPage.googleWalletPromoCloseButton(), 10000)) {
      Logger.info('Dismissing the Google Wallet promo overlay');
      await this.loginPage.googleWalletPromoCloseButton().click();
    }

    if (await this.waitVisible(this.loginPage.completeProfileHeading(), 5000)) {
      Logger.info('Dismissing the Complete Your Profile overlay');
      await this.loginPage.dismissCompleteProfileOverlay();
    }
  }

  /**
   * Full real login: submit the phone, request the OTP, enter it, and clear whatever
   * new-user onboarding follows. Assumes the login dialog is already open (as every test's
   * beforeEach leaves it) — unlike loginWithPhone()/requestOtp(), it does not reopen it.
   */
  async completeLogin(phone: string, otp: string): Promise<void> {
    await this.submitPhoneNumber(phone);
    await this.loginPage.clickGetOtp();
    await expect(this.loginPage.verifyPhoneHeading()).toBeVisible();
    await this.enterOtp(otp);
    await this.completeNewUserOnboardingIfPresent();
  }

  async assertLoggedIn(): Promise<void> {
    await this.loginPage.openAccountMenu();
    await expect(this.loginPage.editProfileButton()).toBeVisible();
  }

  async confirmDeviceLimitAndContinue(): Promise<void> {
    await expect(this.loginPage.deviceLimitHeading()).toBeVisible();
    await this.loginPage.deviceLimitContinueButton().click();
  }

  async cancelDeviceLimit(): Promise<void> {
    await expect(this.loginPage.deviceLimitHeading()).toBeVisible();
    await this.loginPage.deviceLimitCancelButton().click();
  }

  async assertRecaptchaChallengeShown(): Promise<void> {
    await expect(this.loginPage.recaptchaIframe()).toHaveCount(1);
  }
}
