# Playwright: About Us — Company/Journey/Team/Awards/Brands informational page

## Acceptance criteria

- "About Us" is reachable from the header **"More"** dropdown (not a top-level nav item) and is admin-toggleable (hidden entirely when disabled in Admin Panel).
- The About Us page loads content fetched from the Admin Panel and exposes five tabs: **Company, Our Journey, Team, Awards & Recognition, Brands** — all shown together when every module is configured; individually hidden when their own module is not configured.
- **Company** tab is selected by default and shows overview text, optional supporting image/media, and an optional Company Strengths section (hidden when not configured).
- **Our Journey** shows milestones in a scrollable timeline (year + title/description per milestone); clicking a milestone opens a popup with full details, closable via a Close control.
- **Team** shows members grouped by category, in Admin-defined sequence, each with profile image, name, and designation; clicking a member opens a details popup, closable.
- **Awards & Recognition** shows awards as cards with dynamic year filters; selecting a year filters the list, switching/resetting the filter updates it correctly, and a year with no awards shows an appropriate empty state.
- **Brands** lists configured resources with a title and a working open/download link, including external links that open in a new destination.
- The page is responsive across Web and M-site, media loads correctly (with a placeholder/fallback for broken media), large content scrolls smoothly, and a network interruption while loading surfaces an appropriate error message.

## Navigation

1. Open the site at `config.baseUrl` (env-configured — UAT per current `.env.local`).
2. Click **"More"** in the header nav (real accessible name is "More Arrow Down" — a chevron icon concatenates in; match by leading substring, not exact).
3. Click **"About Us"** in the resulting dropdown — a real `role="menuitem"` (not `role="link"`).

