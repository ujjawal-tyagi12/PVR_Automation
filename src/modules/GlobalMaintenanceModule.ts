import { Page, expect } from '@playwright/test';
import { GlobalMaintenancePage } from '@pages/GlobalMaintenancePage';
import { Logger } from '@utils/Logger';

/**
 * Orchestrates the home page as the common anchor for Global Maintenance scenarios — see
 * GlobalMaintenancePage for what was checked and ruled out. No admin maintenance-mode surface
 * exists anywhere on this app.
 */
export class GlobalMaintenanceModule {
  private maintenancePage: GlobalMaintenancePage;

  constructor(private page: Page) {
    this.maintenancePage = new GlobalMaintenancePage(page);
  }

  async open(): Promise<void> {
    Logger.info('Opening the home page (no admin Global Maintenance screen exists)');
    await this.maintenancePage.goto();
  }

  async assertNoPlatformControls(): Promise<void> {
    await expect(this.maintenancePage.selectAllCheckbox()).toHaveCount(0);
    await expect(this.maintenancePage.brandSelectAllCheckbox()).toHaveCount(0);
    await expect(this.maintenancePage.maintenanceToggle()).toHaveCount(0);
  }

  async assertNoMessageForm(): Promise<void> {
    await expect(this.maintenancePage.messageField()).toHaveCount(0);
    await expect(this.maintenancePage.wordCounter()).toHaveCount(0);
  }

  async assertNoSaveOrCancel(): Promise<void> {
    await expect(this.maintenancePage.saveButton()).toHaveCount(0);
    await expect(this.maintenancePage.cancelButton()).toHaveCount(0);
  }
}
