import { Page } from '@playwright/test';

/**
 * Grounded against the live app at BASE_URL (direct Playwright probe, 2026-09-21). The real
 * login surface is the header account-icon → Login "Welcome!" dialog (phone + OTP) — the same
 * dialog already grounded for admin-login.spec.ts; this Page only adds what's specific to the
 * Register/Login Screens sheet module (the real registration-form heading a brand-new number
 * lands on, invalid-phone validation, the real Google-only social login button, and the
 * confirmed-absent "Account deactivated" state). Confirmed live: only Google social login
 * exists — no Apple or Facebook button anywhere on this dialog. No "Account deactivated" state
 * is reachable — there is no admin access anywhere in this project to deactivate a real account
 * first, so that scenario has no live-groundable equivalent.
 *
 * @hritik
 */
export class RegisterLoginPage {
  constructor(private page: Page) {}

  registrationHeading = () => this.page.getByRole('heading', { name: "Let's get to know you better!" });
  // Grounded 2026-09-21 (real failure on automated run, not just manual probe): the real
  // validation message is "Please enter a valid phone number." — same text already grounded in
  // AdminLoginPage.phoneNumberError(). An earlier, ungrounded guess here ("...must contain
  // exactly 10 digits") never matched the live app.
  invalidPhoneText = () => this.page.getByText('Please enter a valid phone number.');
  googleLoginButton = () => this.page.getByRole('button', { name: /google/i });

  // Admin-only / unreachable-without-admin-access state — asserted absent, not assumed.
  deactivatedAccountText = () => this.page.getByText(/account deactivated/i);

  async goto(): Promise<void> {
    await this.page.goto('/');
  }
}
