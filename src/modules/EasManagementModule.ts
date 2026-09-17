import { Page, expect } from '@playwright/test';
import { EasManagementPage } from '@pages/EasManagementPage';
import { Logger } from '@utils/Logger';

/**
 * Orchestrates the real, live early-access.pvrinox.com subdomain — see EasManagementPage for
 * what was verified and what has no reachable admin equivalent (the Screening Management → EAS
 * Management CRUD table).
 */
export class EasManagementModule {
  private easPage: EasManagementPage;

  constructor(private page: Page) {
    this.easPage = new EasManagementPage(page);
  }

  async open(): Promise<void> {
    Logger.info('Opening the real early-access.pvrinox.com subdomain (no admin EAS Management table exists)');
    await this.easPage.goto();
    await expect(this.easPage.playStoreLink()).toBeVisible();
  }

  async assertNoAdminCampaignControls(): Promise<void> {
    await expect(this.easPage.campaignTable()).toHaveCount(0);
    await expect(this.easPage.addCampaignButton()).toHaveCount(0);
    await expect(this.easPage.filterButton()).toHaveCount(0);
  }

  async assertNoAdminFormFields(): Promise<void> {
    await expect(this.easPage.campaignHeadingField()).toHaveCount(0);
    await expect(this.easPage.selectMovieDropdown()).toHaveCount(0);
    await expect(this.easPage.fileUploadInput()).toHaveCount(0);
  }
}
