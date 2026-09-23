# Playwright: Cinemas Listing & Detail — list/map views, filters, sorting & booking entry

## Acceptance criteria

- Cinemas listing is reachable from navigation, gated on location permission/city selection; list view shows name/address/distance/directions/accessibility/favorite/sort options, map view shows the user's location and cinema markers.
- Cinemas sort as Favorite → Recommended (most-visited, logged-in) → Nearest, with same-distance ties broken randomly; marking a cinema favorite moves it to the top immediately.
- Map view supports filtering by distance, showtime, genre, language, format/experience, accessibility, and price, with dynamic marker/list refresh and a "no cinemas found" fallback message + recenter/zoom controls.
- Cinema Detail page shows banner, favorite icon, name, address, distance, show count, amenities, and a "Book a Movie" section with date/search/experience/other filters, expandable movie cards (only one open at a time, top card expanded by default), and color-coded showtimes.
- Search (text + voice, partial/case-insensitive, mic-permission-gated) works both in the cinema listing context and within the Cinema Detail page's movie search.
- The merged web Cinema Page layout supports collapsing/expanding the listing panel with a floating "View Other Cinemas" CTA, and a city-change nudge (Yes/No) when the detected city differs from the saved one.

## Navigation

1. Open the app/website → select "Cinemas" from bottom navigation (App/M-site) or header/nav bar (Web) → land on the cinema listing page.
2. Toggle between List View and Map View; apply filters in Map View; tap a cinema to reach its Detail Page.
3. On the Cinema Detail Page, use the "Book a Movie" section's date selector, search, and filters to reach showtimes.

## Test coverage

- **Scope:** Complete — all feasible rows for this module from the source sheet.
- **Sheet rows included:** 82 raw rows (TC_WEB_304–385), consolidated into **75 scenarios** (3 literal duplicate pairs merged — see below).
- **Merged duplicates:** TC_WEB_322 & 376 (same "no cinemas found in distance range" scenario, tested twice); TC_WEB_335 & 373 (same "only one movie expanded at a time" scenario, tested twice); TC_WEB_371 folds into 359 (date-selector default) + 361 (current/future-only showtimes), which it re-tests together.
- **Out of scope:**
  - TC_WEB_309 — cinemas sorted by most-visited (logged-in) — **Deferred**.
  - TC_WEB_338 — showtime click redirects to booking flow — **Deferred**.
  - TC_WEB_355 — most-visited personalization based on ticket bookings — **Deferred**.
  - TC_WEB_365 — "recommended" tag on personalized cards — **Deferred**.
  - TC_WEB_327/369 (CIN-023/062) — voice search for a movie, voice search blocked without mic permission — **Excluded**, mic-permission-dependent; removed from suite.
  - TC_WEB_313 (CIN-009) — Now Showing section expand/collapse on listing page — **Excluded**, confirmed absent on live build; removed from suite.
  - TC_WEB_315 (CIN-011) — Map filter: distance — **Excluded**, confirmed absent on live build; removed from suite.
  - TC_WEB_326 (CIN-022) — search for a movie by text on Cinema Detail — **Excluded**, confirmed absent on live build; removed from suite.
  - TC_WEB_341/342 (CIN-036/037) — collapse/expand Cinema Listing panel, floating CTA when collapsed — **Excluded**, confirmed absent on live build; removed from suite.
  - TC_WEB_366 (CIN-059) — showtime formats categorized correctly — **Excluded**, confirmed absent on live build; removed from suite.
  - TC_WEB_368/370/385 (CIN-061/063/075) — search matches by entity name, partial/case-insensitive matches, no-match message — **Excluded**, confirmed absent on live build (no search textbox exists on this cinema-first view); removed from suite.

## Scenarios

- **Suggested journey:** `src/tests/cinemas-listing-detail.spec.ts`
- **Sheet:** `_PVR INOX__ Test Cases - M4 _ Website (1).pdf` → Website test-case table

