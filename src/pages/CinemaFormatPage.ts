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
  // Grounded 2026-09-23: the exact set of active formats (INSIGNIA/MX4D/ScreenX/etc.) is
  // environment-specific admin config — confirmed different between UAT and preprod (preprod
  // has no MX4D). A generic count of all page images is the environment-agnostic real signal
  // that the carousel renders with multiple entries, regardless of which formats are active —
  // the fixed header alone (Brand Logo, Map Point Icon, User Icon, Download App GIF) accounts
  // for 4 images, so a real carousel pushes the total well past that baseline.
  allPageImages = () => this.page.getByRole('img');

  async goto(): Promise<void> {
    await this.page.goto('/experiences');
  }
}
