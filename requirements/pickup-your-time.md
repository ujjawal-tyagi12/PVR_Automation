# Playwright: Pickup Your Time — location-based showtime preference flow

## Acceptance criteria

- "Pickup your time" on the Movie Detail Page opens a bottom sheet for time/movie-version selection, gated by location permission (grant, re-prompt if turned off after granting, and — on mobile only — a "Don't ask again" redirect to app settings, out of scope for web).
- Users pick a time and a movie version (e.g. Hindi/Telugu); "Submit Preferences" stays disabled until both are selected. Submitting surfaces a "We found {X} showtime(s)" result with a ±30-minute (backend-configurable) time window, a default 5 km distance filter that auto-expands (and eventually disables) when no cinemas are found nearby, and a manual distance slider with correct boundary behavior.
- A showtime result redirects into the booking flow; "Still not satisfied with the showtime?" opens a cinema-listing fallback (with a correct "{X} cinema(s) found" / "no nearby cinemas" message) that supports multi-cinema selection, a login/signup gate for guests, and a success acknowledgment on submission with the preference saved server-side.
- Selected time/movie/cinema state persists across back-navigation and into the "Still not satisfied" fallback; the bottom sheet cannot be dismissed by drag (only via the close icon); date defaults to the next available date when the current date has no showtimes, including correctly handling a selection near midnight.

## Navigation

1. Launch web → dismiss location prompt → select city (Mumbai-All) → navigate to any Movie Detail Page → tap **"Pickup your time"** CTA (per source sheet precondition — exact Movie Detail Page route/CTA locator not yet grounded live; confirm during `/playwright-mcp`).
2. From the opened bottom sheet: grant/deny location permission as needed → select a time and movie version → **Submit Preferences** → review showtime results or fall through to **"Still not satisfied with the showtime?"** → cinema listing → select cinema(s) → **Submit Preference**.

## Test coverage

- **Scope:** Complete — all feasible rows for this module from the source sheet.
- **Sheet rows included:** 36 of 37 (TC_App_252–288; TC_App_251 is a blank row in the source sheet with no title/steps and is excluded as non-content).
- **Out of scope:**
  - TC_App_288 ("Don't ask again" location denial → redirect to app settings) — this is a native mobile OS permission-settings deep link with no web equivalent; not automatable in a Playwright web suite.
- **Adapted for web (kept in scope, behavior reinterpreted):**
  - TC_App_282 ("app goes to background") → adapted to tab visibility change (`page.evaluate` dispatching a `visibilitychange` event, or opening/backgrounding via a second tab) rather than OS-level app minimize.
  - TC_App_283 ("screen rotation") → adapted to a Playwright viewport resize (portrait↔landscape dimensions) rather than a physical device rotation.
  - TC_App_284 ("device font size increased") → adapted to browser-level font-size/zoom emulation or OS accessibility font scaling via CSS media features, whichever this repo's existing accessibility tests (if any) already standardize on — confirm pattern before writing.
- **Priority/tester columns:** the source sheet leaves Priority blank for this entire module (unlike the other four); priorities below are inferred from each scenario's role in the core flow (P0 for the primary happy path and gating logic, P1 for secondary behaviors, P2 for cosmetic/platform-adaptation checks) — flag with the QA owner (per other modules' "Sankalp"/"Rahul"/"Shakshi" testers, this module's rows carry no tester name either) if actual priorities differ.

## Scenarios

- **Suggested journey:** `src/tests/pickup-your-time.spec.ts`
- **Sheet:** `M6-website.pdf` (page 7) → single "Website" test-execution table, "Pickup your time" module section

