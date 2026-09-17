import { Page, expect } from '@playwright/test';
import { InvestorPresentationPage } from '@pages/InvestorPresentationPage';
import { Logger } from '@utils/Logger';
import { WaitHelper } from '@utils/WaitHelper';

/**
 * Orchestrates the real, public investor-presentation listing at
 * /investors-section?tab=financials&subtype=investor-presentation — see
 * InvestorPresentationPage for what was verified and what has no reachable admin equivalent
 * (the Add/Edit/Toggle/CSV-upload CRUD surface).
 */
export class InvestorPresentationModule {
  private investorPage: InvestorPresentationPage;

  constructor(private page: Page) {
    this.investorPage = new InvestorPresentationPage(page);
  }

  async open(): Promise<void> {
    Logger.info('Opening the real public Investor Presentation listing (no admin CRUD form exists)');
    await this.investorPage.goto();
    // Same investors-section page family as InvestorSupportModule/AnnualReportsModule — gate on
    // hydration before the tab check, consistent with the confirmed pattern there.
    await WaitHelper.forHydration(this.page);
    await expect(this.investorPage.investorPresentationTab()).toBeVisible({ timeout: 20000 });
  }

  async assertYearFilterVisible(): Promise<void> {
    await expect(this.investorPage.yearFilterCombobox()).toBeVisible();
  }

  async assertListingDescendingByYear(): Promise<void> {
    const years = await this.investorPage.allYearCards().allTextContents();
    const parsed = years.map((text) => parseInt(text.trim(), 10)).filter((n) => !Number.isNaN(n));
    for (let i = 1; i < parsed.length; i += 1) {
      expect(parsed[i]).toBeLessThanOrEqual(parsed[i - 1]);
    }
  }

  async assertDuplicateYearCardsExist(): Promise<void> {
    const years = await this.investorPage.allYearCards().allTextContents();
    const counts = new Map<string, number>();
    for (const year of years) {
      counts.set(year.trim(), (counts.get(year.trim()) ?? 0) + 1);
    }
    const hasDuplicate = [...counts.values()].some((count) => count > 1);
    expect(hasDuplicate).toBe(true);
  }

  async assertDownloadButtonWorks(year: string): Promise<void> {
    await expect(this.investorPage.downloadButton(year)).toBeVisible();
  }

  async assertNoAdminCrud(): Promise<void> {
    await expect(this.investorPage.addButton()).toHaveCount(0);
    await expect(this.investorPage.editButton()).toHaveCount(0);
    await expect(this.investorPage.statusToggle()).toHaveCount(0);
    await expect(this.investorPage.nameField()).toHaveCount(0);
  }

  async assertNoSearchOrStatusFilter(): Promise<void> {
    await expect(this.investorPage.nameSearch()).toHaveCount(0);
    await expect(this.investorPage.statusFilter()).toHaveCount(0);
  }

  async assertTenYearsHighlightShowsRealData(): Promise<void> {
    await this.investorPage.tenYearsHighlightTab().click();
    await expect(this.investorPage.operationalHighlightsHeading()).toBeVisible();
  }

  async assertNoCsvUploadInput(): Promise<void> {
    await expect(this.investorPage.csvFileInput()).toHaveCount(0);
  }

  async assertNoPagination(): Promise<void> {
    await expect(this.investorPage.paginationNav()).toHaveCount(0);
  }
}
