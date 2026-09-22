import { Page } from '@playwright/test';

/**
 * Grounded against the live app at BASE_URL (direct Playwright probe, 2026-09-22). Geolocation
 * is pre-granted in playwright.config.ts (Mumbai coordinates), matching what every other module
 * in this project already assumes as its starting state (see AdminLoginModule.open()). The
 * header's location button shows the geolocation-detected city directly.
 *
 * @hritik
 */
export class LocationPermissionPage {
  constructor(private page: Page) {}

  cityButton = () => this.page.getByRole('button', { name: /Map Point Icon/i });

  async goto(): Promise<void> {
    await this.page.goto('/');
  }
}
