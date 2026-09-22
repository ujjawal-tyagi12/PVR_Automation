import { Page, expect } from '@playwright/test';
import { ErrorMaintenancePage } from '@pages/ErrorMaintenancePage';
import { Logger } from '@utils/Logger';

/**
 * Orchestrates the real invalid-route (404-style) page for the Error Page & Maintenance Page
 * sheet module — see ErrorMaintenancePage for what was grounded.
 *
 * @hritik
 */
export class ErrorMaintenanceModule {
  private errorPage: ErrorMaintenancePage;

  constructor(private page: Page) {
    this.errorPage = new ErrorMaintenancePage(page);
  }

  async openInvalidRoute(): Promise<void> {
    Logger.info('Navigating to an invalid route');
    await this.errorPage.gotoInvalidRoute();
  }

  async assertStyled404Shown(): Promise<void> {
    await expect(this.errorPage.backToHomeLink()).toBeVisible({ timeout: 15000 });
  }

  async assertBackToHomeNavigates(): Promise<void> {
    await this.errorPage.backToHomeLink().click();
    await expect(this.page).toHaveURL(/\/$/, { timeout: 15000 });
  }

  async simulateOfflineNavigation(): Promise<void> {
    await this.page.context().setOffline(true);
    try {
      await this.page.goto('/cinemas', { timeout: 8000 }).catch(() => undefined);
    } finally {
      await this.page.context().setOffline(false);
    }
  }
}
