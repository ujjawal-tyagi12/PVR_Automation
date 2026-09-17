import { Page, expect } from '@playwright/test';
import { DeeplinksManagementPage } from '@pages/DeeplinksManagementPage';
import { Logger } from '@utils/Logger';

/**
 * Orchestrates the home page as the common anchor for Deeplinks Management scenarios — see
 * DeeplinksManagementPage for what was checked and ruled out. No admin deep-link surface exists
 * anywhere on this app.
 */
export class DeeplinksManagementModule {
  private deeplinksPage: DeeplinksManagementPage;

  constructor(private page: Page) {
    this.deeplinksPage = new DeeplinksManagementPage(page);
  }

  async open(): Promise<void> {
    Logger.info('Opening the home page (no admin Deeplinks Management screen exists)');
    await this.deeplinksPage.goto();
  }

  async assertNoAdminDeeplinkControls(): Promise<void> {
    await expect(this.deeplinksPage.addLinkButton()).toHaveCount(0);
    await expect(this.deeplinksPage.linkTable()).toHaveCount(0);
    await expect(this.deeplinksPage.screenNameInput()).toHaveCount(0);
    await expect(this.deeplinksPage.universalTab()).toHaveCount(0);
    await expect(this.deeplinksPage.deferredTab()).toHaveCount(0);
  }
}
