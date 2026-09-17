import { Page } from '@playwright/test';

/**
 * Grounded against early-access.pvrinox.com (direct Playwright probe, 2026-09-08) — a real,
 * separate live subdomain hosting the Early Access Screening voting feature at
 * `/{Movie Common Code}` (matches the sheet's own URL description exactly). No active campaign
 * code was available to probe; the root renders a generic footer-only shell. No admin table,
 * search, filter, or Add/Edit campaign form exists anywhere — checked directly, not assumed.
 */
export class EasManagementPage {
  constructor(private page: Page) {}

  playStoreLink = () => this.page.getByRole('link', { name: 'play-store' }).first();

  // Admin-only controls asserted absent — none exist on this real, public subdomain.
  campaignTable = () => this.page.getByRole('table');
  addCampaignButton = () => this.page.getByRole('button', { name: /add.*eas|add.*campaign/i });
  filterButton = () => this.page.getByRole('button', { name: /^filter$/i });
  campaignHeadingField = () => this.page.getByLabel(/campaign heading/i);
  selectMovieDropdown = () => this.page.getByLabel(/select movie/i);
  fileUploadInput = () => this.page.locator('input[type="file"]');

  async goto(): Promise<void> {
    await this.page.goto('https://early-access.pvrinox.com/');
  }
}
