# Playwright: Corporate Booking — City/Cinema/Show request form + OTP submission

## Acceptance criteria

- The Corporate Booking page is reachable via the header "More" dropdown's **"Corporate Booking"** item (label confirmed live in the real menu — see `more-menu-real-labels` project memory) and shows a configured banner (or a default placeholder when none is configured).
- The form's City field is pre-filled from the user's selected city but remains editable; the City and Cinema dropdowns are searchable, City sorted alphabetically and Cinema sorted nearest-first.
- The date picker only allows dates 7+ days out; current/previous dates are disabled.
- Movie Type toggles between "Now Showing" (a real, Admin-sequenced movie list) and "Others"; selecting a movie populates the field.
- Number of Seats accepts 50–999 only — 49 and 1000 are both rejected with validation.
- For a logged-in user, Name/Phone/Email are pre-filled and remain editable; F&B Requirement is a Yes/No field; Other Requirements is capped at 500 characters; Copy to Self is a checkbox.
- Clicking Get OTP sends an OTP to the phone number; a correct OTP completes submission, an incorrect OTP shows an error and allows retry.
- A successful submission shows a configured success popup and (per the sheet) notifies a region-mapped HR recipient, plus the user if Copy to Self was checked — **these two email-delivery checks are verified by asserting the mocked submission request carries the correct recipient/flag, not by checking a real inbox** (see Test coverage — no real request will be sent to production).
- Leaving mandatory fields blank blocks submission with validation messages; invalid email/phone formats are rejected; a network failure during submission shows an appropriate error; the page is responsive on Web and M-site.

## Navigation

