import { Page, expect } from '@playwright/test';
import { ExperienceManagementPage } from '@pages/ExperienceManagementPage';
import { Logger } from '@utils/Logger';

/**
 * Orchestrates the real, public Experiences page — see
 * ExperienceManagementPage for what was verified and what has no reachable
 * admin equivalent (the Experience Management CRUD table).
 */
export class ExperienceManagementModule {
  private experiencePage: ExperienceManagementPage;

  constructor(private page: Page) {
    this.experiencePage = new ExperienceManagementPage(page);
  }

  async open(): Promise<void> {
    Logger.info('Opening the real public Experiences page (no admin Experience Management table exists)');
    await this.experiencePage.goto();
    await expect(this.experiencePage.formatFeaturesHeading()).toBeVisible();
  }

  async assertRealExperienceContentVisible(): Promise<void> {
    await expect(this.experiencePage.formatFeaturesHeading()).toBeVisible();
    await expect(this.experiencePage.termsHeading()).toBeVisible();
    await expect(this.experiencePage.moviesShowingHeading()).toBeVisible();
  }

  async assertNoAdminListingControl(): Promise<void> {
    await expect(this.experiencePage.syncExperiencesButton()).toHaveCount(0);
    await expect(this.experiencePage.globalLogicControl()).toHaveCount(0);
    await expect(this.experiencePage.filterButton()).toHaveCount(0);
    await expect(this.experiencePage.editButton()).toHaveCount(0);
    await expect(this.experiencePage.viewButton()).toHaveCount(0);
  }

  async assertNoImageUploadControl(): Promise<void> {
    await expect(this.experiencePage.fileUploadInput()).toHaveCount(0);
  }

  async assertNoEditFormFields(): Promise<void> {
    await expect(this.experiencePage.experienceKeyField()).toHaveCount(0);
    await expect(this.experiencePage.sequenceField()).toHaveCount(0);
    await expect(this.experiencePage.nudgeSequenceField()).toHaveCount(0);
    await expect(this.experiencePage.trailerUrlField()).toHaveCount(0);
    await expect(this.experiencePage.featuresField()).toHaveCount(0);
  }
}
