# Playwright: OTP Verification Screen (Web)

## Source

PVR INOX Regression Pack (App/Website/Msite), module "OTP Verification Screen", the 7 rows
tagged `App/Web/Msite` (`APP-026`–`APP-031`, `APP-033`). `APP-032` does not exist in the sheet
(App-only gap, already excluded from the export).

## Acceptance criteria

Correct OTP verifies and proceeds; incorrect/expired OTP is rejected with a clear message;
resend is cooldown-gated and works after the cooldown; excessive requests are throttled; the
field only accepts numeric input up to the real OTP length.

## Navigation

Real, public path: header account icon → Login → phone entry → "Verify Phone Number" dialog —
the same dialog already grounded for admin-login.spec.ts / register-login-screens.spec.ts.
Composes `AdminLoginModule` read-only (no changes made to it) for the shared OTP mechanics.

## Test coverage

- **Scope:** Full — all 7 Web-tagged sheet rows for this module are covered.
- **Sheet rows included:** 7 (`APP-026`–`APP-031`, `APP-033`).

## Scenarios

- **Suggested journey:** `src/tests/otp-verification-screen.spec.ts`
- **Source:** PVR INOX Regression Pack (App/Website/Msite)

- [ ] **APP-026** — Real correct-OTP verification proceeds to the registration screen
- [ ] **APP-027** — Real incorrect-OTP entry shows "You have entered an invalid OTP."
- [ ] **APP-028** — Adapted: the real configured OTP validity duration (Admin > Global
  Configuration) isn't reachable without admin access, and the UAT bypass code doesn't follow
  normal expiry rules — confirms the app has one generic invalid-OTP message with no distinct
  "OTP expired" message anywhere live, instead of waiting out a real, unknown-length timer
- [ ] **APP-029** — Real resend-cooldown disables Resend Code with a countdown
- [ ] **APP-030** — Real resend after cooldown succeeds
- [ ] **APP-031** — Real repeated-request throttling ("OTP already sent. Try again after 1
  minute", observed live after 3 requests)
- [ ] **APP-033** — Real field input restriction (non-numeric filtered, capped at 6 digits)
