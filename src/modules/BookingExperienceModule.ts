import { Page, expect } from '@playwright/test';
import { BookingExperiencePage } from '@pages/BookingExperiencePage';
import { Logger } from '@utils/Logger';

/**
 * Grounded against the live app at BASE_URL. No feedback-report surface exists
 * anywhere on this app — see BookingExperiencePage for what was checked.
 */
export class BookingExperienceModule {
  private experiencePage: BookingExperiencePage;

  constructor(private page: Page) {
    this.experiencePage = new BookingExperiencePage(page);
  }

  async open(): Promise<void> {
    Logger.info('Opening home page (closest checked real page — no feedback-report surface exists)');
    await this.experiencePage.goto();
  }

  async assertNoStarRatingFilter(): Promise<void> {
    await expect(this.experiencePage.starRatingFilter()).toHaveCount(0);
  }
}
