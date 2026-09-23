# Playwright: Location — automatic city detection, permission handling & manual fallback

## Acceptance criteria

- App/website attempts automatic location detection on launch; on success the city is identified and location-based content is displayed.
- If auto-detection fails, a network/API error occurs, or location services are inactive, the system prompts for manual city selection.
- The app shows an "Enable Location" screen (Enable Location/Use current location, Select Location Manually); web/M-site shows a permission banner (Allow while visiting the site, Allow this time, Never allow).
- Allowing access (persistent or "this time only") detects the city and shows location-based content; denying, dismissing, or "Never allow" triggers manual city selection.
- When the detected city differs from the saved city, a city-change nudge asks the user to confirm — "Yes" updates the saved city, "No" retains it; nudge frequency/logic follows defined rules and does not block other nudges from appearing.
- Guest users' selected/detected city is stored locally for the session; logged-in users' first detected/selected city is saved to their profile, updated only when a city-change nudge is confirmed.
- A non-serviceable detected city falls back to a nearby serviceable city; a detected sub-city within Delhi NCR/Mumbai defaults to the parent city ("Delhi NCR"/"Mumbai All").
- Manual city entry accepts valid names — including mixed case, leading/trailing spaces, Unicode/accented/foreign characters, hyphens, apostrophes, and duplicates — with normalization, and rejects invalid/empty/numeric/oversized/emoji/mixed-type input with an appropriate error.
- Manual city entry sanitizes and rejects SQL injection, XSS, HTML/JS/CSS/JSON/XML/YAML payloads, SQL queries, command injection, path traversal, and buffer-overflow attempts without executing them.
- Resetting location permission (browser or device settings) re-triggers the permission prompt; a guest session expiring clears local city data and re-prompts for city selection.

## Navigation

