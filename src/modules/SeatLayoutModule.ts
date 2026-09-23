import { Page, expect } from '@playwright/test';
import { SeatLayoutPage } from '@pages/SeatLayoutPage';
import { Logger } from '@utils/Logger';

/**
 * Orchestrates the real seat layout page for the Seat Layout Screen sheet module — see
 * SeatLayoutPage for what was grounded.
 *
 * @hritik
 */
export class SeatLayoutModule {
  private seatPage: SeatLayoutPage;

  constructor(private page: Page) {
    this.seatPage = new SeatLayoutPage(page);
  }

  async openSeatLayout(city: string, movieSlug: string, movieId: string, timeLabel: string): Promise<void> {
    Logger.info(`Opening seat layout for ${movieSlug} at ${timeLabel}`);
    await this.seatPage.gotoMovieSessionsAndOpenShowtime(city, movieSlug, movieId, timeLabel);
  }

  /** Environment-agnostic alternative to openSeatLayout() — a hardcoded movie slug/id is live
   * catalog data that doesn't carry across environments (confirmed live: a real
   * "Movie Not Found!" page on preprod). Follows a real movie + real showtime instead. */
  async openSeatLayoutForAnyRealMovie(): Promise<void> {
    Logger.info('Opening seat layout for a real movie/showtime from the homepage');
    await this.seatPage.gotoAnyRealMovieAndOpenShowtime();
  }

  async assertLayoutLoadedWithCategories(): Promise<void> {
    await expect(this.seatPage.allCategoryHeadings().first()).toBeVisible({ timeout: 15000 });
  }

  /** Reads the real category names present for whatever movie/cinema was reached — "Executive"
   * etc. are specific cinema config, not universal (confirmed live). Extracts just the name
   * before the ":" from each heading's full text (e.g. "Executive: ₹101.68 + GST" →
   * "Executive"). */
  async discoverCategoryNames(): Promise<string[]> {
    await expect(this.seatPage.allCategoryHeadings().first()).toBeVisible({ timeout: 15000 });
    const texts = await this.seatPage.allCategoryHeadings().allInnerTexts();
    return texts.map((t) => t.split(':')[0].trim());
  }

  async assertColorCodingLegendShown(): Promise<void> {
    await expect(this.seatPage.availableLegend()).toBeVisible({ timeout: 15000 });
    await expect(this.seatPage.occupiedLegend()).toBeVisible();
    await expect(this.seatPage.selectedLegend()).toBeVisible();
    await expect(this.seatPage.wheelchairLegend()).toBeVisible();
  }

  async selectFirstAvailableSeat(category: string): Promise<void> {
    await this.seatPage.availableSeatsInCategory(category).first().click();
  }

  async assertSeatSelectedAndPriceUpdated(): Promise<void> {
    await expect(this.seatPage.continueButton()).toBeVisible({ timeout: 10000 });
    await expect(this.seatPage.totalTicketPriceLabel()).toBeVisible();
  }

  async deselectFirstSelectedSeat(category: string): Promise<void> {
    // The same seat button toggles selection off on a second click.
    await this.seatPage.availableSeatsInCategory(category).first().click();
  }

  async assertNoSeatSelected(): Promise<void> {
    await expect(this.page.getByText('Select Seats To Continue')).toBeVisible({ timeout: 10000 });
  }

  async attemptCrossCategorySelection(firstCategory: string, secondCategory: string): Promise<void> {
    await this.selectFirstAvailableSeat(firstCategory);
    await this.selectFirstAvailableSeat(secondCategory);
  }

  async assertCrossCategoryBlocked(): Promise<void> {
    await expect(this.seatPage.crossCategoryDialogHeading()).toBeVisible({ timeout: 10000 });
    await this.seatPage.crossCategoryDialogOkayButton().click();
  }

  async selectSeatsUpToLimit(category: string, count: number): Promise<void> {
    const seats = this.seatPage.availableSeatsInCategory(category);
    for (let i = 0; i < count; i += 1) {
      await seats.nth(i).click();
    }
  }

  async assertMaxSeatsLimitReached(): Promise<void> {
    await expect(this.seatPage.maxSeatsDialogHeading()).toBeVisible({ timeout: 10000 });
  }
}
