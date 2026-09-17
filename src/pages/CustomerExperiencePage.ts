import { Page } from '@playwright/test';

/**
 * Grounded against the live app at BASE_URL/feedback (direct Playwright probe, 2026-09-08) — the
 * real, public source of the data this report would list. No admin report of other customers'
 * submissions (a table with search/filter/sort/export) exists anywhere on this app — checked
 * directly, not assumed; showing one customer's submissions to another would be a data leak.
 */
export class CustomerExperiencePage {
  constructor(private page: Page) {}

  pageHeading = () => this.page.getByRole('heading', { name: 'Customer Experience', level: 1 });
  // Custom dropdown without a programmatically-associated accessible name — matched by visible
  // text instead (confirmed live, 2026-09-08).
  feedbackTypeCombobox = () => this.page.getByRole('combobox').filter({ hasText: /feedback type/i });
  feedbackTypeOption = (name: string) => this.page.getByRole('option', { name });

  // Admin-only report controls asserted absent — none exist on this real, public form.
  reportTable = () => this.page.getByRole('table');
  filterButton = () => this.page.getByRole('button', { name: /^filter$/i });
  exportCsvButton = () => this.page.getByRole('button', { name: /export csv/i });
  sortButton = () => this.page.getByRole('button', { name: /sort/i });

  async goto(): Promise<void> {
    await this.page.goto('/feedback');
  }

  async openFeedbackTypeDropdown(): Promise<void> {
    await this.feedbackTypeCombobox().click();
  }
}