Content scenarios navigate directly to `/about-us` instead (matching this repo's established direct-URL pattern); only ABT-001/002 exercise the menu path itself.

**Live-grounded correction (2026-09-08):** the five "tabs" (Company / Our Journey / Team / Awards & Recognition / Brands) are **not** show/hide panels — they are scroll-to-section buttons on one continuous page. Clicking one scrolls to that section without hiding any other section's content or changing the URL. Every "tab switching"/"default tab" scenario below is implemented against that real behavior, not the show/hide assumption originally written here.

## Test coverage

- **Scope:** Complete — all rows from the sheet's "About Us" module that are feasible to automate.
- **Sheet rows included:** 50 of 51 (TC_Web_1–TC_Web_50; TC_Web_51 excluded as an exact duplicate of TC_Web_50).
- **Automation result:** 47 of 50 scenarios pass live against UAT; 3 are `test.fixme`.
- **Out of scope:**
  - TC_Web_51 — exact duplicate of TC_Web_50 ("Verify internet interruption"); merged into ABT-050.
- **`test.fixme` (genuinely blocked, not fixable via better test code):**
  - **ABT-010** — Company Strengths hidden when not configured: requires an Admin Panel data state (strengths removed) this suite cannot toggle from the UI; UAT always has this section configured.
  - **ABT-036** — No-awards-for-year empty state: Awards genuinely has 2 real cards (Conclave/2024, Iffa/2025); every currently-configured year filter has real data, so there is no year to exercise the empty state against without Admin access or mocking.
  - **ABT-049** — Unconfigured tab/section hidden: same Admin-state dependency as ABT-010; also structurally unlikely to exist as a per-tab flag since all five sections render together on one continuous page.
- **Re-grounded and un-blocked (2026-09-08)** — these were originally thought blocked but turned out to be locator-strategy bugs in the initial grounding, not real site limitations:
  - **ABT-001/002** — the "More" menu path is fully reliable (5/5 fresh-context runs) once matched against the real accessible name ("More Arrow Down", leading-substring) and the real `role="menuitem"` (not `role="link"`).
  - **ABT-032/034/035** — Awards genuinely has 2 real cards rendered as `.swiper-slide`s with no heading role (only `<img alt="{title}">` + plain text); the year filter buttons genuinely filter client-side and reset via "All".
  - **ABT-038/039** — Brands actually renders 3 resources (IMAX logo, PVR logo, "Brand Guidelines" download card with a real separate title text node), not the single Download button originally found.

## Scenarios

- **Suggested journey:** `src/tests/about-us.spec.ts`
- **Sheet:** `_PVR INOX __ Test Cases  - M8 _ Website.pdf` → single continuous table (PDF export, no named sheet)

- [x] **ABT-001** — About Us menu is displayed | Steps: open application menu ("More") | Expected: "About Us" menu item is displayed
- [x] **ABT-002** — Navigation to About Us page | Steps: click "About Us" | Expected: user is navigated to About Us page
- [x] **ABT-003** — About Us page loads successfully | Steps: observe page loading | Expected: page loads without errors
- [x] **ABT-004** — Content fetched from Admin Panel | Steps: open About Us page | Expected: configured content is displayed
- [x] **ABT-005** — Default selected tab | Steps: observe tabs | Expected: Company tab is selected by default
- [x] **ABT-006** — Company tab is displayed | Steps: observe tabs | Expected: Company tab is visible
- [x] **ABT-007** — Company Overview content | Steps: open Company tab | Expected: overview content displayed correctly
- [x] **ABT-008** — Supporting image/media | Steps: open Company tab | Expected: configured image/media displayed
- [x] **ABT-009** — Company Strengths section | Steps: observe Company tab | Expected: strengths are displayed
- [ ] **ABT-010** — Strengths hidden when not configured *(admin-state dependent)* | Steps: open Company tab | Expected: Strengths section is hidden  _(test.fixme — see Test coverage)_
- [x] **ABT-011** — Company content formatting | Steps: observe page | Expected: text formatting matches configuration
- [x] **ABT-012** — Our Journey tab is displayed | Steps: observe tabs | Expected: Our Journey tab is displayed
- [x] **ABT-013** — Navigation to Our Journey tab | Steps: click Our Journey tab | Expected: journey content is displayed
- [x] **ABT-014** — Milestones are displayed | Steps: open Our Journey | Expected: all milestones are displayed
- [x] **ABT-015** — Milestone timeline format | Steps: observe timeline | Expected: milestones appear in timeline format
- [x] **ABT-016** — Milestone year | Steps: observe milestone | Expected: correct year displayed
- [x] **ABT-017** — Milestone title | Steps: observe milestone | Expected: correct title/description displayed
- [x] **ABT-018** — Scrolling through milestones | Steps: scroll timeline | Expected: user can scroll through all milestones
- [x] **ABT-019** — Milestone popup | Steps: click milestone | Expected: detailed popup/dialog opens
- [x] **ABT-020** — Milestone popup content | Steps: observe popup | Expected: correct milestone details displayed
- [x] **ABT-021** — Popup close functionality | Steps: click Close | Expected: popup closes successfully
- [x] **ABT-022** — Team tab is displayed | Steps: observe tabs | Expected: Team tab is displayed
- [x] **ABT-023** — Team categories | Steps: open Team tab | Expected: team groups displayed correctly
- [x] **ABT-024** — Team member profile image | Steps: observe member | Expected: profile image displayed correctly
- [x] **ABT-025** — Team member name | Steps: observe member | Expected: correct name displayed
- [x] **ABT-026** — Team member designation | Steps: observe member | Expected: correct designation displayed
- [x] **ABT-027** — Team sequence | Steps: observe order | Expected: members displayed as configured in Admin
- [x] **ABT-028** — Team member popup | Steps: click member | Expected: details popup opens
- [x] **ABT-029** — Team member popup details | Steps: observe details | Expected: correct member information displayed
- [x] **ABT-030** — Popup dismissal | Steps: close popup | Expected: popup closes successfully
- [x] **ABT-031** — Awards tab is displayed | Steps: open Awards tab | Expected: Awards tab displayed
- [x] **ABT-032** — Award cards | Steps: observe page | Expected: awards displayed in card layout
- [x] **ABT-033** — Year filters | Steps: observe filters | Expected: dynamic year filters displayed
- [x] **ABT-034** — Filtering by year | Steps: select year | Expected: only selected year's awards displayed
- [x] **ABT-035** — Filter reset | Steps: select another year/All | Expected: award list updates correctly
- [ ] **ABT-036** — No awards for selected year *(admin-state dependent)* | Steps: select year with no data | Expected: appropriate "No Awards Found"/empty state displayed  _(test.fixme — see Test coverage)_
- [x] **ABT-037** — Brands tab is displayed | Steps: observe tabs | Expected: Brands tab displayed
- [x] **ABT-038** — Brand resources list | Steps: open Brands tab | Expected: all configured resources displayed
- [x] **ABT-039** — Brand resource title | Steps: observe list | Expected: correct resource title displayed
- [x] **ABT-040** — Download/Open link | Steps: click resource | Expected: resource opens/downloads successfully
- [x] **ABT-041** — Downloadable asset | Steps: download file | Expected: file downloads successfully
- [x] **ABT-042** — External resource link | Steps: click link | Expected: external page opens successfully
- [x] **ABT-043** — All tabs are displayed | Steps: observe page | Expected: Company, Our Journey, Team, Awards & Recognition, Brands all displayed
- [x] **ABT-044** — Tab switching | Steps: switch between tabs | Expected: correct content displayed for each tab
- [x] **ABT-045** — Page responsiveness | Steps: resize browser / open M-site | Expected: layout is responsive without UI issues
- [x] **ABT-046** — Media loading | Steps: open page | Expected: all media loads successfully
- [x] **ABT-047** — Broken image handling *(admin-state dependent)* | Steps: open page | Expected: placeholder/fallback image displayed
- [x] **ABT-048** — Scrolling performance | Steps: scroll page | Expected: smooth scrolling without lag
- [ ] **ABT-049** — Unconfigured tab hidden *(admin-state dependent)* | Steps: open corresponding tab | Expected: tab/section hidden or empty state shown per design  _(test.fixme — see Test coverage)_
- [x] **ABT-050** — Internet interruption | Steps: disconnect internet, open About Us page | Expected: appropriate error message displayed

## E2E implementation notes

- **Layering:** `src/tests/about-us.spec.ts` → `src/modules/AboutUsModule.ts` → `src/pages/AboutUsPage.ts`.
- **Frontend context:** Not provided (no `dev-repo/`) — no existing header/"More"-dropdown Page helper exists in this repo yet (`HomeScreenPage.ts` only has a "View More" offers link, unrelated to the header dropdown), so `AboutUsPage` owns both the "More" → "About Us" nav locators and the tab/popup/filter locators for this page. Ground exact selectors, tab labels, and popup/dialog roles live via Playwright MCP (or headless Playwright per the sandbox grounding technique, since MCP has failed in this sandbox before) during `/playwright-mcp` before writing assertions.
- **Reuse:** None yet for the header "More" menu — first feature to need it; consider promoting it to a shared header helper if a second feature (Legal Content, FAQs, News, Investor, Careers, etc. — all reached the same way per the source sheet) is automated later.
- **Locators:** Prefer accessibility-role locators (`getByRole('tab', ...)`, `getByRole('dialog', ...)`, `getByRole('link', { name: /more/i })`) per repo convention; avoid CSS/XPath.
- **Fixtures / mocks:** ABT-010/036/047/049 are admin-state dependent — if live data doesn't naturally cover them, model mocking after `src/utils/AdminMock.ts` rather than assuming Admin Panel access.
- **Popups:** ABT-019/020/021 (milestone) and ABT-028/029/030 (team member) both open a popup/dialog with a Close control — likely share one reusable popup-assertion helper in `AboutUsModule.ts`.
- **Downloads:** ABT-040/041 should use Playwright's `page.waitForEvent('download')` pattern; ABT-042 should assert a new tab/page via `context.waitForEvent('page')` or an equivalent URL check.
- **Network interruption:** ABT-050 via `context.setOffline(true)` (or route abort) before navigation.
- **Tags:** `@Regression`, `@P1` (per module priorities in the sheet, mostly High/Critical); use project `chromium` per repo conventions.
- **Run:** `npx playwright test src/tests/about-us.spec.ts --project=chromium`

## Source

- **Seed method:** PDF export of a test-case sheet (tabular, full fidelity — treated as the sheet's equivalent since no `.xlsx`/`.csv` was supplied)
- **File:** `/home/user/Documents/_PVR INOX __ Test Cases  - M8 _ Website.pdf`
- **Sheet:** N/A (PDF; single continuous table across pages, TC_Web_1–TC_Web_51 for the "About Us" module)
- **Columns:** Test Summary=`Test case Title`, Test Objective=derived from Title, Test Steps=`Test Steps/validation point`, Expected Result=`Expected Result (ER)`, Priority=`Priority`
- **Frontend repo:** `dev-repo/` not provided
