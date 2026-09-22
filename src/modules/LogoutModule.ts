import { Page, expect } from '@playwright/test';
import { LogoutPage } from '@pages/LogoutPage';
import { AdminLoginModule, TEST_PHONE, VALID_OTP } from '@modules/AdminLoginModule';
import { Logger } from '@utils/Logger';

/**
 * Orchestrates the real logout confirmation flow for the Logout sheet module. Composes
 * AdminLoginModule read-only (no changes to it) for the shared login mechanics already proven
 * live there; AdminLoginModule.logout() itself always confirms, so the cancel path here opens
 * the same dialog independently to stop short of that.
 *
 * @hritik
 */
export class LogoutModule {
  private logoutPage: LogoutPage;
  private adminLogin: AdminLoginModule;

  constructor(private page: Page) {
    this.logoutPage = new LogoutPage(page);
    this.adminLogin = new AdminLoginModule(page);
  }

  async open(): Promise<void> {
    Logger.info('Opening the home page');
    await this.adminLogin.open();
  }

  async loginExistingUser(): Promise<void> {
    await this.adminLogin.openLoginDialog();
    await this.adminLogin.completeLogin(TEST_PHONE, VALID_OTP);
  }

  async logoutStandardFlow(): Promise<void> {
    await this.adminLogin.logout();
  }

  async assertLoggedOut(): Promise<void> {
    await expect(this.logoutPage.accountMenuButton()).toBeVisible({ timeout: 15000 });
  }

  async openLogoutConfirmationDialog(): Promise<void> {
    await this.logoutPage.accountMenuButton().click();
    await this.logoutPage.settingsMenuItem().click();
    await expect(this.logoutPage.logoutButton()).toBeVisible({ timeout: 10000 });
    await this.logoutPage.logoutButton().click();
    await expect(this.logoutPage.stayLoggedInButton()).toBeVisible({ timeout: 10000 });
  }

  async cancelLogout(): Promise<void> {
    await this.logoutPage.stayLoggedInButton().click();
    // Grounded 2026-09-22: "Stay Logged In" only closes the innermost logout-confirmation
    // popup — the Settings sub-dialog and the Account sidebar underneath stay open (confirmed
    // live via a real failure: the header stays aria-hidden, so the next openAccountMenu()
    // call can't find "User Icon"). Close whatever dialog is left, one at a time, until none
    // remain, before anything tries to reopen the account menu.
    for (let i = 0; i < 5 && (await this.page.getByRole('dialog').count()) > 0; i += 1) {
      await this.logoutPage.topDialogCloseButton().click();
    }
  }

  async assertStillLoggedIn(): Promise<void> {
    await this.adminLogin.assertLoggedIn();
  }

  async attemptProtectedRouteAccess(): Promise<void> {
    await this.logoutPage.gotoProtectedProfileRoute();
  }

  async assertRedirectedAwayFromProtectedRoute(): Promise<void> {
    await expect(this.page).not.toHaveURL(/\/dashboard/, { timeout: 15000 });
    await expect(this.page.getByRole('heading', { name: 'Edit Your Details' })).toHaveCount(0);
  }
}
