import { Page, expect } from '@playwright/test';
import { ForgotPasswordPage } from '@pages/ForgotPasswordPage';
import { Logger } from '@utils/Logger';

/**
 * Orchestrates the real login dialog at / — see ForgotPasswordPage for what was checked and
 * ruled out. No password-based login (and therefore no Forgot Password flow) exists anywhere on
 * this app.
 */
export class ForgotPasswordModule {
  private forgotPage: ForgotPasswordPage;

  constructor(private page: Page) {
    this.forgotPage = new ForgotPasswordPage(page);
  }

  async open(): Promise<void> {
    Logger.info('Opening the real login dialog (no admin Forgot Password flow exists)');
    await this.forgotPage.goto();
    await this.forgotPage.openLoginDialog();
    await expect(this.forgotPage.loginDialog()).toBeVisible();
  }

  async assertNoForgotPasswordLink(): Promise<void> {
    await expect(this.forgotPage.forgotPasswordLink()).toHaveCount(0);
  }

  async assertNoPasswordResetFields(): Promise<void> {
    await expect(this.forgotPage.newPasswordField()).toHaveCount(0);
    await expect(this.forgotPage.confirmPasswordField()).toHaveCount(0);
  }
}
