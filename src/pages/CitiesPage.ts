import { Page } from '@playwright/test';

/**
 * Grounded against the live app at BASE_URL (Playwright MCP, 2026-09-02). The original sheet's
 * Cities scenarios assume a backend admin screen (Export CSV, Sync City Master, per-row Sync,
 * Edit City with field validation) — no such screen exists anywhere reachable from BASE_URL's UI.
 * Checked: the full header nav, the footer, and every one of the 14 items in the "More" dropdown
 * (Offers, Privilege Plus, Curated Shows, Kotak Credit Card, Gift Cards, ODR Portal, NVSP, NEST,
 * Bulk Gift Card, Corporate Booking, Career, Investor, News, About Us, Advertise with us) — each
 * either a public marketing page on this same domain or, for NEST, an entirely separate external
 * site (pvrnest.godaddysites.com). None lead to a city-master admin surface.
 *
 * The only real "Cities" surface on this app is the customer-facing "Select Your City" location
 * picker (header, the city-name button next to the logo) — a search box plus a Popular
 * cities / All cities list a visitor uses to pick where to browse movies. See cities.spec.ts for
 * how each original CIT-xxx scenario maps to this real flow.
 */
export class CitiesPage {
  constructor(private page: Page) {}

  citySelectorButton = () => this.page.getByRole('banner').getByRole('button', { name: /Map Point Icon/i });
  closeGoogleWalletPromoButton = () => this.page.getByRole('button', { name: 'close modal' });

  cityDialog = () => this.page.getByRole('dialog').filter({ has: this.page.getByRole('heading', { name: 'Select Your City' }) });
  selectCityHeading = () => this.page.getByRole('heading', { name: 'Select Your City' });
  searchCityInput = () => this.cityDialog().getByRole('textbox', { name: 'Search city' });
  shareLocationText = () => this.page.getByText('Tap to share location');

  popularCitiesHeading = () => this.page.getByRole('heading', { name: 'Popular cities' });
  popularCityButtons = () => this.page.getByRole('button', { name: /^Click to select .* as your location$/i });
  allCitiesHeading = () => this.page.getByRole('heading', { name: 'All cities' });
  cityResultButton = (city: string) => this.page.getByRole('button', { name: new RegExp(`select ${city} as your location`, 'i') });

  cityNotFoundHeading = () => this.page.getByRole('heading', { name: 'City Not Found!' });
  cityNotFoundMessage = () => this.page.getByText('No matches found. Please try a different keyword.');

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  async openCitySelector(): Promise<void> {
    await this.citySelectorButton().click();
  }

  async searchCity(term: string): Promise<void> {
    await this.searchCityInput().fill(term);
  }

  async closeCitySelector(): Promise<void> {
    await this.page.keyboard.press('Escape');
  }
}
