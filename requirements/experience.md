# Playwright: Experience — landing page, carousel, movie search & design/visual conformance

## Acceptance criteria

- Experience landing page opens from Web header nav and App/M-Site bottom nav (More → Experience); page loads without a location error when location/city is set, and prompts the user otherwise.
- Banner video auto-plays after 3 seconds when available, falling back to a static banner/poster when not.
- Experience carousel orders by audi count by default, or by admin-defined priority when an override is configured; selecting a different experience updates banner, description and movie list.
- Movie search (text and voice) returns matching results (partial, case-insensitive); mic permission denial and playback failures surface clear error states.
- Now Showing movies are ordered by show count, with full metadata (poster, rating, genre, language, format, duration, offers); Coming Soon movies are ordered by ascending release date with working Set/Delete Alert.
- Repeated errors (3x) redirect to homepage and trigger an alert email; missing images fall back to a placeholder.
- Visual/design conformance: theme colors, typography (font size/weight), spacing, padding/margin, and highlight states across the Experience screens match the design system (Figma).

## Navigation

1. **Web:** Open website → click "Experience" from header navigation.
2. **App/M-Site:** Launch app/m-site → Bottom Navigation → More → Experience (currently **Not Applicable** per source sheet — TC_WEB_053 — verify current build behavior before automating this path).
3. Land on the Experience landing page: banner/carousel at top, description/features below, Now Showing and Coming Soon movie lists further down.

## Test coverage

