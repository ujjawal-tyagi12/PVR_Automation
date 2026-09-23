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
    // Grounded 2026-09-23: hardcoded format names (INSIGNIA/MX4D/ScreenX) are environment-
    // specific admin config — confirmed to differ between UAT and preprod (preprod has no
    // MX4D). A generic image count above the fixed header's baseline (4: Brand Logo, Map
    // Point Icon, User Icon, Download App GIF) is the environment-agnostic real signal that
    // the carousel rendered with formats, regardless of which ones are active.
    await expect(async () => {
      const count = await this.formatPage.allPageImages().count();
      expect(count).toBeGreaterThan(4);
    }).toPass({ timeout: 15000 });
  }

  async assertFormatDetailShown(): Promise<void> {
    await expect(this.formatPage.formatFeaturesHeading()).toBeVisible({ timeout: 15000 });
    await expect(this.formatPage.moviesShowingHeading()).toBeVisible();
  }
}
