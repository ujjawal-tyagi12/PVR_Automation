import { Page } from '@playwright/test';

/**
 * Grounded against the live app at BASE_URL (direct Playwright probe, 2026-09-22). Reached by
 * clicking a real showtime button on the movie-sessions page — real route
 * `/seatLayout/{encoded-params}`. Categories (Executive/Club/Royal/Royal Recliner) render as
 * table rows with numbered seat buttons (accessible name is just the seat number, no row/
 * wheelchair info — wheelchair seats aren't reliably locatable by accessible name alone).
 * Confirmed live: cross-category selection is blocked with a real dialog, and a real 10-seat
 * cap dialog appears on the 11th selection.
 *
 * @hritik
 */
export class SeatLayoutPage {
  constructor(private page: Page) {}

  categoryHeading = (category: string) => this.page.getByRole('heading', { name: new RegExp(`^${category}:`, 'i') });
  categoryRow = (category: string) => this.page.locator('table').getByRole('row').filter({ has: this.categoryHeading(category) });
  // Grounded 2026-09-23: not every real cinema/screen uses "Executive"/"Club" — confirmed live
  // on a different, randomly-reached real cinema. All category-heading level-4s, in whatever
  // real order they render, is the environment-agnostic way to discover real category names.
  allCategoryHeadings = () => this.page.locator('table').getByRole('heading', { level: 4 });
  // Grounded 2026-09-23: filter({ hasNot: locator('[disabled]') }) checks for a disabled
  // *descendant*, not the seat button's own disabled attribute — a latent bug confirmed live
  // (it only worked before by coincidence, when the first seat in DOM order happened to be
  // enabled). button:not([disabled]) checks the attribute correctly.
  availableSeatsInCategory = (category: string) => this.categoryRow(category).locator('button:not([disabled])');
  continueButton = () => this.page.getByRole('button', { name: 'Continue', exact: true });
  totalTicketPriceLabel = () => this.page.getByText('Total Ticket Price');
  crossCategoryDialogHeading = () => this.page.getByRole('heading', { name: 'Seat Selection Not Allowed' });
  crossCategoryDialogOkayButton = () => this.page.getByRole('button', { name: 'Okay, Got It' });
  maxSeatsDialogHeading = () => this.page.getByRole('heading', { name: /maximum seats/i });
  // Grounded 2026-09-22: "Selected" (and potentially others) appear twice on this page — the
  // legend plus a separate seat-info label — a real strict-mode violation confirmed live.
  // .first() targets the legend's.
  availableLegend = () => this.page.getByText('Available', { exact: true }).first();
  occupiedLegend = () => this.page.getByText('Occupied', { exact: true }).first();
  selectedLegend = () => this.page.getByText('Selected', { exact: true }).first();
  wheelchairLegend = () => this.page.getByText('Wheelchair', { exact: true }).first();

  async gotoMovieSessionsAndOpenShowtime(city: string, movieSlug: string, movieId: string, timeLabel: string): Promise<void> {
    await this.page.goto(`/moviesessions/${city}/${movieSlug}/${movieId}`);
    await this.page.getByRole('button', { name: new RegExp(`^${timeLabel}`, 'i') }).first().click();
  }

  // Grounded 2026-09-23: a hardcoded movie slug/id is live catalog data — confirmed to not
  // exist on preprod (real "Movie Not Found!" page). Following a real homepage movie link,
  // then any real showtime button on that page, is the environment-agnostic path here.
  homepageMovieLink = () => this.page.locator('a[href*="/moviesessions/"]').first();
  anyShowtimeButton = () => this.page.getByRole('button', { name: /^\d{2}:\d{2} (AM|PM)/ }).first();

  async gotoAnyRealMovieAndOpenShowtime(): Promise<void> {
    await this.page.goto('/');
    const href = await this.homepageMovieLink().getAttribute('href');
    if (!href) throw new Error('No real movie link found on the homepage');
    await this.page.goto(href);
    await this.anyShowtimeButton().click();
  }
}
