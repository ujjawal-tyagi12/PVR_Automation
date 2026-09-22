import { Page, expect } from '@playwright/test';
import { CitySelectionPage } from '@pages/CitySelectionPage';
import { Logger } from '@utils/Logger';

/**
 * Orchestrates the real "Select Your City" dialog for the City Selection sheet module — see
 * CitySelectionPage for what was grounded.
 *
 * @hritik
 */
export class CitySelectionModule {
  private cityPage: CitySelectionPage;

  constructor(private page: Page) {
    this.cityPage = new CitySelectionPage(page);
  }

  async open(): Promise<void> {
    Logger.info('Opening the home page with geolocation granted (Mumbai)');
    await this.cityPage.goto();
  }

  async openCityDialog(): Promise<void> {
    await this.cityPage.cityButton().click();
    await expect(this.cityPage.cityDialogHeading()).toBeVisible({ timeout: 10000 });
  }

  async searchAndSelectCity(city: string): Promise<void> {
    await this.cityPage.searchCityInput().fill(city);
    await this.cityPage.cityResultButton(city).click();
    await expect(this.cityPage.cityButton()).toContainText(city, { timeout: 15000 });
  }

  async assertCityAppliedAppWide(city: string): Promise<void> {
    await expect(this.cityPage.cityButton()).toContainText(city);
    await expect(this.cityPage.cityDialogHeading()).toHaveCount(0);
  }

  async searchNonExistentCity(): Promise<void> {
    await this.cityPage.searchCityInput().fill('Zzzznotarealcity');
  }

  async assertNoResultsMessageShown(): Promise<void> {
    await expect(this.cityPage.cityNotFoundHeading()).toBeVisible({ timeout: 10000 });
    await expect(this.cityPage.cityNotFoundText()).toBeVisible();
  }

  async assertPopularCitiesShown(): Promise<void> {
    await expect(this.cityPage.popularCitiesHeading()).toBeVisible({ timeout: 10000 });
  }

  async assertCityPersistsAcrossReload(city: string): Promise<void> {
    await this.page.reload();
    await expect(this.cityPage.cityButton()).toContainText(city, { timeout: 15000 });
  }
}
