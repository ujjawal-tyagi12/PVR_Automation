import { Page, expect } from '@playwright/test';
import { BadgesManagementPage } from '@pages/BadgesManagementPage';
import { Logger } from '@utils/Logger';

/**
 * Grounded against the live app at BASE_URL/passport. No badges-management
 * surface exists anywhere on this app — see BadgesManagementPage for what was
 * checked.
 */
export class BadgesManagementModule {
  private badgesPage: BadgesManagementPage;

  constructor(private page: Page) {
    this.badgesPage = new BadgesManagementPage(page);
  }

  async open(): Promise<void> {
    Logger.info('Opening /passport (closest checked real page — no badges surface exists)');
    await this.badgesPage.goto();
  }

  async assertNoBadgeSurface(): Promise<void> {
    await expect(this.badgesPage.badgeAnyMention()).toHaveCount(0);
  }

  async assertNoFileUploadControl(): Promise<void> {
    await expect(this.badgesPage.fileUploadInput()).toHaveCount(0);
  }
}
