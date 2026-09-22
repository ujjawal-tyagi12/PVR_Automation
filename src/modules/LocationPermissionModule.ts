import { Page, expect } from '@playwright/test';
import { LocationPermissionPage } from '@pages/LocationPermissionPage';
import { Logger } from '@utils/Logger';

/**
 * Orchestrates the home page as the anchor for the Location Permission sheet module — see
 * LocationPermissionPage for what was checked.
 *
 * @hritik
 */
export class LocationPermissionModule {
  private locationPage: LocationPermissionPage;

  constructor(private page: Page) {
    this.locationPage = new LocationPermissionPage(page);
  }

  async open(): Promise<void> {
    Logger.info('Opening the home page with geolocation granted (Mumbai)');
    await this.locationPage.goto();
  }

  async assertCityDetectedViaGeolocation(): Promise<void> {
    await expect(this.locationPage.cityButton()).toContainText('Mumbai', { timeout: 15000 });
  }
}
