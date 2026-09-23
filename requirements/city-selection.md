# Playwright: City Selection — manual city/sub-city picker with search & voice search

## Acceptance criteria

- City Selection screen shows popular cities (with images) at the top, a scrollable alphabetical list of all cities, a search bar, and a "Tap to share location" CTA.
- Selecting a city without sub-cities saves it immediately and updates Home/other screen content for that city.
- Selecting a city with sub-cities (e.g. Mumbai, Delhi-NCR) opens a sub-dropdown; selecting "All" under sub-cities selects the parent city.
- Search requires a minimum of 2 characters, is case-insensitive, supports partial matches, and resolves known aliases (e.g. "Gurgaon" → "Gurugram").
- Voice search converts speech to text and searches the same list; denied microphone permission shows a Settings/Cancel prompt.
- Closing the screen without selecting retains the previously saved city (if one exists); selecting an unmatched city shows "City not found."
- Popular city sequencing, popular-city flag, and full city/sub-city data are sourced from Admin Panel > City Management.
- Network/server failure while loading the city list shows an error message instead of a blank screen.

## Navigation

1. Launch app/web/m-site.
2. Trigger City Selection either by: denying/skipping location permission, automatic location detection failing, or explicitly tapping the city-change option (top of screen in App/M-site, header/navigation bar in Web).
3. City Selection screen opens with popular cities, full city list, and search bar.

## Test coverage

- **Scope:** Standard — positive, negative, edge, and API parity cases derived directly from PRD use case UC 9 (City Selection); RBAC included as a single access-note case since the module has no role-gated behavior.
- **Types included:** Positive, Negative, Edge, API parity, Access note
- **Scenarios included:** 26
- **Out of scope:** None excluded — voice search recognition-failure UI copy and "City not found" exact microcopy were not detailed further in the PRD beyond what's quoted, so those cases assert on the documented message text only.

## Scenarios

- **Suggested journey:** `src/tests/city-selection.spec.ts`
- **Seed:** PRD excerpt — UC 9, *PVR INOX_Product Requirement Document.pdf* (physical pages 34–36), plus a live sample response from the API below.

### Positive

- [ ] **CTY-001** — City Selection screen displays popular cities, scrollable full list, search bar, and "Tap to share location" CTA `[Positive]` | Steps: open City Selection screen | Expected: all four elements render | `@P0 @Smoke`
- [ ] **CTY-002** — Selecting a city with no sub-cities saves it and updates Home content `[Positive]` | Steps: select a city where `hasSubCities:false` (e.g. Bangalore) | Expected: city saved, Home/other screens reflect new city | `@P0 @Smoke`
- [ ] **CTY-003** — Selecting a city with sub-cities opens a sub-dropdown `[Positive]` | Steps: select Mumbai or Delhi-NCR | Expected: sub-dropdown appears listing its sub-cities | `@P0 @Regression`
- [ ] **CTY-004** — Selecting a sub-city saves city + sub-city and updates content `[Positive]` | Steps: select Delhi-NCR → select Gurgaon | Expected: both city and sub-city persisted; content updates for Gurgaon | `@P0 @Regression`
- [ ] **CTY-005** — Selecting "All" under a sub-city dropdown selects the parent city `[Positive]` | Steps: select Delhi-NCR → choose "All" in sub-city dropdown | Expected: "Delhi-NCR" is saved as the selected city | `@P1 @Regression`
- [ ] **CTY-006** — Search returns matching cities/sub-cities for a valid keyword `[Positive]` | Steps: type "Delhi" in search | Expected: results include Delhi and Delhi NCR | `@P0 @Regression`
- [ ] **CTY-007** — Search is case-insensitive and supports partial matches `[Positive]` | Steps: search "del" then "Del" | Expected: identical result sets both times | `@P1 @Regression`
- [ ] **CTY-008** — Search resolves alias names `[Positive]` | Steps: search "Gurgaon" | Expected: result shows "Gurugram" | `@P1 @Regression`
- [ ] **CTY-009** — Voice search returns matching results `[Positive]` | Steps: grant mic permission, speak a city name | Expected: speech converted to text, matching city results shown | `@P1 @Regression`
- [ ] **CTY-010** — "Tap to share location" fetches location automatically `[Positive]` | Steps: tap the CTA | Expected: location fetch flow triggers (per UC 8) | `@P1 @Regression`
- [ ] **CTY-011** — Popular cities render in Admin-configured sequence with name and image `[Positive]` | Steps: open City Selection | Expected: popular cities ordered per configured `sequenceNumber`, each showing name + image | `@P1 @Regression`
- [ ] **CTY-012** — Full city/sub-city list renders alphabetically A–Z `[Positive]` | Steps: scroll full city list | Expected: entries sorted alphabetically | `@P2 @Regression`

### Negative