- **Scope:** Complete — all feasible rows for this module from the source sheet.
- **Sheet rows included:** 68 of 447 (TC_WEB_053–TC_WEB_120).
- **Out of scope:** TC_WEB_066/067/116 (EXP-014/015/064) — voice search success, mic permission denied, mic permission popup UI — **Excluded**, mic-permission-dependent; removed from suite. Also flagged for different tooling: TC_WEB_053/072 carry "Not Applicable" QA status (App/M-Site nav, hover trailer autoplay — confirm feature presence first); TC_WEB_075/076/079 carry "Deferred" QA status (Set/Delete Alert, repeated-error redirect — depend on login + alerting infra not yet automated in this repo). Rows EXP-029 through EXP-068 (TC_WEB_081–TC_WEB_120) are **visual/design-conformance checks** (color, font, spacing vs. Figma) rather than functional flows — see implementation notes below.
  - TC_WEB_053 (EXP-001) — navigation to Experience section (App/M-Site) — **Excluded**, confirmed absent on live build (source sheet marks Not Applicable; this project automates Web/M-Site via a desktop browser, not a native App context); removed from suite.
  - TC_WEB_064 (EXP-012) — experience video playback failure handling — **Excluded**, non-mockable third-party content; removed from suite. Movie/video content ships as part of a Next.js RSC payload during client-side routing, with no discrete, mockable video API to force a failure on.
  - TC_WEB_068 (EXP-016) — Now Showing movie ordering — **Excluded**, confirmed absent on live build (no separate "Now Showing" section confirmed on this page, only a single "Movies Showing in {EXPERIENCE}" list); removed from suite.
  - TC_WEB_071 (EXP-019) — Watch Trailer for multiple trailers — **Excluded**, confirmed absent on live build (no distinct "Watch Trailer" CTA confirmed separately from the card itself); removed from suite.
  - TC_WEB_072 (EXP-020) — hover trailer autoplay on web — **Excluded**, confirmed absent on live build (source sheet's own "Not Applicable" status confirmed live — zero DOM change on a 5s hover); removed from suite.
  - TC_WEB_074 (EXP-022) — Coming Soon movie sorting — **Excluded**, confirmed absent on live build (no separate "Coming Soon" section confirmed on this page); removed from suite.
  - TC_WEB_078/079 (EXP-026/027) — movie fetch failure handling, repeated-error redirect — **Excluded**, non-mockable third-party content; removed from suite. Movie/video data ships as part of the Next.js RSC payload for `/experiences`, not a separate JSON endpoint, so there is no discrete API to force a failure on.
  - TC_WEB_095 (EXP-043) — CTA font size and font weight — **Excluded**, confirmed absent on live build (the "Learn More About {EXPERIENCE}" text CTA this scenario checks is confirmed gone from this build; its replacement is an icon-only SVG play button with no text/font of its own to measure); removed from suite.
  - TC_WEB_105 (EXP-053) — experience tag UI on movie card — **Excluded**, confirmed absent on live build (no distinct experience-tag element separate from the full movie-card text); removed from suite.
  - TC_WEB_106 (EXP-054) — trailer CTA UI on App/M-Site — **Excluded**, confirmed absent on live build (App/M-Site is out of scope for this desktop-browser Web spec); removed from suite.
  - TC_WEB_107 (EXP-055) — hover trailer playback UI on Web — **Excluded**, confirmed absent on live build (see EXP-020 — zero DOM change on hover); removed from suite.
  - TC_WEB_108/109/110 (EXP-056/057/058) — Now Showing section header UI, Coming Soon section header UI, release date text mapping — **Excluded**, confirmed absent on live build (no separate Now Showing/Coming Soon sections confirmed on this page); removed from suite.
  - TC_WEB_114 (EXP-062) — video playback failure UI — **Excluded**, non-mockable third-party content; removed from suite (see EXP-012).
  - TC_WEB_119 (EXP-067) — multi-language text UI handling (Hindi/Tamil) — **Excluded**, confirmed absent on live build (no locale switch or non-English content confirmed reachable during grounding); removed from suite.
- **Environment note (2026-08-19):** `/experiences` structure is identical between production and UAT (Mumbai) — same "Movies Showing in {EXPERIENCE} In Your City {city}" heading and card shapes, though the default selected experience differs per city (DIRECTOR'S CUT on production, INSIGNIA on UAT/Mumbai) and the "Learn More About {EXPERIENCE}" CTA wasn't confirmed present for every experience. These specs now run against UAT for consistency with Global Search/Event Listing/Event Details, which need Mumbai for real data.

## Scenarios

- **Suggested journey:** `src/tests/experience.spec.ts`
- **Sheet:** `_PVR INOX__ Test Cases - M4 _ Website.pdf` → Website test-case table

### Functional (TC_WEB_053–080)

- [ ] **EXP-002** — Verify navigation to Experience section (Web) | Steps: open website → click Experience in header nav | Expected: Experience landing page opens successfully | `@P0 @Regression`
- [ ] **EXP-003** — Verify location validation | Steps: location enabled or city selected, open Experience | Expected: page loads without location error | `@P0 @Regression`
- [ ] **EXP-004** — Verify location not selected handling | Steps: location disabled and city not selected, open Experience | Expected: prompt shown to enable location or select city | `@P0 @Regression`
- [ ] **EXP-005** — Verify experience banner video autoplay | Steps: open Experience page, wait 3 seconds | Expected: latest video auto-plays; banner visible initially | `@P1 @Regression`
- [ ] **EXP-006** — Verify banner fallback when no video available | Steps: open Experience page with no video | Expected: only experience banner/poster displayed | `@P2 @Regression`
- [ ] **EXP-007** — Verify experience carousel ordering by audi count | Steps: observe experience carousel | Expected: ordered by number of audi in the city | `@P0 @Regression`
- [ ] **EXP-008** — Verify experience order override from Admin | Steps: admin override enabled, open Experience page | Expected: sequence follows admin-defined priority | `@P0 @Regression`
- [ ] **EXP-009** — Verify experience selection updates content | Steps: select another experience from carousel | Expected: banner, description and movie list update | `@P0 @Regression`
- [ ] **EXP-010** — Verify experience description section | Steps: observe description/features section | Expected: features and description displayed correctly | `@P1 @Regression`
- [ ] **EXP-011** — Verify experience video CTA behavior | Steps: tap "Treasure the Experience" CTA → select video | Expected: video list displayed; selected video auto-plays | `@P1 @Regression`
- [ ] **EXP-013** — Verify movie search by keyword | Steps: type movie keyword in search bar | Expected: matching movies displayed (partial & case-insensitive) | `@P0 @Regression`
- [ ] **EXP-017** — Verify long movie name truncation | Steps: observe movie card with long name | Expected: name truncated without breaking UI | `@P1 @Regression`
- [ ] **EXP-018** — Verify Now Showing movie card details | Steps: observe movie card | Expected: poster, rating, genre, language, format, duration & offers | `@P0 @Regression`
- [ ] **EXP-021** — Verify booking redirection from movie card | Steps: click Now Showing movie card | Expected: redirected to Movie Detail page with experience pre-filter | `@P0 @Regression`
- [ ] **EXP-023** — Verify Set Alert functionality | Steps: log in, tap Set Alert on upcoming movie | Expected: alert set successfully | `@P1 @Regression` (source QA status: Deferred)
- [ ] **EXP-024** — Verify Delete Alert functionality | Steps: alert already set, tap Delete Alert | Expected: alert removed successfully | `@P1 @Regression` (source QA status: Deferred)
- [ ] **EXP-025** — Verify no movies available message | Steps: open experience with no Now Showing/Coming Soon movies | Expected: "no movies showing in selected experience" message | `@P0 @Regression`
- [ ] **EXP-028** — Verify image fallback handling | Steps: observe experience/movie card with missing image | Expected: generic placeholder image displayed | `@P2 @Regression`

### Visual / design conformance (TC_WEB_081–120)

- [ ] **EXP-029** — Verify theme color consistency across Experience screens | Expected: theme colors match Figma/design system | `@P0 @Regression`
- [ ] **EXP-030** — Verify banner background color mapping with design | Expected: banner color matches design | `@P0 @Regression`
- [ ] **EXP-031** — Verify experience title font size as per design | Expected: font size matches design spec | `@P0 @Regression`
- [ ] **EXP-032** — Verify experience title font weight consistency | Expected: font weight matches design | `@P1 @Regression`
- [ ] **EXP-033** — Verify banner text line height and spacing | Expected: proper spacing, no overlap | `@P1 @Regression`
- [ ] **EXP-034** — Verify video autoplay UI alignment after 3 seconds | Expected: video plays without layout shift | `@P0 @Regression`
- [ ] **EXP-035** — Verify fallback banner image UI when video unavailable | Expected: poster displayed with correct ratio | `@P0 @Regression`
- [ ] **EXP-036** — Verify experience carousel card padding | Expected: padding matches Figma | `@P0 @Regression`
- [ ] **EXP-037** — Verify experience carousel card margin | Expected: equal margin between cards | `@P0 @Regression`
- [ ] **EXP-038** — Verify selected experience highlight UI state | Expected: highlight color & border correct | `@P0 @Regression`
- [ ] **EXP-039** — Verify experience sequence UI based on priority | Expected: order rendered correctly | `@P1 @Regression`
- [ ] **EXP-040** — Verify experience description font size | Expected: matches design and readable | `@P0 @Regression`
- [ ] **EXP-041** — Verify experience description line height | Expected: no clipping or overlap | `@P1 @Regression`
- [ ] **EXP-042** — Verify Treasure the Experience CTA color | Expected: matches primary CTA design | `@P0 @Regression`
- [ ] **EXP-044** — Verify search bar height and padding | Expected: search bar aligned correctly | `@P0 @Regression`
- [ ] **EXP-045** — Verify search placeholder text mapping and spelling | Expected: correct text and spelling | `@P0 @Regression`
- [ ] **EXP-046** — Verify empty search result UI design | Expected: empty state UI matches design | `@P1 @Regression`
- [ ] **EXP-047** — Verify movie card poster aspect ratio | Expected: no stretch or distortion | `@P0 @Regression`
- [ ] **EXP-048** — Verify long movie title truncation with ellipsis | Expected: ellipsis applied correctly | `@P0 @Regression`
- [ ] **EXP-049** — Verify movie title font size on card | Expected: matches design spec | `@P0 @Regression`
- [ ] **EXP-050** — Verify movie title font weight | Expected: correct font weight applied | `@P1 @Regression`
- [ ] **EXP-051** — Verify movie metadata spacing and alignment | Expected: proper alignment & spacing | `@P0 @Regression`
- [ ] **EXP-052** — Verify censor rating badge color and size | Expected: matches design and readable | `@P0 @Regression`
- [ ] **EXP-059** — Verify Set Alert / Delete Alert CTA UI | Expected: correct CTA state shown | `@P1 @Regression`
- [ ] **EXP-060** — Verify alert count text alignment | Expected: no overlap or cut-off | `@P2 @Regression`
- [ ] **EXP-061** — Verify error message UI when no movies available | Expected: error message matches design | `@P0 @Regression`
- [ ] **EXP-063** — Verify location permission popup UI | Expected: popup UI matches design | `@P0 @Regression`
- [ ] **EXP-065** — Verify image fallback UI for missing posters | Expected: placeholder image shown | `@P0 @Regression`
- [ ] **EXP-066** — Verify UI responsiveness on small screens | Expected: no UI break or overlap | `@P0 @Regression`
- [ ] **EXP-068** — Verify dark/light theme color mapping | Expected: contrast & colors correct | `@P1 @Regression`

## E2E implementation notes

- **Layering:** `src/tests/experience.spec.ts` → `src/modules/ExperienceModule.ts` → `src/pages/ExperiencePage.ts`
- **Frontend context:** Not provided — no `dev-repo/` supplied. Discover selectors via Playwright MCP snapshot on the live/staging site.
- **Reuse:** Search bar, mic/voice-search flow, and card metadata rendering (poster/rating/genre) overlap heavily with Global Search ([[global-search]]) and Cinemas Listing & Detail — check for a shared `SearchModule`/movie-card component before duplicating.
- **Locators:** Prefer `getByRole('tab'|'listitem')` for carousel items, `getByRole('button', { name: /treasure the experience/i })`, `getByRole('searchbox')`. Confirm via Playwright MCP snapshot.
- **Fixtures / mocks:** EXP-012/EXP-026 (API failures) and EXP-027 (repeated-error redirect) need network mocking (`page.route`) to force failure states reliably; EXP-023/EXP-024 need a logged-in fixture and an upcoming-movie test-data setup.
- **Visual rows (EXP-029–EXP-068):** These are design-conformance checks, not functional flows. Do **not** write per-pixel Figma-comparison assertions — instead use `expect(locator).toHaveCSS(...)` for concrete, known values (color/font-size/font-weight/padding) where the design spec gives an exact value, and `expect(page).toHaveScreenshot(...)` (Playwright visual regression) for holistic layout checks. This block is roughly half the module's row count and is the main automation-effort driver — flag it in planning as separate, slower-to-build coverage from the functional rows above.
- **Tags:** `@Regression`, `@P0` for navigation, carousel, search, error-state and most visual-conformance rows (per source Priority=High); `@P1`/`@P2` for secondary cosmetics and alerts.
- **Run:** `npx playwright test src/tests/experience.spec.ts --project=chromium`

## Source

- **Seed method:** PDF-exported test-case table (pasted directly; no separate Excel/CSV file)
- **File:** `_PVR INOX__ Test Cases - M4 _ Website.pdf` (pages 2–4)
- **Sheet:** N/A — single "Website" test execution table
- **Columns:** Test Summary=`Test case Title`, Test Objective=`Pre Conditions`, Test Steps=`Test Steps/validation point`, Expected Result=`Expected Result (ER)`, also carried: `Priority`, `QA Status`
- **Frontend repo:** not provided
