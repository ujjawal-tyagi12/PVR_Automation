import { Page, expect } from '@playwright/test';
import { CinemasListingPage } from '@pages/CinemasListingPage';
import { Logger } from '@utils/Logger';

/**
 * Orchestrates the real Cinemas listing + detail split-view page for the Cinemas Listing &
 * Detail Page sheet module — see CinemasListingPage for what was grounded.
 *
 * @hritik
 */
export class CinemasListingModule {
  private cinemasPage: CinemasListingPage;

  constructor(private page: Page) {
    this.cinemasPage = new CinemasListingPage(page);
  }

  async openForCity(city: string): Promise<void> {
    Logger.info(`Opening the cinemas listing for ${city}`);
    await this.cinemasPage.goto(city);
  }

  async assertCinemasLoaded(): Promise<void> {
    await expect(this.cinemasPage.allCinemasHeading()).toBeVisible({ timeout: 15000 });
    await expect(this.cinemasPage.cinemaCountHeading()).toBeVisible({ timeout: 15000 });
  }

  async assertViewToggleAvailable(): Promise<void> {
    await expect(this.cinemasPage.listViewButton()).toBeVisible({ timeout: 15000 });
    await expect(this.cinemasPage.mapViewButton()).toBeVisible({ timeout: 15000 });
  }

  async assertDistanceShownPerCinema(): Promise<void> {
    await expect(this.page.getByText(/km away/i).first()).toBeVisible({ timeout: 15000 });
  }

  /** Opens whichever cinema is first in the live listing — a hardcoded name is environment-
   * specific catalog data that doesn't carry across environments. Returns its real name so
   * callers can assert against it. */
  async openFirstCinemaDetail(): Promise<string> {
    const heading = this.cinemasPage.firstListedCinemaHeading();
    await expect(heading).toBeVisible({ timeout: 15000 });
    const name = (await heading.innerText()).trim();
    await heading.click();
    await expect(this.cinemasPage.getDirectionsButton()).toBeVisible({ timeout: 15000 });
    return name;
  }

  async assertCinemaDetailLoaded(cinemaName: string): Promise<void> {
    await expect(this.page.getByRole('heading', { name: cinemaName, exact: true }).first()).toBeVisible();
    await expect(this.cinemasPage.getDirectionsButton()).toBeVisible();
  }

  async assertAmenitiesDisplayed(): Promise<void> {
    await expect(this.cinemasPage.amenitiesHeading()).toBeVisible({ timeout: 15000 });
  }

  async assertNoSearchInputExists(): Promise<void> {
    await expect(this.cinemasPage.searchTextbox()).toHaveCount(0);
  }

  async assertEmptyStateForCityWithNoCinemas(): Promise<void> {
    await expect(this.cinemasPage.noResultsHeading()).toBeVisible({ timeout: 15000 });
    await expect(this.cinemasPage.noResultsText()).toBeVisible();
  }
}
