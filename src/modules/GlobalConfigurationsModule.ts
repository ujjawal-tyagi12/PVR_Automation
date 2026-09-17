import { Page, expect } from '@playwright/test';
import { GlobalConfigurationsPage } from '@pages/GlobalConfigurationsPage';
import { Logger } from '@utils/Logger';

/**
 * Orchestrates the home page as the common anchor for Global Configurations scenarios — see
 * GlobalConfigurationsPage for what was checked and ruled out. No admin global-configurations
 * surface exists anywhere on this app.
 */
export class GlobalConfigurationsModule {
  private configPage: GlobalConfigurationsPage;

  constructor(private page: Page) {
    this.configPage = new GlobalConfigurationsPage(page);
  }

  async open(): Promise<void> {
    Logger.info('Opening the home page (no admin Global Configurations screen exists)');
    await this.configPage.goto();
  }

  async assertNoConfigTable(): Promise<void> {
    await expect(this.configPage.configTable()).toHaveCount(0);
    await expect(this.configPage.inoxTab()).toHaveCount(0);
  }

  async assertNoSearchOrFilters(): Promise<void> {
    await expect(this.configPage.typeSearch()).toHaveCount(0);
    await expect(this.configPage.subTypeSearch()).toHaveCount(0);
    await expect(this.configPage.dateRangeFilter()).toHaveCount(0);
  }

  async assertNoAddOrEditForm(): Promise<void> {
    await expect(this.configPage.addButton()).toHaveCount(0);
    await expect(this.configPage.editButton()).toHaveCount(0);
    await expect(this.configPage.sameAsAboveCheckbox()).toHaveCount(0);
    await expect(this.configPage.valueField()).toHaveCount(0);
    await expect(this.configPage.descriptionField()).toHaveCount(0);
  }
}
