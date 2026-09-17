import { Page } from '@playwright/test';

/**
 * Grounded against the live app at BASE_URL/investors-section?tab=financials&
 * subtype=annual-report (Playwright MCP, 2026-08-31). This is a real, public
 * page whose "Annual Report" tab matches the sheet's ANR-* content concept
 * (Start Year, downloadable Document) — see TestData/TestMd/annual-reports.md.
 * It is the CMS's published output: an "All Years" filter and per-year article
 * cards with a Download button each, but no Add/Edit/Toggle/search-by-name/
 * sort/Status-filter affordance anywhere on it.
 */
export class AnnualReportsPage {
  constructor(private page: Page) {}

  annualReportTab = () => this.page.getByRole('button', { name: 'Annual Report', exact: true });
  yearFilter = () => this.page.getByRole('combobox').first();
  reportCards = () => this.page.getByRole('article');
  downloadButton = (year: string) => this.page.getByRole('button', { name: `Download ${year}` });
  reportYearText = (year: string) => this.page.getByText(year, { exact: true }).first();
  fileUploadInput = () => this.page.locator('input[type="file"]');

  async goto(): Promise<void> {
    await this.page.goto('/investors-section?tab=financials&subtype=annual-report');
  }
}