- [ ] **PYT-001** — Verify user can open "Pickup your time" flow | Steps: (on Movie Detail Page) click "Pickup your time" CTA | Expected: bottom sheet/screen opens with time & movie selection options | `@P0 @Regression`
- [ ] **PYT-002** — Verify location permission prompt when not granted | Steps: (location NOT granted) click CTA | Expected: system prompts to grant location permission, cannot proceed without granting | `@P0 @Regression`
- [ ] **PYT-003** — Verify flow when location permission is granted | Steps: (granted) click CTA | Expected: directly navigated to preference selection screen | `@P0 @Regression`
- [ ] **PYT-004** — Verify re-prompt when location turned OFF after granting | Steps: (granted, then turned off) click CTA again | Expected: system re-prompts for enabling location | `@P1 @Regression`
- [ ] **PYT-005** — Verify user can select time | Steps: (preference screen open) select a time | Expected: selected time highlighted, user can proceed | `@P0 @Regression`
- [ ] **PYT-006** — Verify movie versions displayed and selectable | Steps: view versions list → select one (e.g. Hindi, Telugu) | Expected: versions displayed correctly, selection captured | `@P0 @Regression`
- [ ] **PYT-007** — Verify "Submit Preferences" CTA state | Steps: don't select time → check CTA; select time → check CTA | Expected: disabled when time not selected, enabled after required fields chosen | `@P0 @Regression`
- [ ] **PYT-008** — Verify system shows showtimes when available | Steps: (valid time & movie selected) click Submit Preferences | Expected: "We found {X} showtime(s)…" message with cinema/showtime list | `@P0 @Regression`
- [ ] **PYT-009** — Verify correct showtime count displayed | Steps: observe count in message | Expected: count matches backend data (±30 min logic, date, distance) | `@P1 @Regression`
- [ ] **PYT-010** — Verify default distance filter value | Steps: open showtime result screen | Expected: default distance set to 5 km | `@P1 @Regression`
- [ ] **PYT-011** — Verify auto-expansion of distance when no results | Steps: (no cinemas within 5 km) submit preferences | Expected: system auto-increases distance range, results shown within expanded range | `@P1 @Regression`
- [ ] **PYT-012** — Verify fallback when no showtimes found in max range | Steps: submit preferences | Expected: distance filter disabled, all cinemas in city shown | `@P1 @Regression`
- [ ] **PYT-013** — Verify navigation to booking flow on showtime click | Steps: click on any showtime | Expected: redirected to booking flow, required popups (terms, etc.) appear | `@P0 @Regression`
- [ ] **PYT-014** — Verify "Still not satisfied with the showtime?" CTA | Steps: click CTA | Expected: cinema listing screen opens | `@P0 @Regression`
- [ ] **PYT-015** — Verify cinema listing when no showtime available | Steps: (no showtimes found) submit preferences | Expected: cinema list displayed based on distance | `@P1 @Regression`
- [ ] **PYT-016** — Verify cinema count message | Steps: observe message | Expected: "{X} cinema(s) found" displayed correctly | `@P1 @Regression`
- [ ] **PYT-017** — Verify message when no nearby cinemas | Steps: (no cinemas within max range) submit preferences | Expected: "No nearby cinemas found…" message displayed | `@P1 @Regression`
- [ ] **PYT-018** — Verify user can select multiple cinemas | Steps: select multiple cinemas | Expected: multiple selections allowed | `@P1 @Regression`
- [ ] **PYT-019** — Verify login prompt for guest user | Steps: (not logged in) select cinemas → click Submit Preference | Expected: login/signup prompt displayed | `@P0 @Regression`
- [ ] **PYT-020** — Verify preference submission success | Steps: (logged in, cinemas selected) click Submit Preference | Expected: success acknowledgment shown, preference saved in backend | `@P0 @Regression`
- [ ] **PYT-021** — Verify bottom sheet cannot be closed via drag | Steps: (bottom sheet open) try to drag down | Expected: screen does NOT close, only closes via cross icon | `@P1 @Regression`
- [ ] **PYT-022** — Verify showtime filtering logic | Steps: (showtimes exist around selected time) select time (e.g. 10:00 PM) | Expected: showtimes between 9:30 PM – 10:30 PM displayed | `@P0 @Regression`
- [ ] **PYT-023** — Verify default date selection | Steps: open result screen | Expected: current or next available date selected by default | `@P1 @Regression`
- [ ] **PYT-024** — Verify next available date selected when current date has no showtimes | Steps: (no showtime for current date) select time → submit | Expected: system auto-selects next available date, showtimes shown for it | `@P1 @Regression`
- [ ] **PYT-025** — Verify showtime logic across midnight | Steps: (showtimes around midnight) select time (e.g. 11:45 PM) → submit | Expected: showtimes from next day (±30 min) considered, correct results | `@P1 @Regression`
- [ ] **PYT-026** — Verify ± time range reflects backend config | Steps: (backend config changed, e.g. ±45 min) select time → submit | Expected: results follow updated config, not hardcoded to ±30 min | `@P2 @Regression`
- [ ] **PYT-027** — Verify user can manually change distance filter | Steps: move distance slider | Expected: cinema/showtime list updates accordingly | `@P1 @Regression`
- [ ] **PYT-028** — Verify distance slider boundaries | Steps: set distance to minimum, then maximum | Expected: results update correctly, no crash or incorrect data | `@P2 @Regression`
- [ ] **PYT-029** — Verify selected data persists on back navigation | Steps: navigate back → reopen flow | Expected: previously selected time/movie values retained | `@P1 @Regression`
- [ ] **PYT-030** — Verify filters persist in "Still not satisfied" flow | Steps: click "Still not satisfied" | Expected: previous selections (time, movie) retained | `@P1 @Regression`
- [ ] **PYT-031** — Verify state when app is backgrounded (web: tab visibility change) | Steps: trigger `visibilitychange` (background) → restore | Expected: screen state preserved, no reset/crash | `@P2 @Regression`
- [ ] **PYT-032** — Verify UI on viewport rotation (web: portrait↔landscape resize) | Steps: resize viewport | Expected: UI adjusts correctly, no data loss | `@P2 @Regression`
- [ ] **PYT-033** — Verify UI with large font size | Steps: increase font-size/zoom emulation → open flow | Expected: text readable, UI not broken | `@P2 @Regression`
- [ ] **PYT-034** — Verify UI in dark mode | Steps: (dark color-scheme emulation) open flow | Expected: UI elements visible, no contrast issues | `@P2 @Regression`
- [ ] **PYT-035** — Verify stability on rapid open/close | Steps: open and close flow quickly, multiple times | Expected: no crash or UI glitch | `@P1 @Regression`
- [ ] **PYT-036** — Verify validation when movie version not selected | Steps: don't select movie version → click CTA | Expected: validation message shown OR a default selection is applied | `@P1 @Regression`

