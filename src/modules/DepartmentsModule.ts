import { Page, expect } from '@playwright/test';
import { DepartmentsPage } from '@pages/DepartmentsPage';
import { Logger } from '@utils/Logger';

/**
 * Orchestrates the real, public Careers page's Explore Departments section — see
 * DepartmentsPage for what was verified and what has no reachable admin equivalent (the Jobs
 * Management → Departments CRUD table).
 */
export class DepartmentsModule {
  private departmentsPage: DepartmentsPage;

  constructor(private page: Page) {
    this.departmentsPage = new DepartmentsPage(page);
  }

  async open(): Promise<void> {
    Logger.info('Opening the real public Careers page (no admin Departments table exists)');
    await this.departmentsPage.goto();
    await expect(this.departmentsPage.exploreDepartmentsHeading()).toBeVisible();
  }

  async assertRealDepartmentOpensApplyForm(name: string): Promise<void> {
    await this.departmentsPage.clickDepartment(name);
    await expect(this.departmentsPage.applyDialog()).toBeVisible();
    await expect(this.departmentsPage.departmentField()).toHaveValue(name);
  }

  async assertNoAdminDepartmentControls(): Promise<void> {
    await expect(this.departmentsPage.addDepartmentButton()).toHaveCount(0);
    await expect(this.departmentsPage.departmentTable()).toHaveCount(0);
    await expect(this.departmentsPage.filterButton()).toHaveCount(0);
  }

  async assertNoAdminFormFields(): Promise<void> {
    await expect(this.departmentsPage.sequenceField()).toHaveCount(0);
    await expect(this.departmentsPage.fileUploadInput()).toHaveCount(0);
  }
}
