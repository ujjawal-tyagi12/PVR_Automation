import { Page } from '@playwright/test';

/**
 * Grounded against early-access.pvrinox.com (direct Playwright probe, 2026-09-08) — the same
 * real, live voting subdomain used by EasManagementPage; this is where votes are genuinely cast.
 * No admin report of individual voter identities (search/filter/sort per-campaign results, or a
 * manual vote-count editor) exists anywhere — checked directly, not assumed.
 */
export class EasReportsPage {
  constructor(private page: Page) {}

  playStoreLink = () => this.page.getByRole('link', { name: 'play-store' }).first();

  // Admin-only report controls asserted absent — none exist on this real, public subdomain.
  reportTable = () => this.page.getByRole('table');
  viewButton = () => this.page.getByRole('button', { name: /^view$/i });
  manageVotesButton = () => this.page.getByRole('button', { name: /manage votes/i });
  votedCityFilter = () => this.page.getByLabel(/voted city/i);
  winnerCityText = () => this.page.getByText(/winner city/i);

  async goto(): Promise<void> {
    await this.page.goto('https://early-access.pvrinox.com/');
  }
}
