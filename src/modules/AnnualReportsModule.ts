import { Page, expect } from '@playwright/test';
import { AnnualReportsPage } from '@pages/AnnualReportsPage';
import { Logger } from '@utils/Logger';
import { WaitHelper } from '@utils/WaitHelper';

/**
 * Grounded against the live app at BASE_URL/investors-section. Orchestrates the
 * real, public Annual Report tab — see AnnualReportsPage for what was verified.
 */
export class AnnualReportsModule {
  private reportsPage: AnnualReportsPage;

  constructor(private page: Page) {
    this.reportsPage = new AnnualReportsPage(page);
  }

  async open(): Promise<void> {
    Logger.info('Opening the public Investor Section Annual Report tab');
    await this.reportsPage.goto();
    // Report cards render client-side after navigation; waiting here (once, for every test)
    // avoids a hydration race that intermittently makes the first assertion see zero cards.
    await WaitHelper.forHydration(this.page);
    // Explicit 20s timeout (vs the 10s default) absorbs the slow end of that hydration race
    // instead of failing the shared beforeEach on it (observed once in 25 runs).
    await expect(this.reportsPage.reportCards().first()).toBeVisible({ timeout: 20000 });
  }

  async assertReportCardVisible(year: string): Promise<void> {
    await expect(this.reportsPage.reportYearText(year)).toBeVisible();
  }

  async assertDownloadButtonVisible(year: string): Promise<void> {
    await expect(this.reportsPage.downloadButton(year)).toBeVisible();
  }

  async assertNoFileUploadControl(): Promise<void> {
    await expect(this.reportsPage.fileUploadInput()).toHaveCount(0);
  }
}
