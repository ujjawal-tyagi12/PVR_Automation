import { Page } from '@playwright/test';
import { AffiliatesManagementPage } from '@pages/AffiliatesManagementPage';
import { Logger } from '@utils/Logger';

/**
 * Grounded against the live app at BASE_URL. No affiliate-account-management
 * surface exists anywhere on this app — see AffiliatesManagementPage for what
 * was checked and ruled out.
 */
export class AffiliatesManagementModule {
  private affiliatesPage: AffiliatesManagementPage;

  constructor(private page: Page) {
    this.affiliatesPage = new AffiliatesManagementPage(page);
  }

  async open(): Promise<void> {
    // Geolocation is pre-granted in playwright.config.ts, so the "Enable Location" gate never appears.
    Logger.info('Opening the closest thematically-related real page (Corporate Booking)');
    await this.affiliatesPage.goto();
  }
}
