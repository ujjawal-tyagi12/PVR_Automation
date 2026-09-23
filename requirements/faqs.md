# Playwright: FAQs — Accordion-style FAQ list

## Acceptance criteria

- The FAQs page (`/faq`) loads a list of Admin-configured questions in accordion format, all collapsed by default.
- Clicking a question expands it and shows its answer; clicking a different question collapses the previously-open one and expands the new one (only one FAQ is ever open at a time). Clicking an already-open question toggles it closed.
- Keyboard users can reach and expand/collapse a question via Tab + Enter.
- Long answers display in full without truncation; formatting (bullets, rich text, special characters) renders as configured.
- The page is responsive across Web and M-site, survives refresh (returning to the default collapsed state) and browser-back, loads within acceptable time, and a network interruption while loading surfaces an appropriate error.

## Navigation

Real route confirmed live: **`/faq`** (singular — `/faqs` is a blank generic shell, same class of guessed-vs-real-route gap as About Us/Legal Content).

No entry point exists in the footer or the header "More" dropdown (the same 15-item menu grounded for About Us, which does not include FAQs). The real entry point is the **guest-accessible** Account dialog: click the header **"User Icon"** → a real `role="dialog"` opens ("Account" heading, buttons "Login" / "Customer Experience" / "Settings") → click **"Settings"** → the same dialog transitions in-place to a Content section listing **"Privacy Policy"** / **"Terms & Conditions"** / **"Terms of Use"** / **"FAQs"** as real buttons → click **"FAQs"** → closes the dialog and navigates to `/faq`.

**Corrected 2026-09-08:** an earlier grounding pass wrongly assumed this needed a logged-in session (hence a login-based plan using `RegisterLoginModule`). Re-grounded live, twice: the identical flow works for a plain guest, no login at all — see the [[settings-panel-content-nav]] project memory. (Also found in that same pass, unrelated to FAQs but worth flagging: the `otp-flow-automation-solved` OTP bypass this repo relied on for *other* login-dependent flows has stopped working as of today — real `400 INVALID_OTP` rejection — see that memory.) Content scenarios still use direct `/faq` navigation, matching the established repo pattern; only FAQ-001/002 exercise the dialog itself.

## Test coverage

- **Scope:** Complete — all 29 rows from the sheet's "FAQs" module.
- **Sheet rows included:** 29 of 29 (TC_Web_97–TC_Web_125); no duplicates found.
- **Automation result:** 25 of 29 scenarios pass live against UAT (confirmed stable across 2 runs); 4 are `test.fixme`.
- **Real data grounded live (2026-09-08):** UAT has exactly **3 real FAQs**, and the full accordion mechanic was verified end-to-end in a live trace (default collapsed → expand → auto-collapse-on-switch → toggle-closed-on-repeat-click), including real keyboard (Tab+Enter) support:
  - Q: "Can tickets be cancelled immediately?" → A: "Tickets can be cancelled 10 mins after booking confirmation."
  - Q: "When will the refund be processed?" → A: "Refund will be processed within 7 working days."
  - Q: "5 Simple Steps to Buy Tickets Online." → A: a long multi-step booking guide (real long-answer content for FAQ-014).
- No `aria-expanded` exists on any question button — expand/collapse must be asserted via answer-text visibility, not ARIA state (same adaptation as About Us's tab "selected" state).
- No distinct content-fetching API exists (same generic site-wide calls as About Us/Legal Content: `/api/auth/session`, `/api/get-city-list`, `/api/detect-city`) — server-rendered, so network-interruption uses the same `context.setOffline()` adaptation as `AboutUsModule.ts`'s ABT-050 / `LegalContentModule.ts`'s LGL-041.
- **Confirmed genuinely blocked (checked thoroughly, not just once):**
  - **FAQ-017** (hyperlinks in answer) — checked all 3 real answers individually; zero real links in any of them.
  - **FAQ-024** (image/media in answer) — checked all 3 real answers; only generic header/widget chrome icons render regardless of which FAQ is open, no answer-specific media exists.
  - **FAQ-018** (empty state) / **FAQ-019** (updated content) — both require an Admin Panel data state this suite can't toggle from the UI (same category proven unfixable for About Us's ABT-010/036/049 — a genuine RSC-payload interception was attempted there and found too fragile/architecturally unsound to rely on; same site, same limitation, not re-attempted here).
- **FAQ-015** (scrolling within FAQs) and **FAQ-028** (large number of FAQs, sheet says >50) are adapted: only 3 real FAQs exist, not enough to force genuine scrolling or a performance-relevant volume — asserted as "doesn't break with the real, small dataset" rather than the sheet's literal volume assumption.

## Scenarios

- **Suggested journey:** `src/tests/faqs.spec.ts`
- **Sheet:** `_PVR INOX __ Test Cases  - M8 _ Website.pdf` → single continuous table (PDF export, no named sheet)

