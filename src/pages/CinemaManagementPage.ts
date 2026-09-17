import { Page } from '@playwright/test';

/**
 * Grounded against the live app at BASE_URL/cinemas/Mumbai (Playwright MCP,
 * 2026-08-31 and 2026-09-01) — the same real public cinema listing used by
 * AmenitiesManagementPage. Real cinema-name headings and per-card details (e.g.
 * "0 Shows", "X km away") are genuinely visible here, but no admin table
 * (Serial No./Cinema ID/POS Menu/Ticket QR URL/Food QR URL/Last Sync/Status/
 * Action per TestData/TestMd/cinema-management.md), no search bar, and no
 * Sync/Edit/Export CSV admin controls exist anywhere on this app — checked
 * directly, not assumed.
 */
export class CinemaManagementPage {
  constructor(private page: Page) {}

  cinemaNameHeading = () => this.page.getByRole('heading', { level: 3 }).first();
  fileUploadInput = () => this.page.locator('input[type="file"]');
  syncButton = () => this.page.getByRole('button', { name: /sync/i });
  editIconButton = () => this.page.getByRole('button', { name: /^edit$/i });
  viewIconButton = () => this.page.getByRole('button', { name: /^view$/i });
  exportCsvButton = () => this.page.getByRole('button', { name: /export csv/i });
  filterButton = () => this.page.getByRole('button', { name: /^filter$/i });
  apiTimeoutField = () => this.page.getByLabel(/api timeout/i);
  radiusField = () => this.page.getByLabel(/^radius$/i);
  foodStopTimeField = () => this.page.getByLabel(/food stop time/i);
  relationManagerField = () => this.page.getByLabel(/relation manager/i);
  ticketQrUrlField = () => this.page.getByLabel(/ticket qr/i);
  metaTitleField = () => this.page.getByLabel(/meta title/i);
  metaDescriptionField = () => this.page.getByLabel(/meta description/i);

  async goto(): Promise<void> {
    await this.page.goto('/cinemas/Mumbai');
  }
}
