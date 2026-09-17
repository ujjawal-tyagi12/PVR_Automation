import { Page } from '@playwright/test';

/**
 * Grounded against the live app at BASE_URL/career (direct Playwright probe, 2026-09-08) — a
 * real, public "Explore Departments" section with a real department button ("Sales Marketing")
 * that opens a genuine "Apply for the role" job-application dialog. No admin table, search,
 * filter, Add/Edit form, or status toggle exists anywhere on this app — checked directly, not
 * assumed.
 */
export class DepartmentsPage {
  constructor(private page: Page) {}

  exploreDepartmentsHeading = () => this.page.getByRole('heading', { name: 'Explore Departments' });
  departmentButton = (name: string) => this.page.getByRole('button', { name: new RegExp(name, 'i') });
  applyDialog = () => this.page.getByRole('dialog').filter({ has: this.page.getByRole('heading', { name: 'Apply for the role' }) });
  departmentField = () => this.applyDialog().getByRole('textbox', { name: 'Department' });

  // Admin-only controls asserted absent — none exist on this real, public page.
  addDepartmentButton = () => this.page.getByRole('button', { name: /add department/i });
  departmentTable = () => this.page.getByRole('table');
  filterButton = () => this.page.getByRole('button', { name: /^filter$/i });
  sequenceField = () => this.page.getByLabel(/^sequence$/i);
  fileUploadInput = () => this.page.locator('input[type="file"]');

  async goto(): Promise<void> {
    await this.page.goto('/career');
  }

  async clickDepartment(name: string): Promise<void> {
    await this.departmentButton(name).click();
  }
}