- [x] **FAQ-001** — FAQs option is displayed | Steps: open Settings panel Content section | Expected: FAQs option is displayed
- [x] **FAQ-002** — Navigation to FAQs page | Steps: click FAQs | Expected: user is navigated to FAQs page successfully
- [x] **FAQ-003** — FAQs page loads successfully | Steps: observe page loading | Expected: page loads without errors
- [x] **FAQ-004** — FAQ content fetched from Admin Panel | Steps: open FAQs page | Expected: configured FAQs are displayed
- [x] **FAQ-005** — FAQ list is displayed | Steps: open FAQs page | Expected: list of FAQs is displayed
- [x] **FAQ-006** — FAQs displayed in accordion format | Steps: observe FAQ list | Expected: FAQs displayed in accordion format
- [x] **FAQ-007** — All FAQ questions collapsed by default | Steps: open FAQs page | Expected: all questions collapsed by default
- [x] **FAQ-008** — Expanding a FAQ | Steps: click any FAQ question | Expected: selected FAQ expands and displays the answer
- [x] **FAQ-009** — Answer content | Steps: observe answer | Expected: correct configured answer is displayed
- [x] **FAQ-010** — Only one FAQ remains expanded | Steps: click another FAQ | Expected: newly selected FAQ expands, previous one collapses
- [x] **FAQ-011** — Switching between FAQs | Steps: expand multiple FAQs one by one | Expected: only one remains expanded at any time
- [x] **FAQ-012** — Collapsing previously expanded FAQ | Steps: click another FAQ | Expected: previous FAQ collapses automatically
- [x] **FAQ-013** — FAQ display sequence | Steps: observe FAQ list | Expected: FAQs displayed in Admin-configured sequence
- [x] **FAQ-014** — Long answer display | Steps: expand the long-answer FAQ | Expected: complete answer displayed without truncation
- [x] **FAQ-015** — Scrolling within FAQs page *(adapted — only 3 real FAQs)* | Steps: scroll page | Expected: user can scroll smoothly
- [x] **FAQ-016** — Special characters and formatting | Steps: expand FAQ | Expected: formatting displayed correctly
- [ ] **FAQ-017** — Hyperlinks in FAQ answer *(blocked — no real link in any answer)* | Steps: click hyperlink | Expected: correct destination opens  _(test.fixme — see Test coverage)_
- [ ] **FAQ-018** — Behavior when no FAQs are configured *(admin-state dependent)* | Steps: open FAQs page | Expected: appropriate empty state displayed  _(test.fixme — see Test coverage)_
- [ ] **FAQ-019** — Updated FAQ content *(admin-state dependent)* | Steps: refresh FAQs page | Expected: latest content displayed  _(test.fixme — see Test coverage)_
- [x] **FAQ-020** — Page responsiveness | Steps: resize browser / open M-site | Expected: layout responsive without UI issues
- [x] **FAQ-021** — Page refresh behavior | Steps: refresh browser/page | Expected: page reloads with default collapsed state
- [x] **FAQ-022** — Browser back navigation | Steps: click browser Back | Expected: user redirected to previous page
- [x] **FAQ-023** — Internet interruption | Steps: disconnect internet, open FAQs page | Expected: appropriate error message displayed
- [ ] **FAQ-024** — FAQ answer with image/media *(blocked — no content image in any answer)* | Steps: expand FAQ | Expected: image/media displayed correctly  _(test.fixme — see Test coverage)_
- [x] **FAQ-025** — FAQ answer with rich text | Steps: expand FAQ | Expected: rich text formatting displayed correctly
- [x] **FAQ-026** — Accessibility using keyboard | Steps: Tab + Enter | Expected: can expand/collapse using keyboard
- [x] **FAQ-027** — Repeated tapping on same FAQ | Steps: tap same FAQ multiple times | Expected: no UI issue or crash (toggles closed)
- [x] **FAQ-028** — Large number of FAQs *(adapted — only 3 real FAQs, not >50)* | Steps: open FAQs page | Expected: all FAQs load without performance issues
- [x] **FAQ-029** — UI consistency | Steps: observe fonts/spacing/alignment | Expected: UI matches design specs across Web/M-site

## E2E implementation notes

- **Layering:** `src/tests/faqs.spec.ts` → `src/modules/FaqsModule.ts` → `src/pages/FaqsPage.ts`.
- **Frontend context:** Not provided (no `dev-repo/`) — grounded live via headless Playwright instead (Playwright MCP fails in this sandbox — see `pvr-inox-grounding-technique` project memory).
- **Reuse:** `RegisterLoginModule`/`RegisterLoginPage` for the Settings-panel navigation scenario (FAQ-001/002) — do not reimplement login. `grantMumbaiGeolocation`/`dismissPromoPopup`/`UAT_BASE_URL` from `LocationHelper` for direct `/faq` navigation, matching `AboutUsModule.ts`/`LegalContentModule.ts`.
- **Locators:** FAQ question buttons have no `aria-expanded`/`data-testid` — match by `getByRole('button', { name: <question text>, exact: true })`; assert expand/collapse via the answer text's visibility, not ARIA state.
- **Fixtures / mocks:** FAQ-018/019 are admin-state dependent — do not attempt RSC-payload mocking (already proven fragile/unsound for this app's architecture via About Us's ABT-010 investigation); defer to manual QA unless Admin access becomes available.
- **Network interruption:** FAQ-023 via `context.setOffline(true)` before `page.goto()`, same adaptation as `AboutUsModule.ts`'s ABT-050.
- **Tags:** `@Regression`, priority per the sheet's Priority column (mostly High/Critical for the core accordion mechanics); use project `chromium` per repo conventions.
- **Run:** `npx playwright test src/tests/faqs.spec.ts --project=chromium`

## Source

- **Seed method:** PDF export of a test-case sheet (tabular, full fidelity — same source file as About Us/Legal Content)
- **File:** `/home/user/Documents/_PVR INOX __ Test Cases  - M8 _ Website.pdf`
- **Sheet:** N/A (PDF; single continuous table across pages, TC_Web_97–TC_Web_125 for the "FAQs" module)
- **Columns:** Test Summary=`Test case Title`, Test Objective=derived from Title, Test Steps=`Test Steps/validation point`, Expected Result=`Expected Result (ER)`, Priority=`Priority`
- **Frontend repo:** `dev-repo/` not provided
