import { Page, expect } from '@playwright/test';
import { JobsPage } from '@pages/JobsPage';
import { Logger } from '@utils/Logger';
import { WaitHelper } from '@utils/WaitHelper';

/**
 * Orchestrates the real, public Careers page at /career — see JobsPage for what was verified
 * and what has no reachable admin equivalent (the per-job-posting CRUD table).
 */
export class JobsModule {
  private jobsPage: JobsPage;

  constructor(private page: Page) {
    this.jobsPage = new JobsPage(page);
  }

  async open(): Promise<void> {
    Logger.info('Opening the real public Careers page (no per-job-posting listing exists)');
    await this.jobsPage.goto();
    await WaitHelper.forHydration(this.page);
    await expect(this.jobsPage.departmentsHeading()).toBeVisible({ timeout: 20000 });
  }

  async assertOnlyDepartmentCardsExist(): Promise<void> {
    await expect(this.jobsPage.departmentCard()).toBeVisible();
    await expect(this.jobsPage.jobsTable()).toHaveCount(0);
  }

  async assertNoAdminForm(): Promise<void> {
    await expect(this.jobsPage.addJobButton()).toHaveCount(0);
    await expect(this.jobsPage.editButton()).toHaveCount(0);
    await expect(this.jobsPage.deleteButton()).toHaveCount(0);
    await expect(this.jobsPage.vacanciesField()).toHaveCount(0);
    await expect(this.jobsPage.minExperienceField()).toHaveCount(0);
    await expect(this.jobsPage.maxExperienceField()).toHaveCount(0);
    await expect(this.jobsPage.startDateField()).toHaveCount(0);
    await expect(this.jobsPage.endDateField()).toHaveCount(0);
    await expect(this.jobsPage.departmentEmailsField()).toHaveCount(0);
  }

  async assertNoJobsTable(): Promise<void> {
    await expect(this.jobsPage.jobsTable()).toHaveCount(0);
    await expect(this.jobsPage.activateButton()).toHaveCount(0);
  }
}
