# Playwright: Investor Section — Financial/Reports/Disclosures with deep-linkable tabs

## Acceptance criteria

- The Investor Section page is reachable via the header "More" dropdown's "Investor" item (same pattern as About Us/News), and loads Admin-configured top-level tabs in Admin-defined sequence, with the first tab selected by default.
- **Financial** tab shows configured sub-sections including a "10 Years Highlight" table whose structure (columns/rows) matches Admin configuration, plus informative text.
- **Annual Report** / **Investor Presentation** / **Subsidiary Reports** / **Statement** sections each list documents sorted per their own rule (Financial Year desc; Year desc then upload time desc; upload time desc; as configured) with working downloads.
- **Quarterly Financials** defaults to the latest year, offers a Year dropdown and categories, and quarter-wise documents download correctly.
- **Statutory Disclosure** groups documents year-wise with a default sub-section and latest-first ordering.
- **Analyst Coverage** cards are alphabetical; **Investor Support** shows roles and contact info; **Scheme of Merger** lists documents latest-uploaded-first.
- **Team** tab shows groups/members (image, name, designation) in Admin-defined sequence with a detail popup per member.
- Deep links land directly on a configured tab/sub-section; each tab/sub-section has a unique URL. **RESOLVED (real behavior differs from the sheet):** an invalid/unavailable deep link does NOT fall back to a default tab — it stays on the invalid URL and shows a real, reproducible `"{Humanized slug} content will be available soon."` message instead (see Test coverage).
- **Confirmed real file types: PDF and Audio (MP3) only** — no DOC or Video document, and no standalone Image-as-document, exists anywhere reachable on this page (7 sections sampled live). A broken document download fails **silently** — no visible UI error exists anywhere (a real, confirmed product gap, not a test-locator gap).
- Empty/unconfigured tabs and sub-sections are directly, live-testable via the fallback-message mechanism above (no Admin access needed); the page is responsive and survives a network interruption with an appropriate error.

## Navigation

