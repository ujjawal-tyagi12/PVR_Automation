import { Page } from '@playwright/test';

/**
 * Grounded against the live app at BASE_URL (direct Playwright probe, 2026-09-09). This app's
 * only login mechanism is the real customer phone+OTP dialog — already confirmed in
 * admin-login.md/spec (ADL-002: no password field exists) and change-password.md/spec. Since
 * there is no password-based login at all, a "Forgot Password" flow (as described in
 * TestData/TestMd/forgot-password.md) cannot exist on this app.
 */
export class ForgotPasswordPage {
  constructor(private page: Page) {}

  accountMenuButton = () => this.page.getByRole('button', { name: 'User Icon' });
  loginMenuItem = () => this.page.getByRole('button', { name: 'Login' });
  loginDialog = () => this.page.getByRole('dialog');
  forgotPasswordLink = () => this.page.getByText(/forgot password/i);
  emailInput = () => this.page.getByLabel(/^email$/i);
  newPasswordField = () => this.page.getByLabel(/^new password$/i);
  confirmPasswordField = () => this.page.getByLabel(/confirm.*password/i);

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  async openLoginDialog(): Promise<void> {
    // Grounded 2026-09-15: the header can be slower to hydrate than the default actionability
    // wait under live load — same confirmed pattern as AdminLoginPage/AdminProfilePage's
    // identical button. Waiting explicitly first, with a generous timeout, avoids a flaky click.
    await this.accountMenuButton().waitFor({ state: 'visible', timeout: 20000 });
    await this.accountMenuButton().click();
    await this.loginMenuItem().click();
  }
}
