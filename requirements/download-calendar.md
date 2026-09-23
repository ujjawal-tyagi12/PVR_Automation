# Playwright: Download Calendar — date-range PDF export from the Coming Soon page

> **Seed note (2026-09-06):** this is a NEW module with no prior ticket to reconcile — unlike
> `coming-soon.md`/`curated-shows.md`/`movie-alerts.md`, there is no earlier `M6-website.pdf`- or
> `TC_App`-sourced version to supersede. This ticket is written directly from a freshly pasted raw
> sheet excerpt, `TC_Web_196–210` (`TC_Web_211` was a blank row in the source sheet, excluded), the
> same `TC_WEB` numbering scheme every other already-automated Web module in this suite was built
> from. All `DLC-001–015` scenario IDs below are new and map 1:1 to `TC_Web_196–210` — no merges,
> no exclusions.

## Acceptance criteria

- "Download Calendar" is a real control on the **Coming Soon page itself** (`/coming-soon`), sitting
  beside the search bar above the Year/Month/Week filter bar — not a separate route. This confirms
  the sheet's own implicit hint: `TC_Web_205`'s expected result names a "Coming Soon Movies" PDF
  heading, the exact heading text the live Coming Soon page itself uses.
- Clicking it opens a dialog with `From`/`To` date fields (each a real calendar popover) and a
  `Download` button. Selecting a valid range and downloading produces a genuine, client-rendered
  PDF (a real `%PDF-1.3` binary, backed by a real, unmocked `POST /api/calendar-html` call) listing
  the matching Coming Soon movies with poster, name, cast, genre, and language, grouped by
  month/week, with a "Time Period" line showing the selected range.
- The date pickers disable past dates (and today itself) and cap the selectable window to roughly
  one year from today's real date (not from the selected `From` date). A Coming Soon quick-genre
  chip selected on the page **before** opening the dialog narrows the downloaded content to match.
- A date range with no matching movies shows a real "No Movies Found" empty state; a genuine
  backend failure (mocked, since none was reproducible live) shows a real inline error message
  without closing the dialog.

## Navigation

1. Direct URL: `https://inox-uat-web.pvrinox.com/coming-soon`, Mumbai-All, with geolocation granted
   — matches this repo's established direct-URL pattern (`ComingSoonPage.ts`, `OffersPage.ts`,
   `CuratedShowsPage.ts`). Reuses `ComingSoonModule.gotoComingSoon`'s exact navigation shape (own
   copy in `DownloadCalendarModule.gotoComingSoon`, since this Page is self-contained — see E2E
   implementation notes).
2. On the Coming Soon page: click the "Download Calendar" button (top-right, beside the search
   bar) to open the dialog; click "From"/"To" to open the real date-picker popover; optionally
   select a quick genre chip on the main page **before** opening the dialog to narrow the download.

## Test coverage

- **Scope: Complete** — all 15 rows from the source sheet (`TC_Web_196–210`), mapped 1:1 to
  `DLC-001–015` (no merges, no exclusions).
- **Final split: 15 real, automated scenarios, all live-grounded — 0 `test.fixme`.** Unlike the
  prior three modules in this suite, every scenario here turned out to be reproducible, either
  live or via a single, clearly-flagged `page.route` mock for the one case (`DLC-009`) that
  genuinely needed a data/error shape not obtainable live.
