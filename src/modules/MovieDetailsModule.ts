import { Page, expect } from '@playwright/test';
import { MovieDetailsPage } from '@pages/MovieDetailsPage';
import { Logger } from '@utils/Logger';

/**
 * Orchestrates the real /moviesessions/{City}/{MovieSlug}/{MovieId} combined details +
 * showtime page for the Now Showing Movies Details Page sheet module — see MovieDetailsPage
 * for what was grounded.
 *
 * @hritik
 */
export class MovieDetailsModule {
  private moviePage: MovieDetailsPage;

  constructor(private page: Page) {
    this.moviePage = new MovieDetailsPage(page);
  }

  async open(city: string, movieSlug: string, movieId: string): Promise<void> {
    Logger.info(`Opening movie details for ${movieSlug}`);
    await this.moviePage.goto(city, movieSlug, movieId);
  }

  async assertMovieDetailsLoaded(expectedTitle: string): Promise<void> {
    await expect(this.moviePage.movieTitleHeading()).toContainText(expectedTitle, { timeout: 15000 });
  }

  async playTrailerAndAssertOpens(): Promise<void> {
    await this.moviePage.watchTrailerButton().click();
    await expect(this.moviePage.trailerDialog()).toBeVisible({ timeout: 10000 });
    await expect(this.moviePage.trailerIframe()).toBeVisible({ timeout: 10000 });
  }

  async assertShowtimeColorCodingLegendShown(): Promise<void> {
    await expect(this.moviePage.showtimeLegendAvailable()).toBeVisible({ timeout: 15000 });
    await expect(this.moviePage.showtimeLegendFillingFast()).toBeVisible();
    await expect(this.moviePage.showtimeLegendSoldOut()).toBeVisible();
    await expect(this.moviePage.showtimeLegendLapsed()).toBeVisible();
  }

  async assertShowtimesSortedAscending(): Promise<void> {
    const times = await this.moviePage.showtimeTimes().allInnerTexts();
    expect(times.length).toBeGreaterThan(0);
    const toMinutes = (t: string): number => {
      const [time, meridiem] = t.split(' ');
      // eslint-disable-next-line prefer-const
      let [hours, minutes] = time.split(':').map(Number);
      if (meridiem === 'PM' && hours !== 12) hours += 12;
      if (meridiem === 'AM' && hours === 12) hours = 0;
      return hours * 60 + minutes;
    };
    const minutesList = times.map(toMinutes);
    const sorted = [...minutesList].sort((a, b) => a - b);
    expect(minutesList).toEqual(sorted);
  }

  /** Switches to the 2nd available date button (the 1st is usually today, already selected) —
   * dynamic rather than a hardcoded date label, since real dates shift daily. */
  async switchToAnotherAvailableDate(): Promise<void> {
    const dates = this.moviePage.dateSelectorButtons();
    const count = await dates.count();
    expect(count).toBeGreaterThan(1);
    await dates.nth(1).click();
  }

  async assertShowtimeGridVisible(): Promise<void> {
    await expect(this.moviePage.showtimeTimes().first()).toBeVisible({ timeout: 15000 });
  }

  async openFormatFilter(): Promise<void> {
    await this.moviePage.filterButton().click();
    await expect(this.moviePage.experiencesFilterButton()).toBeVisible({ timeout: 10000 });
  }

  async assertLanguageAndSubtitleInfoShown(): Promise<void> {
    await expect(this.moviePage.wheelchairIcon()).toBeVisible({ timeout: 15000 });
    await expect(this.moviePage.subtitleIcon()).toBeVisible();
  }
}
