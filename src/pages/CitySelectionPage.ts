import { Page } from '@playwright/test';

/**
 * Grounded against the live app at BASE_URL (direct Playwright probe, 2026-09-22). The real
 * city picker is the header's location button → "Select Your City" dialog: a search box,
 * "Popular cities" (5 quick-select buttons), and "All cities" (a full alphabetical list). A
 * search with no match shows a real "City Not Found!" message.
 *
 * @hritik
 */
export class CitySelectionPage {
  constructor(private page: Page) {}

  cityButton = () => this.page.getByRole('button', { name: /Map Point Icon/i });
  cityDialogHeading = () => this.page.getByRole('heading', { name: 'Select Your City' });
  searchCityInput = () => this.page.getByRole('textbox', { name: 'Search city' });
  popularCitiesHeading = () => this.page.getByRole('heading', { name: 'Popular cities' });
  cityNotFoundHeading = () => this.page.getByRole('heading', { name: 'City Not Found!' });
  cityNotFoundText = () => this.page.getByText('No matches found. Please try a different keyword.');
  cityResultButton = (city: string) => this.page.getByRole('button', { name: `Click to select ${city} as your location` });

  async goto(): Promise<void> {
    await this.page.goto('/');
  }
}