- [ ] **CTY-020** — Closing without selecting retains the previously saved city `[Negative]` | Steps: with a city already saved, open City Selection, close without choosing | Expected: previous city remains active | `@P1 @Regression`
- [ ] **CTY-021** — Searching a city not in the list shows "City not found" `[Negative]` | Steps: search a nonexistent city name | Expected: "City not found" message; existing list remains selectable | `@P1 @Regression`
- [ ] **CTY-022** — Search does not trigger below the 2-character minimum `[Negative]` | Steps: type 1 character | Expected: no search triggered/no results fetched | `@P1 @Regression`
- [ ] **CTY-023** — Search rejects disallowed characters `[Negative]` | Steps: type numbers/special symbols/emojis (`@ # $ % ^ & * ( )`) | Expected: input rejected or yields no results, no crash | `@P1 @Regression`
- [ ] **CTY-024** — Search input with leading/trailing spaces still matches correctly `[Negative]` | Steps: search " Delhi " | Expected: same results as trimmed "Delhi" | `@P2 @Regression`
- [ ] **CTY-025** — Denied microphone permission shows Settings/Cancel prompt `[Negative]` | Steps: deny mic permission, tap mic icon | Expected: popup shown with Settings/Cancel; Cancel falls back to text search | `@P1 @Regression`
- [ ] **CTY-026** — City list load failure shows an error message `[Negative]` | Steps: simulate network/server failure while loading city list | Expected: error message shown instead of blank screen | `@P1 @Regression`
- [ ] **CTY-027** — Missing popular-city image shows a generic placeholder `[Negative]` | Steps: popular city configured without an image | Expected: generic placeholder image displayed | `@P2 @Regression`

### API parity

- [ ] **CTY-040** — `GET /api/get-city-list` success renders Popular Cities and full city list matching payload `[API parity]` | Steps: call `get-city-list`, open City Selection | Expected: `statusCode:200`, `message:"en.CITY_LISTED"`; UI's Popular Cities section == `data.popularCities[]` and full list == `data.cities[]` by `cityName`/`cityId` | `@P0 @Regression`
- [ ] **CTY-041** — Sub-city dropdown matches `subCities[]` for cities with `hasSubCities:true` `[API parity]` | Steps: select Mumbai-All (`cityId:123`) or Delhi-NCR (`cityId:121`) | Expected: dropdown options equal each entry's `CityName` from the API's `subCities[]` array | `@P0 @Regression`
- [ ] **CTY-042** — Popular cities render ordered by ascending `sequenceNumber` `[API parity]` | Steps: inspect API response `sequenceNumber` per popular city vs. rendered order | Expected: UI order matches ascending `sequenceNumber` (e.g. Mumbai-All=3, Bangalore=5, Delhi-NCR=19, Hyderabad=22, Chennai=27) | `@P1 @Regression`
- [ ] **CTY-043** — Non-200/error response from `get-city-list` surfaces an error state `[API parity]` | Steps: mock a non-200 response or timeout on `get-city-list` | Expected: UI shows an error message, no blank/broken screen | `@P1 @Regression`
- [ ] **CTY-044** — Empty `cities[]` in API payload renders an empty state without crashing `[API parity]` | Steps: mock `data.cities:[]` while `popularCities` still has entries | Expected: full-list section shows an empty state; Popular Cities still renders | `@P2 @Regression`

### Access note

- [ ] **CTY-050** — Both Guest and Logged-in users can fully use City Selection `[RBAC]` | Steps: repeat CTY-002 as Guest, then as a logged-in user | Expected: identical behavior for both actor types (per PRD Primary Actor: "Customer — Logged-in or Guest") | `@P2 @Regression`

## E2E implementation notes

- **Layering:** `src/tests/city-selection.spec.ts` → `src/modules/CitySelectionModule.ts` → `src/pages/CitySelectionPage.ts`
- **Frontend context:** Not provided — no `dev-repo/` supplied. Use accessibility-role locators via Playwright MCP snapshot discovery during generation.
- **Reuse:** Location/permission helpers are likely shared with Location Permission (UC 8) and Cinemas Listing modules — check for an existing `LocationModule`/fixture before building a new one; Global Search's search-bar handling (`src/pages/GlobalSearchPage.ts`, `src/modules/GlobalSearchModule.ts`) may already implement the 2-char-minimum/case-insensitive/alias search pattern reused here.
- **APIs:** `GET https://inox-uat-web.pvrinox.com/api/get-city-list` — confirmed live on UAT (2026-09-01). Response shape: `{ statusCode, message, data: { popularCities: [{ _id, cityId, cityName, hasSubCities, popularCity, subCities: [{ CityId, CityName, CityImgPath, Latitude, Longitude, cinemaCount }], latitude, longitude, cityImageURL, sequenceNumber, cityNameAlias, cityImageURLLight, cinemaCount, isPersonalizationEnabled }], cities: [{ _id, cityId, cityName, hasSubCities, popularCity, subCities, latitude, longitude }] } }`.
- **Locators:** Prefer `getByRole('searchbox')`, `getByRole('button', { name: /mic|voice/i })`, `getByRole('button', { name: <cityName> })`, `getByRole('listbox'|'list')` for the sub-city dropdown. Confirm exact roles/names via Playwright MCP `browser_snapshot` before coding.
- **Fixtures / mocks:** CTY-026 (list load failure), CTY-043 (API error), CTY-044 (empty cities) need network mocking/interception on `get-city-list`; CTY-009/CTY-025 (voice search) need `context.grantPermissions`/deny for microphone.
- **Tags:** `@Regression` throughout, `@P0`/`@Smoke` for core screen render + core selection flows, `@P1` for search/API-parity/permission cases, `@P2` for cosmetic/secondary cases.
- **Run:** `npx playwright test src/tests/city-selection.spec.ts --project=chromium`

## Source

- **Seed method:** Generated (PRD excerpt + live API sample)
- **Module:** City Selection
- **Testing types:** Positive, Negative, Edge, API parity, Access note (RBAC not applicable — no role gating in this module)
- **Depth:** Standard
- **User stories / scenarios provided:** PRD UC 9 (yes — summarized in Acceptance criteria)
- **Frontend repo:** not provided
- **API contract:** `GET https://inox-uat-web.pvrinox.com/api/get-city-list` — live UAT sample captured 2026-09-01, `statusCode:200`, `message:"en.CITY_LISTED"`
