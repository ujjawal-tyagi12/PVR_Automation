import { Page, expect } from '@playwright/test';
import { EventsListingPage } from '@pages/EventsListingPage';
import { WaitHelper } from '@utils/WaitHelper';
import { Logger } from '@utils/Logger';

/**
 * Orchestrates the real Search dialog's Movies/Events tab for the Events Listing & Detail Page
 * sheet module — see EventsListingPage for what was grounded and why content-dependent cases
 * are adapted.
 *
 * @hritik
 */
export class EventsListingModule {
  private eventsPage: EventsListingPage;

  constructor(private page: Page) {
    this.eventsPage = new EventsListingPage(page);
  }

  async open(): Promise<void> {
    Logger.info('Opening the home page');
    await this.eventsPage.goto();
    await WaitHelper.forHydration(this.page);
  }

  async openEventsTab(): Promise<void> {
    await this.eventsPage.searchTriggerButton().click();
    await expect(this.eventsPage.searchDialog()).toBeVisible({ timeout: 10000 });
    await expect(this.eventsPage.moviesEventsTab()).toBeVisible({ timeout: 10000 });
  }
}
