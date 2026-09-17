import { Page, expect } from '@playwright/test';
import { GiftCardMasterPage } from '@pages/GiftCardMasterPage';
import { Logger } from '@utils/Logger';
import { WaitHelper } from '@utils/WaitHelper';

/**
 * Orchestrates the real, public gift-card listing at /gift-cards — see GiftCardMasterPage for
 * what was verified and what has no reachable admin equivalent (the Scheme Master CRUD table).
 */
export class GiftCardMasterModule {
  private giftCardPage: GiftCardMasterPage;

  constructor(private page: Page) {
    this.giftCardPage = new GiftCardMasterPage(page);
  }

  async open(): Promise<void> {
    Logger.info('Opening the real public gift-card listing (no admin Scheme Master table exists)');
    await this.giftCardPage.goto();
    // This page's client-side hydration is occasionally slower than the default 10s expect
    // timeout under live load (confirmed via repeated flaky failures, all on this exact
    // assertion) — gate on WaitHelper.forHydration() first, then keep the generous timeout as a
    // second line of defense for this specific heading.
    await WaitHelper.forHydration(this.page);
    await expect(this.giftCardPage.pageHeading()).toBeVisible({ timeout: 20000 });
  }

  async assertOccasionChipFilters(chip: string): Promise<void> {
    const button = this.giftCardPage.occasionChip(chip);
    await expect(button).toBeVisible();
    await button.click();
  }

  async assertNoAdminTable(): Promise<void> {
    await expect(this.giftCardPage.schemeTable()).toHaveCount(0);
    await expect(this.giftCardPage.createSchemeButton()).toHaveCount(0);
    await expect(this.giftCardPage.editButton()).toHaveCount(0);
  }

  async assertNoAdminSearchOrFilters(): Promise<void> {
    await expect(this.giftCardPage.searchInput()).toHaveCount(0);
    await expect(this.giftCardPage.imagesFilter()).toHaveCount(0);
    await expect(this.giftCardPage.statusFilter()).toHaveCount(0);
    await expect(this.giftCardPage.validityFromInput()).toHaveCount(0);
    await expect(this.giftCardPage.validityToInput()).toHaveCount(0);
    await expect(this.giftCardPage.lastEditedFilter()).toHaveCount(0);
  }

  async assertNoImageOrSequenceControls(): Promise<void> {
    await expect(this.giftCardPage.imageUploadInput()).toHaveCount(0);
    await expect(this.giftCardPage.mainImageDropdown()).toHaveCount(0);
    await expect(this.giftCardPage.sequenceField()).toHaveCount(0);
    await expect(this.giftCardPage.statusToggle()).toHaveCount(0);
  }

  async assertNoSyncButton(): Promise<void> {
    await expect(this.giftCardPage.syncButton()).toHaveCount(0);
  }
}
