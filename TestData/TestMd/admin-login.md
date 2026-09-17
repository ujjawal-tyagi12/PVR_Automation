# Playwright: Admin Login — credentials, OTP, password reset, and lockout

## Acceptance criteria

- Login screen shows logo, welcome text, Email input, Password input with a working show/hide eye
  icon, **Forgot Password?** CTA, and **Continue** button.
- Valid email/password sends a **6-digit OTP** to the registered email and redirects to an OTP
  screen; the correct OTP **within 2 minutes** logs the admin in and redirects to the Dashboard.
- A successful login **creates a session and an audit log entry**.
- **Resend OTP** is disabled until **60 seconds** have elapsed, then becomes available/enabled.
- **Forgot Password?** navigates to a Forgot Password screen.
- An **expired password** replaces Continue with a **Reset Password** flow (OTP-gated); a successful
  reset shows a confirmation popup that returns to Login, and the new password works for the next
  login.
- Negative/validation handling: invalid credentials, malformed/out-of-range email, incorrect/expired
  OTP, three failed OTP or credential attempts triggering a **10-minute lockout**, mismatched
  new/confirm password on reset, and suspicious activity surfacing an (invisible) **reCAPTCHA v3**
  challenge.
- Boundary behavior: OTP expiry at exactly 2 minutes, Resend enabled at exactly 60 seconds, password
  expiry at exactly 30 days, session auto-logout after 30 minutes idle, and a used OTP cannot be
  reused.

## Navigation

1. Navigate directly to the Admin Panel login URL (pre-authentication — this ticket **is** the login
   flow; exact admin app URL pending confirmation from the user, see E2E notes).
2. Enter Email/Password → **Continue** → OTP screen → Dashboard (or Reset Password screen if the
   password has expired).

## Test coverage

- **Scope:** Complete — all Admin Login rows in the "first 150" execution batch for this run.
- **Sheet rows included:** 28 of 28 (`ADL-001`–`ADL-028`).
- **Out of scope:** None within this batch.

## Scenarios

- **Suggested journey:** `TestData/TestSpecs/admin-login.spec.ts`
- **Sheet:** PVR INOX — Admin Portal Test Cases (Web-Only) → default sheet

- [ ] **ADL-001** — Login screen displays required elements | Steps: navigate to Admin Panel URL | Expected: logo, welcome placeholder text, Email input, Password input with eye icon, Forgot Password? CTA, and Continue button all visible `[High]`
- [ ] **ADL-002** — Password eye icon toggles visibility | Steps: type password → click eye icon → click again | Expected: password shown in plain text when enabled; masked (e.g. asterisks) when disabled `[High]`
- [ ] **ADL-003** — Valid credentials trigger OTP and redirect to OTP screen | Steps: enter valid email/password → Continue | Expected: 6-digit OTP emailed to registered address; admin redirected to OTP verification screen `[High]`
- [ ] **ADL-004** — Correct OTP within validity logs in successfully | Steps: on OTP screen enter the correct OTP within 2 minutes | Expected: login succeeds; admin redirected to Dashboard `[High]`
- [ ] **ADL-005** — Successful login creates session and audit entry | Steps: complete full login sequence with valid credentials + OTP | Expected: secure session created; full sequence recorded in audit logs `[High]`
- [ ] **ADL-006** — Resend OTP available after 60 seconds | Steps: on OTP screen wait 60 seconds → click Resend OTP | Expected: new OTP sent; resend succeeds `[High]`
- [ ] **ADL-007** — Forgot Password CTA navigates away | Steps: on Login screen click Forgot Password? | Expected: admin redirected to Forgot Password screen `[High]`
- [ ] **ADL-008** — Expired password flow reaches Password Reset screen | Steps: log in with credentials whose password has expired → click Reset Password → enter OTP sent to email | Expected: Continue is replaced by Reset Password; correct OTP proceeds to Password Reset screen `[High]`
- [ ] **ADL-009** — Password reset success shows confirmation popup | Steps: on Password Reset screen enter matching new password and confirmation → submit | Expected: success popup appears with a button back to login; clicking it navigates to Login screen `[High]`
- [ ] **ADL-010** — Login succeeds with newly reset password | Steps: after password reset, log in again using the new password | Expected: login succeeds via standard credential + OTP flow `[High]`
- [ ] **ADL-011** — Invalid credentials rejected | Steps: enter incorrect email/password → Continue | Expected: stays on Login screen; error "Invalid credentials. Please enter the valid credentials to proceed." `[Medium]`
- [ ] **ADL-012** — Invalid email format rejected | Steps: enter malformed email (e.g. missing domain dot) → Continue | Expected: inline error "Invalid Email Format. Please try again"; form not submitted `[Medium]`
- [ ] **ADL-013** — Incorrect OTP rejected | Steps: on OTP screen enter a wrong 6-digit code | Expected: stays on OTP screen; error "Invalid OTP. Please try again." `[Medium]`
- [ ] **ADL-014** — Expired OTP rejected | Steps: wait past 2-minute validity → enter the OTP | Expected: error "OTP expired. Please try again."; resend option available `[Medium]`
- [ ] **ADL-015** — Three failed OTP attempts blocks login | Steps: enter incorrect OTP three times | Expected: further attempts blocked for 10 minutes; error "Too many failed attempts. Please try again after 10 minutes." `[Medium]`
- [ ] **ADL-016** — Login attempt during active OTP block is rejected | Steps: after triggering the 10-minute OTP block, attempt another OTP entry | Expected: blocked with "Too many failed attempts. Please try again after 10 minutes." `[Medium]`
- [ ] **ADL-017** — Three failed credential attempts blocks login | Steps: submit incorrect email/password combinations three times within 10 minutes | Expected: "Too many failed attempts. Please try again after 10 minutes." shown `[Medium]`
- [ ] **ADL-018** — Mismatched new/confirm password rejected on reset | Steps: on Password Reset screen enter a new password and a different confirmation → submit | Expected: validation error; reset not completed; admin remains on Password Reset screen `[Medium]`
- [ ] **ADL-019** — Suspicious activity triggers reCAPTCHA v3 challenge | Steps: trigger suspicious login pattern | Expected: Google reCAPTCHA v3 surfaces (normally invisible) and gates submission `[Medium]`
- [ ] **ADL-020** — Resend OTP disabled before 60 seconds | Steps: on OTP screen attempt Resend OTP before 60 seconds have elapsed | Expected: Resend control remains disabled/unavailable `[Medium]`
- [ ] **ADL-021** — Email below minimum length rejected | Steps: enter an email under 5 characters → Continue | Expected: length validation error; submission blocked `[Low]`
- [ ] **ADL-022** — Email above maximum length rejected | Steps: enter an email over 100 characters → Continue | Expected: length validation error; submission blocked `[Low]`
- [ ] **ADL-023** — Email format edge cases rejected | Steps: enter emails with multiple `@`, consecutive dots, or disallowed special characters (`! # $ % ^ & *`) | Expected: each is rejected with the invalid email format error `[Low]`
- [ ] **ADL-024** — OTP at exactly the 2-minute expiry boundary | Steps: submit the OTP at/just after the 2-minute mark | Expected: OTP treated as expired; "OTP expired. Please try again." shown `[Low]`
- [ ] **ADL-025** — Resend OTP enabled exactly at the 60-second boundary | Steps: wait until the 60-second mark → check Resend control state | Expected: Resend OTP becomes enabled at/after 60 seconds `[Low]`
- [ ] **ADL-026** — Password expiry at the 30-day boundary forces reset | Steps: attempt login with a password exactly at its 30-day expiry | Expected: Continue replaced with Reset Password button and expired-password message `[Low]`
- [ ] **ADL-027** — Session auto-logout after 30 minutes inactivity | Steps: log in successfully → remain idle for 30 minutes → attempt an admin panel action | Expected: session has ended; admin is logged out and redirected to Login `[Low]`
- [ ] **ADL-028** — Used OTP cannot be reused | Steps: complete a successful login with an OTP → attempt to reuse the same OTP for another login | Expected: reused OTP is rejected as invalid/invalidated `[Low]`

