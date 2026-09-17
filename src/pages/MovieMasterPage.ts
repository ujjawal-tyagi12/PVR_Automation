import { Page } from '@playwright/test';

/**
 * Grounded against the live app at BASE_URL/coming-soon (direct Playwright probe, 2026-09-16) —
 * the same real, public, week-grouped movie listing already grounded in coming-soon.spec.ts
 * (batch 4), reused here as the public equivalent of the sheet's Movie Master catalog. Real
 * search ("Search for upcoming Movies") and the FILTER BY panel (Genre/Language checkboxes) are
 * confirmed live. No admin table (Common Code/Movie ID/Trailers/Status columns), no Common
 * Code/Movie ID search, no Release Date range filter, no Sync/Export CSV/Edit/Upload controls,
 * and no Meta Title/Synopsis edit form exist anywhere on this app.
 */
export class MovieMasterPage {
  constructor(private page: Page) {}

  pageHeading = () => this.page.getByRole('heading', { name: 'Coming Soon', level: 1 });
  searchInput = () => this.page.getByRole('textbox', { name: 'Search for upcoming Movies' });
  filterButton = () => this.page.getByRole('button', { name: /filter/i });
  filterDialog = () => this.page.getByRole('dialog', { name: 'FILTER BY' });
  movieHeading = (name: string) => this.page.getByRole('heading', { name, level: 3 }).first();
  moviesNotFoundHeading = () => this.page.getByRole('heading', { name: 'Movies Not Found!' });

  // Admin-only controls asserted absent — none exist on this real, public page.
  movieTable = () => this.page.getByRole('table');
  commonCodeSearch = () => this.page.getByRole('textbox', { name: /common code/i });
  movieIdSearch = () => this.page.getByRole('textbox', { name: /movie id/i });
  releaseDateFilter = () => this.page.getByLabel(/release date/i);
  syncButton = () => this.page.getByRole('button', { name: /^sync/i });
  exportCsvButton = () => this.page.getByRole('button', { name: /export csv/i });
  editButton = () => this.page.getByRole('button', { name: /^edit$/i });
  uploadImageButton = () => this.page.getByRole('button', { name: /upload image/i });
  metaTitleField = () => this.page.getByLabel(/meta title/i);
  synopsisField = () => this.page.getByLabel(/^synopsis$/i);
  trailerUrlField = () => this.page.getByLabel(/trailer url/i);

  async goto(): Promise<void> {
    await this.page.goto('/coming-soon');
  }
}
