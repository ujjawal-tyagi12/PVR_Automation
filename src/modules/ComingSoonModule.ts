import { Page, expect } from '@playwright/test';
import { ComingSoonPage } from '@pages/ComingSoonPage';
import { Logger } from '@utils/Logger';

/**
 * Orchestrates the real homepage Coming Soon tab control for the Coming Soon sheet module —
 * see ComingSoonPage for what was grounded and why deeper cases are adapted.
 *
 * @hritik
 */
export class ComingSoonModule {
  private comingSoonPage: ComingSoonPage;

  constructor(private page: Page) {
    this.comingSoonPage = new ComingSoonPage(page);
  }

  async open(): Promise<void> {
    Logger.info('Opening the home page');
    await this.comingSoonPage.goto();
  }

  async assertComingSoonTabExists(): Promise<void> {
    await expect(this.comingSoonPage.comingSoonTab()).toBeVisible({ timeout: 15000 });
  }

  async clickComingSoonTab(): Promise<void> {
    await this.comingSoonPage.comingSoonTab().click();
  }
}
