import { Page } from '@playwright/test';

/**
 * Grounded against the live app at BASE_URL (direct Playwright probe, 2026-09-22). The
 * "Coming Soon" tab is a real, clickable control in the homepage's movie-listing tab row (Now
 * Showing / Coming Soon / Experiences / Trailers / Offers / Food / Curated Shows). Confirmed
 * live: clicking it across several attempts never produced an observably different movie list
 * from "Now Showing" — Mumbai has no Coming Soon titles configured at grounding time (a real
 * data state, not a broken control), so deeper content-dependent behavior (detail page, Notify
 * Me, transition, flash message) has no reachable live target within a reasonable time budget.
 *
 * @hritik
 */
export class ComingSoonPage {
  constructor(private page: Page) {}

  comingSoonTab = () => this.page.getByRole('button', { name: 'Coming Soon', exact: true });
  nowShowingTab = () => this.page.getByRole('button', { name: 'Now Showing', exact: true });

  async goto(): Promise<void> {
    await this.page.goto('/');
  }
}
