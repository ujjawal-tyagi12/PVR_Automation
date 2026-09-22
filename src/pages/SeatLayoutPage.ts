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
  availableSeatsInCategory = (category: string) =>
    this.categoryRow(category).getByRole('button').filter({ hasNot: this.page.locator('[disabled]') });
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
}
