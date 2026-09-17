import { Page, expect } from '@playwright/test';

/**
 * Grounded against the live app at BASE_URL (Playwright MCP, 2026-08-31). The real
 * login surface on this app is the customer-site phone+OTP dialog reached via the
 * header account icon — there is no separate Email+Password admin login screen;
 * that never existed on this domain. See TestData/TestMd/admin-login.md for the
 * mapping from the original sheet scenarios (which assumed Email+Password) to this
 * real flow.
 */
export class AdminLoginPage {
  constructor(private page: Page) {}

  accountMenuButton = () => this.page.getByRole('button', { name: 'User Icon' });
  loginMenuItem = () => this.page.getByRole('button', { name: 'Login' });

  loginDialog = () => this.page.getByRole('dialog');
  welcomeHeading = () => this.page.getByRole('heading', { name: 'Welcome!' });
  phoneNumberInput = () => this.page.getByRole('textbox', { name: /enter your phone number/i });
  phoneNumberError = () => this.page.getByText('Please enter a valid phone number.');
  getOtpButton = () => this.page.getByRole('button', { name: 'Get OTP' });
  googleSignInButton = () => this.page.getByRole('button', { name: /google/i });
  closeDialogButton = () => this.loginDialog().getByRole('heading').locator('button');

  verifyPhoneHeading = () => this.page.getByRole('heading', { name: 'Verify Phone Number' });
  otpEditNumberButton = () => this.page.getByText(/^\+91 \d{10}$/);
  otpInput = () => this.loginDialog().getByRole('textbox');
  resendWaitMessage = () => this.page.getByText(/please wait.*before you can/i);
  resendCodeButton = () => this.page.getByRole('button', { name: 'Resend Code' });

  deviceLimitHeading = () => this.page.getByRole('heading', { name: 'Device Limit Reached' });
  deviceLimitCancelButton = () => this.page.getByRole('button', { name: 'Cancel' });
  deviceLimitContinueButton = () => this.page.getByRole('button', { name: 'Continue' });

  recaptchaIframe = () => this.page.locator('iframe[title*="recaptcha" i]');

  accountSidebarHeading = () => this.page.getByRole('heading', { name: 'Account' });
  loginPromptText = () => this.page.getByText('Login or signup to continue');
  customerExperienceMenuItem = () => this.page.getByRole('button', { name: 'Customer Experience' });
  settingsMenuItem = () => this.page.getByRole('button', { name: 'Settings' });
  editProfileButton = () => this.page.getByRole('button', { name: 'Edit profile' });

  // Grounded 2026-09-01, re-verified 2026-09-15 (bypass code rotated — see .env.local's
  // TEST_PASSWORD): the current OTP bypass is a genuine UAT test-mode bypass — verified
  // end-to-end via a real login with a fresh random phone number. A brand-new number always
  // lands on this 3-step registration flow (basic info -> preferences -> a profile-completion
  // nudge) straight after the OTP is accepted.
  registrationHeading = () => this.page.getByRole('heading', { name: "Let's get to know you better!" });
  firstNameInput = () => this.page.getByRole('textbox', { name: /enter your first name/i });
  registrationEmailInput = () => this.page.getByRole('textbox', { name: /enter your email/i });
  registrationSubmitButton = () => this.page.getByRole('button', { name: 'Submit' });
  preferencesHeading = () => this.page.getByRole('heading', { name: 'Select Your Preferences' });
  illMissOutButton = () => this.page.getByRole('button', { name: "I'll miss out" });
  profileNudgeSkipButton = () => this.page.getByRole('button', { name: 'Skip Anyway' });
  // A 4th, separate promo overlay ("Get Verified with Google Wallet!") consistently follows the
  // profile nudge and intercepts clicks on the rest of the page until dismissed.
  googleWalletPromoCloseButton = () => this.page.getByRole('button', { name: 'close modal' });
  // Grounded 2026-09-03: a 5th overlay ("Complete Your Profile") appears on an unpredictable
  // timer independent of the other onboarding steps — observed both in place of, and stacked on
  // top of, the Google Wallet promo. Scoped to its own dialog (not the page-level "I'll miss out"
  // from the preferences step) since both buttons share the same accessible name and can be
  // present at once.
  completeProfileHeading = () => this.page.getByRole('heading', { name: 'Complete Your Profile' });
  completeProfileMissOutButton = () =>
    this.page
      .getByRole('dialog')
      .filter({ has: this.completeProfileHeading() })
      .getByRole('button', { name: "I'll Miss Out" });

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  async openAccountMenu(): Promise<void> {
    // Grounded 2026-09-15: the header can be slower to hydrate than the default actionability
    // wait under live load (same class of issue as GiftCardMasterModule's page-load check, and
    // confirmed here too via a real click timeout on this exact button). Waiting explicitly
    // first, with a generous timeout, avoids that instead of relying solely on click()'s own
    // actionability retry.
    await this.accountMenuButton().waitFor({ state: 'visible', timeout: 20000 });
    await this.accountMenuButton().click();
  }

  async clickLogin(): Promise<void> {
    await this.loginMenuItem().click();
  }

  async fillPhoneNumber(phone: string): Promise<void> {
    await this.phoneNumberInput().fill(phone);
  }

  async clickGetOtp(): Promise<void> {
    await this.getOtpButton().click();
  }

  async fillOtp(otp: string): Promise<void> {
    // Verifying the value landed (not just that fill() resolved) matters specifically when a
    // test enters several OTP codes back-to-back with no gap between them (e.g. repeated wrong-
    // attempt scenarios) — grounded via direct probe: without this, a fast-follow fill() can
    // race the app's own OTP-field re-render, leaving a value that mixes digits from the
    // previous and current entries instead of cleanly replacing it.
    //
    // Grounded 2026-09-03: that race can leave the field stuck on the corrupted value for the
    // full assertion timeout rather than self-correcting — a single fill() plus a passive wait
    // isn't enough. Retrying the fill itself (not just re-checking) clears it.
    const input = this.otpInput();
    await expect(async () => {
      await input.fill(otp);
      await expect(input).toHaveValue(otp, { timeout: 2000 });
    }).toPass({ timeout: 15000 });
  }

  async clickResendCode(): Promise<void> {
    await this.resendCodeButton().click();
  }

  async dismissCompleteProfileOverlay(): Promise<void> {
    // Grounded 2026-09-15: this overlay can re-render (or be replaced by a fresh instance —
    // it's already documented above as appearing on its own unpredictable timer) right as the
    // dismiss click lands, detaching the button mid-click — confirmed live via a real failure
    // ("element was detached from the DOM, retrying" after 15s of Playwright's own actionability
    // retries). Re-locating and re-clicking on failure, same pattern as fillOtp() above, clears
    // it instead of exhausting the timeout on a single stale reference.
    await expect(async () => {
      await this.completeProfileMissOutButton().click({ timeout: 5000 });
    }).toPass({ timeout: 15000 });
  }
}
