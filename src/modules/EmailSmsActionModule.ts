import { Page, expect } from '@playwright/test';
import { EmailSmsActionPage } from '@pages/EmailSmsActionPage';
import { Logger } from '@utils/Logger';

/**
 * Orchestrates the home page as the common anchor for Email SMS Action scenarios — see
 * EmailSmsActionPage for what was checked and ruled out. No admin notification-log surface
 * exists anywhere on this app.
 */
export class EmailSmsActionModule {
  private esaPage: EmailSmsActionPage;

  constructor(private page: Page) {
    this.esaPage = new EmailSmsActionPage(page);
  }

  async open(): Promise<void> {
    Logger.info('Opening the home page (no admin Email SMS Action screen exists)');
    await this.esaPage.goto();
  }

  async assertNoAdminNotificationControls(): Promise<void> {
    await expect(this.esaPage.trackIdSearchInput()).toHaveCount(0);
    await expect(this.esaPage.notificationTable()).toHaveCount(0);
    await expect(this.esaPage.purposeTypeCombobox()).toHaveCount(0);
  }

  async assertNoResendControls(): Promise<void> {
    await expect(this.esaPage.resendEmailButton()).toHaveCount(0);
    await expect(this.esaPage.resendSmsButton()).toHaveCount(0);
    await expect(this.esaPage.resendWhatsappButton()).toHaveCount(0);
  }
}
