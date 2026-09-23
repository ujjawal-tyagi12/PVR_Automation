import type { Page } from '@playwright/test';

/**
 * Admin Panel > Login Settings (max-device-limit configuration only — TC_ADM_042/043/044).
 * Grounded 2026-09-16: `config.adminBaseUrl` (https://uat-admin.pvrinox.com/) is now a real,
 * user-confirmed URL, not a guess. The login screen itself ("Welcome to PVR INOX Admin Panel!",
 * Email/Password/Continue) is protected by Google reCAPTCHA — confirmed via network logs
 * (`recaptcha/api2/reload|clr|bcn` fire on submit) — so headless Playwright cannot get past
 * login; this only works from an interactive/human-driven browser session (e.g. `claude
 * --chrome`), not `chromium.launch({ headless: true })`.
 * TODO(heal): every locator below this comment is still an unverified guess — the admin
 * dashboard/nav structure past login has not been seen yet. Ground them via an interactive
 * session once one successfully logs in.
 */
export class AdminLoginSettingsPage {
  constructor(private page: Page) {}

  readonly adminUsernameInput = () => this.page.getByRole('textbox', { name: /username|email/i });
  readonly adminPasswordInput = () => this.page.getByLabel(/password/i);
  readonly adminLoginButton = () => this.page.getByRole('button', { name: /log ?in/i });

  readonly loginSettingsNav = () => this.page.getByRole('link', { name: /login settings/i });
  readonly maxDevicesDropdown = () => this.page.getByRole('combobox', { name: /max device(s)? (allowed|limit)/i });
  readonly saveButton = () => this.page.getByRole('button', { name: /save/i });
  readonly saveSuccessMessage = () => this.page.getByText(/settings? (updated|saved) successfully/i);

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  async loginAsAdmin(username: string, password: string): Promise<void> {
    await this.adminUsernameInput().fill(username);
    await this.adminPasswordInput().fill(password);
    await this.adminLoginButton().click();
  }

  async openLoginSettings(): Promise<void> {
    await this.loginSettingsNav().click();
  }

  async selectMaxDevices(value: string): Promise<void> {
    await this.maxDevicesDropdown().selectOption(value);
  }

  async save(): Promise<void> {
    await this.saveButton().click();
  }

  async getMaxDeviceOptionTexts(): Promise<string[]> {
    const texts = await this.maxDevicesDropdown().locator('option').allTextContents();
    return texts.map((t) => t.trim());
  }
}
