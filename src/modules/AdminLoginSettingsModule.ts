import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { AdminLoginSettingsPage } from '@pages/AdminLoginSettingsPage';
import { Logger } from '@utils/Logger';
import { config } from '@config/index';

export class AdminLoginSettingsModule {
  private readonly adminPage: AdminLoginSettingsPage;

  constructor(private page: Page) {
    this.adminPage = new AdminLoginSettingsPage(page);
  }

  async gotoAdminLoginSettings(): Promise<void> {
    Logger.info(`Navigating to Admin Login Settings at ${config.adminBaseUrl}`);
    await this.adminPage.goto();
    await this.adminPage.loginAsAdmin(config.testUsername, config.testPassword);
    await this.adminPage.openLoginSettings();
  }

  async setMaxDeviceLimit(value: string): Promise<void> {
    Logger.info(`Setting max device limit to ${value}`);
    await this.adminPage.selectMaxDevices(value);
    await this.adminPage.save();
  }

  async expectSaveSucceeded(): Promise<void> {
    await expect(this.adminPage.saveSuccessMessage()).toBeVisible();
  }

  async expectDropdownOptions(expectedValues: string[]): Promise<void> {
    const optionTexts = await this.adminPage.getMaxDeviceOptionTexts();
    for (const value of expectedValues) {
      expect(optionTexts).toContain(value);
    }
  }
}
