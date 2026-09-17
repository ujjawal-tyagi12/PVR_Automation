import { Page } from '@playwright/test';

/**
 * Grounded against the live app at BASE_URL (direct Playwright probe, 2026-09-04). No
 * country-listing/switcher UI exists anywhere on this app — checked the header nav, footer,
 * every "More" dropdown item, and /sitemap.xml directly (same method used for cities.spec.ts).
 * This is a single-country (India) app end-to-end. Grounded against the home page as the anchor.
 */
export class CountriesPage {
  constructor(private page: Page) {}

  countrySearchInput = () => this.page.getByRole('textbox', { name: /search countr/i });
  countryTable = () => this.page.getByRole('table');
  addCountryButton = () => this.page.getByRole('button', { name: /^add$/i });
  editCountryButton = () => this.page.getByRole('button', { name: /^edit$/i });
  deleteCountryButton = () => this.page.getByRole('button', { name: /^delete$/i });
  countrySwitcherButton = () => this.page.getByRole('button', { name: /select.*countr/i });
  currentCityButton = () => this.page.getByRole('banner').getByRole('button', { name: /^Map Point Icon/i });

  async goto(): Promise<void> {
    await this.page.goto('/');
  }
}
