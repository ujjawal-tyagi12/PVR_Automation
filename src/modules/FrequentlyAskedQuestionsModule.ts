import { Page, expect } from '@playwright/test';
import { FrequentlyAskedQuestionsPage } from '@pages/FrequentlyAskedQuestionsPage';
import { Logger } from '@utils/Logger';

/**
 * Orchestrates the real, public FAQ accordion at /faq — see FrequentlyAskedQuestionsPage for
 * what was verified and what has no reachable admin equivalent (the Static Management → FAQ
 * CRUD table).
 */
export class FrequentlyAskedQuestionsModule {
  private faqPage: FrequentlyAskedQuestionsPage;

  constructor(private page: Page) {
    this.faqPage = new FrequentlyAskedQuestionsPage(page);
  }

  async open(): Promise<void> {
    Logger.info('Opening the real public FAQ page (no admin FAQ table exists)');
    await this.faqPage.goto();
    await expect(this.faqPage.pageHeading()).toBeVisible();
  }

  async assertRealFaqExpands(question: string): Promise<void> {
    const button = this.faqPage.faqQuestionButton(question);
    await expect(button).toBeVisible();
    await button.click();
  }

  async assertNoAdminFaqControls(): Promise<void> {
    await expect(this.faqPage.faqTable()).toHaveCount(0);
    await expect(this.faqPage.addFaqButton()).toHaveCount(0);
    await expect(this.faqPage.editButton()).toHaveCount(0);
    await expect(this.faqPage.deleteButton()).toHaveCount(0);
  }

  async assertNoCountryTabs(): Promise<void> {
    await expect(this.faqPage.indiaTab()).toHaveCount(0);
    await expect(this.faqPage.sriLankaTab()).toHaveCount(0);
  }

  async assertNoSearchBar(): Promise<void> {
    await expect(this.faqPage.searchInput()).toHaveCount(0);
  }
}