- **Real findings that corrected the sheet's own assumptions** (documented inline, not silently
  reinterpreted):
  - **`TC_Web_200` ("select same date → Calendar downloaded successfully") does NOT hold live.**
    Grounded via a full popover DOM dump: once a `From` date is chosen, that exact day is itself
    `disabled` in the `To` picker (confirmed via `element.disabled`, not just a visual/CSS cue) —
    the real constraint is `To` strictly after `From`, never `To == From`. `DLC-005` asserts the
    real behavior instead of the sheet's unverified assumption.
  - **`TC_Web_201`/`TC_Web_203` ("Validation message displayed" / "Button disabled until valid
    input") collapse into ONE real mechanism, not two.** There is no separate inline validation
    message for the no-dates-selected case — the `Download` button is a native `disabled`
    `<button>` until both dates are chosen, confirmed via the DOM `disabled` attribute (not just
    CSS opacity). `DLC-006` and `DLC-008` both assert this same real mechanism from two angles
    (a static disabled check, and a disabled→enabled transition), matching the sheet's own
    two-row split without inventing a second distinct UI.
  - **The downloaded "PDF" has NO extractable text layer** — a real, load-bearing environment
    finding for `TC_Web_205–207`. A genuine download was captured (a real `%PDF-1.3` binary, 2
    pages, ~800 KB) and fed through both `pdf-parse` and poppler's industry-standard `pdftotext`;
    both returned completely empty text, despite the file containing real `/Font`/`BT`/`Tj`
    (text-drawing) operators — a known limitation of client-rendered PDFs (e.g.
    `html2canvas`+`jsPDF`-style pipelines) that embed subset-font glyphs without a `ToUnicode`
    CMap. Since no honest tool can read the PDF's text, `DLC-010/011/012` verify the real, unmocked
    `POST /api/calendar-html` response body instead — confirmed to be the exact HTML document the
    PDF is rendered from (same heading, same per-movie name/genre/language, same "Time Period"
    line) — rather than adding a heavier OCR dependency to read a rasterized page image. **No
    PDF-parsing dependency was added to this repo** — see E2E implementation notes for the full
    reasoning trail (a `pdf-parse` install was tried, proved useless against this specific PDF, and
    was cleanly reverted).
  - **`TC_Web_204`'s "API failure" and `TC_Web_208`'s "no movie scenario" are two genuinely
    different, distinguishable real states**, not the same empty-state UI wearing two labels: a
    real (unmocked) near-term date range with zero matching movies returns a real `404`
    (`NO_COMING_SOON_MOVIES_FOUND`) and the app CLOSES the date-picker dialog, opening a separate
    "No Movies Found" dialog with a "Select Another Date" button (`DLC-013`). A genuine backend
    failure (mocked via `page.route`, since no real 5xx was reproducible live) instead KEEPS the
    same date-picker dialog open and renders a real inline message, "Unable to download calendar.
    Please try again later." (`DLC-009`) — confirmed via two separate live/mocked runs that
    produced visibly different UI outcomes.
  - **The 1-year-max window is anchored to today's real date, not to the selected `From` date** —
    confirmed live: regardless of which `From` date was chosen, the `To` picker's year `<select>`
    only ever offers exactly two years (the current one and the next), never a third. `DLC-004`
    asserts this structurally (exactly 2 year options) rather than pinning to a specific cutoff
    date, since "today" is a moving target between grounding and any later test run.
- **Environment finding (grounded 2026-09-06 against UAT):** the real `POST /api/calendar-html`
  request body is `{ lat, long, userLocation, fromDate, toDate, theme, movieIds, cityId, filter? }`
  — `movieIds` is the full set of currently-listed Coming Soon movie IDs, and `filter` (present
  only when a quick-genre chip is active) is `{ genre: string[] }`; the backend applies the actual
  `fromDate`/`toDate` window server-side and returns `404 NO_COMING_SOON_MOVIES_FOUND` if nothing
  in that window matches. The 200 response body is `{ statusCode, messageType, data: { html } }`,
  a complete standalone HTML document.
- **Date-drift safety note:** most scenarios here select dates dynamically (the first real
  selectable day the picker itself reports, read live off the DOM's `disabled` attributes) rather
  than a hardcoded day number, precisely because this sandbox's clock keeps advancing between
  grounding and any later run — a hardcoded "day 10" valid at grounding time could silently become
  a disabled past date later. Only the scenarios that need the specific real Dec 2026 movie release
  week (`DLC-001` uses dynamic dates instead; `DLC-007`/`DLC-010`/`DLC-011`/`DLC-012`/`DLC-015`
  hardcode `Dec 25–31`) accept that same live-data-drift risk `ComingSoonModule.ts` already
  documents for its own hardcoded movie names.

## Scenarios

- **Suggested journey:** `src/tests/download-calendar.spec.ts`
- **Sheet:** pasted `TC_Web_196–210` raw excerpt (tab-separated, columns: ID / Module (first row
  only) / Title / Precondition / Steps / Expected / Notes) — see Source section.

- [x] **DLC-001** — Download with a valid date range produces a real PDF | `@P0 @Smoke`
- [x] **DLC-002** — Date picker UI opens on clicking From | `@P1 @Regression`
- [x] **DLC-003** — Past dates (and today) are disabled in the picker | `@P1 @Regression`
- [x] **DLC-004** — Selection is restricted to a ~1-year max window | `@P2 @Regression`
- [x] **DLC-005** — Same From/To date is not selectable | `@P2 @Regression` (reinterpreted — real
  behavior contradicts the sheet; see Test coverage note)
- [x] **DLC-006** — Download stays disabled until both dates are chosen (real "validation") |
  `@P1 @Regression` (reinterpreted — no separate validation message exists)
- [x] **DLC-007** — A Coming Soon genre filter narrows the downloaded content | `@P0 @Regression`
- [x] **DLC-008** — Download button state (disabled then enabled) | `@P1 @Regression`
- [x] **DLC-009** — API failure shows a real inline error message (mocked) | `@P1 @Regression`
- [x] **DLC-010** — Downloaded content has the "Coming Soon Movies" heading | `@P0 @Regression`
  (verified via the real `calendar-html` response, not PDF bytes — see Test coverage note)
- [x] **DLC-011** — Downloaded content has movie name, genre, and language | `@P0 @Regression`
  (same verification method as DLC-010)
- [x] **DLC-012** — Downloaded content has the selected date range | `@P0 @Regression` (same
  verification method as DLC-010)
- [x] **DLC-013** — No-movie-match date range shows the real "No Movies Found" state |
  `@P1 @Regression`
- [x] **DLC-014** — From/To fields are visually aligned in the dialog | `@P2 @Regression`
- [x] **DLC-015** — Multiple downloads work without a crash | `@P1 @Regression`

## E2E implementation notes

- **Layering:** `src/tests/download-calendar.spec.ts` → `src/modules/DownloadCalendarModule.ts` →
  `src/pages/DownloadCalendarPage.ts`.
- **Frontend context:** No `dev-repo/` provided. Grounded via read-only + `page.route`-mocked
  headless Playwright against UAT (`inox-uat-web.pvrinox.com`, Mumbai-All), 2026-09-06. Scratchpad
  `ground-download-calendar-*.js` scripts hold the raw diagnostics this file's tests and
  `DownloadCalendarPage.ts`/`DownloadCalendarModule.ts`'s doc comments build on.
- **Why a new Page object, self-contained rather than composing `ComingSoonPage`:** this repo's
  rule is one Page object per logical screen/component, not strictly one per route — "Download
  Calendar" is its own logical component (a single dialog-driven workflow) even though it lives on
  the Coming Soon page's DOM, so it earns its own `DownloadCalendarPage.ts`/
  `DownloadCalendarModule.ts` pair. It does NOT import `ComingSoonPage`/`ComingSoonModule` at all —
  every locator/action it needs (the trigger button, the quick genre chips, the dialog, the
  popover) lives in the one page it's grounded against, so composing the other module would add a
  cross-module dependency for zero real reuse benefit. `DownloadCalendarModule.gotoComingSoon`
  duplicates `ComingSoonModule.gotoComingSoon`'s exact navigation shape (own copy, not imported) —
  an intentional, minimal duplication over adding a coupling between two otherwise-independent
  modules.
- **The PDF-parsing dependency question:** the task considered adding `pdf-parse` (a lightweight,
  well-established PDF-text-extraction library) specifically for `TC_Web_205–207`. It WAS installed
  (`npm install --save-dev pdf-parse@^1.1.4`) and tested against a real captured download first —
  but it returned completely empty text for this specific PDF (confirmed independently via
  poppler's `pdftotext` too, ruling out a `pdf-parse`-specific bug). Since the dependency provided
  zero honest verification value here, it was cleanly reverted (`npm uninstall pdf-parse`) and
  `package.json`/`package-lock.json` are unchanged from before this task. Content verification
  instead uses the real, unmocked `POST /api/calendar-html` network response — the exact HTML the
  PDF renders from, captured live via `page.waitForResponse`, the same "capture a real Playwright
  event" shape `ComingSoonModule.expectMicDeniedAlertShown`'s dialog race already establishes in
  this repo.
- **Locators:** the "Download Calendar" trigger has the same "icon alt + label" accessible-name
  quirk `ComingSoonPage.ts` documents for its own "Filter" trigger (the img's `alt="Download Icon"`
  merges with the button's text into one combined accessible name) — targeted via
  `locator('button').filter({ hasText: 'Download Calendar' })`, not `getByRole`. The main dialog
  and the date-picker popover are BOTH real `role="dialog"` elements coexisting in the DOM at
  once — disambiguated via `hasText`/`hasNotText` on the main dialog's fixed description text
  ("Select dates to download your calendar"), the same disambiguation shape
  `ComingSoonPage.filterDialog` already uses for its own modal. Day-cell state (`disabled`) is read
  via a direct DOM `evaluate` on the popover rather than `getByRole`, since date-relationship
  constraints (e.g. "same as `From`") are expressed via the real `disabled` attribute, not a
  distinguishable accessible name.
- **Fixtures / mocks:** `DLC-009` is the only scenario needing `page.route` (a real backend failure
  was not reproducible live) — same fault-injection shape `MovieAlertsModule.mockSaveAlertFailure`
  already establishes in this repo. Every other scenario runs against real, live UAT data/behavior,
  including the "no movies found" empty state (`DLC-013`), which is a genuine unmocked 404, not a
  simulated one.
- **Tags:** `@Smoke` on `DLC-001` (the core "does a real download happen at all" path);
  `@Regression` elsewhere. `@P0` for the core download/content/filter-propagation paths, `@P1` for
  secondary picker/button-state/error paths, `@P2` for the cosmetic alignment check and the
  ordering-adjacent 1-year-max/same-date checks — inferred consistent with the equivalent-role
  scenarios in `coming-soon.md`/`curated-shows.md` (no explicit Priority column in this pasted
  excerpt).
- **Run:** `npx playwright test src/tests/download-calendar.spec.ts --project=chromium`

## Source

- **Seed method:** raw sheet excerpt pasted directly into the task (tab-separated rows,
  `TC_Web_196–210`; `TC_Web_211` was a blank row in the source sheet, excluded) — this is a NEW
  module with no prior ticket/ID scheme to reconcile against, unlike `coming-soon.md`/
  `curated-shows.md`/`movie-alerts.md`.
- **File:** none saved to disk — pasted excerpt only, matching the citation style of every other
  `TC_WEB`-numbered module in this suite (see `coming-soon.md`'s own Source section).
- **Sheet:** N/A — single "Website" test-case excerpt, "Download Calendar" module section.
- **Columns:** ID, Module (first row only), Title, Precondition, Steps, Expected Result, Notes.
- **Frontend repo:** not provided — grounded instead against live UAT
  (`inox-uat-web.pvrinox.com`).
