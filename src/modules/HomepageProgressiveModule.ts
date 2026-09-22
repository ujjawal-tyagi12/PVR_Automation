import { Page, expect } from '@playwright/test';
import { HomepageProgressivePage } from '@pages/HomepageProgressivePage';
import { CitySelectionModule } from '@modules/CitySelectionModule';
import { Logger } from '@utils/Logger';

/**
 * Orchestrates the real homepage for the Homepage (Progressive) sheet module — see
 * HomepageProgressivePage for what was grounded. Composes CitySelectionModule read-only (no
 * changes to it) for the city-switch mechanics already proven live there.
 *
 * @hritik
 */
export class HomepageProgressiveModule {
  private homePage: HomepageProgressivePage;
  private citySelection: CitySelectionModule;

  constructor(private page: Page) {
    this.homePage = new HomepageProgressivePage(page);
    this.citySelection = new CitySelectionModule(page);
  }

  async open(): Promise<void> {
    Logger.info('Opening the home page');
    await this.homePage.goto();
  }

  async assertProgressiveSectionsLoaded(): Promise<void> {
    await expect(this.homePage.bannerRegion()).toBeVisible({ timeout: 15000 });
    await expect(this.homePage.cinemasNavLink()).toBeVisible();
  }

  async assertGuestSeesLoginPrompt(): Promise<void> {
    await this.homePage.accountMenuButton().click();
    await expect(this.homePage.loginPromptText()).toBeVisible({ timeout: 10000 });
    await expect(this.homePage.loginButton()).toBeVisible();
  }

  async switchCityAndAssertContentUpdates(city: string): Promise<void> {
    await this.citySelection.openCityDialog();
    await this.citySelection.searchAndSelectCity(city);
    await this.citySelection.assertCityAppliedAppWide(city);
  }
}
