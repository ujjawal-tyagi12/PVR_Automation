import { Page } from '@playwright/test';

/**
 * Grounded against the live app at BASE_URL/career (direct Playwright probe, 2026-09-16). This
 * is the real, public source of what an admin's Job Requests report would list: clicking a
 * department card opens a genuine "Apply for the role" form (Full Name/Phone Number/Email/
 * Department pre-filled/Upload Resume/Submit) with real client-side validation (confirmed live:
 * an invalid email shows "Please enter a valid email"). There is no admin report/listing
 * surface — search by Job ID/Title/Name/Email/Phone, filters, CSV export, or resume download —
 * reachable anywhere on this app; only the submission side is real.
 */
export class JobRequestsPage {
  constructor(private page: Page) {}

  departmentCard = (name: string) => this.page.getByRole('button', { name: new RegExp(name, 'i') }).first();
  applyHeading = () => this.page.getByRole('heading', { name: 'Apply for the role' });
  fullNameInput = () => this.page.getByRole('textbox', { name: 'Full name' });
  phoneInput = () => this.page.getByRole('textbox', { name: 'Phone number' });
  emailInput = () => this.page.getByRole('textbox', { name: 'Email' });
  departmentInput = () => this.page.getByRole('textbox', { name: 'Department' });
  resumeUploadButton = () => this.page.getByRole('button', { name: 'Upload resume' });
  submitButton = () => this.page.getByRole('button', { name: 'Submit' });
  invalidEmailText = () => this.page.getByText('Please enter a valid email');

  // Admin-only controls asserted absent — no report/listing surface exists on this public page.
  reportTable = () => this.page.getByRole('table');
  jobIdSearch = () => this.page.getByRole('textbox', { name: /job id/i });
  countryFilter = () => this.page.getByRole('combobox', { name: /country/i });
  departmentFilter = () => this.page.getByRole('combobox', { name: /^department filter$/i });
  exportCsvButton = () => this.page.getByRole('button', { name: /export csv/i });
  downloadResumeButton = () => this.page.getByRole('button', { name: /download resume/i });

  async goto(): Promise<void> {
    await this.page.goto('/career');
  }

  async openApplyForm(department: string): Promise<void> {
    await this.departmentCard(department).click();
  }
}
