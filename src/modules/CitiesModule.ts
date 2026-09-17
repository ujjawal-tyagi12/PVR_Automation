import { Page, Locator, expect } from '@playwright/test';
import { CitiesPage } from '@pages/CitiesPage';
import { Logger } from '@utils/Logger';

/**
 * Orchestrates the real customer-facing "Select Your City" location picker — the only real
 * "Cities" surface reachable from BASE_URL. See CitiesPage for what was grounded and
 * cities.spec.ts for the CIT-xxx -> real-flow mapping.
 */
export class CitiesModule {
  private citiesPage: CitiesPage;

  constructor(private page: Page) {
    this.citiesPage = new CitiesPage(page);
  }

  private async waitVisible(locator: Locator, timeout: number): Promise<boolean> {
    return locator
      .waitFor({ state: 'visible', timeout })
      .then(() => true)
      .catch(() => false);
  }

  async open(): Promise<void> {
    Logger.info('Opening home page');
    await this.citiesPage.goto();
  }

  async dismissGoogleWalletPromoIfPresent(): Promise<void> {
    if (await this.waitVisible(this.citiesPage.closeGoogleWalletPromoButton(), 5000)) {
      Logger.info('Dismissing the Google Wallet promo overlay');
      await this.citiesPage.closeGoogleWalletPromoButton().click();
    }
  }

  async openCityDrawer(): Promise<void> {
    Logger.info('Opening the Select Your City drawer');
    await this.dismissGoogleWalletPromoIfPresent();
    await this.citiesPage.openCitySelector();
    await expect(this.citiesPage.selectCityHeading()).toBeVisible();
  }

  async searchCity(term: string): Promise<void> {
    Logger.info(`Searching for city: ${term}`);
    await this.citiesPage.searchCity(term);
  }

  async assertCityResultVisible(city: string): Promise<void> {
    await expect(this.citiesPage.cityResultButton(city)).toBeVisible();
  }

  async assertNoCityFound(): Promise<void> {
    await expect(this.citiesPage.cityNotFoundHeading()).toBeVisible();
    await expect(this.citiesPage.cityNotFoundMessage()).toBeVisible();
  }
}
