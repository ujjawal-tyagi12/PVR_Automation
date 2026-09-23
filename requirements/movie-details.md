# Playwright: Movie Details — header, trailers, cinema/showtime booking entry & preferences

## Acceptance criteria

- Movie Detail page is reachable from homepage, cinema listing, and experience-page movie cards, defaulting to the "Book Movie" section.
- Movie header shows full metadata (poster, name, rating, genre, duration); trailer autoplays after load with a Watch Trailer CTA for multiple trailers, and Share Movie shares poster/text/deep-link. **Note:** header details, trailer autoplay, and Share Movie are all currently **failing** in manual QA (TC_WEB_394/395/398) — automate to codify expected behavior and catch the regression, not as a claim they currently pass.
- Book Movie section defaults the date filter to today, supports cinema search (text + voice, mic-permission-gated) and Reset Filters, shows color-coded showtimes (including Sold Out handling), and redirects to seat selection on a valid showtime click (with booking-failure handling).
- When no suitable showtime exists, "Pickup Your Time" opens a preference-submission flow (success, failure, and guest-redirect-then-return paths).
- Cinema list within Book Movie sorts Favorite → Recommended → Distance, expands only one card at a time (first expanded by default), and supports the full filter set (experience/accessibility/genre/language/price/showtime) with an applied-filters summary and a cinema/showtime count message.
- Popups (adult-content warning, experience-mismatch) appear per admin-defined order; distance-based fallback auto-expands and offers a city-wide option when no cinemas are found nearby.
- Movie Details tab shows synopsis/cast/crew/trailers/backdrops; Also Playing shows up to 10 related movies; a fixed Book Now CTA persists on scroll (App/M-Site).

## Navigation

1. Reach Movie Detail via: homepage movie card click, cinema-listing movie selection, or an experience-page movie card (with the experience filter pre-applied).
2. On load, the Book Movie section is the default tab; switch to Movie Details tab for synopsis/cast/crew content.
3. Within Book Movie: use the date selector, search/filters, and expand a cinema card to reach its showtimes.

## Test coverage

- **Scope:** Complete — all feasible rows for this module from the source sheet.
- **Sheet rows included:** 62 raw rows (TC_WEB_386–447), consolidated into **49 scenarios** (7 literal duplicate pairs merged — see below).
- **Merged duplicates:** TC_WEB_416 → 396 (Watch Trailer CTA for multiple trailers, tested twice); TC_WEB_419 → 399 (date filter default, tested twice); TC_WEB_420 → 400 (cinema search by text, tested twice); TC_WEB_434 → 406 (booking redirection, tested twice); TC_WEB_438 → 408 (Pickup Your Time flow, tested twice); TC_WEB_442 → 412 (Movie Details tab switch, tested twice); TC_WEB_446 → 397 (trailer playback failure, tested twice — different trigger wording, same assertion).
- **Known-failing (include as scenarios, document expected behavior, flag current status):**
  - TC_WEB_394 — movie header details — **Fail**
  - TC_WEB_395 — trailer autoplay — **Fail**
  - TC_WEB_398 — Share Movie functionality — **Fail**
