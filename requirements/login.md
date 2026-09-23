# Playwright: Login — Manual login/registration core flow (Website)

## Acceptance criteria

- Mobile number field is editable; manual login/registration proceeds via phone + OTP.
- Registration Details requires First Name, Last Name, Email with documented validation rules.
- Deactivated accounts are blocked with a support-contact popup.
- Phone field only accepts exactly 10 numeric digits starting with 6/7/8/9.
- Terms & Privacy links are reachable from the login screen.
- Layout is responsive; OTP/token never appears in the URL; captcha (v3) can trigger on suspicious activity.

## Navigation

1. Launch the Website.
2. Login screen is shown (or reached via header/CTA "Log in").
3. Choose Manual entry or Continue as Guest.

## Test coverage

- **Scope:** Regression — every row in the source sheet's "Login" module, per explicit instruction not to skip any.
- **Types included:** Positive, Negative, Security/UX checks
- **Scenarios included:** 23 (TC_ADM_001–010, 013–022, 024–026)
- **Removed:** TC_ADM_011 (Google/Apple sign-in), TC_ADM_012 (mobile-number conflict during social login), TC_ADM_023 (social login network failure) — the Social Login module/ticket and every social-login-dependent scenario across the suite were removed at the user's explicit request. These are no longer present anywhere in this ticket or its spec.
- **Out of scope:** none — every remaining row is automated.

## Scenarios

- **Suggested journey:** `src/tests/login.spec.ts`
- **Seed:** User-provided Excel/CSV-style sheet (pasted in-conversation), "Login" module rows TC_ADM_001–026 (minus the removed social-login rows above)

| ID | Title | Priority | Status |
|---|---|---|---|
| TC_ADM_001 | Mobile number field prefilled (if available)/editable | High | Automated |
| TC_ADM_002 | OTP verification → Home | High | Automated |
| TC_ADM_003 | OTP invalid entry | High | Automated |
| TC_ADM_004 | OTP expired | High | Automated |
| TC_ADM_005 | OTP resend | High | Automated |
| TC_ADM_006 | New user mobile number field → OTP screen | High | Automated |
| TC_ADM_007 | Registration mandatory fields gate Submit | High | Automated |
| TC_ADM_008 | First Name validation | High | Automated |
| TC_ADM_009 | Last Name validation | High | Automated |
| TC_ADM_010 | Email validation | High | Automated |
| TC_ADM_013 | Continue as Guest | Medium | Automated |
| TC_ADM_014 | Device limit enforcement (3rd device) | High | Automated |
| TC_ADM_015 | Inactive/deactivated user login | High | Automated |
| TC_ADM_016 | Max OTP attempts (lock 10 min) | High | Automated |
| TC_ADM_017 | Responsive layout | Medium | Automated (viewport matrix) |
| TC_ADM_018 | URL masking (no OTP/token in URL) | High | Automated |
| TC_ADM_019 | Mobile number < 10 digits | High | Automated |
| TC_ADM_020 | Mobile number > 10 digits | High | Automated |
| TC_ADM_021 | Mobile number non-numeric chars | Medium | Automated |
| TC_ADM_022 | Terms & Privacy links | Medium | Automated |
| TC_ADM_024 | Captcha trigger (web) | Medium | Automated (via mocked `captchaRequired` flag) |
| TC_ADM_025 | Login button disabled on empty input | High | Automated |
| TC_ADM_026 | Mobile number input capped at 10 digits | High | Automated |

## E2E implementation notes

- **Layering:** `src/tests/login.spec.ts` → `src/modules/RegisterLoginModule.ts` → `src/pages/RegisterLoginPage.ts` (reused from `register-login.md` — same screens, no new Page/Module needed for this ticket).
- **Frontend context:** Not provided.
- **APIs:** Mocked via `src/utils/OtpMock.ts` — see its file-level comment for the "no real contract available" caveat. No real network traffic reaches production.
- **Locators:** Unverified guesses (PRD copy + sheet's own field/button names) — see `TODO(heal)` in `RegisterLoginPage.ts`.
- **Tags:** `@P0`/High → also `@Smoke` on the core happy paths (001,002,007,008,009,010,015,016,019,020,025); rest `@Regression`.
- **Run:** `npx playwright test src/tests/login.spec.ts --project=chromium`

## Source

- **Seed method:** User-provided test-case sheet (pasted, not a file — `/create-md-ticket` intake adapted accordingly)
- **Module:** Login
- **Testing types:** Regression (all rows)
- **IDs:** Original `TC_ADM_XXX` IDs preserved as-is (not renumbered to a new PREFIX) to keep traceability to the source sheet.
- **Frontend repo:** not provided
- **API contract:** not provided — mocked per `src/utils/OtpMock.ts`
