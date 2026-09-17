import { Page } from '@playwright/test';

/**
 * Grounded against the live app at BASE_URL/investors-section?tab=financials&subtype=investor-
 * support (direct Playwright probe, 2026-09-16). This is a real, public tab on the Investor
 * Section page — confirmed live to show "Investor support content will be available soon."
 * There is no Analyst Coverage / Investor Support sub-tab pair, no data table (Research House/
 * Analyst Name/Email/Status/Action), and no admin CRUD anywhere on this app.
 */
export class InvestorSupportPage {
  constructor(private page: Page) {}

  pageHeading = () => this.page.getByRole('heading', { name: 'Investor Section', level: 1 });
  investorSupportTab = () => this.page.getByRole('button', { name: 'Investor Support' });
  comingSoonText = () => this.page.getByText('Investor support content will be available soon.');

  // Admin-only controls asserted absent — no functional tabs/table exist on this public page.
  analystCoverageTab = () => this.page.getByRole('tab', { name: /analyst coverage/i });
  dataTable = () => this.page.getByRole('table');
  searchInput = () => this.page.getByRole('textbox', { name: /search/i });
  statusFilter = () => this.page.getByRole('combobox', { name: /^status$/i });
  addButton = () => this.page.getByRole('button', { name: /^add$/i });
  editButton = () => this.page.getByRole('button', { name: /^edit$/i });
  categoryField = () => this.page.getByLabel(/^category$/i);
  typeField = () => this.page.getByLabel(/^type$/i);

  async goto(): Promise<void> {
    await this.page.goto('/investors-section?tab=financials&subtype=investor-support');
  }
}
