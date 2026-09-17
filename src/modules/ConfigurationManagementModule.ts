import { Page, expect } from '@playwright/test';
import { ConfigurationManagementPage } from '@pages/ConfigurationManagementPage';
import { Logger } from '@utils/Logger';

/**
 * Orchestrates the home page as the common anchor for Configuration Management scenarios — see
 * ConfigurationManagementPage for what was checked and ruled out. No admin settings surface
 * exists anywhere on this app.
 */
export class ConfigurationManagementModule {
  private configPage: ConfigurationManagementPage;

  constructor(private page: Page) {
    this.configPage = new ConfigurationManagementPage(page);
  }

  async open(): Promise<void> {
    Logger.info('Opening the home page (no admin Configuration Management screen exists)');
    await this.configPage.goto();
  }

  async assertNoConfigurationEntryPoint(): Promise<void> {
    await expect(this.configPage.configurationMenuItem()).toHaveCount(0);
    await expect(this.configPage.settingsLink()).toHaveCount(0);
  }
}
