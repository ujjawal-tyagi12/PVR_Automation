import { Page, expect } from '@playwright/test';
import { BookingManagementReportsPage } from '@pages/BookingManagementReportsPage';
import { Logger } from '@utils/Logger';

/**
 * Grounded against the live app at BASE_URL. No admin cross-customer booking
 * lookup surface exists anywhere on this app — see
 * BookingManagementReportsPage for what was checked.
 */
export class BookingManagementReportsModule {
  private bookingPage: BookingManagementReportsPage;

  constructor(private page: Page) {
    this.bookingPage = new BookingManagementReportsPage(page);
  }

  async open(): Promise<void> {
    Logger.info('Opening home page (closest checked real page — no admin booking-lookup surface exists)');
    await this.bookingPage.goto();
  }

  async assertNoSearchTypeControl(): Promise<void> {
    await expect(this.bookingPage.trackIdSearchType()).toHaveCount(0);
  }

  async assertNoFilterControl(): Promise<void> {
    await expect(this.bookingPage.filterPopupButton()).toHaveCount(0);
    await expect(this.bookingPage.resetFilterButton()).toHaveCount(0);
  }

  async assertNoUtmParametersSection(): Promise<void> {
    await expect(this.bookingPage.utmParametersHeading()).toHaveCount(0);
  }

  async assertNoExportCsvControl(): Promise<void> {
    await expect(this.bookingPage.exportCsvButton()).toHaveCount(0);
  }

  async assertNoPaymentResponseJsonControl(): Promise<void> {
    await expect(this.bookingPage.paymentResponseJsonButton()).toHaveCount(0);
  }

  async assertNoSurchargeAmountField(): Promise<void> {
    await expect(this.bookingPage.surchargeAmountText()).toHaveCount(0);
  }

  async assertNoBookingIdField(): Promise<void> {
    await expect(this.bookingPage.bookingIdLabel()).toHaveCount(0);
  }

  async assertNoPaginationControl(): Promise<void> {
    await expect(this.bookingPage.paginationNextButton()).toHaveCount(0);
  }
}