1. Launch the app or access the website/M-site.
2. Location permission is requested — native OS popup on app (Enable Location: Allow while using the app / Allow this time / Don't allow / Settings / Cancel), permission banner on web/M-site (Allow while visiting the site / Allow this time / Never allow).
3. On allow, the system detects the city automatically and shows location-based content; if the detected city differs from a previously saved one, a city-change nudge appears (Yes/No).
4. On deny, dismiss, failure, or "Never allow", the system falls back to manual city selection — user taps "Select Location Manually" and chooses/types a city.

## Test coverage

- **Scope:** Complete — all 72 feasible rows covering auto-detection, permission grant/deny flows, the city-change nudge, guest/logged-in storage, and manual entry (including validation and security-injection fuzzing).
- **Sheet rows included:** 72 of 72 (TC_WEB_030–TC_WEB_101)
- **Out of scope:** None — all rows are automatable UI/behavior/security assertions.

## Scenarios

- **Suggested journey:** `src/tests/location.spec.ts`
- **Sheet:** `location-test-cases.csv` (converted from *_PVR INOX __ Test Cases - M3 _ Website.pdf*) → single sheet

### Auto-detection & permission grant/deny

- [ ] **LOC-001** — App/website launches and attempts to detect location automatically | Steps: launch app/site with network + location active | Expected: system attempts auto-detection | `@P0 @Smoke` (TC_WEB_030)
- [ ] **LOC-002** — System successfully identifies a valid city automatically | Steps: launch with network + location active | Expected: valid city identified, location-based content shown | `@P0 @Smoke` (TC_WEB_031)
- [ ] **LOC-003** — System prompts for manual selection if auto-detection fails | Steps: disable location services, launch | Expected: error shown, manual selection prompted | `@P1 @Regression` (TC_WEB_032)
- [ ] **LOC-004** — Location permission options displayed on the app | Steps: launch app | Expected: "Enable Location" screen with Enable Location/Use current location + Select Location Manually | `@P1 @Regression` (TC_WEB_033)
- [ ] **LOC-005** — Location permission options displayed on web/M-site | Steps: access site | Expected: permission banner with Allow while visiting the site / Allow this time / Never allow | `@P1 @Regression` (TC_WEB_034)
- [ ] **LOC-006** — User allows location access on the app | Steps: Enable Location → "Allow while using the app" (native popup) | Expected: city detected, location-based content shown | `@P0 @Smoke` (TC_WEB_035)
- [ ] **LOC-007** — User allows location access on web/M-site | Steps: select "Allow while visiting the site" | Expected: city detected, location-based content shown | `@P1 @Regression` (TC_WEB_036)
- [ ] **LOC-008** — User allows location access for current session (app) | Steps: "Allow this time" (native popup) | Expected: city detected for session | `@P1 @Regression` (TC_WEB_037)
- [ ] **LOC-009** — User allows location access for current session (web/M-site) | Steps: "Allow this time" (banner) | Expected: city detected for session | `@P1 @Regression` (TC_WEB_038)
- [ ] **LOC-010** — User denies location access on the app | Steps: "Don't allow" (native popup) | Expected: manual city selection triggered | `@P0 @Smoke` (TC_WEB_039)
- [ ] **LOC-011** — User denies location access on web/M-site | Steps: "Never allow" (banner) | Expected: manual city selection triggered | `@P1 @Regression` (TC_WEB_040)
- [ ] **LOC-013** — User dismisses the location permission prompt | Steps: dismiss without selecting an option | Expected: manual city selection triggered | `@P1 @Regression` (TC_WEB_042)
- [ ] **LOC-014** — Location detection failure due to network/API error | Steps: simulate network/API error during detection | Expected: error shown, manual selection prompted | `@P1 @Regression` (TC_WEB_043)
- [ ] **LOC-032** — Location services inactive | Steps: launch with location services off | Expected: prompt to enable services or select manually | `@P1 @Regression` (TC_WEB_061)
- [ ] **LOC-033** — No network connectivity | Steps: launch with network unavailable | Expected: error shown, manual selection prompted | `@P1 @Regression` (TC_WEB_062)
- [ ] **LOC-034** — Partial network connectivity | Steps: launch with partial connectivity | Expected: detection attempted, may fall back to manual selection | `@P1 @Regression` (TC_WEB_063)

### City-change nudge

- [ ] **LOC-012** — System detects a city change and prompts for confirmation | Steps: simulate change in detected city | Expected: city-change nudge shown | `@P1 @Regression` (TC_WEB_041)
- [ ] **LOC-019** — Nudge displayed when detected city differs from saved city | Steps: simulate city change | Expected: nudge asks to confirm updating saved city | `@P0 @Smoke` (TC_WEB_048)
- [ ] **LOC-022** — User confirms a city change | Steps: select "Yes" on nudge | Expected: detected city becomes new saved city | `@P0 @Smoke` (TC_WEB_051)
- [ ] **LOC-023** — User declines a city change | Steps: select "No" on nudge | Expected: previously saved city retained | `@P1 @Regression` (TC_WEB_052)
- [ ] **LOC-031** — Frequency and logic of the city-change nudge | Steps: simulate multiple city changes | Expected: nudge shown per defined frequency/logic (not on every change) | `@P1 @Regression` (TC_WEB_060)

### Manual selection, Settings/Cancel & storage persistence

- [ ] **LOC-015** — Detection of a non-serviceable city | Steps: simulate non-serviceable city detected | Expected: user's city updated to nearby serviceable city | `@P1 @Regression` (TC_WEB_044)
- [ ] **LOC-016** — Detection of sub-cities within Delhi NCR/Mumbai All | Steps: simulate sub-city detection | Expected: defaults to Delhi NCR/Mumbai All, content updates accordingly | `@P1 @Regression` (TC_WEB_045)
- [ ] **LOC-017** — Data storage behavior for guest users | Steps: select/detect city as guest, then change it | Expected: city stored locally for session; local record updates on change | `@P1 @Regression` (TC_WEB_046)
- [ ] **LOC-018** — Data storage behavior for logged-in users | Steps: log in, select/detect city, then change it | Expected: first city saved to profile; profile updates only on nudge confirmation | `@P1 @Regression` (TC_WEB_047)
- [ ] **LOC-020** — Location service failure | Steps: simulate location service failure | Expected: error shown, manual selection prompted | `@P1 @Regression` (TC_WEB_049)
- [ ] **LOC-021** — Manual city selection process | Steps: "Select Location Manually" → choose a city | Expected: selected city displayed, content updated | `@P0 @Smoke` (TC_WEB_050)
- [ ] **LOC-024** — User selects "Settings" to enable location services | Steps: Enable Location → "Settings" (popup) | Expected: redirected to device settings page | `@P1 @Regression` (TC_WEB_053)
- [ ] **LOC-025** — User selects "Cancel" on the location services popup | Steps: Enable Location → "Cancel" | Expected: returned to "Enable Location" screen | `@P1 @Regression` (TC_WEB_054)
- [ ] **LOC-026** — Guest user's session expires | Steps: select/detect city as guest, wait for session expiry | Expected: local data cleared, city selection/location access re-prompted | `@P1 @Regression` (TC_WEB_055)
- [ ] **LOC-027** — Location permission reset manually on web/M-site | Steps: reset location permission in browser settings | Expected: permission banner reappears | `@P1 @Regression` (TC_WEB_056)
- [ ] **LOC-028** — Location permission reset manually on the app | Steps: reset location permission in device settings | Expected: "Enable Location" screen reappears | `@P1 @Regression` (TC_WEB_057)
- [ ] **LOC-029** — Selected city persists for the session (guest) | Steps: select city manually as guest, navigate | Expected: city persists for session, drives location-based content | `@P1 @Regression` (TC_WEB_058)
- [ ] **LOC-030** — Selected city persists in profile (logged-in) | Steps: log in, select city manually, navigate | Expected: city saved to profile, drives location-based content | `@P1 @Regression` (TC_WEB_059)

### Manual city input validation

- [ ] **LOC-035** — Invalid city name entered | Steps: "Select Location Manually" → invalid name | Expected: error — city not recognized, prompts for valid city | `@P1 @Regression` (TC_WEB_064)
- [ ] **LOC-036** — City name with special characters | Steps: enter special-character name | Expected: error — city not recognized | `@P1 @Regression` (TC_WEB_065)
- [ ] **LOC-037** — Numeric city name | Steps: enter numeric name | Expected: error — city not recognized | `@P1 @Regression` (TC_WEB_066)
- [ ] **LOC-038** — Empty city input field | Steps: leave field empty, submit | Expected: error — field cannot be empty | `@P1 @Regression` (TC_WEB_067)
- [ ] **LOC-039** — City name at boundary of valid input length | Steps: enter name at max valid length | Expected: accepted, location-based content shown | `@P1 @Regression` (TC_WEB_068)
- [ ] **LOC-040** — City name exceeding maximum input length | Steps: enter oversized name | Expected: error — exceeds maximum length | `@P1 @Regression` (TC_WEB_069)
- [ ] **LOC-041** — City name with mixed case letters | Steps: enter "dElHi"-style input | Expected: normalized, accepted | `@P2 @Regression` (TC_WEB_070)
- [ ] **LOC-042** — City name with leading/trailing spaces | Steps: enter " Delhi " | Expected: trimmed, accepted | `@P2 @Regression` (TC_WEB_071)
- [ ] **LOC-043** — Duplicate city name entered | Steps: enter a duplicate name | Expected: accepted, content shown | `@P1 @Regression` (TC_WEB_072)
- [ ] **LOC-044** — Valid city name entered | Steps: enter a valid name | Expected: accepted, content shown | `@P1 @Regression` (TC_WEB_073)
- [ ] **LOC-045** — City name with invalid characters | Steps: enter invalid-character name | Expected: error — city not recognized | `@P1 @Regression` (TC_WEB_074)
- [ ] **LOC-046** — Non-existent city name | Steps: enter a non-existent name | Expected: error — city not recognized | `@P1 @Regression` (TC_WEB_075)
- [ ] **LOC-047** — City name with foreign characters | Steps: enter foreign-character name | Expected: accepted, content shown | `@P1 @Regression` (TC_WEB_076)
- [ ] **LOC-048** — City name with emoji characters | Steps: enter name with emoji | Expected: error — city not recognized | `@P1 @Regression` (TC_WEB_077)
- [ ] **LOC-061** — City name with Unicode characters | Steps: enter Unicode name | Expected: accepted, content shown | `@P1 @Regression` (TC_WEB_090)
- [ ] **LOC-062** — Very long city name | Steps: enter very long name | Expected: error — exceeds maximum length | `@P1 @Regression` (TC_WEB_091)
- [ ] **LOC-063** — Very short city name | Steps: enter very short name | Expected: accepted, content shown | `@P1 @Regression` (TC_WEB_092)
- [ ] **LOC-064** — City name with mixed language characters | Steps: enter mixed-language name | Expected: accepted, content shown | `@P2 @Regression` (TC_WEB_093)
- [ ] **LOC-065** — City name with repeated characters | Steps: enter repeated-char name | Expected: normalized, accepted | `@P2 @Regression` (TC_WEB_094)
- [ ] **LOC-066** — Hyphenated city name | Steps: enter hyphenated name | Expected: accepted, content shown | `@P2 @Regression` (TC_WEB_095)
- [ ] **LOC-067** — City name with an apostrophe | Steps: enter name with apostrophe | Expected: accepted, content shown | `@P2 @Regression` (TC_WEB_096)
- [ ] **LOC-068** — City name with accented characters | Steps: enter accented name | Expected: accepted, content shown | `@P2 @Regression` (TC_WEB_097)
- [ ] **LOC-069** — City name with spaces between characters | Steps: enter name with internal spaces | Expected: normalized, accepted | `@P2 @Regression` (TC_WEB_098)
- [ ] **LOC-070** — City name with tab characters | Steps: enter name with tabs | Expected: normalized, accepted | `@P2 @Regression` (TC_WEB_099)
- [ ] **LOC-071** — City name with newline characters | Steps: enter name with newlines | Expected: normalized, accepted | `@P2 @Regression` (TC_WEB_100)
- [ ] **LOC-072** — City name with mixed input types (letters/numbers/symbols) | Steps: enter mixed-type input | Expected: error — city not recognized | `@P1 @Regression` (TC_WEB_101)

### Security — input sanitization

- [ ] **LOC-049** — SQL injection attempt in city input | Steps: enter SQL injection payload | Expected: input sanitized, error — city not recognized, no execution | `@P1 @Regression` (TC_WEB_078)
- [ ] **LOC-050** — XSS injection attempt in city input | Steps: enter XSS payload | Expected: sanitized, no script execution | `@P1 @Regression` (TC_WEB_079)
- [ ] **LOC-051** — City name with HTML tags | Steps: enter HTML-tagged input | Expected: sanitized, error — city not recognized | `@P1 @Regression` (TC_WEB_080)
- [ ] **LOC-052** — JavaScript code in city input | Steps: enter JS payload | Expected: sanitized, no execution | `@P1 @Regression` (TC_WEB_081)
- [ ] **LOC-053** — CSS code in city input | Steps: enter CSS payload | Expected: sanitized, error — city not recognized | `@P1 @Regression` (TC_WEB_082)
- [ ] **LOC-054** — JSON code in city input | Steps: enter JSON payload | Expected: sanitized, error — city not recognized | `@P1 @Regression` (TC_WEB_083)
- [ ] **LOC-055** — XML code in city input | Steps: enter XML payload | Expected: sanitized, error — city not recognized | `@P1 @Regression` (TC_WEB_084)
- [ ] **LOC-056** — YAML code in city input | Steps: enter YAML payload | Expected: sanitized, error — city not recognized | `@P1 @Regression` (TC_WEB_085)
- [ ] **LOC-057** — SQL query in city input | Steps: enter raw SQL query | Expected: sanitized, error — city not recognized | `@P1 @Regression` (TC_WEB_086)
- [ ] **LOC-058** — Command injection attempt | Steps: enter command injection payload | Expected: sanitized, no execution | `@P1 @Regression` (TC_WEB_087)
- [ ] **LOC-059** — Path traversal attempt | Steps: enter path traversal payload (e.g. `../../etc/passwd`) | Expected: sanitized, error — city not recognized | `@P1 @Regression` (TC_WEB_088)
- [ ] **LOC-060** — Buffer overflow attempt | Steps: enter oversized/malformed payload | Expected: sanitized, no crash, error — city not recognized | `@P1 @Regression` (TC_WEB_089)

## E2E implementation notes

- **Layering:** `src/tests/location.spec.ts` → `src/modules/LocationModule.ts` → `src/pages/LocationPage.ts`
- **Frontend context:** Not provided — no `dev-repo/` supplied. Use accessibility-role locators via Playwright MCP snapshot discovery during generation.
- **Reuse:** Manual city selection (LOC-021, 029, 030, 035–072) largely overlaps with the existing City Selection module (`src/pages/CitySelectionPage.ts` / `src/modules/CitySelectionModule.ts`, see `requirements/city-selection.md`) — check it before building duplicate manual-entry/search logic. The city-change nudge (LOC-012, 019, 022, 023, 031) may share a `NudgeModule`/`NudgePage` with the not-yet-built Complete-Your-Profile and Verify-Your-Email nudges from the same PDF — worth a shared component rather than three separate implementations.
- **Locators:** Prefer `getByRole('button', { name: 'Enable Location' | 'Select Location Manually' | 'Settings' | 'Cancel' | 'Yes' | 'No' })` for app dialogs, and `getByText`/`getByRole('button')` for the web/M-site permission banner options (Allow while visiting the site / Allow this time / Never allow). Confirm exact roles/names via Playwright MCP `browser_snapshot` before coding.
- **Fixtures / mocks:** Use `context.grantPermissions(['geolocation'])` / `context.clearPermissions()` and `context.setGeolocation(...)` to drive allow/deny/city-change scenarios (LOC-001–014, 032, 034); `context.setOffline(true)` or route interception for network-failure cases (LOC-014, 020, 033); route mocking on the detection/lookup API for non-serviceable-city and sub-city-default cases (LOC-015, 016); `localStorage`/profile-API assertions for storage-persistence cases (LOC-017, 018, 026, 029, 030); no mocking needed for manual-input validation/security rows (LOC-035–072) beyond driving the input field directly and asserting sanitized/no-op behavior.
- **Tags:** `@P0 @Smoke` for core detect/permission/manual-select/nudge paths (LOC-001, 002, 006, 010, 019, 021, 022), `@P1 @Regression` as the default (including all security-injection cases), `@P2 @Regression` for cosmetic input-normalization edge cases (LOC-041, 042, 064–071).
- **Run:** `npx playwright test src/tests/location.spec.ts --project=chromium`

## Source

- **Seed method:** Excel/CSV
- **File:** `requirements/location-test-cases.csv` (converted from user-provided PDF *"_PVR INOX __ Test Cases - M3 _ Website.pdf"*, rows TC_WEB_030–TC_WEB_101)
- **Sheet:** single sheet (CSV)
- **Columns:** Test Summary=`Test Case Title`, Test Objective=`Test Case Title`, Test Steps=`Test Steps`, Expected Result=`Expected Result`
- **Frontend repo:** not provided
