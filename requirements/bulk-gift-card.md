# Playwright: Bulk Gift Card — Contact request form + OTP submission

## Acceptance criteria

- The Bulk Gift Card page is reachable via the header "More" dropdown's **"Bulk Gift Card"** item (label confirmed live in the real menu — see `more-menu-real-labels` project memory) and shows a configured banner (or a default placeholder when none is configured).
- For a logged-in user, Name/Phone/Email are pre-filled and remain editable.
- Location and Company Name are capped at 100 characters, Message at 500 characters; Copy to Self is a checkbox.
- Clicking Get OTP sends an OTP to the phone number; a correct OTP completes submission, an incorrect OTP shows an error and allows retry.
- A successful submission shows a configured success popup ("Gift Card Request Submitted! Your Gift Card request has been submitted successfully") and (per the sheet) notifies a configured recipient, plus the user if Copy to Self was checked — **these email-delivery checks are verified by asserting the mocked submission request, not by checking a real inbox** (see Test coverage — no real request will be sent to production).
- Submitting without Copy to Self checked still submits the request, but sends no confirmation email to the user.
- Leaving mandatory fields blank blocks submission with validation messages; invalid email/phone formats are rejected; a network failure shows an appropriate error; the page is responsive on Web and M-site.

## Navigation

1. Open the site at `config.uatBaseUrl` (`https://uat-web.pvrinox.com`, per `otp-flow-automation-solved` project memory).
2. Dismiss the "Enable Location" modal (Cancel) and the city-selection drawer (select **Mumbai-All**) if either appears on a fresh session — both were observed blocking header interaction during this ticket's grounding pass.
3. Click **"More"** in the header nav → click the **"Bulk Gift Card"** `menuitem` (label confirmed live per `more-menu-real-labels`; exact route/URL not yet confirmed — see E2E implementation notes, TODO(heal)).

## Test coverage

- **Scope:** Complete — all 27 of the sheet's "Bulk Gift Card" rows.
- **Sheet rows included:** 27 of 27 (TC_Web_328–TC_Web_354). None excluded.
- **Not yet automated/grounded** — this ticket was seeded from the sheet only; no implementation or live grounding of the actual form fields has happened yet. Treat every locator in the eventual `BulkGiftCardPage.ts` as a guess needing live confirmation, consistent with `pvr-inox-grounding-technique` project memory.
- **Deliberate scope adaptation:** TC_Web_343 (recipient email) and TC_Web_344 (Copy to Self email) describe checking real email delivery. Per the user's explicit, standing instruction not to create data or trigger real side effects in the shared UAT environment, the Get OTP → Verify → Submit chain must be **mocked via `page.route()`** (same pattern as `src/utils/OtpMock.ts`), and these two scenarios verify the *mocked request payload*, not a real inbox. No real gift-card request should ever reach the real backend from this suite.

## Scenarios

- **Suggested journey:** `src/tests/bulk-gift-card.spec.ts`
- **Source file:** `_PVR INOX __ Test Cases .xlsx` → sheet `M8 | Website`

