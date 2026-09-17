import { Page } from '@playwright/test';

/**
 * Grounded against the live app at BASE_URL (direct Playwright probe, 2026-09-10). No admin
 * site-maintenance-mode UI exists anywhere on this app — checked the header nav, footer, every
 * "More" dropdown item, and direct URL guesses. Testing an actual maintenance-mode toggle would
 * also be unsafe against a shared live UAT target even if such a control existed. Grounded
 * against the home page as the anchor.
 */
export class GlobalMaintenancePage {
  constructor(private page: Page) {}

  platformCheckbox = (name: string) => this.page.getByRole('checkbox', { name: new RegExp(name, 'i') });
  selectAllCheckbox = () => this.page.getByRole('checkbox', { name: /select all/i });
  brandSelectAllCheckbox = () => this.page.getByRole('checkbox', { name: /select all.*brand/i });
  maintenanceToggle = () => this.page.getByRole('switch', { name: /maintenance/i });
  messageField = () => this.page.getByLabel(/message/i);
  wordCounter = () => this.page.getByText(/\d+\s*\/\s*\d+/);
  saveButton = () => this.page.getByRole('button', { name: /^save$/i });
  cancelButton = () => this.page.getByRole('button', { name: /^cancel$/i });

  async goto(): Promise<void> {
    await this.page.goto('/');
  }
}
