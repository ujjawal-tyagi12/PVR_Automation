import { Page } from '@playwright/test';

/**
 * Grounded against the live app at BASE_URL/career (direct Playwright probe, 2026-09-16). The
 * real Careers page shows only Department-level "apply" cards (e.g. "Sales Marketing") — no
 * per-job-posting listing with Title/Vacancies/Experience/Start-End Date exists anywhere on
 * this app; clicking a department opens a generic apply form, not a specific job's detail page.
 * No admin CRUD (Add/Edit/Delete/Activate/Deactivate a job posting) exists either.
 */
export class JobsPage {
  constructor(private page: Page) {}

  departmentsHeading = () => this.page.getByRole('heading', { name: 'Explore Departments' });
  departmentCard = () => this.page.getByRole('button').filter({ hasText: /marketing|sales|hr|finance|operations/i }).first();

  // Admin-only controls asserted absent — no per-job listing or CRUD form exists.
  jobsTable = () => this.page.getByRole('table');
  jobTitleHeading = (title: string) => this.page.getByRole('heading', { name: title });
  addJobButton = () => this.page.getByRole('button', { name: /^add job$/i });
  editButton = () => this.page.getByRole('button', { name: /^edit$/i });
  deleteButton = () => this.page.getByRole('button', { name: /^delete$/i });
  vacanciesField = () => this.page.getByLabel(/vacancies/i);
  minExperienceField = () => this.page.getByLabel(/minimum experience/i);
  maxExperienceField = () => this.page.getByLabel(/maximum experience/i);
  startDateField = () => this.page.getByLabel(/^start date$/i);
  endDateField = () => this.page.getByLabel(/^end date$/i);
  departmentEmailsField = () => this.page.getByLabel(/department email/i);
  activateButton = () => this.page.getByRole('button', { name: /^activate$/i });

  async goto(): Promise<void> {
    await this.page.goto('/career');
  }
}
