import { Page } from '@playwright/test';

/**
 * Grounded against the live app at BASE_URL/moviesessions/mumbai/dhurandharhindi/30205 (direct
 * Playwright probe, 2026-09-08) — a real, public movie session page showing a genuine, aggregated
 * "User Ratings" badge (e.g. "4.5") with a star icon. No admin report of individual per-customer
 * ratings (a searchable/filterable/sortable listing) exists anywhere on this app — checked
 * directly, not assumed.
 */
export class CustomerFeedbackMovieRatingsPage {
  constructor(private page: Page) {}

  // "User Ratings" is the accessible name of an icon image, not visible text — the real rating
  // value renders as sibling text (e.g. "4.5") (confirmed live, 2026-09-08).
  userRatingsBadge = () => this.page.getByRole('img', { name: /user ratings/i });
  movieHeading = () => this.page.getByRole('heading', { level: 1 }).first();

  // Admin-only report controls asserted absent — none exist on this real, public movie page.
  selectMovieDropdown = () => this.page.getByLabel(/select movie/i);
  reportTable = () => this.page.getByRole('table');
  filterButton = () => this.page.getByRole('button', { name: /^filter$/i });
  editRatingButton = () => this.page.getByRole('button', { name: /edit rating/i });

  async goto(): Promise<void> {
    await this.page.goto('/moviesessions/mumbai/dhurandharhindi/30205');
  }
}
