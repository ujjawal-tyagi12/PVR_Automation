import { Page } from '@playwright/test';
import { AdminProfilePage } from '@pages/AdminProfilePage';
import { Logger } from '@utils/Logger';

/**
 * Grounded against the live app at BASE_URL. Orchestrates the real, pre-login
 * account sidebar — see AdminProfilePage for what was verified and why the
 * authenticated profile screens could not be reached.
 */
export class AdminProfileModule {
  private profilePage: AdminProfilePage;

  constructor(private page: Page) {
    this.profilePage = new AdminProfilePage(page);
  }

  async open(): Promise<void> {
    // Geolocation is pre-granted in playwright.config.ts, so the "Enable Location" gate never appears.
    Logger.info('Opening home page');
    await this.profilePage.goto();
  }

  async openAccountSidebar(): Promise<void> {
    Logger.info('Opening the account sidebar');
    await this.profilePage.openAccountMenu();
  }
}
