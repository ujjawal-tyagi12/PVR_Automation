import { Page } from '@playwright/test';

/**
 * Grounded against the live app at BASE_URL/curated-shows (Playwright MCP,
 * 2026-09-01) — the real "Curated Shows" menu item under header > More. It is
 * a public listing page (heading "Curated Shows", a real "Search for movies,
 * festivals..." bar, and a "No Curated Shows Available" empty state in this
 * city), not the Events Management admin CRUD screen described in the sheet
 * (per-entry Event ID/Event Name/Common Code/Event Start-End Date/Trailers/
 * Languages, Now Showing/Coming Soon tabs, Sync Events, Export CSV, Edit).
 * No such admin listing or editor is reachable anywhere on this app — checked
 * directly against this page and the account sidebar. See
 * TestData/TestMd/events-management.md.
 */
export class EventsManagementPage {
  constructor(private page: Page) {}

  pageHeading = () => this.page.getByRole('heading', { name: 'Curated Shows', level: 1 });
  searchInput = () => this.page.getByPlaceholder(/search for movies, festivals/i);
  emptyStateHeading = () => this.page.getByRole('heading', { name: /no curated shows available/i });
  syncButton = () => this.page.getByRole('button', { name: /sync events/i });
  filterButton = () => this.page.getByRole('button', { name: /^filter$/i });
  exportCsvButton = () => this.page.getByRole('button', { name: /export csv/i });
  editIconButton = () => this.page.getByRole('button', { name: /^edit$/i });
  viewIconButton = () => this.page.getByRole('button', { name: /^view$/i });
  topPriorityButton = () => this.page.getByRole('button', { name: /top priority/i });
  fileUploadInput = () => this.page.locator('input[type="file"]');
  metaTitleField = () => this.page.getByLabel(/meta title/i);
  eventDescriptionField = () => this.page.getByLabel(/event description/i);
  campaignVideoField = () => this.page.getByLabel(/campaign(ing)? video/i);

  async goto(): Promise<void> {
    await this.page.goto('/curated-shows');
  }
}
