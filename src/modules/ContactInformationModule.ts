import { Page, expect } from '@playwright/test';
import { ContactInformationPage } from '@pages/ContactInformationPage';
import { Logger } from '@utils/Logger';

/**
 * Orchestrates the real, public Customer Experience page at /feedback — see
 * ContactInformationPage for what was verified and what has no reachable admin equivalent (the
 * per-Brand/Country Contact Information CRUD table).
 */
export class ContactInformationModule {
  private contactPage: ContactInformationPage;

  constructor(private page: Page) {
    this.contactPage = new ContactInformationPage(page);
  }

  async open(): Promise<void> {
    Logger.info('Opening the real public Customer Experience page (no admin Contact Information table exists)');
    await this.contactPage.goto();
    await expect(this.contactPage.pageHeading()).toBeVisible();
  }

  async assertRealContactChannelsVisible(): Promise<void> {
    await expect(this.contactPage.contactUsHeading()).toBeVisible();
    await expect(this.contactPage.emailLink()).toHaveAttribute('href', 'mailto:feedback@pvrinox.com');
    await expect(this.contactPage.phoneLink()).toHaveAttribute('href', 'tel:+91-8800900009');
    await expect(this.contactPage.whatsappLink()).toBeVisible();
    await expect(this.contactPage.timingsText()).toBeVisible();
  }

  async assertNoAddOrDeleteControl(): Promise<void> {
    await expect(this.contactPage.addButton()).toHaveCount(0);
    await expect(this.contactPage.deleteButton()).toHaveCount(0);
  }

  async assertNoAdminTableOrEditControls(): Promise<void> {
    await expect(this.contactPage.brandCountryTable()).toHaveCount(0);
    await expect(this.contactPage.editButton()).toHaveCount(0);
    await expect(this.contactPage.lastEditedOnText()).toHaveCount(0);
  }
}
