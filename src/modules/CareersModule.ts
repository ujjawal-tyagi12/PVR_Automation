import { Page, expect } from '@playwright/test';
import { CareersPage } from '@pages/CareersPage';
import { Logger } from '@utils/Logger';

/**
 * Orchestrates the real, public Careers page — see CareersPage for what was
 * verified and what has no reachable admin equivalent (the Static Management
 * Careers-location CRUD editor).
 */
export class CareersModule {
  private careersPage: CareersPage;

  constructor(private page: Page) {
    this.careersPage = new CareersPage(page);
  }

  async open(): Promise<void> {
    Logger.info('Opening the public Careers page');
    await this.careersPage.goto();
    await expect(this.careersPage.whyPvrHeading()).toBeVisible();
  }

  async assertRealCareersContentVisible(): Promise<void> {
    await expect(this.careersPage.whyPvrHeading()).toBeVisible();
    await expect(this.careersPage.departmentsHeading()).toBeVisible();
  }

  async assertNoImageUploadControl(): Promise<void> {
    await expect(this.careersPage.imageUploadInput()).toHaveCount(0);
  }

  async assertNoLatLongFields(): Promise<void> {
    await expect(this.careersPage.latitudeField()).toHaveCount(0);
    await expect(this.careersPage.longitudeField()).toHaveCount(0);
  }
}
