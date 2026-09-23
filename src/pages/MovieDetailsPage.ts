import { Page } from '@playwright/test';

/**
 * Grounded against the live app at BASE_URL (direct Playwright probe, 2026-09-22). The real
 * route is /moviesessions/{City}/{MovieSlug}/{MovieId} — a combined details + showtime page:
 * title/genre/language/censor-rating/duration/rating/synopsis at the top, a date selector, a
 * showtime grid per cinema (time, language, Wheelchair/Subtitle icons), and a legend
 * ("Available Filling Fast Sold Out Lapsed") confirming the color-coding concept. "Watch
 * Trailer" opens a real dialog with a video iframe.
 *
 * @hritik
 */
export class MovieDetailsPage {
  constructor(private page: Page) {}

  movieTitleHeading = () => this.page.getByRole('heading', { level: 1 });
  watchTrailerButton = () => this.page.getByRole('button', { name: /watch trailer/i });
  trailerDialog = () => this.page.getByRole('dialog');
  trailerIframe = () => this.page.locator('iframe').first();
  // Grounded 2026-09-22: these render as 4 separate badge elements, not one combined text
  // node — a real failure on a single combined getByText() confirmed no element actually
  // contains all four phrases together.
  showtimeLegendAvailable = () => this.page.getByText('Available', { exact: true });
  showtimeLegendFillingFast = () => this.page.getByText('Filling Fast', { exact: true });
  showtimeLegendSoldOut = () => this.page.getByText('Sold Out', { exact: true });
  showtimeLegendLapsed = () => this.page.getByText('Lapsed', { exact: true });
  showtimeTimes = () => this.page.getByText(/^\d{2}:\d{2} (AM|PM)$/);
  // Date buttons render as "{day} {weekday}" (e.g. "23 Wed") — matched generically since the
  // real dates shift daily and shouldn't be hardcoded.
  dateSelectorButtons = () => this.page.getByRole('button', { name: /^\d{1,2} (Mon|Tue|Wed|Thu|Fri|Sat|Sun)$/ });
  filterButton = () => this.page.getByRole('button', { name: /Filter Icon Filter/i });
  experiencesFilterButton = () => this.page.getByRole('button', { name: 'Experiences', exact: true });
  wheelchairIcon = () => this.page.getByRole('img', { name: 'Wheelchair Icon' }).first();
  subtitleIcon = () => this.page.getByRole('img', { name: 'Sub Title Icon' }).first();

  async goto(city: string, movieSlug: string, movieId: string): Promise<void> {
    await this.page.goto(`/moviesessions/${city}/${movieSlug}/${movieId}`);
  }

  // Grounded 2026-09-23: a hardcoded movie slug/id is live catalog data — confirmed to not
  // exist on preprod (real "Movie Not Found!" page). The homepage always links to whatever
  // movies are actually showing, so following one of those real links is the environment-
  // agnostic way to reach a real movie details page.
  homepageMovieLink = () => this.page.locator('a[href*="/moviesessions/"]').first();

  async gotoHomepage(): Promise<void> {
    await this.page.goto('/');
  }
}
