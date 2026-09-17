import { Page } from '@playwright/test';

/**
 * Grounded against the live app at BASE_URL/faq (direct Playwright probe, 2026-09-09) — a real,
 * public FAQ accordion. Confirmed live: real questions ("Can tickets be cancelled immediately?",
 * "When will the refund be processed?", "5 Simple Steps to Buy Tickets Online.") expand to real
 * answers. This is a single, country-agnostic, view-only accordion — not a tabbed admin CRUD
 * table. No Add/Edit/Delete control, Country/Sequence field, or search bar exists anywhere on
 * this app — checked directly, not assumed.
 */
export class FrequentlyAskedQuestionsPage {
  constructor(private page: Page) {}

  pageHeading = () => this.page.getByRole('heading', { name: 'Frequently Asked Questions', level: 1 });
  faqQuestionButton = (question: string) => this.page.getByRole('button', { name: question });

  // Admin-only controls asserted absent — none exist on this real, public accordion.
  faqTable = () => this.page.getByRole('table');
  addFaqButton = () => this.page.getByRole('button', { name: /add faq/i });
  editButton = () => this.page.getByRole('button', { name: /^edit$/i });
  deleteButton = () => this.page.getByRole('button', { name: /^delete$/i });
  searchInput = () => this.page.getByRole('textbox');
  indiaTab = () => this.page.getByRole('tab', { name: /^india$/i });
  sriLankaTab = () => this.page.getByRole('tab', { name: /sri lanka/i });

  async goto(): Promise<void> {
    await this.page.goto('/faq');
  }
}
