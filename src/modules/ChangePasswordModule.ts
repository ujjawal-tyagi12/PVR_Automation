import { Page, expect } from '@playwright/test';
import { ChangePasswordPage } from '@pages/ChangePasswordPage';
import { Logger } from '@utils/Logger';

/**
 * Orchestrates the real pre-login account sidebar / Settings screen — see
 * ChangePasswordPage for why no Change Password surface is reachable on this
 * app (it has no password-based login at all).
 */
export class ChangePasswordModule {
  private changePasswordPage: ChangePasswordPage;

  constructor(private page: Page) {
    this.changePasswordPage = new ChangePasswordPage(page);
  }

  async open(): Promise<void> {
    Logger.info('Opening home page and the account sidebar Settings screen (no password-based login exists on this app)');
    await this.changePasswordPage.goto();
    await this.changePasswordPage.openAccountMenu();
    await this.changePasswordPage.openSettings();
    await expect(this.changePasswordPage.appearanceMenuItem()).toBeVisible();
  }

  async assertNoChangePasswordScreen(): Promise<void> {
    await expect(this.changePasswordPage.currentPasswordField()).toHaveCount(0);
    await expect(this.changePasswordPage.newPasswordField()).toHaveCount(0);
    await expect(this.changePasswordPage.confirmPasswordField()).toHaveCount(0);
    await expect(this.changePasswordPage.updateButton()).toHaveCount(0);
  }
}
