import { Page, expect } from '@playwright/test';
import { AboutUsPage } from '@pages/AboutUsPage';
import { Logger } from '@utils/Logger';

/**
 * Grounded against the live app at BASE_URL/about-us. Orchestrates the real,
 * public, read-only About Us page — see AboutUsPage for what was verified.
 */
export class AboutUsModule {
  private aboutUsPage: AboutUsPage;

  constructor(private page: Page) {
    this.aboutUsPage = new AboutUsPage(page);
  }

  async open(): Promise<void> {
    // Geolocation is pre-granted in playwright.config.ts, so the "Enable Location" gate never appears.
    Logger.info('Opening the public About Us page');
    await this.aboutUsPage.goto();
  }

  async openTab(tab: 'Company' | 'Our Journey' | 'Team' | 'Awards' | 'Brands'): Promise<void> {
    Logger.info(`Switching to ${tab} tab`);
    const tabs = {
      Company: this.aboutUsPage.companyTab(),
      'Our Journey': this.aboutUsPage.ourJourneyTab(),
      Team: this.aboutUsPage.teamTab(),
      Awards: this.aboutUsPage.awardsTab(),
      Brands: this.aboutUsPage.brandsTab(),
    };
    await tabs[tab].click();
  }

  async filterAwardsByYear(year: 'All' | '2024' | '2025'): Promise<void> {
    await this.aboutUsPage.awardsYearFilter(year).click();
  }

  async assertNoFileUploadControl(): Promise<void> {
    await expect(this.aboutUsPage.fileUploadInput()).toHaveCount(0);
  }
}
