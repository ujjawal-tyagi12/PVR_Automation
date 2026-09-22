import { Page } from '@playwright/test';

/**
 * Grounded against the live app at BASE_URL (direct Playwright probe, 2026-09-22). The real
 * route is /experiences — a carousel of active formats/experiences (INSIGNIA, ONYX DINER,
 * MX4D, ScreenX, Kiddles, each with its own named image) with a detail panel for the default
 * one (Format features, a "Movies Showing in {Format} In Your City {City}" section, Terms &
 * Conditions).
 *
 * @hritik
 */
export class CinemaFormatPage {
  constructor(private page: Page) {}

  formatImage = (name: string) => this.page.getByRole('img', { name, exact: true });
  formatFeaturesHeading = () => this.page.getByRole('heading', { name: /format features/i });
  moviesShowingHeading = () => this.page.getByRole('heading', { name: /movies showing in/i });

  async goto(): Promise<void> {
    await this.page.goto('/experiences');
  }
}
