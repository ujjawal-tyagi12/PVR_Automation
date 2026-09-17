import { Page } from '@playwright/test';

/**
 * Grounded against the live app at
 * BASE_URL/investors-section?tab=financials&subtype=investor-presentation (direct Playwright
 * probe, 2026-09-10). This is a real, public listing of investor presentations — real yearly
 * cards (e.g. "2021", "2019", "2018") each with a working Download button, confirmed rendered
 * in descending-year order, with genuine multiple cards sharing the same year (e.g. six "2017"
 * cards) — the public equivalent of the sheet's "multiple presentations for same year" scenario.
 * An "All Years" combobox filters the list.
 *
 * "10 Years Highlight" is itself a REAL, public sibling tab on this page (confirmed live by
 * clicking it) — it renders a genuine "Operational Highlights" financial data table (FY16–FY25),
 * completely unrelated to the sheet's admin "Upload 10 years highlight CSV" popup. It is not an
 * upload trigger; do not assert it absent. No admin CRUD (Add/Edit page, Active/Inactive toggle,
 * CSV-upload file input), search-by-name, or explicit Status filter exists anywhere on this app.
 */
export class InvestorPresentationPage {
  constructor(private page: Page) {}

  pageHeading = () => this.page.getByRole('heading', { name: 'Investor Section', level: 1 });
  investorPresentationTab = () => this.page.getByRole('button', { name: 'Investor Presentation' });
  yearFilterCombobox = () => this.page.getByRole('combobox').filter({ hasText: /years/i });
  presentationCard = (year: string) => this.page.locator('article', { hasText: year }).first();
  downloadButton = (year: string) => this.page.getByRole('button', { name: new RegExp(`download ${year}`, 'i') }).first();
  allYearCards = () => this.page.locator('article');

  // Admin-only controls asserted absent — no CRUD surface exists on this public page.
  nameSearch = () => this.page.getByRole('textbox', { name: /^name$/i });
  statusFilter = () => this.page.getByRole('combobox', { name: /^status$/i });
  addButton = () => this.page.getByRole('button', { name: /add investor presentation/i });
  editButton = () => this.page.getByRole('button', { name: /^edit$/i });
  statusToggle = () => this.page.getByRole('switch');
  tenYearsHighlightTab = () => this.page.getByRole('button', { name: /^10 years highlight$/i });
  operationalHighlightsHeading = () => this.page.getByRole('heading', { name: 'Operational Highlights' });
  csvFileInput = () => this.page.locator('input[type="file"]');
  nameField = () => this.page.getByLabel(/^name$/i);
  paginationNav = () => this.page.getByRole('navigation', { name: /pagination/i });

  async goto(): Promise<void> {
    await this.page.goto('/investors-section?tab=financials&subtype=investor-presentation');
  }
}
