import { Page } from '@playwright/test';

/**
 * Grounded against the live app at BASE_URL (direct Playwright probe, 2026-09-22). The real
 * route is /cinemas/{City} — a split view: a list of active cinemas for the city (name,
 * distance, wheelchair icon) on the left, and a detail panel (address, amenities, showtimes,
 * now-showing movies) for whichever cinema is selected on the right. No search box exists
 * anywhere on this page — confirmed absent, not assumed. A city with zero active cinemas shows
 * a real "No Result Found!" empty state instead of a blank/broken page.
 *
 * @hritik
 */
export class CinemasListingPage {
  constructor(private page: Page) {}

  allCinemasHeading = () => this.page.getByRole('heading', { name: 'All Cinemas' });
  cinemaCountHeading = () => this.page.getByRole('heading', { name: /^\d+ Cinemas?$/ });
  listViewButton = () => this.page.getByRole('button', { name: /List View/i });
  mapViewButton = () => this.page.getByRole('button', { name: /Map View/i });
  cinemaHeading = (name: string) => this.page.getByRole('heading', { name, exact: true }).first();
  getDirectionsButton = () => this.page.getByRole('button', { name: 'Get Directions' });
  amenitiesHeading = () => this.page.getByRole('heading', { name: 'Amenities' });
  noResultsHeading = () => this.page.getByRole('heading', { name: 'No Result Found!' });
  noResultsText = () => this.page.getByText('Currently, no data is available');
  searchTextbox = () => this.page.getByRole('textbox', { name: /search/i });

  async goto(city: string): Promise<void> {
    await this.page.goto(`/cinemas/${city}`);
  }
}
