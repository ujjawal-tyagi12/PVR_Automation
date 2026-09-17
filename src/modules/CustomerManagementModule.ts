import { Page, expect } from '@playwright/test';
import { CustomerManagementPage } from '@pages/CustomerManagementPage';
import { Logger } from '@utils/Logger';

/**
 * Orchestrates the home page as the common anchor for Customer Management scenarios — see
 * CustomerManagementPage for what was checked and ruled out. No admin CRM surface exists
 * anywhere on this app.
 */
export class CustomerManagementModule {
  private customerPage: CustomerManagementPage;

  constructor(private page: Page) {
    this.customerPage = new CustomerManagementPage(page);
  }

  async open(): Promise<void> {
    Logger.info('Opening the home page (no admin Customer Management CRM exists)');
    await this.customerPage.goto();
  }

  async assertNoAdminCustomerListing(): Promise<void> {
    await expect(this.customerPage.customerSearchInput()).toHaveCount(0);
    await expect(this.customerPage.customerTable()).toHaveCount(0);
  }

  async assertNoEditControl(): Promise<void> {
    await expect(this.customerPage.editCustomerButton()).toHaveCount(0);
  }
}
