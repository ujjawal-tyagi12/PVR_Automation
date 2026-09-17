import { Page } from '@playwright/test';

/**
 * Grounded against the live app at BASE_URL (direct Playwright probe, 2026-09-10). No admin
 * global-configurations UI exists anywhere on this app — checked the header nav, footer, every
 * "More" dropdown item, and direct URL guesses (same method used for format-management.spec.ts,
 * confirmed absent, not assumed). Grounded against the home page as the anchor.
 */
export class GlobalConfigurationsPage {
  constructor(private page: Page) {}

  configTable = () => this.page.getByRole('table');
  inoxTab = () => this.page.getByRole('tab', { name: /inox/i });
  typeSearch = () => this.page.getByRole('textbox', { name: /^type$/i });
  subTypeSearch = () => this.page.getByRole('textbox', { name: /sub type/i });
  dateRangeFilter = () => this.page.getByLabel(/last edited/i);
  addButton = () => this.page.getByRole('button', { name: /^add$/i });
  sameAsAboveCheckbox = () => this.page.getByRole('checkbox', { name: /same as above/i });
  editButton = () => this.page.getByRole('button', { name: /^edit$/i });
  valueField = () => this.page.getByLabel(/^value$/i);
  descriptionField = () => this.page.getByLabel(/^description$/i);

  async goto(): Promise<void> {
    await this.page.goto('/');
  }
}
