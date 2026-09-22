import { Page } from '@playwright/test';

/**
 * Grounded against the live app at BASE_URL (direct Playwright probe, 2026-09-22). No dedicated
 * /events route exists (confirmed: both /events and /experiences/events dead-end at the real
 * 404 page). Events are reachable only via the header Search dialog's "Movies/Events" tab —
 * confirmed real and reachable, but no live event was consistently listed across probes at
 * grounding time (a real, live-data state, not a broken control).
 *
 * @hritik
 */
export class EventsListingPage {
  constructor(private page: Page) {}

  searchTriggerButton = () => this.page.getByRole('banner').getByRole('button').filter({ hasNotText: /.+/ }).first();
  searchDialog = () => this.page.getByRole('dialog', { name: 'Search' });
  moviesEventsTab = () => this.page.getByRole('tab', { name: 'Movies/Events' });

  async goto(): Promise<void> {
    await this.page.goto('/');
  }
}
