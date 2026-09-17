import { Page, expect } from '@playwright/test';
import { GiftCardSectionStaticManagementPage } from '@pages/GiftCardSectionStaticManagementPage';
import { Logger } from '@utils/Logger';
import { WaitHelper } from '@utils/WaitHelper';

/**
 * Orchestrates the real, public gift-card page's static content at /gift-cards — see
 * GiftCardSectionStaticManagementPage for what was verified and what has no reachable admin
 * equivalent (the Static Management edit form).
 */
export class GiftCardSectionStaticManagementModule {
  private staticPage: GiftCardSectionStaticManagementPage;

  constructor(private page: Page) {
    this.staticPage = new GiftCardSectionStaticManagementPage(page);
  }

  async open(): Promise<void> {
    Logger.info('Opening the real public gift-card page static content (no admin edit form exists)');
    await this.staticPage.goto();
    // Same live page as GiftCardMasterModule — its client-side hydration is occasionally
    // slower than the default 10s expect timeout (see that module for the confirmed pattern).
    await WaitHelper.forHydration(this.page);
    await expect(this.staticPage.pageHeading()).toBeVisible({ timeout: 20000 });
  }

  async assertRealStaticContentVisible(): Promise<void> {
    await expect(this.staticPage.subTitleText()).toBeVisible();
    await expect(this.staticPage.bodyCopyText()).toBeVisible();
    await expect(this.staticPage.howItWorksButton()).toBeVisible();
  }

  async assertNoEditForm(): Promise<void> {
    await expect(this.staticPage.titleField()).toHaveCount(0);
    await expect(this.staticPage.subTitleField()).toHaveCount(0);
    await expect(this.staticPage.whyBuyField()).toHaveCount(0);
    await expect(this.staticPage.howItWorksDescField()).toHaveCount(0);
    await expect(this.staticPage.importantInfoField()).toHaveCount(0);
    await expect(this.staticPage.saveButton()).toHaveCount(0);
  }

  async assertNoImageUpload(): Promise<void> {
    await expect(this.staticPage.imageUploadInput()).toHaveCount(0);
  }
}
