import { Page, expect } from '@playwright/test';
import { CustomerFeedbackMovieRatingsPage } from '@pages/CustomerFeedbackMovieRatingsPage';
import { Logger } from '@utils/Logger';

/**
 * Orchestrates a real, public movie session page — see CustomerFeedbackMovieRatingsPage for what
 * was verified and what has no reachable admin equivalent (the Reports → Customer Feedback
 * (Movie Ratings) per-customer listing).
 */
export class CustomerFeedbackMovieRatingsModule {
  private ratingsPage: CustomerFeedbackMovieRatingsPage;

  constructor(private page: Page) {
    this.ratingsPage = new CustomerFeedbackMovieRatingsPage(page);
  }

  async open(): Promise<void> {
    Logger.info('Opening a real movie session page (no admin per-customer ratings report exists)');
    await this.ratingsPage.goto();
    await expect(this.ratingsPage.movieHeading()).toBeVisible();
  }

  async assertRealAggregateRatingVisible(): Promise<void> {
    await expect(this.ratingsPage.userRatingsBadge()).toBeVisible();
  }

  async assertNoAdminReportControls(): Promise<void> {
    await expect(this.ratingsPage.selectMovieDropdown()).toHaveCount(0);
    await expect(this.ratingsPage.reportTable()).toHaveCount(0);
    await expect(this.ratingsPage.filterButton()).toHaveCount(0);
  }

  async assertNoEditRatingControl(): Promise<void> {
    await expect(this.ratingsPage.editRatingButton()).toHaveCount(0);
  }
}
