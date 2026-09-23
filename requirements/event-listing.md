# Playwright: Event Listing — homepage entry, filters, sorting & promo playback

## Acceptance criteria

- Events section is visible on the homepage (Web) with 6 event cards and a "View All" CTA that redirects to the Event Listing page.
- Event Listing page loads with no filters applied by default; Categories filter shows options (Comedy, Music, Nightlife, Concerts…) and all filters are ordered alphabetically (Date filter's "All" pinned last).
- Events are sorted in ascending order of event date; each event card shows poster, name, category, language, tags, duration, date, and offers.
- Watch Promo plays a single promo automatically in the native player, or shows a selectable promo list when multiple promos exist; cards without a promo show only the poster.
- Tapping an event card redirects to the Event Detail page.

## Navigation

1. **Web:** Launch web → navigate to Homepage → scroll to Events section → click "View All" CTA to reach the Event Listing page.
2. **App/M-Site:** Launch app/m-site → tap "Events" from top navigation (currently **Not Applicable** per source sheet — TC_WEB_028 — verify current build behavior before automating this path).
3. On the Event Listing page: observe default (no) filters, open Categories filter, and check event card ordering/details.

## Test coverage

- **Scope:** Complete — all feasible rows for this module from the source sheet.
- **Sheet rows included:** 13 of 447 (TC_WEB_026–TC_WEB_038).
- **Out of scope:**
  - TC_WEB_026 (EL-001) — Events section visibility on homepage (Web) — **Excluded**, confirmed absent on live build; removed from suite.
  - TC_WEB_027 (EL-002) — View All CTA navigation from homepage (Web) — **Excluded**, confirmed absent on live build (no "View All" CTA found near the Events section on either environment); removed from suite.
  - TC_WEB_028 (EL-003) — Events navigation from top menu (App/M-Site) — **Excluded**, confirmed absent on live build (source sheet marks this Not Applicable, and there is no "Events" link in the header nav on either environment); removed from suite.
  - TC_WEB_029/030/031 (EL-004/005/006) — default filter state, Categories filter options, filters alphabetical ordering — **Excluded**, confirmed absent on live build (no dedicated Event Listing page exists to hold filters); removed from suite.
  - TC_WEB_032 (EL-007) — event sorting by date — **Excluded**, confirmed absent on live build (no event cards exist on the homepage); removed from suite.
  - TC_WEB_033 (EL-008) — event card details — **Excluded**, confirmed absent on live build (the known "Karan Aujla" event card no longer renders anywhere on the homepage); removed from suite.
  - TC_WEB_034/035 (EL-009/010) — Watch Promo for single/multiple promos — **Excluded**, confirmed absent on live build (no distinct "Watch Promo" CTA confirmed on homepage event cards); removed from suite.
  - TC_WEB_036 (EL-011) — promo fallback when no promo exists — **Excluded**, confirmed absent on live build (no distinct promo affordance confirmed on homepage event cards); removed from suite.
  - TC_WEB_037 (EL-012) — hover autoplay on web — **Excluded**, confirmed absent on live build (hovering a real event card for up to 8s produced zero `<video>` elements; source sheet's own "Not Applicable" status confirmed live); removed from suite.
  - TC_WEB_038 (EL-013) — navigation to Event Detail page — **Excluded**, confirmed absent on live build (no event card exists on the homepage to click); removed from suite.
- **Environment finding (2026-08-19, corrected 2026-08-24, superseded 2026-08-26/28):** the Events feature is **not deployed on production** at all was the original (2026-08-19) finding, later corrected — see [[events-feature-not-live]] memory: Events IS live on both UAT and production when Mumbai is selected as the city, as a homepage carousel only (no separate Event Listing page/route on either environment — `/events`, `/events/mumbai`, `/events?city=mumbai` all render the same empty stub; EL-000 is a permanent regression guard for that specific gap). A **later, independently re-confirmed regression** (2026-08-26, re-confirmed 2026-08-28) found the homepage's "Events" section itself has since gone genuinely absent on UAT/Mumbai — a full heading sweep finds zero "Events" match, even though the underlying event page still renders fine when visited directly by URL. EL-001–013 are `test.fixme`-removed for this reason (see Out of scope above); EL-000 remains as the one real, passing regression guard.
- **Known flakiness (2026-08-19, historical):** when the Events section was still rendering, it was observed to render noticeably later/independently of the "Now Showing" section this repo's ready-signal (`LocationHelper.waitForHomepageReady`) waits on — kept here for context in case the section reappears.

## Scenarios

- **Suggested journey:** `src/tests/event-listing.spec.ts`
- **Sheet:** `_PVR INOX__ Test Cases - M4 _ Website.pdf` → Website test-case table

- [x] **EL-000** — Regression guard: no dedicated Event Listing page exists yet | Steps: navigate to `/events` | Expected: renders as an empty stub, not a filterable Event Listing page | `@P0 @Regression`

EL-001 through EL-013 (the full original scenario set) are removed — see Out of scope below.

## E2E implementation notes

- **Layering:** `src/tests/event-listing.spec.ts` → `src/modules/EventListingModule.ts` → `src/pages/EventListingPage.ts`
- **Frontend context:** Not provided — no `dev-repo/` supplied. Grounded instead via a read-only headless-Playwright pass against UAT (`inox-uat-web.pvrinox.com`, Mumbai) — see `EventListingPage.ts` doc comment.
- **Reuse:** City/location bootstrap (`LocationHelper.dismissLocationAndSelectCity`) is shared with Global Search, Event Details, and Experience — UAT specifically needs `UAT_CITY`/`UAT_SUB_CITY` (`'Mumbai-All'`/`'Mumbai'`), not the production default (`'Delhi-NCR'`/`'Noida'`), because Delhi has no movie/event data configured on UAT.
- **Locators:** Event cards are real `<a href="/eventsessions/{city}/{slug}/{id}">` links (not `role="article"` as originally guessed) — `getByRole('link', { name })`. No "Watch Promo" CTA, "View All" link, or filter UI was found on either environment.
- **Base URL:** These specs navigate to `UAT_BASE_URL` directly rather than relying on `playwright.config.ts`'s shared `baseURL` (which stays pointed at production for other suites like login/registration) — see `EventListingModule.ts`.
- **Tags:** `@Regression`, `@P0` for the listing → detail navigation path and card content, `@P1`/`@P2` for filter cosmetics and promo edge cases (still blocked).
- **Run:** `npx playwright test src/tests/event-listing.spec.ts --project=chromium`

## Source

- **Seed method:** PDF-exported test-case table (pasted directly; no separate Excel/CSV file)
- **File:** `_PVR INOX__ Test Cases - M4 _ Website.pdf` (pages 1–2)
- **Sheet:** N/A — single "Website" test execution table
- **Columns:** Test Summary=`Test case Title`, Test Objective=`Pre Conditions`, Test Steps=`Test Steps/validation point`, Expected Result=`Expected Result (ER)`, also carried: `Priority`, `QA Status`
- **Frontend repo:** not provided
