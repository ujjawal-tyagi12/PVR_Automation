import { Page } from '@playwright/test';

/**
 * Grounded against the live app at BASE_URL (direct Playwright probe, 2026-09-22). Logout is
 * reached via the account sidebar → Settings → Logout, which opens a real confirmation dialog
 * ("Are you sure you want to logout?", "Yes, Logout" / "Stay Logged In") — the same flow
 * already grounded for AdminLoginModule.logout() (Register/Login Screens module). This Page
 * only adds the "Stay Logged In" cancel path and the protected-route redirect check, which are
 * specific to this sheet module.
 *
 * @hritik
 */
export class LogoutPage {
  constructor(private page: Page) {}

  accountMenuButton = () => this.page.getByRole('button', { name: 'User Icon' });
  settingsMenuItem = () => this.page.getByRole('button', { name: 'Settings right arrow', exact: true });
  logoutButton = () => this.page.getByRole('button', { name: 'Logout', exact: true });
  stayLoggedInButton = () => this.page.getByRole('button', { name: 'Stay Logged In' });
  logoutDialogHeading = () => this.page.getByRole('heading', { name: 'Logout', exact: true });
  // Matches AdminLoginPage.closeDialogButton()'s pattern: an unnamed close icon inside whatever
  // dialog's heading is currently topmost. Grounded 2026-09-22: on the Settings dialog
  // specifically, that heading also contains an accordion-trigger button ("Appearance"), so
  // .first() is required to land on the actual close button, not the accordion.
  topDialogCloseButton = () => this.page.getByRole('dialog').getByRole('heading').locator('button').first();

  async gotoProtectedProfileRoute(): Promise<void> {
    await this.page.goto('/dashboard?tab=profile');
  }
}
