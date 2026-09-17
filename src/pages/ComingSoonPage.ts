import { Page } from '@playwright/test';

/**
 * Grounded against the live app at BASE_URL/coming-soon (direct Playwright probe, 2026-09-04) —
 * a real, public, week-grouped upcoming-movies listing. Search ("Search for upcoming Movies"),
 * the FILTER BY panel (Genre/Language checkboxes, Clear All, Show Results), and the
 * "Movies Not Found!" empty state are all real and confirmed live. No admin table (Serial No.,
 * Movie ID, Alias Name, Common Code, Trailers, Status, Action per TestData/TestMd/coming-soon.md),
 * no Common Code/Movie ID search, no date-range filter, and no Sync/Export CSV/View/Edit/
 * Activate/Upload controls exist anywhere on this app — checked directly, not assumed.
 */
export class ComingSoonPage {
  constructor(private page: Page) {}

  pageHeading = () => this.page.getByRole('heading', { name: 'Coming Soon', level: 1 });
  searchInput = () => this.page.getByRole('textbox', { name: 'Search for upcoming Movies' });
  filterButton = () => this.page.getByRole('button', { name: /filter/i });
  filterDialog = () => this.page.getByRole('dialog', { name: 'FILTER BY' });
  clearAllButton = () => this.filterDialog().getByRole('button', { name: 'Clear All' });
  movieHeading = (name: string) => this.page.getByRole('heading', { name, level: 3 }).first();
  moviesNotFoundHeading = () => this.page.getByRole('heading', { name: 'Movies Not Found!' });
  weekHeading = () => this.page.getByRole('heading', { level: 3 }).first();

  // Admin-only controls asserted absent — none exist on this real, public page.
  syncButton = () => this.page.getByRole('button', { name: /^sync/i });
  viewIconButton = () => this.page.getByRole('button', { name: /^view$/i });
  editIconButton = () => this.page.getByRole('button', { name: /^edit$/i });
  activateButton = () => this.page.getByRole('button', { name: /^activate$/i });
  deactivateButton = () => this.page.getByRole('button', { name: /^(deactivate|inactivate)$/i });
  exportCsvButton = () => this.page.getByRole('button', { name: /export csv/i });
  fileUploadInput = () => this.page.locator('input[type="file"]');
  synopsisSourceField = () => this.page.getByLabel(/synopsis source/i);
  trailerField = (n: number) => this.page.getByLabel(new RegExp(`trailer ${n}`, 'i'));
  metaTitleField = () => this.page.getByLabel(/meta title/i);
  metaDescriptionField = () => this.page.getByLabel(/meta description/i);
  adultDescriptionField = () => this.page.getByLabel(/adult movie description/i);

  async goto(): Promise<void> {
    await this.page.goto('/coming-soon');
  }

  async search(query: string): Promise<void> {
    await this.searchInput().fill(query);
  }

  async openFilter(): Promise<void> {
    await this.filterButton().click();
  }
}
