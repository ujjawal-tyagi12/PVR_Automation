import { Page } from '@playwright/test';

/**
 * Grounded against the live app at BASE_URL (Playwright MCP, 2026-09-01). This
 * app's only login mechanism is the real customer phone+OTP dialog — already
 * confirmed in admin-login.md/spec (ADL-002: no password field exists on this
 * app; ADL-018: no confirm-password field exists). The pre-login account
 * sidebar's "Settings" screen was checked directly and contains only
 * "Appearance" and content links (Privacy Policy/Terms & Conditions/Terms of
 * Use/FAQs) — no password-change surface anywhere. Since there is no
 * password-based login at all, a "Change Password" screen (as described in
 * TestData/TestMd/change-password.md) cannot exist on this app.
 */
export class ChangePasswordPage {
  constructor(private page: Page) {}

  accountMenuButton = () => this.page.getByRole('button', { name: 'User Icon' });
  settingsMenuItem = () => this.page.getByRole('button', { name: 'Settings' });
  appearanceMenuItem = () => this.page.getByRole('button', { name: 'Appearance' });
  currentPasswordField = () => this.page.getByLabel(/current password/i);
  newPasswordField = () => this.page.getByLabel(/^new password$/i);
  confirmPasswordField = () => this.page.getByLabel(/confirm new password/i);
  updateButton = () => this.page.getByRole('button', { name: /^update$/i });

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  async openAccountMenu(): Promise<void> {
    // Grounded 2026-09-15: the header can be slower to hydrate than the default actionability
    // wait under live load — same confirmed pattern as AdminLoginPage/AdminProfilePage's
    // identical button. Waiting explicitly first, with a generous timeout, avoids a flaky click.
    await this.accountMenuButton().waitFor({ state: 'visible', timeout: 20000 });
    await this.accountMenuButton().click();
  }

  async openSettings(): Promise<void> {
    await this.settingsMenuItem().click();
  }
}
