import { Page } from '@playwright/test';

/**
 * Grounded against the live app at BASE_URL/news (direct Playwright probe, 2026-09-16). This is
 * a real, public news listing — real articles (Title/Source/Date/truncated description with
 * "Read More"), real Year/Month filters, and real category chips (All/New Initiatives/Cinema
 * Openings) are confirmed live. No admin table, admin Add/Edit/Delete/Activate/Deactivate/
 * Sequence controls, or Brand-Country tab pair exist anywhere on this app.
 */
export class NewsManagementPage {
  constructor(private page: Page) {}

  pageHeading = () => this.page.getByRole('heading', { name: 'News', level: 1 });
  yearFilter = () => this.page.getByRole('button', { name: /^year/i });
  monthFilter = () => this.page.getByRole('button', { name: /^month/i });
  allCategoryChip = () => this.page.getByRole('button', { name: /^all$/i });
  categoryChip = (name: string) => this.page.getByRole('button', { name: new RegExp(`^${name}$`, 'i') });
  newsCard = (title: string) => this.page.getByRole('heading', { name: title, level: 3 }).first();

  // Admin-only controls asserted absent — no admin CRUD surface exists on this public page.
  newsTable = () => this.page.getByRole('table');
  brandCountryTab = () => this.page.getByRole('tab');
  addButton = () => this.page.getByRole('button', { name: /^add$/i });
  editButton = () => this.page.getByRole('button', { name: /^edit$/i });
  deleteButton = () => this.page.getByRole('button', { name: /^delete$/i });
  activateButton = () => this.page.getByRole('button', { name: /^activate$/i });
  deactivateButton = () => this.page.getByRole('button', { name: /^deactivate$/i });
  titleField = () => this.page.getByLabel(/^title$/i);
  sourceField = () => this.page.getByLabel(/^source$/i);
  sequenceField = () => this.page.getByLabel(/^sequence$/i);
  imageUploadInput = () => this.page.locator('input[type="file"]');

  async goto(): Promise<void> {
    await this.page.goto('/news');
  }
}
