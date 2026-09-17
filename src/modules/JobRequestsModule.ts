import { Page, expect } from '@playwright/test';
import { JobRequestsPage } from '@pages/JobRequestsPage';
import { Logger } from '@utils/Logger';
import { WaitHelper } from '@utils/WaitHelper';

/**
 * Orchestrates the real, public "Apply for the role" form at /career — see JobRequestsPage for
 * what was verified and what has no reachable admin equivalent (the Job Requests report).
 */
export class JobRequestsModule {
  private jobRequestsPage: JobRequestsPage;

  constructor(private page: Page) {
    this.jobRequestsPage = new JobRequestsPage(page);
  }

  async open(): Promise<void> {
    Logger.info('Opening the real public Careers page (no admin Job Requests report exists)');
    await this.jobRequestsPage.goto();
    await WaitHelper.forHydration(this.page);
    await this.jobRequestsPage.openApplyForm('Sales Marketing');
    await expect(this.jobRequestsPage.applyHeading()).toBeVisible({ timeout: 20000 });
  }

  async assertRealApplyFormFields(): Promise<void> {
    await expect(this.jobRequestsPage.fullNameInput()).toBeVisible();
    await expect(this.jobRequestsPage.phoneInput()).toBeVisible();
    await expect(this.jobRequestsPage.emailInput()).toBeVisible();
    await expect(this.jobRequestsPage.departmentInput()).toHaveValue('Sales Marketing');
    await expect(this.jobRequestsPage.resumeUploadButton()).toBeVisible();
  }

  async assertInvalidEmailRejected(): Promise<void> {
    await this.jobRequestsPage.emailInput().fill('not-an-email');
    await this.jobRequestsPage.emailInput().press('Tab');
    await expect(this.jobRequestsPage.invalidEmailText()).toBeVisible();
  }

  async assertDepartmentFieldReadOnly(): Promise<void> {
    await expect(this.jobRequestsPage.departmentInput()).toBeDisabled();
  }

  async assertNoAdminReport(): Promise<void> {
    await expect(this.jobRequestsPage.reportTable()).toHaveCount(0);
    await expect(this.jobRequestsPage.exportCsvButton()).toHaveCount(0);
    await expect(this.jobRequestsPage.downloadResumeButton()).toHaveCount(0);
  }

  async assertNoSearchOrFilters(): Promise<void> {
    await expect(this.jobRequestsPage.jobIdSearch()).toHaveCount(0);
    await expect(this.jobRequestsPage.countryFilter()).toHaveCount(0);
    await expect(this.jobRequestsPage.departmentFilter()).toHaveCount(0);
  }
}
