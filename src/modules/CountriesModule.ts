import { Page, expect } from '@playwright/test';
import { CountriesPage } from '@pages/CountriesPage';
import { Logger } from '@utils/Logger';

/**
 * Orchestrates the home page as the common anchor for Countries scenarios — see CountriesPage
 * for what was checked and ruled out. No admin country-listing surface exists anywhere on this
 * app; it is a single-country (India) app end-to-end.
 */
export class CountriesModule {
  private countriesPage: CountriesPage;

  constructor(private page: Page) {
    this.countriesPage = new CountriesPage(page);
  }

  async open(): Promise<void> {
    Logger.info('Opening the home page (no admin Countries listing exists)');
    await this.countriesPage.goto();
  }

  async assertNoAdminCountryListing(): Promise<void> {
    await expect(this.countriesPage.countryTable()).toHaveCount(0);
    await expect(this.countriesPage.countrySearchInput()).toHaveCount(0);
  }

  async assertNoAddEditDeleteControls(): Promise<void> {
    await expect(this.countriesPage.addCountryButton()).toHaveCount(0);
    await expect(this.countriesPage.editCountryButton()).toHaveCount(0);
    await expect(this.countriesPage.deleteCountryButton()).toHaveCount(0);
  }

  async assertSingleCountryApp(): Promise<void> {
    await expect(this.countriesPage.countrySwitcherButton()).toHaveCount(0);
    await expect(this.countriesPage.currentCityButton()).toBeVisible();
  }
}
