import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { EventListingPage } from '@pages/EventListingPage';
import { dismissLocationAndSelectCity, waitForHomepageReady, UAT_BASE_URL, UAT_CITY, UAT_SUB_CITY } from '@utils/LocationHelper';
import { Logger } from '@utils/Logger';

export class EventListingModule {
  private readonly eventListingPage: EventListingPage;

  constructor(private page: Page) {
    this.eventListingPage = new EventListingPage(page);
  }

  /**
   * Targets UAT directly (`UAT_BASE_URL`, not the shared `playwright.config.ts` `baseURL`)
   * because the Events feature only exists there with Mumbai selected — see
   * [[events-feature-not-live]] memory and LocationHelper.ts doc comment. This deliberately
   * does not touch the framework's shared production `BASE_URL` default used by other
   * suites (login, registration, ...).
   */
  async gotoHomepageWithCitySelected(): Promise<void> {
    Logger.info('Opening UAT homepage and ensuring Mumbai is selected');
    await this.page.goto(UAT_BASE_URL);
    await waitForHomepageReady(this.page, UAT_CITY, UAT_SUB_CITY);
  }

  async gotoEventsRoute(): Promise<void> {
    await this.eventListingPage.gotoEventsRoute(UAT_BASE_URL);
    // Grounded 2026-08-19: the location modal reappears on every full-page navigation on this
    // site (not just the very first visit), so it must be re-dismissed after `goto('/events')`.
    await dismissLocationAndSelectCity(this.page, UAT_CITY, UAT_SUB_CITY);
  }

  /**
   * Grounded 2026-08-19: the Events section renders later than "Now Showing" (the signal
   * `waitForHomepageReady` waits on) — it sits further down the page and was seen to still be
   * loading after "Now Showing" was already visible. Scroll it into view and use a longer,
   * explicit timeout rather than the default.
   */
  async expectEventsSectionVisible(): Promise<void> {
    const heading = this.eventListingPage.eventsSectionHeading();
    await heading.scrollIntoViewIfNeeded({ timeout: 20_000 }).catch(() => undefined);
    await expect(heading).toBeVisible({ timeout: 20_000 });
  }

  async expectEventCardVisible(title: string): Promise<void> {
    const card = this.eventListingPage.eventCardByTitle(title);
    await card.scrollIntoViewIfNeeded({ timeout: 20_000 }).catch(() => undefined);
    await expect(card).toBeVisible({ timeout: 20_000 });
  }

  async expectEventCardsVisible(): Promise<void> {
    const card = this.eventListingPage.eventCards().first();
    await card.scrollIntoViewIfNeeded({ timeout: 20_000 }).catch(() => undefined);
    await expect(card).toBeVisible({ timeout: 20_000 });
  }

  async clickEventCardAndExpectNavigation(title: string, urlPattern: RegExp): Promise<void> {
    const card = this.eventListingPage.eventCardByTitle(title);
    await card.scrollIntoViewIfNeeded({ timeout: 20_000 }).catch(() => undefined);
    await card.click({ timeout: 20_000 });
    await this.page.waitForURL(urlPattern, { timeout: 15_000 });
  }

  /**
   * Regression guard for the "no dedicated listing page" state found during grounding
   * (2026-08-19, both production and UAT): `/events` renders only a "Back To Home" link with
   * no event content — Events is only reachable via the homepage carousel. This assertion is
   * expected to start FAILING the day a real Event Listing page ships at this route — that
   * failure is the signal to un-skip the remaining `test.fixme` scenarios in
   * event-listing.spec.ts that assume filters/a "View All" CTA.
   */
  async expectDedicatedListingPageStillMissing(): Promise<void> {
    await expect(this.eventListingPage.backToHomeLink()).toBeVisible();
  }
}
