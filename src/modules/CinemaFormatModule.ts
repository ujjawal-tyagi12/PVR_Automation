import { Page, expect } from '@playwright/test';
import { CinemaFormatPage } from '@pages/CinemaFormatPage';
import { Logger } from '@utils/Logger';

/**
 * Orchestrates the real /experiences page for the Cinema Format/Experience sheet module — see
 * CinemaFormatPage for what was grounded.
 *
 * @hritik
 */
export class CinemaFormatModule {
  private formatPage: CinemaFormatPage;

  constructor(private page: Page) {
    this.formatPage = new CinemaFormatPage(page);
  }

  async open(): Promise<void> {
    Logger.info('Opening the experiences/formats page');
    await this.formatPage.goto();
  }

  async assertFormatsListed(): Promise<void> {
    await expect(this.formatPage.formatImage('INSIGNIA')).toBeVisible({ timeout: 15000 });
    await expect(this.formatPage.formatImage('MX4D')).toBeVisible();
    await expect(this.formatPage.formatImage('ScreenX')).toBeVisible();
  }

  async assertFormatDetailShown(): Promise<void> {
    await expect(this.formatPage.formatFeaturesHeading()).toBeVisible({ timeout: 15000 });
    await expect(this.formatPage.moviesShowingHeading()).toBeVisible();
  }
}
