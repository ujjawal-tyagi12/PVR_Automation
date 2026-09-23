import type { Page } from '@playwright/test';

/**
 * Re-grounded 2026-08-19 against UAT (inox-uat-web.pvrinox.com, Mumbai) via a read-only
 * headless-Playwright diagnostic pass — see scratchpad inspect-uat-events*.js scripts. The
 * Events feature IS live here (unlike production — see [[events-feature-not-live]] memory
 * and EventListingModule.ts), but only as a homepage carousel: a "Events" heading with event
 * cards linking directly to `/eventsessions/{city}/{event-slug}/{id}`
 * (e.g. `/eventsessions/mumbai/live-karan-aujla-concert/30199`). No "View All" CTA and no
 * separate Event Listing page/route were found — `/events`, `/events/mumbai`, and
 * `/events?city=mumbai` all still render the same empty "Back To Home" stub confirmed on
 * production. So there is no dedicated listing page with Category/Date filters to automate
 * against; `viewAllEventsCta` and `categoriesFilterButton` below are kept as **unconfirmed
 * best-effort guesses** in case a filtered listing page exists behind a not-yet-found route.
 */
export class EventListingPage {
  constructor(private page: Page) {}

  // Grounded 2026-08-19 (UAT, Mumbai).
  readonly eventsSectionHeading = () => this.page.getByRole('heading', { name: /^events$/i });
  readonly eventCardByTitle = (title: string) => this.page.getByRole('link', { name: new RegExp(title, 'i') });
  readonly eventCards = () => this.page.locator('a[href*="/eventsessions/"]');
  // Grounded 2026-08-19: same stub confirmed on both production and UAT.
  readonly backToHomeLink = () => this.page.getByRole('link', { name: /back to home/i });

  // TODO(heal): unconfirmed — no separate Event Listing page/route was found on either
  // environment during grounding; re-ground if one is discovered.
  readonly viewAllEventsCta = () => this.page.getByRole('link', { name: /view all/i });
  readonly categoriesFilterButton = () => this.page.getByRole('button', { name: /categories/i });
  readonly watchPromoButton = () => this.page.getByRole('button', { name: /watch promo/i });

  async gotoEventsRoute(baseUrl: string): Promise<void> {
    await this.page.goto(`${baseUrl}/events`);
  }

  async clickEventCard(title: string): Promise<void> {
    await this.eventCardByTitle(title).click();
  }
}
