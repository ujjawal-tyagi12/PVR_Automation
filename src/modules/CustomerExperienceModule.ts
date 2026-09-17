import { Page, expect } from '@playwright/test';
import { CustomerExperiencePage } from '@pages/CustomerExperiencePage';
import { Logger } from '@utils/Logger';

/**
 * Orchestrates the real, public feedback form at /feedback — see CustomerExperiencePage for what
 * was verified and what has no reachable admin equivalent (the Reports → Customer Experience
 * listing).
 */
export class CustomerExperienceModule {
  private customerExpPage: CustomerExperiencePage;

  constructor(private page: Page) {
    this.customerExpPage = new CustomerExperiencePage(page);
  }

  async open(): Promise<void> {
    Logger.info('Opening the real public feedback form (no admin Customer Experience report exists)');
    await this.customerExpPage.goto();
    await expect(this.customerExpPage.pageHeading()).toBeVisible();
  }

  async assertNoAdminReportControls(): Promise<void> {
    await expect(this.customerExpPage.reportTable()).toHaveCount(0);
    await expect(this.customerExpPage.filterButton()).toHaveCount(0);
    await expect(this.customerExpPage.exportCsvButton()).toHaveCount(0);
    await expect(this.customerExpPage.sortButton()).toHaveCount(0);
  }

  async assertRealFeedbackTypeOptions(): Promise<void> {
    await this.customerExpPage.openFeedbackTypeDropdown();
    for (const type of ['Complaint', 'Suggestion', 'Compliment', 'Enquiry', 'Others']) {
      await expect(this.customerExpPage.feedbackTypeOption(type)).toBeVisible();
    }
  }
}