## E2E implementation notes

- **Layering:** `src/tests/pickup-your-time.spec.ts` → `src/modules/PickupYourTimeModule.ts` → `src/pages/PickupYourTimePage.ts`.
- **Frontend context:** No `dev-repo/` provided. Not yet grounded live — the "Pickup your time" CTA's exact Movie Detail Page location was not reached during this pass (exploration focused on Offers/Curated Shows/Coming Soon navigation); run a full `/playwright-mcp` grounding pass against UAT (`inox-uat-web.pvrinox.com`) before implementing, starting from a real movie's detail page.
- **Reuse:** Login/OTP gating (PYT-019) should reuse `RegisterLoginModule` — see [[otp-flow-automation-solved]] (UAT accepts any 6-digit OTP, `'123456'`). Location-permission handling (PYT-002/003/004) should reuse whatever permission-mocking helper other specs use, or introduce one via `context.grantPermissions()/clearPermissions()` for `geolocation`.
- **Locators:** None grounded yet for this module — full pass needed.
- **Fixtures / mocks:** PYT-008/009/011/012/022/024/025/026 (showtime search results, distance auto-expansion, ±time-window config) will need either real UAT showtime data for a known movie/cinema or API mocking, since UAT's cinema/showtime data is otherwise mostly dummy (see [[production-uat-functional-gaps]]) — confirm with the backend/QA team which movie has real bookable showtimes on UAT before grounding these. PYT-031 (background/reopen) and PYT-033 (font size)/PYT-034 (dark mode) are web-adapted per the Out of scope note above — verify against this repo's `general-no-wait-for-timeout` and existing accessibility-test conventions (if any) before implementing.
- **Tags:** `@Regression` throughout (Complete coverage); `@P0` for the primary open→select→submit→book path and login/validation gating, `@P1` for secondary result/filter/persistence behavior, `@P2` for platform-adaptation and cosmetic checks — priorities inferred, see coverage note above (source sheet left this module's Priority column blank).
- **Run:** `npx playwright test src/tests/pickup-your-time.spec.ts --project=chromium`

## Source

- **Seed method:** PDF-exported test-case table (pasted directly; no separate Excel/CSV file — Google Sheets link provided required login and could not be fetched headlessly)
- **File:** `M6-website.pdf` (page 7)
- **Sheet:** N/A — single "Website" test-execution table, "Pickup your time" module section
- **Columns:** Test Summary=`Test case Title`, Test Objective=`Pre Conditions`, Test Steps=`Test Steps/validation point`, Expected Result=`Expected Result (ER)` (Priority/QA Status/Tester columns blank for this module in the source)
- **Frontend repo:** not provided — not yet grounded against live UAT for this specific module (see implementation notes)
