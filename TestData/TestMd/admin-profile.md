# Playwright: Admin Profile — view/edit details and OTP-gated email change

## Acceptance criteria

- The admin-name dropdown (top-right) exposes **Profile**, **Change Password**, and **Logout**.
- **Profile** shows Admin Name, Email Address, Phone Number, and an **Edit** CTA, all read-only until
  Edit is clicked; Edit reveals editable fields plus **Cancel**/**Update**.
- Updating **Name/Phone** saves directly and creates an audit log entry; **Cancel** reverts to the
  original read-only values with no backend call.
- Changing **Email** is a two-step OTP flow: OTP to the **current** email first, then (on correct
  entry) a prompt for the **new** email, which itself gets OTP-verified before the change is
  applied — after which the admin is **logged out** and redirected to Login.
- **Resend OTP** on either popup follows the same 60-second gate as Admin Login.
- Field validation: Admin Name required, 1–100 characters, no special characters; Phone must be
  exactly 10 numeric digits and not start with 0–5; the **Update** button stays disabled while any
  field is invalid.

## Navigation

1. Log in to the Admin Panel (see `admin-login.md`).
2. Click the **admin name** in the top-right header → select **Profile** from the dropdown.
3. Click **Edit** to modify Name/Phone/Email.

## Test coverage

- **Scope:** Complete — all Admin Profile rows in the "first 150" execution batch for this run.
- **Sheet rows included:** 24 of 24 (`ADP-001`–`ADP-024`).
- **Out of scope:** None within this batch. **Change Password** (listed in the dropdown but not
  detailed in these rows) is out of scope for this ticket.

## Scenarios

- **Suggested journey:** `TestData/TestSpecs/admin-profile.spec.ts`
- **Sheet:** PVR INOX — Admin Portal Test Cases (Web-Only) → default sheet

- [ ] **ADP-001** — Admin name dropdown shows Profile/Change Password/Logout | Steps: click admin name top-right | Expected: dropdown with Profile, Change Password, and Logout options `[High]`
- [ ] **ADP-002** — Profile screen displays admin details | Steps: select Profile from dropdown | Expected: Admin Name, Email Address, Phone Number, and Edit CTA visible, read-only `[High]`
- [ ] **ADP-003** — Edit CTA enables editable fields | Steps: click Edit CTA | Expected: fields become editable; Cancel and Update buttons appear `[High]`
- [ ] **ADP-004** — Update Name and Phone saves successfully | Steps: Edit → change Admin Name and Phone Number → Update | Expected: details saved; screen returns to read-only with new values; audit log entry created `[High]`
- [ ] **ADP-005** — Edit email sends OTP to current email | Steps: click Edit CTA on email field | Expected: OTP sent to current registered email; popup opens to enter OTP `[High]`
- [ ] **ADP-006** — Correct current-email OTP prompts for new email | Steps: enter correct OTP for current email | Expected: popup appears prompting entry of the new email address `[High]`
- [ ] **ADP-007** — Submitting new email sends OTP to it | Steps: submit a valid new email | Expected: OTP sent to the new email; popup opens to enter it `[High]`
- [ ] **ADP-008** — Correct new-email OTP updates email and logs out | Steps: enter correct OTP for the new email | Expected: email updated; admin logged out; redirected to Login screen `[High]`
- [ ] **ADP-009** — Resend OTP available after 60 seconds | Steps: on an OTP popup wait 60 seconds → Resend OTP | Expected: new OTP sent `[High]`
- [ ] **ADP-010** — Cancel edit reverts without saving | Steps: Edit → change a field → Cancel | Expected: UI reverts to read-only original values; no backend update call made `[Medium]`
- [ ] **ADP-011** — Incorrect OTP for current email rejected | Steps: on the current-email OTP popup enter a wrong code | Expected: error "Invalid OTP. Please try again."; email flow does not proceed `[Medium]`
- [ ] **ADP-012** — Incorrect OTP for new email rejected | Steps: on the new-email OTP popup enter a wrong code | Expected: error shown; email not updated `[Medium]`
- [ ] **ADP-013** — Invalid email format in new-email popup rejected | Steps: enter a malformed email in the new-email popup | Expected: error "Please enter a valid email address."; OTP not sent `[Medium]`
- [ ] **ADP-014** — Empty admin name rejected | Steps: Edit → clear Admin Name → attempt Update | Expected: error "Admin Name is required."; Update blocked `[Medium]`
- [ ] **ADP-015** — Admin name with special characters rejected | Steps: enter a name containing `@#$%&*` → attempt Update | Expected: error "Admin Name cannot contain special characters." `[Medium]`
- [ ] **ADP-016** — Admin name over 100 characters rejected | Steps: enter a 101+ character name → attempt Update | Expected: error "Admin Name must be between 1 and 100 characters." `[Medium]`
- [ ] **ADP-017** — Phone number not exactly 10 digits rejected | Steps: enter a 9-digit and an 11-digit phone number → attempt Update | Expected: format validation error; Update blocked `[Medium]`
- [ ] **ADP-018** — Phone number with non-numeric characters rejected | Steps: enter letters/symbols in the phone field → attempt Update | Expected: validation error; Update blocked `[Medium]`
- [ ] **ADP-019** — Phone starting with an invalid digit rejected | Steps: enter a 10-digit number starting with 0–5 → attempt Update | Expected: validation error; Update blocked `[Medium]`
- [ ] **ADP-020** — Update button disabled while invalid | Steps: Edit → enter invalid data in any field | Expected: Update button remains disabled until all fields pass validation `[Medium]`
- [ ] **ADP-021** — Admin name at minimum length (1 char) accepted | Steps: enter a single-character valid name → Update | Expected: name accepted and saved `[Low]`
- [ ] **ADP-022** — Admin name at maximum length (100 chars) accepted | Steps: enter exactly 100 valid characters → Update | Expected: name accepted and saved `[Low]`
- [ ] **ADP-023** — Resend OTP disabled before 60 seconds | Steps: on an OTP popup attempt Resend before 60 seconds elapse | Expected: Resend control remains disabled/unavailable `[Low]`
- [ ] **ADP-024** — Resend OTP enabled exactly at 60 seconds | Steps: wait until exactly 60 seconds on an OTP popup | Expected: Resend OTP becomes enabled `[Low]`

## E2E implementation notes

- **Layering:** `TestData/TestSpecs/admin-profile.spec.ts` → `src/modules/AdminProfileModule.ts` →
  `src/pages/AdminProfilePage.ts`.
- **Frontend context:** Not yet grounded. Requires an authenticated session — depends on
  `admin-login.md` being grounded first (real admin URL + credentials).
- **Reuse:** Shares the OTP popup component/flow with `admin-login.md`'s OTP screen; likely worth a
  common `OtpModule`/helper once both are grounded live, rather than duplicating OTP-entry logic.
- **Locators:** `data-testid` preferred; role/label fallback.
- **Fixtures/mocks:** Same OTP-delivery concern as Admin Login (`ADP-005`–`ADP-009`, `ADP-011`,
  `ADP-012`, `ADP-023`, `ADP-024`) — needs a test-mode OTP bypass or mail fixture to automate
  reliably.
- **Tags:** `@Regression @P1`; `@Smoke` candidate: `ADP-001`, `ADP-002`, `ADP-004`.
- **Run:** `npx playwright test TestData/TestSpecs/admin-profile.spec.ts --project=chromium`

## Source

- **Seed method:** Google Sheet (CSV export)
- **File:** "PVR INOX — Admin Portal Test Cases (Web-Only)" —
  `https://docs.google.com/spreadsheets/d/1TGio-P24tVNox7RdMhK-Rkpoa7vVuGy7CxiW7KQY_lg`
- **Sheet:** default/first sheet (single-tab CSV export)
- **Columns:** Test Summary=`Test case Title`, Test Steps=`Test Steps/validation point`, Expected
  Result=`Expected Result (ER)`, Priority=`Priority`
- **Row range:** `ADP-001`–`ADP-024` (rows 87–110 of the first 150 rows executed in this batch)
- **Frontend repo:** not provided; live admin app URL pending confirmation from the user