- **Out of scope:**
  - TC_WEB_389–393 — experience nudge (visibility, apply-filters, know-more, skip, hidden-when-none) — **Deferred**, feature not yet built.
  - TC_WEB_447 — multiple-error redirect logic — **Deferred**.
  - TC_WEB_401/402 (MOV-011/012) — cinema search by voice, mic permission denied handling — **Excluded**, mic-permission-dependent; removed from suite.
  - TC_WEB_397/446 (MOV-007) — trailer playback failure shows error — **Excluded**, non-mockable third-party content; removed from suite. Watch Trailer opens a real `youtube.com/embed/...` iframe with no first-party trailer/video API to force a failure state on; blocking the embed renders no in-app error message at all.
  - TC_WEB_407 (MOV-017) — booking redirection failure handling — **Excluded**, confirmed absent on live build (forcing the real `seatLayout` route to HTTP 500 renders the browser's raw failed-response body, not an in-app "Unable to start booking" message; no such error-message UI state exists to assert on); removed from suite.
  - TC_WEB_433 (MOV-040) — seat price tooltip on hover/long-press — **Excluded**, confirmed absent on live build (seat prices render as static, always-visible text; no `[aria-label*="seat"]` elements and no `[role="tooltip"]` on hover, 0 matches); removed from suite.
  - TC_WEB_444 (MOV-048) — backdrop viewer opens with download option — **Excluded**, confirmed absent on live build (0 matches for "backdrop"/"gallery" text anywhere on the Movie Details tab; no backdrop gallery feature exists on this movie's page); removed from suite.
  - TC_WEB_445 (MOV-049) — Fixed Book Now CTA persists on scroll (App/M-Site) — **Excluded**, confirmed absent on live build (App/M-Site-only per source sheet, out of scope for this desktop-browser Web spec); removed from suite.

## Scenarios

- **Suggested journey:** `src/tests/movie-details.spec.ts`
- **Sheet:** `_PVR INOX__ Test Cases - M4 _ Website (1).pdf` → Website test-case table

- [ ] **MOV-001** — Open Movie Detail from homepage | Row: 386 | Expected: page opens with Book Movie section by default | `@P0 @Smoke`
- [ ] **MOV-002** — Open Movie Detail from cinema listing | Row: 387 | Expected: page opens successfully | `@P0 @Regression`
- [ ] **MOV-003** — Open Movie Detail from experience page | Row: 388 | Expected: page opens with experience filter applied | `@P0 @Regression`
- [ ] **MOV-004** — Movie header shows correct metadata | Row: 394 | Expected: all movie metadata displayed correctly | `@P0 @Regression` (source QA status: **Fail** — automate to codify expected behavior)
- [ ] **MOV-005** — Trailer auto-plays after load | Row: 395 | Expected: latest trailer auto-plays | `@P1 @Regression` (source QA status: **Fail**)
- [ ] **MOV-006** — Watch Trailer CTA for multiple trailers | Rows: 396, 416 | Expected: trailer list shown; selected trailer auto-plays | `@P1 @Regression`
- [ ] **MOV-008** — Share Movie shares poster/text/deep-link | Row: 398 | Expected: shared successfully via native share | `@P1 @Regression` (source QA status: **Fail**)
- [ ] **MOV-009** — Date filter defaults to today | Rows: 399, 419 | Expected: current date selected by default | `@P0 @Regression`
- [ ] **MOV-010** — Cinema search by text | Rows: 400, 420 | Expected: matching cinemas displayed | `@P0 @Regression`
- [ ] **MOV-013** — Reset Filters clears all applied filters | Row: 403 | Expected: filters cleared, listing refreshed | `@P1 @Regression`
- [ ] **MOV-014** — Showtime color coding | Row: 404 | Expected: correct color per status (Available/Filling Fast/Sold Out/Lapsed) | `@P0 @Regression`
- [ ] **MOV-015** — Sold Out showtime handling | Row: 405 | Expected: flash message shown for houseful show | `@P0 @Regression`
- [ ] **MOV-016** — Booking flow redirection | Rows: 406, 434 | Expected: redirected to seat selection page | `@P0 @Smoke`
- [ ] **MOV-018** — Pickup Your Time CTA opens preference flow | Rows: 408, 438 | Expected: preference-submission form displayed | `@P0 @Regression`
- [ ] **MOV-019** — Submit Preference success | Row: 409 | Expected: preference submitted, confirmation shown | `@P0 @Regression`
- [ ] **MOV-020** — Submit Preference failure | Row: 410 | Expected: error message displayed | `@P0 @Regression`
- [ ] **MOV-021** — Submit Preference as guest redirects to login | Row: 411 | Expected: redirected to login, returns to preference flow after login | `@P0 @Regression`
- [ ] **MOV-022** — Movie Details tab shows synopsis/cast/crew/trailers/backdrops | Rows: 412, 442 | Expected: full content shown on tab switch | `@P1 @Regression`
- [ ] **MOV-023** — No Cinemas Found message under restrictive filters | Row: 413 | Expected: error message shown | `@P0 @Regression`
- [ ] **MOV-024** — Movie poster and key metadata display | Row: 414 | Expected: name, rating, genre, duration all correct | `@P0 @Regression`
- [ ] **MOV-025** — Poster shown when trailer unavailable | Row: 415 | Expected: only poster displayed, no trailer attempt | `@P1 @Regression`
- [ ] **MOV-026** — Selecting a trailer from the list plays it | Row: 417 | Expected: trailer plays in native player | `@P1 @Regression`
- [ ] **MOV-027** — Promotional banner displays when configured | Row: 418 | Expected: banner displayed correctly | `@P2 @Regression`
- [ ] **MOV-028** — Experience filter ordered by audi count/admin priority | Row: 421 | Expected: filter options correctly ordered | `@P0 @Regression`
- [ ] **MOV-029** — Experience filter auto-applied on redirection from Experience page | Row: 422 | Expected: filter pre-applied | `@P1 @Regression`
- [ ] **MOV-030** — Distance filter shows "Enable Location" CTA without location | Row: 423 | Expected: CTA displayed | `@P0 @Regression`
- [ ] **MOV-031** — Applied filters list shown | Row: 424 | Expected: all active filters listed | `@P1 @Regression`
- [ ] **MOV-032** — Cinema/showtime count message shown | Row: 425 | Expected: "X showtimes in Y cinemas" text shown | `@P1 @Regression`
- [ ] **MOV-033** — Cinema sorting — Favorite first | Row: 426 | Expected: favorite cinema on top | `@P0 @Regression`
- [ ] **MOV-034** — Cinema sorting — Recommended next | Row: 427 | Expected: recommended cinemas shown after favorites | `@P1 @Regression`
- [ ] **MOV-035** — Cinema sorting — Distance-based remainder | Row: 428 | Expected: remaining cinemas sorted ascending by distance | `@P0 @Regression`
- [ ] **MOV-036** — Default cinema card expansion | Row: 429 | Expected: first cinema card expanded on load | `@P1 @Regression`
- [ ] **MOV-037** — Only one cinema card expanded at a time | Row: 430 | Expected: expanding another collapses the first | `@P1 @Regression`
- [ ] **MOV-038** — Showtime card shows correct details | Row: 431 | Expected: time, format, language shown correctly | `@P0 @Regression`
- [ ] **MOV-039** — Lapsed showtime is not clickable | Row: 432 | Expected: slot disabled/non-interactive | `@P0 @Regression`
- [ ] **MOV-041** — Popup list follows admin-defined sequence | Row: 435 | Expected: popups shown in configured order | `@P0 @Regression`
- [ ] **MOV-042** — Adult movie popup for A-rated content | Row: 436 | Expected: adult warning popup shown | `@P0 @Regression`
- [ ] **MOV-043** — Experience-mismatch popup (IMAX cinema + non-IMAX show) | Row: 437 | Expected: format mismatch popup shown | `@P1 @Regression`
- [ ] **MOV-044** — Distance auto-expansion when no cinema in range | Row: 439 | Expected: distance range auto-expands | `@P1 @Regression`
- [ ] **MOV-045** — City-wide fallback prompt when max range exhausted | Row: 440 | Expected: city-wide option prompt shown | `@P0 @Regression`
- [ ] **MOV-046** — Also Playing section shows related movies | Row: 441 | Expected: up to 10 movies displayed | `@P2 @Regression`
- [ ] **MOV-047** — Cast & Crew profile navigation | Row: 443 | Expected: profile page opens on tap | `@P2 @Regression`

## E2E implementation notes

- **Layering:** `src/tests/movie-details.spec.ts` → `src/modules/MovieDetailsModule.ts` → `src/pages/MovieDetailsPage.ts`
- **Frontend context:** No `dev-repo/` supplied. Reuse `LocationHelper` for city/location bootstrap and promo-popup dismissal, consistent with the other modules seeded this session.
- **Locators:** Not yet grounded — needs a Playwright MCP or headless diagnostic pass for the Book Movie section's date selector, cinema-card expand/collapse, showtime grid, and popup sequence before writing `MovieDetailsPage.ts`.
- **Known-failing scenarios (MOV-004, 005, 008):** write these as real assertions against the *expected* behavior from the sheet, not soft/skipped checks — they exist to catch the moment the underlying bug is fixed (or to confirm it's still broken, which is itself useful regression signal). Do not weaken the assertions to make them pass artificially.
- **Auth-dependent scenarios:** MOV-019–021 (Submit Preference) need a logged-in and a guest session respectively — reuse the real-OTP login flow from `RegisterLoginModule` (see `login.spec.ts`), not the non-functional `mockOtpApis`.
- **Data-driven robustness:** movie/cinema/showtime data is live and rotates — assert on relative ordering and "first matching" elements, not hardcoded movie/cinema names, per the pattern already established this session.
- **Reuse:** consider factoring the cinema-sort (Favorite → Recommended → Distance) and showtime-color-coding assertions into shared helpers if `EventDetailsModule`'s "Book Event" section (which has near-identical logic per `event-details.md`) hasn't already done so — check before duplicating.
- **Tags:** `@P0`/`@Smoke` for the open-detail-page and booking-redirect paths; `@P1`/`@P2 @Regression` for filter/sort mechanics, popups, and cosmetic sections (Also Playing, Cast & Crew, backdrops).
- **Run:** `npx playwright test src/tests/movie-details.spec.ts --project=chromium`

## Source

- **Seed method:** PDF-exported test-case table (pasted directly; no separate Excel/CSV file)
- **File:** `_PVR INOX__ Test Cases - M4 _ Website (1).pdf` (pages 14–16)
- **Sheet:** N/A — single "Website" test execution table
- **Columns:** Test Summary=`Test case Title`, Test Objective=`Pre Conditions`, Test Steps=`Test Steps/validation point`, Expected Result=`Expected Result (ER)`, also carried: `Actual Result`, `Priority`, `QA Status`
- **Frontend repo:** not provided