1. Open the site at `config.uatBaseUrl` (`https://uat-web.pvrinox.com`, per `otp-flow-automation-solved` project memory).
2. Dismiss the "Enable Location" modal (Cancel) and the city-selection drawer (select **Mumbai-All**, matching every other module's convention) if either appears on a fresh session — both were observed blocking header interaction during this ticket's grounding pass.
3. Click **"More"** in the header nav → click the **"Corporate Booking"** `menuitem` (label confirmed live per `more-menu-real-labels`; exact route/URL not yet confirmed — see E2E implementation notes, TODO(heal)).

## Test coverage

- **Scope:** Complete — all 38 of the sheet's "Corporate Booking" rows.
- **Sheet rows included:** 38 of 38 (TC_Web_290–TC_Web_327). None excluded.
- **Not yet automated/grounded** — this ticket was seeded from the sheet only; no implementation or live grounding of the actual form fields has happened yet (an attempt to click through to this page during ticket-writing was blocked by the Enable Location modal — see Navigation). Treat every locator in the eventual `CorporateBookingPage.ts` as a guess needing live confirmation, consistent with `pvr-inox-grounding-technique` project memory.
- **Deliberate scope adaptation:** TC_Web_320 (HR email notification) and TC_Web_321 (Copy to Self email) describe checking real email delivery. Per the user's explicit, standing instruction not to create data or trigger real side effects in the shared UAT environment, the Get OTP → Verify → Submit chain must be **mocked via `page.route()`** (same pattern as `src/utils/OtpMock.ts`), and these two scenarios verify the *mocked request payload* (correct recipient mapping / correct flag), not a real inbox. No real corporate-booking request should ever reach the real backend from this suite.

## Scenarios

- **Suggested journey:** `src/tests/corporate-booking.spec.ts`
- **Source file:** `_PVR INOX __ Test Cases .xlsx` → sheet `M8 | Website`

- [ ] **CB-001** — Corporate Booking option displayed | Steps: open More menu | Expected: option is displayed
- [ ] **CB-002** — Navigation to Corporate Booking page | Steps: click Corporate Booking | Expected: user navigates to Corporate Booking page
- [ ] **CB-003** — Banner image | Steps: open page with banner configured | Expected: configured banner displayed
- [ ] **CB-004** — Default placeholder banner | Steps: open page with no banner configured | Expected: default placeholder displayed
- [ ] **CB-005** — City field prefilled | Steps: open form with a city selected | Expected: selected city is prefilled
- [ ] **CB-006** — City field editable | Steps: change city | Expected: user can edit city
- [ ] **CB-007** — City list sorting | Steps: open City dropdown | Expected: cities appear alphabetically
- [ ] **CB-008** — City search | Steps: search city | Expected: matching cities displayed
- [ ] **CB-009** — Cinema dropdown | Steps: select city, open Cinema dropdown | Expected: cinemas for selected city displayed
- [ ] **CB-010** — Cinema sorting | Steps: open Cinema dropdown | Expected: cinemas sorted nearest-first
- [ ] **CB-011** — Cinema search | Steps: search cinema | Expected: matching cinemas displayed
- [ ] **CB-012** — Date selection restriction | Steps: open calendar | Expected: only dates 7+ days out are selectable
- [ ] **CB-013** — Current/previous dates disabled | Steps: check calendar | Expected: earlier dates disabled
- [ ] **CB-014** — Movie Type options | Steps: open Movie Type | Expected: "Now Showing" and "Others" displayed
- [ ] **CB-015** — Now Showing movie list | Steps: select Now Showing, open movie list | Expected: movies displayed in Admin-configured sequence
- [ ] **CB-016** — Movie selection | Steps: select a movie | Expected: selected movie populated
- [ ] **CB-017** — Preferred Show Time options | Steps: open dropdown | Expected: all configured time slots displayed
- [ ] **CB-018** — Seats minimum validation | Steps: enter 49 | Expected: validation displayed
- [ ] **CB-019** — Seats maximum validation | Steps: enter 1000 | Expected: validation displayed
- [ ] **CB-020** — Valid seat count | Steps: enter a value 50–999 | Expected: value accepted
- [ ] **CB-021** — Logged-in Name prefilled | Steps: open form as logged-in user | Expected: Name prefilled and editable
- [ ] **CB-022** — Logged-in Phone prefilled | Steps: open form as logged-in user | Expected: Phone prefilled and editable
- [ ] **CB-023** — Logged-in Email prefilled | Steps: open form as logged-in user | Expected: Email prefilled and editable
- [ ] **CB-024** — F&B Requirement options | Steps: observe field | Expected: Yes/No options displayed
- [ ] **CB-025** — Other Requirements max length | Steps: enter >500 characters | Expected: input restricted to 500 characters
- [ ] **CB-026** — Copy to Self checkbox | Steps: select checkbox | Expected: checkbox selected successfully
- [ ] **CB-027** — Get OTP CTA *(mocked)* | Steps: complete mandatory fields, click Get OTP | Expected: mocked OTP-send request fired
- [ ] **CB-028** — Valid OTP *(mocked)* | Steps: enter correct OTP | Expected: OTP verified successfully
- [ ] **CB-029** — Invalid OTP *(mocked)* | Steps: enter incorrect OTP | Expected: error displayed, retry allowed
- [ ] **CB-030** — Backend submission *(mocked, assert payload)* | Steps: complete flow with valid OTP | Expected: request submitted successfully
- [ ] **CB-031** — HR email notification *(adapted — assert mocked request carries correct recipient mapping, not a real inbox)* | Steps: submit request | Expected: mocked request reflects correct recipient mapping
- [ ] **CB-032** — Copy to Self email *(adapted — same as CB-031)* | Steps: check Copy to Self, submit | Expected: mocked request reflects the confirmation-email flag
- [ ] **CB-033** — Success popup | Steps: observe popup after successful submission | Expected: configured success message displayed
- [ ] **CB-034** — Mandatory field validations | Steps: leave mandatory fields blank, click Get OTP | Expected: validation messages displayed
- [ ] **CB-035** — Invalid email format | Steps: enter invalid email, submit | Expected: email validation displayed
- [ ] **CB-036** — Invalid phone number | Steps: enter invalid phone, submit | Expected: phone validation displayed
- [ ] **CB-037** — Responsive UI | Steps: resize browser / open M-site | Expected: layout remains responsive
- [ ] **CB-038** — Network failure during submission | Steps: abort route, submit request | Expected: appropriate error message displayed

## E2E implementation notes

- **Layering:** `src/tests/corporate-booking.spec.ts` → `src/modules/CorporateBookingModule.ts` → `src/pages/CorporateBookingPage.ts`.
- **Frontend context:** Not provided (no `dev-repo/`) — ground live via headless Playwright from Bash/Node (interactive Playwright MCP fails in this sandbox — see `pvr-inox-grounding-technique` project memory).
- **TODO(heal):** the real "Corporate Booking" route/URL and every form-field locator below this note are unconfirmed guesses. A grounding attempt during ticket-writing got as far as dismissing the Enable Location modal but the subsequent "More" menu click did not reliably open — retry with generous waits and a fresh screenshot-verify-act loop rather than chained blind clicks (same flakiness class as `pvr-inox-grounding-technique`'s "unresolved flakiness" note).
- **Reuse:** `LocationHelper` (`grantMumbaiGeolocation`, `dismissLocationAndSelectCity`, `clickThroughOverlays`, `dismissPromoPopup`) — every prior module hits the same overlay/location quirks.
- **Fixtures / mocks:** New `CorporateBookingMock.ts` (or extend `OtpMock.ts`) intercepting the Get-OTP/verify-OTP/submit endpoints for this form specifically — **do not let the real submission reach the backend**, per the user's explicit no-real-data instruction for this shared environment (see project memory `shared-environment-read-only`). Assert against the intercepted request body for CB-030/031/032 rather than any real email/backend record.
- **Tags:** `@Regression`, priority per the sheet's Priority column; `chromium` project per repo convention.
- **Run:** `npx playwright test src/tests/corporate-booking.spec.ts --project=chromium`

## Source

- **Seed method:** Excel
- **File:** `/home/user/Downloads/_PVR INOX __ Test Cases .xlsx`
- **Sheet:** `M8 | Website`
- **Columns:** Test Summary=`Test case Title`, Test Objective=`Pre Conditions`, Test Steps=`Test Steps/validation point`, Expected Result=`Expected Result  (ER)`, Priority=`Priority`
- **Frontend repo:** `dev-repo/` not provided
