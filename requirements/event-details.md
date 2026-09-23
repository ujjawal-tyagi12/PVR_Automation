# Playwright: Event Details — page layout, Book Event booking flow & error handling

## Acceptance criteria

- Event Detail page displays poster, name, tags, category, age limit, duration, language, and synopsis.
- Watch Trailer shows a selectable list when multiple trailers exist and auto-plays the chosen one; promotional banner and Share Event (poster/text/deep-link) work when configured/supported.
- Book Event section shows a Date filter (defaulting to current date) and a cinema list ordered Favorite → Recommended → Nearest.
- Only one cinema card can be expanded at a time, with autoscroll on expansion; showtimes are color-coded by status (Available/Filling Fast/Sold Out/Lapsed).
- Selecting an available showtime redirects to seat selection; Sold Out showtimes are handled distinctly; booking/API failures and promo playback failures surface an error message.
- Restrictive filters that return zero cinemas show a "No Cinemas Found" error.

## Navigation

1. From the Event Listing page (see [[event-listing]]), click any event card.
2. Land on the Event Detail page — review header/synopsis content, then scroll to the Book Event section.
3. Apply date/cinema filters and expand a cinema card to reach showtimes for booking-flow scenarios.

## Test coverage

- **Scope:** Complete — all feasible rows for this module from the source sheet.
- **Sheet rows included:** 14 of 447 (TC_WEB_039–TC_WEB_052).
- **Out of scope:** None excluded. Four rows carry "Deferred" QA status in the source sheet (TC_WEB_041 promotional banner, TC_WEB_042 Share Event, TC_WEB_048 Sold Out handling, TC_WEB_049 booking redirection, TC_WEB_052 booking failure handling) — included per instruction, but these depend on booking-flow infrastructure this repo does not yet automate (no seat-selection/payment module exists); expect these to need new fixtures/mocks and possibly to fail until the underlying feature is confirmed stable.
- **Environment finding (2026-08-19):** an Event Detail page is reachable and real on UAT (`inox-uat-web.pvrinox.com`, Mumbai) at `/eventsessions/{city}/{slug}/{id}` — confirmed content: event title, a "{N} SHOWS IN {M} CINEMA(S)" heading, and cinema entries. The page still had a loading spinner up when this grounding pass inspected buttons/tabs, so booking-flow interactivity (date filter, showtimes, Watch Trailer, Share) was **not** confirmed — ED-001/ED-005 are grounded and automated; the rest stay `test.fixme` pending a deeper pass once the page's full load state can be captured (e.g. waiting on the spinner to disappear before inspecting).

## Scenarios

- **Suggested journey:** `src/tests/event-details.spec.ts`
- **Sheet:** `_PVR INOX__ Test Cases - M4 _ Website.pdf` → Website test-case table