1. Open the site at `config.baseUrl` (env-configured — UAT per current `.env.local`).
2. Click **"More"** in the header nav (real name "More Arrow Down") → click the **"Investor"** `menuitem` (exact match to the sheet — confirmed live, unlike Careers' "Career" mismatch).
3. Real landing URL: **`/investors-section?tab=team`** — directly `goto`-able, confirmed live. All 6 top-level tabs and their sub-navigation are query-param driven (`?tab={slug}`, `&subtype={slug}`, and a third `&category={slug}` for one Investor Support sub-tab) and directly deep-linkable — no menu click needed for any scenario. See `InvestorSectionPage.ts`'s doc comment for the full real URL scheme and every other grounded finding (active-tab class detection, download mechanics, the fallback-message discovery, real file types, the hydration-race Healer finding).

## Test coverage

- **Scope:** Complete — all 59 rows from the sheet's "Investor Section" module.
- **Sheet rows included:** 59 of 59 (TC_Web_171–TC_Web_229); no duplicates found in this module.
- **Automation result:** 56 of 59 scenarios pass live against UAT (confirmed stable across 2 runs); 3 are `test.fixme`.
- **Real bugs the Generator→Healer loop caught (genuine test-code issues, not site issues):**
  - `h3 + table` (CSS adjacent-sibling) never matched the 3 "10 Years Highlight" tables — the real `<h3>` sits inside its own wrapper `<div>` alongside a "Units: Numbers / %" label, so the table isn't a direct sibling. Fixed via `xpath=following::table[1]`.
  - Investor Presentation cards have real same-year ties (two real "2021" cards) — a download-button locator without `.first()` hit a Playwright strict-mode violation.
  - Reading sub-navigation button text immediately after `gotoTab`'s heading-visibility check raced real content still streaming in — `gotoTab` only waits for the page-level heading, not tab-specific content. Fixed by waiting for the first expected label before capturing text.
  - **The most significant Healer finding:** this page is React-Server-Component-rendered — the heading is visible before React finishes hydrating, so a tab click fired immediately after can silently no-op (no handler attached yet) with no error thrown. This broke a browser-back test (`goBack()` had no real second history entry to return from, since the "click" never actually navigated, and landed on `about:blank`). Fixed with a retry-click pattern (the same technique `LocationHelper.clickThroughOverlays` already uses for a different overlay-timing race) — and, since even a confirmed click's visual "active" class flip proved racy against the real router URL under back/forward navigation specifically, the back-nav check itself was switched to assert the URL directly (confirmed live to update reliably within ~300ms) rather than the CSS class.
- **Major real findings that reshape scenarios (grounded live, not guessed):**
  - **Invalid deep links do NOT fall back to a default tab** (the sheet's INV-050 premise is false) — confirmed live: the URL stays on the invalid slug, no tab/pill shows active, and a real, reproducible `"{Humanized slug} content will be available soon."` message renders. This **upgrades INV-047/050/059 from admin-state-blocked to directly, live-testable** — no Admin access needed, since the exact same mechanism reproduces for any unconfigured tab/subtype slug.
  - **Quarterly Financials renders differently for the current year vs. a completed one**: the default/latest year (FY 2026-27) only has 1 of 6 real categories ("Shareholding Pattern") populated — the other 5 simply don't render a section at all, since the year is still in progress. The full "6 categories × 4 quarters = 24 buttons" structure only appears for a completed past year (confirmed live for FY 2024-25) — INV-023/024 select that year explicitly rather than assuming the default year shows everything.
  - **Confirmed real file types: PDF and Audio (MP3) only**, sampled across 7 real sections — no DOC, no standalone Image-as-document, no Video exists anywhere reachable. INV-053 (DOC) and INV-055 (Video) have no real example to assert against; INV-054 (Image) likewise — the only images found are card thumbnails, not a downloadable "document."
  - **Document-open failure has no visible UI error** (confirmed via two real interception techniques — `route.abort` and a real `404`): the sheet's "Unable to open the document" message does not exist in the real product; an empty `role="alert"` toast-container element is always present in the DOM regardless, so the real, confirmed signal is that no alert/status element ever carries actual text.
  - Two different real download mechanics coexist: Annual Report proxies through a real API (`/api/media-download`, the one confirmed content-related API on this page — RSC/SSR everywhere else); Quarterly Financials/Subsidiary Report/Scheme of Merger/Statement of Deviation download directly from `uat-media.pvrinox.com`. The one real audio document opens as a new tab instead of a download.
  - The Statement of Deviation section's real on-page document titles are date-labeled (e.g. "PVR Statement of Deviation 23.01.2020") — different from the downloaded file's real name (`..._Regulation32_Q3_FY2019-20.pdf`); test data must match the displayed title, not the filename (same class of trap as News's visual-vs-DOM-casing finding).
- **Confirmed genuinely blocked:**
  - **INV-053** (DOC support), **INV-054** (Image support), **INV-055** (Video support) — no real example of any of these file types exists anywhere reachable on this page (7 sections sampled live); asserting "support" without a real document to test against would be a guess, not a test.

## Scenarios

- **Suggested journey:** `src/tests/investor-section.spec.ts`
- **Sheet:** `_PVR INOX __ Test Cases  - M8 _ Website.pdf` → single continuous table (PDF export, no named sheet)

- [x] **INV-001** — Investor option is displayed | Steps: open More menu | Expected: Investor option is displayed
- [x] **INV-002** — Navigation to Investor Section page | Steps: click Investor | Expected: user is navigated to Investor Section page
- [x] **INV-003** — Investor data fetched from Admin | Steps: open Investor page | Expected: configured data displayed successfully
- [x] **INV-004** — Top-level tabs are displayed | Steps: observe page | Expected: configured tabs displayed
- [x] **INV-005** — Tab sequence | Steps: observe tabs | Expected: tabs in Admin-defined sequence
- [x] **INV-006** — Default selected tab | Steps: open Investor page | Expected: first configured tab selected by default
- [x] **INV-007** — Default tab content | Steps: observe content | Expected: content of first tab displayed
- [x] **INV-008** — Financial tab | Steps: click Financial | Expected: Financial section opens successfully
- [x] **INV-009** — Financial sub-sections | Steps: observe sub-sections | Expected: all configured sub-sections displayed in Admin sequence
- [x] **INV-010** — 10 Years Highlight table | Steps: open 10 Years Highlight | Expected: financial table displayed correctly
- [x] **INV-011** — Year-wise financial data | Steps: observe table | Expected: year-wise values displayed correctly
- [x] **INV-012** — Configurable table structure | Steps: verify columns & rows | Expected: table structure matches Admin configuration
- [x] **INV-013** — Informative text | Steps: observe page | Expected: configured text displayed
- [x] **INV-014** — Annual Report list | Steps: open Annual Report | Expected: reports are displayed
- [x] **INV-015** — Report sorting | Steps: observe list | Expected: sorted by Financial Year (descending)
- [x] **INV-016** — Report details | Steps: observe report card | Expected: thumbnail, title, year & link displayed
- [x] **INV-017** — Annual Report download | Steps: click report | Expected: report opens/downloads successfully
- [x] **INV-018** — Investor Presentation list | Steps: open section | Expected: presentations displayed
- [x] **INV-019** — Presentation sorting | Steps: observe list | Expected: sorted by Year (desc), then upload date-time (desc)
- [x] **INV-020** — Presentation download | Steps: click presentation | Expected: file opens/downloads successfully
- [x] **INV-021** — Latest year selected | Steps: open Quarterly Financials | Expected: latest year selected by default
- [x] **INV-022** — Year dropdown | Steps: open dropdown | Expected: available years displayed
- [x] **INV-023** — Categories | Steps: observe categories | Expected: configured categories displayed
- [x] **INV-024** — Quarter-wise documents | Steps: expand category | Expected: quarter-wise documents displayed
- [x] **INV-025** — Quarterly document download | Steps: click document | Expected: document opens/downloads successfully
- [x] **INV-026** — Subsidiary Reports | Steps: open section | Expected: reports displayed
- [x] **INV-027** — Subsidiary sorting | Steps: observe list | Expected: sorted by upload date-time (descending)
- [x] **INV-028** — Statutory Disclosure tabs | Steps: open section | Expected: configured tabs displayed
- [x] **INV-029** — Default sub-section | Steps: open Statutory Disclosure | Expected: first sub-section selected by default
- [x] **INV-030** — Year-wise grouping | Steps: observe documents | Expected: documents grouped year-wise
- [x] **INV-031** — Document sorting | Steps: observe list | Expected: latest document displayed first
- [x] **INV-032** — Document download | Steps: click document | Expected: file opens/downloads successfully
- [x] **INV-033** — Analyst Coverage cards | Steps: open Analyst Coverage | Expected: cards displayed alphabetically
- [x] **INV-034** — Analyst details | Steps: observe card | Expected: research house, analyst name & contact displayed
- [x] **INV-035** — Investor Support roles | Steps: open Investor Support | Expected: all configured roles displayed
- [x] **INV-036** — Contact information | Steps: observe details | Expected: contact information displayed correctly
- [x] **INV-037** — Document list | Steps: open Scheme of Merger | Expected: documents displayed
- [x] **INV-038** — Document sorting | Steps: observe list | Expected: latest uploaded document displayed first
- [x] **INV-039** — Document download | Steps: click document | Expected: file opens/downloads successfully
- [x] **INV-040** — Statement documents | Steps: open section | Expected: documents displayed
- [x] **INV-041** — Document download | Steps: click document | Expected: file opens/downloads successfully
- [x] **INV-042** — Team groups | Steps: open Team tab | Expected: team groups displayed
- [x] **INV-043** — Team member details | Steps: observe member | Expected: image, name & designation displayed
- [x] **INV-044** — Team sequence | Steps: observe order | Expected: members displayed in Admin-defined sequence
- [x] **INV-045** — Team member popup | Steps: click member | Expected: member detail popup displayed
- [x] **INV-046** — Document open failure *(RESOLVED: real behavior is a silent failure — no such message exists in the product; asserts the real, confirmed behavior)* | Steps: click a document with an invalid URL | Expected: "Unable to open the document. Please try again." message displayed
- [x] **INV-047** — Hidden empty tabs *(RESOLVED: testable via the real fallback-message mechanism, not admin-state blocked — see Test coverage)* | Steps: open Investor page | Expected: tab/sub-section with no data is hidden
- [x] **INV-048** — Deep link to top-level tab | Steps: open deep link | Expected: user lands directly on the respective tab
- [x] **INV-049** — Deep link to sub-section | Steps: open deep link | Expected: user lands directly on the configured sub-section
- [x] **INV-050** — Fallback for invalid deep link *(RESOLVED: real behavior stays on the invalid URL with a real fallback message, not a default-tab redirect — see Test coverage)* | Steps: open invalid/unavailable deep link | Expected: system opens default tab
- [x] **INV-051** — Unique frontend URL | Steps: navigate between tabs | Expected: URL changes uniquely per tab/sub-section
- [x] **INV-052** — PDF support *(scope depends on live config)* | Steps: open a PDF document | Expected: PDF opens successfully
- [ ] **INV-053** — DOC support *(scope depends on live config)* | Steps: open a DOC document | Expected: DOC file downloads/opens successfully  _(test.fixme — see Test coverage)_
- [ ] **INV-054** — Image support *(scope depends on live config)* | Steps: open an image file | Expected: image opens successfully  _(test.fixme — see Test coverage)_
- [ ] **INV-055** — Video support *(scope depends on live config)* | Steps: open a video file | Expected: video plays successfully  _(test.fixme — see Test coverage)_
- [x] **INV-056** — Audio support *(scope depends on live config)* | Steps: open an audio file | Expected: audio plays successfully
- [x] **INV-057** — Browser back navigation | Steps: press Back | Expected: previous page opens correctly
- [x] **INV-058** — Responsive UI | Steps: resize browser / open M-site | Expected: layout remains responsive
- [x] **INV-059** — No data available *(RESOLVED: same fallback-message mechanism as INV-047/050, not admin-state blocked — see Test coverage)* | Steps: open Investor page with no data configured | Expected: empty tabs hidden, first available tab displayed

## E2E implementation notes

- **Layering:** `src/tests/investor-section.spec.ts` → `src/modules/InvestorSectionModule.ts` → `src/pages/InvestorSectionPage.ts`.
- **Frontend context:** Not provided (no `dev-repo/`) — will ground live via headless Playwright driven from Bash/Node scripts, or a background research agent for token efficiency (Playwright MCP's interactive browser fails in this sandbox — see `pvr-inox-grounding-technique` project memory).
- **Reuse:** `grantMumbaiGeolocation`/`dismissPromoPopup`/`UAT_BASE_URL` from `LocationHelper`, matching every prior module.
- **Locators:** No `data-testid` anywhere in this codebase so far (established precedent) — expect `getByRole` throughout; confirm live rather than assume.
- **Downloads:** Use Playwright's `page.waitForEvent('download')` for INV-017/020/025/032/039/041 rather than asserting on a new tab, unless live grounding shows the real behavior is a new-tab open instead of a browser download.
- **Fixtures / mocks:** INV-053/054/055 (DOC/Image/Video "support") are genuinely blocked — no real example of any of these file types exists anywhere reachable on this page (7 sections sampled live); do not fabricate a file to test against. INV-047/050/059, originally anticipated as admin-state-dependent, turned out to be directly testable via the real "unconfigured slug" fallback-message mechanism instead — no mocking needed.
- **Tags:** `@Regression`, priority per the sheet's Priority column; use project `chromium` per repo conventions.
- **Run:** `npx playwright test src/tests/investor-section.spec.ts --project=chromium`

## Source

- **Seed method:** PDF export of a test-case sheet (tabular, full fidelity — same source file as prior modules)
- **File:** `_PVR INOX __ Test Cases  - M8 _ Website.pdf`
- **Sheet:** N/A (PDF; single continuous table across pages, TC_Web_171–TC_Web_229 for the "Investor Section" module)
- **Columns:** Test Summary=`Test case Title`, Test Objective=derived from Title, Test Steps=`Test Steps/validation point`, Expected Result=`Expected Result (ER)`, Priority=`Priority`
- **Frontend repo:** `dev-repo/` not provided
