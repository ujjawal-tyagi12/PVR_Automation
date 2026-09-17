import { Page, expect } from '@playwright/test';
import { CinemaManagementPage } from '@pages/CinemaManagementPage';
import { Logger } from '@utils/Logger';

/**
 * Orchestrates the real, public cinema listing at /cinemas/Mumbai — see
 * CinemaManagementPage for what was verified and what has no reachable admin
 * equivalent (the Cinema Management CRUD table).
 */
export class CinemaManagementModule {
  private cinemaPage: CinemaManagementPage;

  constructor(private page: Page) {
    this.cinemaPage = new CinemaManagementPage(page);
  }

  async open(): Promise<void> {
    Logger.info('Opening the real public cinema listing (no admin Cinema Management table exists)');
    await this.cinemaPage.goto();
    await expect(this.cinemaPage.cinemaNameHeading()).toBeVisible();
  }

  async assertNoAdminListingControl(): Promise<void> {
    await expect(this.cinemaPage.syncButton()).toHaveCount(0);
    await expect(this.cinemaPage.editIconButton()).toHaveCount(0);
    await expect(this.cinemaPage.viewIconButton()).toHaveCount(0);
    await expect(this.cinemaPage.exportCsvButton()).toHaveCount(0);
    await expect(this.cinemaPage.filterButton()).toHaveCount(0);
  }

  async assertNoImageUploadControl(): Promise<void> {
    await expect(this.cinemaPage.fileUploadInput()).toHaveCount(0);
  }

  async assertNoEditFormFields(): Promise<void> {
    await expect(this.cinemaPage.apiTimeoutField()).toHaveCount(0);
    await expect(this.cinemaPage.radiusField()).toHaveCount(0);
    await expect(this.cinemaPage.foodStopTimeField()).toHaveCount(0);
    await expect(this.cinemaPage.relationManagerField()).toHaveCount(0);
    await expect(this.cinemaPage.ticketQrUrlField()).toHaveCount(0);
    await expect(this.cinemaPage.metaTitleField()).toHaveCount(0);
    await expect(this.cinemaPage.metaDescriptionField()).toHaveCount(0);
  }
}
