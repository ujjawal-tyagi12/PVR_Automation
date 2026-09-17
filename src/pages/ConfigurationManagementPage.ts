import { Page } from '@playwright/test';

/**
 * Grounded against the live app at BASE_URL (direct Playwright probe, 2026-09-04). No admin
 * settings surface exists anywhere on this app — checked the header nav, footer, every "More"
 * dropdown item, and /sitemap.xml directly (same method used for cities.spec.ts). The 20
 * settings described in TestData/TestMd/configuration-management.md (banner timing, OTP
 * validity, checkout countdown, cart limits, device limits, etc.) are diffuse across many real
 * frontend surfaces rather than one admin screen, so this grounds against the home page as the
 * common anchor and asserts no configuration entry point exists.
 */
export class ConfigurationManagementPage {
  constructor(private page: Page) {}

  moreMenuButton = () => this.page.getByRole('button', { name: /^more/i });
  configurationMenuItem = () => this.page.getByRole('menuitem', { name: /configuration/i });
  settingsLink = () => this.page.getByRole('link', { name: /settings|configuration/i });
  bannerCarousel = () => this.page.locator('[class*="banner" i], [class*="carousel" i]').first();
  cartLimitText = () => this.page.getByText(/cart item limit/i);
  deviceLimitHeading = () => this.page.getByRole('heading', { name: 'Device Limit Reached' });

  async goto(): Promise<void> {
    await this.page.goto('/');
  }
}
