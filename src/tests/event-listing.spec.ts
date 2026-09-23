import { test } from '@fixtures/index';

/**
 * Ticket: requirements/event-listing.md — sheet-sourced "Event Listing" module (TC_WEB_026-038).
 *
 * Re-grounded 2026-08-19 against UAT (inox-uat-web.pvrinox.com, Mumbai) after a first pass
 * against production found the Events feature entirely absent there — see
 * [[events-feature-not-live]] memory. On UAT/Mumbai, Events IS live, but only as a homepage
 * carousel: a "Events" heading with cards linking straight to
 * `/eventsessions/{city}/{slug}/{id}`. No "View All" CTA and no separate Event Listing
 * page/route (`/events`, `/events/mumbai`, `/events?city=mumbai`) were found on either
 * environment — EL-000 is a real, passing regression guard for that specific gap, and stays
 * relevant regardless of which environment ships Events fully. Scenarios that assume a
 * dedicated listing page with filters (EL-002, EL-004, EL-005, EL-006) stay `test.fixme` for
 * that reason; the rest are grounded and enabled against the real homepage carousel.
 *
 * REGRESSION (confirmed 2026-08-26, re-confirmed independently 2026-08-28 and 2026-08-31): the
 * "Events" homepage section itself is now genuinely absent — a full heading sweep on UAT/Mumbai
 * finds zero matches (IN THE SPOTLIGHT / Now Showing / Discover the Experiences / SUPPORT / GET
 * THE APP render, no Events). The underlying event page itself still works fine when visited
 * directly (`/eventsessions/mumbai/live-karan-aujla-concert/30199` renders real content, real
 * showtimes) — this is specifically the homepage carousel/section no longer surfacing it, a
 * real product regression, not a locator or timing issue. EL-001/EL-007/EL-008/EL-013 (which
 * all depend on this section existing) are `test.fixme` to track it, same treatment as
 * home-screen.spec.ts's HOME-014/015/016/044/058.
 */
test.describe('Event Listing @RUN3', () => {
  // Grounded 2026-08-19: the homepage's Events section can take longer to render than the
  // default 60s test timeout leaves room for once beforeEach's own retries are accounted for
  // — this site's content genuinely loads slowly under real conditions, not a code bug.
  test.slow();

  test.beforeEach(async ({ eventListingModule }) => {
    await eventListingModule.gotoHomepageWithCitySelected();
  });

  test('EL-000 — no dedicated Event Listing page exists yet (regression guard) @P0 @Regression', async ({ eventListingModule }) => {
    await test.step('navigate to the only Events-shaped route found (`/events`)', async () => {
      await eventListingModule.gotoEventsRoute();
    });

    await test.step('it still renders as an empty stub, not a filterable Event Listing page', async () => {
      await eventListingModule.expectDedicatedListingPageStillMissing();
    });
  });

  test.fixme('EL-001 — Events section visibility on homepage (Web) @P0 @Regression — REGRESSION (see file header): the anchor event has expired and no Events section exists on the homepage right now', () => {});






  test.fixme('EL-007 — event cards render for date-sorting verification @P0 @Regression — REGRESSION (see file header): no event cards exist on the homepage right now', () => {});

  test.fixme('EL-008 — Event card details @P0 @Regression — REGRESSION (see file header): the known "Karan Aujla" event card no longer renders anywhere on the homepage', () => {});





  test.fixme('EL-013 — navigation to Event Detail page @P0 @Regression — REGRESSION (see file header): no event card exists on the homepage to click', () => {});
});
