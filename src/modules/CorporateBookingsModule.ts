import { Page, expect } from '@playwright/test';
import { CorporateBookingsPage } from '@pages/CorporateBookingsPage';
import { Logger } from '@utils/Logger';

/**
 * Orchestrates the real, public Corporate Booking request form at /corporate-booking — see
 * CorporateBookingsPage for what was verified and what has no reachable admin equivalent (the
 * Reports → Corporate Bookings listing and the Static Management banner-edit screen).
 */
export class CorporateBookingsModule {
  private corporatePage: CorporateBookingsPage;

  constructor(private page: Page) {
    this.corporatePage = new CorporateBookingsPage(page);
  }

  async open(): Promise<void> {
    Logger.info('Opening the real public Corporate Booking form (no admin report or banner-edit screen exists)');
    await this.corporatePage.goto();
    await expect(this.corporatePage.pageHeading()).toBeVisible();
  }

  async assertRealBookingFormVisible(): Promise<void> {
    await expect(this.corporatePage.detailsHeading()).toBeVisible();
    await expect(this.corporatePage.cityCombobox()).toBeVisible();
    await expect(this.corporatePage.cinemaCombobox()).toBeVisible();
    await expect(this.corporatePage.seatsInput()).toBeVisible();
    await expect(this.corporatePage.nextButton()).toBeDisabled();
  }

  async assertNoAdminReportControls(): Promise<void> {
    await expect(this.corporatePage.reportTable()).toHaveCount(0);
    await expect(this.corporatePage.filterButton()).toHaveCount(0);
    await expect(this.corporatePage.exportCsvButton()).toHaveCount(0);
  }

  async assertNoAddOrDeleteControl(): Promise<void> {
    await expect(this.corporatePage.addButton()).toHaveCount(0);
    await expect(this.corporatePage.deleteButton()).toHaveCount(0);
  }

  async assertNoBannerUploadControl(): Promise<void> {
    await expect(this.corporatePage.fileUploadInput()).toHaveCount(0);
  }
}