- [ ] **CIN-001** — Navigate to cinema listing page | Row: 304 | Steps: select Cinemas from nav | Expected: user lands on cinema listing page | `@P0 @Smoke`
- [ ] **CIN-002** — Location/city gate before displaying cinemas | Row: 305 | Steps: attempt view without location/city | Expected: prompted to enable location or select city | `@P0 @Regression`
- [ ] **CIN-003** — List view shows required details and sort options | Row: 306 | Expected: name, address, distance, directions, accessibility, favorite icon, sort options shown | `@P1 @Regression`
- [ ] **CIN-004** — Map view shows user location and cinema markers | Row: 307 | Expected: user's location + cinema markers displayed | `@P0 @Regression`
- [ ] **CIN-005** — Favorite cinemas sorted to top (logged-in) | Row: 308 | Expected: favorites displayed at top of list | `@P1 @Regression`
- [ ] **CIN-006** — Nearest-first sorting for logged-in and guest users | Row: 310 | Expected: cinemas sorted by nearest distance regardless of login state | `@P0 @Regression`
- [ ] **CIN-007** — Tapping a cinema navigates to Cinema Detail | Row: 311 | Expected: redirected to Cinema Detail Page | `@P0 @Smoke`
- [ ] **CIN-008** — Marking a cinema favorite reflects in sorting | Row: 312 | Expected: cinema marked favorite, moves to top of list | `@P0 @Regression`
- [ ] **CIN-010** — Now Showing carousel truncates long names | Row: 314 | Expected: names truncated appropriately in carousel | `@P0 @Regression`
- [ ] **CIN-012** — Map filter: showtime | Row: 316 | Expected: cinemas filtered by selected showtime | `@P0 @Regression`
- [ ] **CIN-013** — Map filter: genre | Row: 317 | Expected: cinemas filtered by selected genre | `@P0 @Regression`
- [ ] **CIN-014** — Map filter: language | Row: 318 | Expected: cinemas filtered by selected language | `@P0 @Regression`
- [ ] **CIN-015** — Map filter: format and experience | Row: 319 | Expected: cinemas filtered by selected format/experience | `@P0 @Regression`
- [ ] **CIN-016** — Map filter: accessibility | Row: 320 | Expected: cinemas filtered by accessibility options | `@P0 @Regression`
- [ ] **CIN-017** — Map filter: price range | Row: 321 | Expected: cinemas filtered by price range | `@P0 @Regression`
- [ ] **CIN-018** — No-cinemas-found message on distance filter | Rows: 322, 376 | Expected: "We couldn't find any cinemas near your location…" message shown | `@P1 @Regression`
- [ ] **CIN-019** — Map recenter and zoom controls | Row: 323 | Expected: map recenters to current location, zoom in/out works | `@P1 @Regression`
- [ ] **CIN-020** — Cinema Detail Page displays all required info | Row: 324 | Expected: banner, favorite icon, name, address, distance, show count, amenities, Book a Movie section all shown | `@P0 @Smoke`
- [ ] **CIN-021** — Book a Movie section displays with all filters | Row: 325 | Expected: date filter, search, experience filter, other filters, movie/event list shown | `@P1 @Regression`
- [ ] **CIN-024** — Filter movies by experience | Row: 328 | Expected: movies filtered by selected experience | `@P0 @Regression`
- [ ] **CIN-025** — Filter movies by accessibility | Row: 329 | Expected: movies filtered by accessibility options | `@P0 @Regression`
- [ ] **CIN-026** — Filter movies by genre | Row: 330 | Expected: movies filtered by genre | `@P1 @Regression`
- [ ] **CIN-027** — Filter movies by language | Row: 331 | Expected: movies filtered by language | `@P0 @Regression`
- [ ] **CIN-028** — Filter movies by price range | Row: 332 | Expected: movies filtered by price range | `@P1 @Regression`
- [ ] **CIN-029** — Filter movies by showtime | Row: 333 | Expected: movies filtered by showtime | `@P0 @Regression`
- [ ] **CIN-030** — No-movies-found message under filters | Row: 334 | Expected: "No movies found under the selected filter." shown | `@P0 @Regression`
- [ ] **CIN-031** — Only one movie card expanded at a time | Rows: 335, 373 | Expected: expanding a second card collapses the first | `@P0 @Regression`
- [ ] **CIN-032** — Showtimes display correctly | Row: 336 | Expected: start time, language, format, experience, accessibility icons, color-coded status all shown | `@P0 @Regression`
- [ ] **CIN-033** — Seat-category price shown on hover/long-press | Row: 337 | Expected: price for seat categories displayed | `@P0 @Regression`
- [ ] **CIN-034** — "Directions" opens external map service | Row: 339 | Expected: Google/Apple Maps opens with cinema coordinates | `@P0 @Regression`
- [ ] **CIN-035** — Merged Cinema Page displays correctly (Web) | Row: 340 | Expected: left listing panel + right detail panel rendered | `@P0 @Regression`
- [ ] **CIN-038** — Map View access blocked without location permission | Row: 343 | Expected: popup prompts enabling location permission | `@P1 @Regression`
- [ ] **CIN-039** — Enabling location permission unlocks Map View | Row: 344 | Expected: user can access Map View after granting permission | `@P0 @Regression`
- [ ] **CIN-040** — City-change nudge appears on detected-vs-saved city mismatch | Row: 345 | Expected: nudge with Yes/No options appears | `@P1 @Regression`
- [ ] **CIN-041** — Selecting "Yes" in city-change nudge saves new city | Row: 346 | Expected: new city saved, content updates | `@P0 @Regression`
- [ ] **CIN-042** — Selecting "No" in city-change nudge retains previous city | Row: 347 | Expected: previous city retained, redirected to list view | `@P0 @Regression`
- [ ] **CIN-043** — Same-distance cinemas sorted randomly | Row: 348 | Expected: random order among tied-distance cinemas | `@P1 @Regression`
- [ ] **CIN-044** — Multiple favorite cinemas sorted by distance | Row: 349 | Expected: favorites sub-sorted by distance | `@P0 @Regression`
- [ ] **CIN-045** — Same-showtime-count movies/events sorted randomly | Row: 350 | Expected: random order among ties | `@P0 @Regression`
- [ ] **CIN-046** — Cinemas with "Adfree Shows" labeled correctly | Row: 351 | Expected: label shown for qualifying cinemas | `@P0 @Regression`
- [ ] **CIN-047** — Now Showing sequenced by show count | Row: 352 | Expected: sorted by number of shows available | `@P0 @Regression`
- [ ] **CIN-048** — Long movie names truncated in listing | Row: 353 | Expected: names truncated appropriately | `@P1 @Regression`
- [ ] **CIN-049** — Favorite status reflects immediately in sorting | Row: 354 | Expected: sort order updates immediately after marking favorite | `@P0 @Regression`
- [ ] **CIN-050** — Map shows nearest cinemas by default | Row: 356 | Expected: nearest cinemas shown by default on map load | `@P0 @Regression`
- [ ] **CIN-051** — Filters refresh both map markers and list dynamically | Row: 357 | Expected: markers and list update together on filter change | `@P0 @Regression`
- [ ] **CIN-052** — Amenities displayed with icons/labels | Row: 358 | Expected: amenities section shows icons or labels | `@P1 @Regression`
- [ ] **CIN-053** — Date selector defaults to today and is highlighted | Rows: 359, 371 | Expected: today's date selected and visually highlighted | `@P0 @Regression`
- [ ] **CIN-054** — Experience filter displays above the movie listing | Row: 360 | Expected: experience filter positioned above listing | `@P0 @Regression`
- [ ] **CIN-055** — Only current/future showtimes shown | Rows: 361, 371 | Expected: past showtimes excluded | `@P0 @Regression`
- [ ] **CIN-056** — Expandable movie cards reveal available slots | Row: 362 | Expected: expanding a card reveals its slots | `@P0 @Regression`
- [ ] **CIN-057** — Top movie card expanded by default | Row: 363 | Expected: first/top card pre-expanded on load | `@P1 @Regression`
- [ ] **CIN-058** — Movies/events sorted by available showtime count | Row: 364 | Expected: sorted by showtime count descending | `@P0 @Regression`
- [ ] **CIN-060** — Popups display in expanded view by default | Row: 367 | Expected: popup content shown expanded | `@P0 @Regression`
- [ ] **CIN-064** — Showtimes displayed in ascending order | Row: 372 | Expected: chronological ascending order | `@P0 @Regression`
- [ ] **CIN-065** — Filters and options listed alphabetically | Row: 374 | Expected: alphabetical ordering across all filters | `@P0 @Regression`
- [ ] **CIN-066** — Distance filter range is 0–25km (CMS-managed) | Row: 375 | Expected: range spans 0 to 25km | `@P1 @Regression`
- [ ] **CIN-067** — Showtime filter range 12:00AM–11:59PM, 10-min interval | Row: 377 | Expected: full-day range with 10-minute steps | `@P0 @Regression`
- [ ] **CIN-068** — Language filter options based on fetched movies | Row: 378 | Expected: options reflect actually-fetched movie data | `@P1 @Regression`
- [ ] **CIN-069** — Genre filter options based on fetched movies | Row: 379 | Expected: options reflect fetched movie data | `@P0 @Regression`
- [ ] **CIN-070** — Cinema experience filter options based on priority logic | Row: 380 | Expected: options ordered per priority logic | `@P0 @Regression`
- [ ] **CIN-071** — Accessibility filter options based on fetched data | Row: 381 | Expected: options reflect fetched data | `@P0 @Regression`
- [ ] **CIN-072** — Price filter range is dynamic and selectable | Row: 382 | Expected: range reflects real data, selection works | `@P0 @Regression`
- [ ] **CIN-073** — Message shown when map filters return zero results | Row: 383 | Expected: "Sorry, no movies found under the selected filter." shown | `@P1 @Regression`
- [ ] **CIN-074** — Accessibility icons show correct message on hover/tap | Row: 384 | Expected: correct message displayed per icon | `@P0 @Regression`

