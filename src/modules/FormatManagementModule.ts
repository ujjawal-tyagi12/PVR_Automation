import { Page, expect } from '@playwright/test';
import { FormatManagementPage } from '@pages/FormatManagementPage';
import { Logger } from '@utils/Logger';

/**
 * Orchestrates the home page as the common anchor for Format Management scenarios — see
 * FormatManagementPage for what was checked and ruled out. No admin format-management surface
 * exists anywhere on this app.
 */
export class FormatManagementModule {
  private formatPage: FormatManagementPage;

  constructor(private page: Page) {
    this.formatPage = new FormatManagementPage(page);
  }

  async open(): Promise<void> {
    Logger.info('Opening the home page (no admin Format Management screen exists)');
    await this.formatPage.goto();
  }

  async assertNoAdminFormatControls(): Promise<void> {
    await expect(this.formatPage.formatTable()).toHaveCount(0);
    await expect(this.formatPage.syncFormatsButton()).toHaveCount(0);
    await expect(this.formatPage.filterButton()).toHaveCount(0);
    await expect(this.formatPage.editButton()).toHaveCount(0);
  }

  async assertNoAdminFormFields(): Promise<void> {
    await expect(this.formatPage.nameField()).toHaveCount(0);
    await expect(this.formatPage.brandField()).toHaveCount(0);
    await expect(this.formatPage.descriptionField()).toHaveCount(0);
  }
}
