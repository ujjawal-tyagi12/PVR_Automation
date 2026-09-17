import { Page, expect } from '@playwright/test';
import { EventsManagementPage } from '@pages/EventsManagementPage';
import { Logger } from '@utils/Logger';

/**
 * Orchestrates the real, public Curated Shows page — see EventsManagementPage
 * for what was verified and what has no reachable admin equivalent (the
 * Events Management CRUD table).
 */
export class EventsManagementModule {
  private eventsPage: EventsManagementPage;

  constructor(private page: Page) {
    this.eventsPage = new EventsManagementPage(page);
  }

  async open(): Promise<void> {
    Logger.info('Opening the real public Curated Shows page (no admin Events Management table exists)');
    await this.eventsPage.goto();
    await expect(this.eventsPage.pageHeading()).toBeVisible();
  }

  async assertRealSearchBarVisible(): Promise<void> {
    await expect(this.eventsPage.searchInput()).toBeVisible();
  }

  async assertNoAdminListingControl(): Promise<void> {
    await expect(this.eventsPage.syncButton()).toHaveCount(0);
    await expect(this.eventsPage.filterButton()).toHaveCount(0);
    await expect(this.eventsPage.exportCsvButton()).toHaveCount(0);
    await expect(this.eventsPage.editIconButton()).toHaveCount(0);
    await expect(this.eventsPage.viewIconButton()).toHaveCount(0);
    await expect(this.eventsPage.topPriorityButton()).toHaveCount(0);
  }

  async assertNoImageUploadControl(): Promise<void> {
    await expect(this.eventsPage.fileUploadInput()).toHaveCount(0);
  }

  async assertNoEditFormFields(): Promise<void> {
    await expect(this.eventsPage.metaTitleField()).toHaveCount(0);
    await expect(this.eventsPage.eventDescriptionField()).toHaveCount(0);
    await expect(this.eventsPage.campaignVideoField()).toHaveCount(0);
  }
}