## E2E implementation notes

- **Layering:** `TestData/TestSpecs/admin-login.spec.ts` → `src/modules/AdminLoginModule.ts` →
  `src/pages/AdminLoginPage.ts`. This is the foundation module every other admin ticket's auth
  fixture will build on.
- **Frontend context:** Not yet grounded. `inox-uat-web.pvrinox.com` (both `/admin` and `/login`
  paths) only renders the public site's generic SPA fallback ("Back To Home") — confirmed live via
  Playwright MCP navigation, so this is **not** the admin app's real domain. The correct admin
  login URL is still pending from the user; nothing below can be run until it's grounded.
- **Reuse:** `src/fixtures/auth.fixture.ts` (`ensureStorageState`) already assumes a login module —
  `AdminLoginModule` should replace/extend `SampleModule.login` once real selectors exist.
- **Locators:** `data-testid` preferred; email/password inputs and Continue button likely reachable
  via role/label as a fallback if no test ids exist.
- **Fixtures/mocks:** OTP delivery (`ADL-003`–`ADL-006`, `ADL-013`–`ADL-016`, `ADL-024`, `ADL-025`,
  `ADL-028`) cannot be driven through a real inbox in CI — needs either a test-mode OTP bypass/fixed
  code from the app, or a mail-fetch fixture; confirm which exists once the app is reachable.
  Time-boundary cases (`ADL-014`, `ADL-024`, `ADL-025`, `ADL-026`, `ADL-027`) will likely need
  `page.clock` or a backend time-travel hook rather than real waits.
- **Tags:** `@Regression @P0` for the High rows (core login/OTP/reset path); `@Regression @P1` for
  Medium; `@Regression @P2` for Low/boundary; `@Smoke`: `ADL-001`, `ADL-003`, `ADL-004`.
- **Run:** `npx playwright test TestData/TestSpecs/admin-login.spec.ts --project=chromium`

## Source

- **Seed method:** Google Sheet (CSV export)
- **File:** "PVR INOX — Admin Portal Test Cases (Web-Only)" —
  `https://docs.google.com/spreadsheets/d/1TGio-P24tVNox7RdMhK-Rkpoa7vVuGy7CxiW7KQY_lg`
- **Sheet:** default/first sheet (single-tab CSV export)
- **Columns:** Test Summary=`Test case Title`, Test Steps=`Test Steps/validation point`, Expected
  Result=`Expected Result (ER)`, Priority=`Priority`
- **Row range:** `ADL-001`–`ADL-028` (rows 59–86 of the first 150 rows executed in this batch)
- **Frontend repo:** not provided; live admin app URL pending confirmation from the user
