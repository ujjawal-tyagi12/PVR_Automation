import { Page, expect } from '@playwright/test';
import { InCinemaFoodSectionPage } from '@pages/InCinemaFoodSectionPage';
import { Logger } from '@utils/Logger';

/**
 * Orchestrates the real, public "Book with Ticket" tab at /food?tab=book-with-ticket — see
 * InCinemaFoodSectionPage for what was verified and what has no reachable admin equivalent (the
 * Static Management edit form).
 */
export class InCinemaFoodSectionModule {
  private inCinemaPage: InCinemaFoodSectionPage;

  constructor(private page: Page) {
    this.inCinemaPage = new InCinemaFoodSectionPage(page);
  }

  async open(): Promise<void> {
    Logger.info('Opening the real public Book with Ticket tab (no admin edit form exists)');
    await this.inCinemaPage.goto();
    await expect(this.inCinemaPage.bookWithTicketTab()).toBeVisible();
  }

  async assertRealStaticContentVisible(): Promise<void> {
    await expect(this.inCinemaPage.bannerImage()).toBeVisible();
    await expect(this.inCinemaPage.orderAnytimeTab()).toBeVisible();
  }

  async assertUnbookedUserSeesLoginPrompt(): Promise<void> {
    await expect(this.inCinemaPage.loginPromptButton()).toBeVisible();
  }

  async assertNoEditForm(): Promise<void> {
    await expect(this.inCinemaPage.titleField()).toHaveCount(0);
    await expect(this.inCinemaPage.subTitleField()).toHaveCount(0);
    await expect(this.inCinemaPage.descriptionField()).toHaveCount(0);
    await expect(this.inCinemaPage.saveButton()).toHaveCount(0);
  }

  async assertNoImageUpload(): Promise<void> {
    await expect(this.inCinemaPage.imageUploadInput()).toHaveCount(0);
  }
}