- [ ] **BGC-001** — Bulk Gift Card option displayed | Steps: open More menu | Expected: option is displayed
- [ ] **BGC-002** — Navigation to Bulk Gift Card page | Steps: click Bulk Gift Card | Expected: user navigates to page
- [ ] **BGC-003** — Banner image | Steps: open page with banner configured | Expected: configured banner displayed
- [ ] **BGC-004** — Placeholder banner | Steps: open page with no banner configured | Expected: default placeholder displayed
- [ ] **BGC-005** — Name prefilled | Steps: open form as logged-in user | Expected: Name prefilled and editable
- [ ] **BGC-006** — Phone prefilled | Steps: open form as logged-in user | Expected: Phone prefilled and editable
- [ ] **BGC-007** — Email prefilled | Steps: open form as logged-in user | Expected: Email prefilled and editable
- [ ] **BGC-008** — Location max length | Steps: enter >100 characters | Expected: input restricted to 100 characters
- [ ] **BGC-009** — Company Name max length | Steps: enter >100 characters | Expected: input restricted to 100 characters
- [ ] **BGC-010** — Message max length | Steps: enter >500 characters | Expected: input restricted to 500 characters
- [ ] **BGC-011** — Copy to Self checkbox | Steps: select checkbox | Expected: checkbox selected successfully
- [ ] **BGC-012** — Get OTP CTA *(mocked)* | Steps: complete mandatory fields, click Get OTP | Expected: mocked OTP-send request fired
- [ ] **BGC-013** — Valid OTP *(mocked)* | Steps: enter valid OTP | Expected: OTP verification successful
- [ ] **BGC-014** — Invalid OTP *(mocked)* | Steps: enter invalid OTP | Expected: error displayed, retry allowed
- [ ] **BGC-015** — Backend submission *(mocked, assert payload)* | Steps: complete flow | Expected: request submitted successfully
- [ ] **BGC-016** — Recipient email *(adapted — assert mocked request carries correct recipient mapping, not a real inbox)* | Steps: submit request | Expected: mocked request reflects correct recipient mapping
- [ ] **BGC-017** — Copy to Self email *(adapted — same as BGC-016)* | Steps: check Copy to Self, submit | Expected: mocked request reflects the confirmation-email flag
- [ ] **BGC-018** — Success popup | Steps: observe popup after successful submission | Expected: "Gift Card Request Submitted! Your Gift Card request has been submitted successfully" displayed
- [ ] **BGC-019** — Mandatory field validation | Steps: leave mandatory fields blank, click Get OTP | Expected: validation messages displayed
- [ ] **BGC-020** — Invalid email | Steps: enter invalid email, submit | Expected: email validation displayed
- [ ] **BGC-021** — Invalid phone number | Steps: enter invalid phone, submit | Expected: phone validation displayed
- [ ] **BGC-022** — Location accepts valid input | Steps: enter valid location, submit | Expected: location accepted
- [ ] **BGC-023** — Company Name accepts valid input | Steps: enter valid company name, submit | Expected: company name accepted
- [ ] **BGC-024** — Message accepts special characters | Steps: enter special characters within limit, submit | Expected: message accepted
- [ ] **BGC-025** — Form submission without Copy to Self *(adapted — assert no mocked confirmation-email request fired)* | Steps: submit without checking Copy to Self | Expected: request submitted, no confirmation email sent to user
- [ ] **BGC-026** — Responsive UI | Steps: resize browser / open M-site | Expected: layout displays correctly
- [ ] **BGC-027** — Internet failure | Steps: disconnect/abort route, submit | Expected: appropriate error message displayed

## E2E implementation notes

- **Layering:** `src/tests/bulk-gift-card.spec.ts` → `src/modules/BulkGiftCardModule.ts` → `src/pages/BulkGiftCardPage.ts`.
- **Frontend context:** Not provided (no `dev-repo/`) — ground live via headless Playwright from Bash/Node (interactive Playwright MCP fails in this sandbox — see `pvr-inox-grounding-technique` project memory).
- **TODO(heal):** the real "Bulk Gift Card" route/URL and every form-field locator below this note are unconfirmed guesses — same grounding gap as `corporate-booking.md` (this form sits right next to it in the More menu; ground both in the same pass).
- **Reuse:** `LocationHelper` (`grantMumbaiGeolocation`, `dismissLocationAndSelectCity`, `clickThroughOverlays`, `dismissPromoPopup`); likely near-identical form scaffolding to `CorporateBookingPage.ts`/`CorporateBookingModule.ts` — consider a small shared helper for the common Name/Phone/Email-prefill + Copy-to-Self + Get-OTP pattern both forms share.
- **Fixtures / mocks:** New `BulkGiftCardMock.ts` (or extend `OtpMock.ts`) intercepting the Get-OTP/verify-OTP/submit endpoints — **do not let the real submission reach the backend**, per the user's explicit no-real-data instruction for this shared environment (see project memory `shared-environment-read-only`). Assert against the intercepted request body for BGC-015/016/017/025 rather than any real email/backend record.
- **Tags:** `@Regression`, priority per the sheet's Priority column; `chromium` project per repo convention.
- **Run:** `npx playwright test src/tests/bulk-gift-card.spec.ts --project=chromium`

## Source

- **Seed method:** Excel
- **File:** `/home/user/Downloads/_PVR INOX __ Test Cases .xlsx`
- **Sheet:** `M8 | Website`
- **Columns:** Test Summary=`Test case Title`, Test Objective=`Pre Conditions`, Test Steps=`Test Steps/validation point`, Expected Result=`Expected Result  (ER)`, Priority=`Priority`
- **Frontend repo:** `dev-repo/` not provided