- [ ] **ED-001** — Verify Event Detail page layout | Steps: navigate from Event Listing, observe page | Expected: poster, name, tags, category, age limit, duration, language, synopsis displayed | `@P0 @Regression`
- [ ] **ED-002** — Verify Watch Trailer CTA behavior | Steps: click Watch Trailer → select trailer | Expected: trailer list displayed; selected trailer auto-plays | `@P1 @Regression`
- [ ] **ED-003** — Verify promotional banner display | Steps: banner configured in Admin, observe page | Expected: promotional banner displayed | `@P2 @Regression` (source QA status: Deferred)
- [ ] **ED-004** — Verify Share Event functionality | Steps: native share supported, tap Share icon | Expected: poster, text and deep-link shared successfully | `@P1 @Regression` (source QA status: Deferred)
- [ ] **ED-005** — Verify Book Event section visibility | Steps: scroll to Book Event section | Expected: section displayed with filters and cinema list | `@P0 @Regression`
- [ ] **ED-006** — Verify Date filter default selection | Steps: observe Date filter | Expected: current date selected and highlighted by default | `@P0 @Regression`
- [ ] **ED-007** — Verify cinema sorting logic | Steps: log in, enable location, observe cinema list | Expected: Favorite → Recommended → Nearest order followed | `@P0 @Regression`
- [ ] **ED-008** — Verify cinema card expansion behavior | Steps: expand one cinema card | Expected: only one cinema expanded; autoscroll occurs | `@P1 @Regression`
- [ ] **ED-009** — Verify showtime color coding | Steps: observe showtime cards | Expected: Available/Filling Fast/Sold Out/Lapsed colors shown correctly | `@P0 @Regression`
- [ ] **ED-010** — Verify Sold Out showtime handling | Steps: click Sold Out showtime | Expected: sold-out handling shown (exact message TBD — not captured in sheet) | `@P0 @Regression` (source QA status: Deferred)
- [ ] **ED-011** — Verify booking redirection to seat selection | Steps: click showtime → accept popup | Expected: redirected to seat selection (exact target TBD — not captured in sheet) | `@P0 @Regression` (source QA status: Deferred)
- [ ] **ED-012** — Verify No Cinemas Found error | Steps: apply restrictive filters | Expected: error message shown for no cinemas | `@P0 @Regression`
- [ ] **ED-013** — Verify Promo Playback Failure handling | Steps: attempt to play promo that fails to load | Expected: error message shown for promo failure | `@P1 @Regression`
- [ ] **ED-014** — Verify Booking Redirection Failure handling | Steps: simulate booking API failure, select showtime | Expected: failure handling shown (exact message TBD — not captured in sheet) | `@P0 @Regression` (source QA status: Deferred)

## E2E implementation notes

- **Layering:** `src/tests/event-details.spec.ts` → `src/modules/EventDetailsModule.ts` → `src/pages/EventDetailsPage.ts`
- **Frontend context:** Not provided — no `dev-repo/` supplied. Grounded instead via a read-only headless-Playwright pass against a real UAT event detail page — see `EventDetailsPage.ts` doc comment for exactly what was and wasn't confirmed.
- **Reuse:** City/location bootstrap (`LocationHelper.dismissLocationAndSelectCity`) is shared with Global Search, Event Listing, and Experience — UAT specifically needs `UAT_CITY`/`UAT_SUB_CITY` (`'Mumbai-All'`/`'Mumbai'`).
- **Locators:** `eventTitle` and `showsCountHeading` are grounded; cinema-list entries reuse the same "Enable location to get directions" copy confirmed in `GlobalSearchPage.ts`. Everything past that (date filter, showtimes, Watch Trailer, Share) is an unconfirmed best-effort guess — re-ground after waiting for `EventDetailsPage.loadingSpinner` to disappear.
- **Base URL:** These specs navigate to `UAT_BASE_URL` directly (a known event: `/eventsessions/mumbai/live-karan-aujla-concert/30199`) rather than relying on `playwright.config.ts`'s shared `baseURL`.
- **Fixtures / mocks:** ED-010/ED-011/ED-013/ED-014 require simulated failure states (booking API 4xx/5xx, promo load failure) and a guaranteed Sold Out slot — these need test-data or network-mocking support (`page.route`) since they can't rely on live data being in the right state.
- **Tags:** `@Regression`, `@P0` for detail-page content, cinema sorting, showtime coloring and error states; `@P1`/`@P2` for trailer, share, banner cosmetics.
- **Run:** `npx playwright test src/tests/event-details.spec.ts --project=chromium`

## Source

- **Seed method:** PDF-exported test-case table (pasted directly; no separate Excel/CSV file)
- **File:** `_PVR INOX__ Test Cases - M4 _ Website.pdf` (pages 1–2)
- **Sheet:** N/A — single "Website" test execution table
- **Columns:** Test Summary=`Test case Title`, Test Objective=`Pre Conditions`, Test Steps=`Test Steps/validation point`, Expected Result=`Expected Result (ER)`, also carried: `Priority`, `QA Status`
- **Frontend repo:** not provided
