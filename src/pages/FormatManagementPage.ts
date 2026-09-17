import { Page } from '@playwright/test';

/**
 * Grounded against the live app at BASE_URL (direct Playwright probe, 2026-09-09). No admin
 * format-management UI exists anywhere on this app — checked the header nav, footer, every
 * "More" dropdown item, and /sitemap.xml directly (same method used for cities.spec.ts).
 * Grounded against the home page as the anchor.
 */
export class FormatManagementPage {
  constructor(private page: Page) {}

  formatTable = () => this.page.getByRole('table');
  syncFormatsButton = () => this.page.getByRole('button', { name: /sync formats/i });
  filterButton = () => this.page.getByRole('button', { name: /^filter$/i });
  editButton = () => this.page.getByRole('button', { name: /^edit$/i });
  nameField = () => this.page.getByLabel(/^format name$/i);
  brandField = () => this.page.getByLabel(/^brand$/i);
  descriptionField = () => this.page.getByLabel(/^description$/i);

  async goto(): Promise<void> {
    await this.page.goto('/');
  }
}
