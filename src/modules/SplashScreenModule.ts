import { Page, expect } from '@playwright/test';
import { SplashScreenPage } from '@pages/SplashScreenPage';
import { Logger } from '@utils/Logger';

/**
 * Orchestrates the home page as the common anchor for the Splash Screen scenario — see
 * SplashScreenPage for what was checked and ruled out. No web equivalent of the native
 * app-store version-gate concept exists on this app.
 *
 * @hritik
 */
export class SplashScreenModule {
  private splashPage: SplashScreenPage;

  constructor(private page: Page) {
    this.splashPage = new SplashScreenPage(page);
  }

  async open(): Promise<void> {
    Logger.info('Opening the home page (no web version-gate/splash concept exists)');
    await this.splashPage.goto();
  }

  async assertNoVersionGate(): Promise<void> {
    await expect(this.splashPage.updateRequiredPrompt()).toHaveCount(0);
    await expect(this.splashPage.splashLogo()).toHaveCount(0);
  }
}
