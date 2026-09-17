import { Page } from '@playwright/test';

/**
 * Grounded against the live app at BASE_URL (Playwright MCP, 2026-08-31). The
 * account sidebar (header account icon) is real and confirmed: heading "Account",
 * "Login or signup to continue", "Customer Experience", and "Settings". Its
 * authenticated state — where Admin Name/Email/Phone/Edit (as described in
 * TestData/TestMd/admin-profile.md) would presumably live — was never observed,
 * because completing login requires a real OTP with no test-mode bypass (see
 * admin-login.md). This module cannot be grounded past the pre-login state.
 */
export class AdminProfilePage {
  constructor(private page: Page) {}

  accountMenuButton = () => this.page.getByRole('button', { name: 'User Icon' });
  accountSidebarHeading = () => this.page.getByRole('heading', { name: 'Account' });
  loginPromptText = () => this.page.getByText('Login or signup to continue');
  customerExperienceMenuItem = () => this.page.getByRole('button', { name: 'Customer Experience' });
  settingsMenuItem = () => this.page.getByRole('button', { name: 'Settings' });

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  async openAccountMenu(): Promise<void> {
    // Grounded 2026-09-15: the header can be slower to hydrate than the default actionability
    // wait under live load (same class of issue as GiftCardMasterModule's page-load check) —
    // confirmed live via a real click timeout. Waiting explicitly first, with a generous
    // timeout, avoids that instead of relying solely on click()'s own actionability retry.
    await this.accountMenuButton().waitFor({ state: 'visible', timeout: 20000 });
    await this.accountMenuButton().click();
  }
}
