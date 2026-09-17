# Playwright: Forgot Password — admin password-reset flow via email OTP

## Acceptance criteria

- Admin can request a password reset via a registered email, verify a 6-digit OTP, and set a new
  password meeting complexity/length rules, with rate limiting on OTP requests and attempts.

## Navigation

1. Real path: none found — already confirmed for `change-password.spec.ts`: this app's only
   login mechanism is the real customer phone+OTP dialog. There is no password field, no
   Email+Password admin login screen, and therefore no password to forget, anywhere on this app.
2. Sheet-described admin path (not reachable on this app): Admin Login screen → **Forgot
   Password?**.

## Test coverage

- **Scope:** Full — all 23 sheet rows for this module are covered in this batch.
- **Sheet rows included:** 23 (`AFP-001`–`AFP-023`).

## Scenarios

- **Suggested journey:** `src/tests/forgot-password.spec.ts`
- **Sheet:** sixth 150-row batch

- [ ] **AFP-001** — Forgot Password screen displays required elements (adapted)
- [ ] **AFP-002** — Registered email triggers OTP and redirect (adapted)
- [ ] **AFP-003** — Correct OTP within validity reaches Password Reset screen (adapted)
- [ ] **AFP-004** — Valid matching new password resets successfully (adapted)
- [ ] **AFP-005** — Success popup navigates back to Login (adapted)
- [ ] **AFP-006** — Resend OTP available after 60 seconds (adapted)
- [ ] **AFP-007** — Unregistered email rejected (adapted)
- [ ] **AFP-008** — Invalid email format rejected (adapted)
- [ ] **AFP-009** — Incorrect OTP rejected (adapted)
- [ ] **AFP-010** — Expired OTP rejected (adapted)
- [ ] **AFP-011** — Three incorrect OTP attempts blocks retry (adapted)
- [ ] **AFP-012** — New password failing complexity criteria rejected (adapted)
- [ ] **AFP-013** — Confirm password mismatch rejected (adapted)
- [ ] **AFP-014** — New password same as current password rejected (adapted)
- [ ] **AFP-015** — Empty email submission blocked (adapted)
- [ ] **AFP-016** — Email below minimum length rejected (adapted)
- [ ] **AFP-017** — Email above maximum length rejected (adapted)
- [ ] **AFP-018** — Password at minimum length boundary (8 chars) accepted (adapted)
- [ ] **AFP-019** — Password at maximum length boundary (16 chars) accepted (adapted)
- [ ] **AFP-020** — Password outside length bounds rejected (adapted)
- [ ] **AFP-021** — Max 3 OTP requests per 10 minutes enforced (adapted)
- [ ] **AFP-022** — OTP at exactly the 2-minute expiry boundary (adapted)
- [ ] **AFP-023** — Email format edge cases rejected (adapted)

## E2E implementation notes

- **Layering:** `src/tests/forgot-password.spec.ts` → `src/modules/ForgotPasswordModule.ts` →
  `src/pages/ForgotPasswordPage.ts`.
- **Frontend context:** The real login surface (header account icon → Login) is a phone+OTP
  dialog with no password field anywhere — already grounded directly for `admin-login.spec.ts`
  (`ADL-002`: confirms no password field exists) and `change-password.spec.ts`. Since there is no
  password-based login at all, a "Forgot Password" flow cannot exist on this app; checked
  directly on the real login dialog, not assumed.
- **Tags:** `@Regression @P2`.
- **Run:** `npx playwright test src/tests/forgot-password.spec.ts --project=chromium`

## Source

- **Seed method:** Google Sheet (CSV export)
- **Row range:** `AFP-001`–`AFP-023` (sixth 150-row batch)
