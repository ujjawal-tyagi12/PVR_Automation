# Playwright: Register/Login Screens — phone+OTP registration and login (Web)

## Source

PVR INOX Regression Pack (App/Website/Msite), module "Register/Login Screens", the 10 rows
tagged `App/Web/Msite` (`APP-016`–`APP-025`).

## Acceptance criteria

New users register via phone+OTP and land on profile completion; existing users log in via
phone+OTP or Google and land on the homepage; invalid input, deactivated accounts, device
limits, and network failure are all handled with appropriate messaging.

## Navigation

Real, public path: header account icon → **Login** → the real "Welcome!" phone+OTP dialog —
the same dialog already grounded for `admin-login.spec.ts`. Confirmed live: only Google social
login exists (no Apple/Facebook). A brand-new phone number lands on a real registration screen
("Let's get to know you better!") after a valid OTP. A "Device Limit Reached" overlay is
genuine and reachable on a seasoned number. No "Account deactivated" state is reachable — this
project has no admin access to deactivate a real account first.

## Test coverage

- **Scope:** Full — all 10 Web-tagged sheet rows for this module are covered.
- **Sheet rows included:** 10 (`APP-016`–`APP-025`).

## Scenarios

- **Suggested journey:** `src/tests/register-login-screens.spec.ts`
- **Source:** PVR INOX Regression Pack (App/Website/Msite)

- [ ] **APP-016** — Real registration screen shown for a brand-new number after OTP (adapted
  title: sheet says "Complete Your Profile screen"; real screen is "Let's get to know you
  better!" — the same functional step)
- [ ] **APP-017** — Real existing-user login lands authenticated on the homepage
- [ ] **APP-018** — Real Google social login button triggers genuine navigation to
  accounts.google.com
- [ ] **APP-019** — Adapted: cancelling a real third-party Google OAuth flow reliably and
  safely isn't automatable from here; confirms the button/flow entry point is real instead
- [ ] **APP-020** — Real invalid-phone validation
- [ ] **APP-021** — Adapted: no admin access exists anywhere in this project to deactivate a
  real account first
- [ ] **APP-022** — Real "Device Limit Reached" overlay (already confirmed live for
  admin-login.spec.ts's seasoned TEST_PHONE)
- [ ] **APP-023** — Adapted: no native App exists to test cross-platform session consistency
  against; confirms the web session itself is created correctly
- [ ] **APP-024** — Real network-failure handling via Playwright's offline simulation
- [ ] **APP-025** — Real logout (Settings > Logout) and re-login