## E2E implementation notes

- **Layering:** `src/tests/cinemas-listing-detail.spec.ts` → `src/modules/CinemasListingDetailModule.ts` → `src/pages/CinemasListingDetailPage.ts`
- **Frontend context:** No `dev-repo/` supplied. Reuse `LocationHelper` (`grantMumbaiGeolocation`, `dismissLocationAndSelectCity`, `dismissPromoPopup`, `clickThroughOverlays`) for the same city/location bootstrap and promo-popup interference already grounded for other pages this session.
- **Locators:** Not yet grounded — map view, filter chips, cinema/movie cards, and the merged web layout's collapse/expand controls all need a Playwright MCP or headless diagnostic pass before writing `CinemasListingDetailPage.ts`. Map-based scenarios (CIN-004, 011–017, 019, 038–039, 050–051, 066–067, 073) may need Playwright's geolocation mock + a real cinema-bearing city (Mumbai, per this session's UAT findings) to have non-empty results.
- **Data-driven robustness:** cinema/movie names, favorite state, and showtime data are live and can change between runs — assert on "first/any" matches and relative ordering rather than hardcoded cinema/movie names, per the pattern already used for Global Search/Event Listing/Experience.
- **State setup:** favorite-sorting scenarios (CIN-005, 008, 044, 049) and personalization-adjacent ones need a logged-in session — reuse the real-OTP login flow established in `login.spec.ts` (`RegisterLoginModule`), not the retired `mockOtpApis` (confirmed non-functional on UAT — see `login.spec.ts` header note).
- **Tags:** `@P0`/`@Smoke` for primary navigation and detail-page-load paths; `@P1`/`@P2 @Regression` for filter/sort mechanics and cosmetic edge cases.
- **Run:** `npx playwright test src/tests/cinemas-listing-detail.spec.ts --project=chromium`

## Source

- **Seed method:** PDF-exported test-case table (pasted directly; no separate Excel/CSV file)
- **File:** `_PVR INOX__ Test Cases - M4 _ Website (1).pdf` (pages 11–14)
- **Sheet:** N/A — single "Website" test execution table
- **Columns:** Test Summary=`Test case Title`, Test Objective=`Pre Conditions`, Test Steps=`Test Steps/validation point`, Expected Result=`Expected Result (ER)`, also carried: `Actual Result`, `Priority`, `QA Status`
- **Frontend repo:** not provided
