import { Page, expect } from '@playwright/test';
import { AmenitiesManagementPage } from '@pages/AmenitiesManagementPage';
import { Logger } from '@utils/Logger';

/**
 * Grounded against the live app at BASE_URL/cinemas/Mumbai. No itemized
 * amenities-management surface exists anywhere on this app — see
 * AmenitiesManagementPage for what was checked and ruled out.
 */
export class AmenitiesManagementModule {
  private amenitiesPage: AmenitiesManagementPage;

  constructor(private page: Page) {
    this.amenitiesPage = new AmenitiesManagementPage(page);
  }

  async open(): Promise<void> {
    // Geolocation is pre-granted in playwright.config.ts, so the "Enable Location" gate never appears.
    Logger.info('Opening a real cinema detail page to check for amenities content');
    await this.amenitiesPage.goto();
  }

  async assertNoFileUploadControl(): Promise<void> {
    await expect(this.amenitiesPage.fileUploadInput()).toHaveCount(0);
  }
}
