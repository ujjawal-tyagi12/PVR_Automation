# Playwright: Guest Login — Continue as Guest and restricted-action gating

## Acceptance criteria

- "Continue as Guest" is visible on the login screen and lands the user on Home with restricted functionality.
- Restricted actions (booking, offers, profile) redirect a guest to Login; completing login resumes the original flow.
- Guest session data is not persisted permanently — a fresh session returns to Login, not a restored guest Home.
- Restricted actions remain blocked without login (no bypass), and "Continue as Guest" is safely re-clickable without crashing.

## Navigation

1. Launch the Website (not logged in).
2. Login screen is shown.
3. Tap "Continue as Guest".

## Test coverage

- **Scope:** Regression — every row in the source sheet's "Guest Login" module.
- **Types included:** Positive, Negative
- **Scenarios included:** 8 (TC_ADM_027–034), all automated — none skipped.
- **Out of scope:** none.

## Scenarios

- **Suggested journey:** `src/tests/guest-login.spec.ts`
- **Seed:** User-provided test-case sheet, "Guest Login" module rows TC_ADM_027–034

| ID | Title | Priority | Status |
|---|---|---|---|
| TC_ADM_027 | "Continue as Guest" button visible on login screen | High | Automated |
| TC_ADM_028 | Redirect to Home on tapping "Continue as Guest" | High | Automated |
| TC_ADM_029 | Restricted actions prompt login | High | Automated |
| TC_ADM_030 | Redirect back to original flow after login | High | Automated |
| TC_ADM_031 | Home screen UI for Guest user | Medium | Automated |
| TC_ADM_032 | Guest session data not persisted permanently | Medium | Automated |
| TC_ADM_033 | Restricted actions blocked without login | High | Automated |
| TC_ADM_034 | "Continue as Guest" clickable/responsive, no crash | Medium | Automated |

## E2E implementation notes

- **Layering:** `src/tests/guest-login.spec.ts` → `src/modules/RegisterLoginModule.ts` → `src/pages/RegisterLoginPage.ts` (reused).
- **APIs:** Mocked via `src/utils/OtpMock.ts` for the login-resume scenario (TC_ADM_030); no real network traffic.
- **Locators:** Unverified guesses — see `TODO(heal)` in `RegisterLoginPage.ts`.
- **Tags:** `@P0`/High → `@Smoke` on 027/028/029/033; rest `@Regression`.
- **Run:** `npx playwright test src/tests/guest-login.spec.ts --project=chromium`

## Source

- **Seed method:** User-provided test-case sheet (pasted)
- **Module:** Guest Login
- **Testing types:** Regression (all rows)
- **IDs:** Original `TC_ADM_XXX` IDs preserved.
- **Frontend repo:** not provided
- **API contract:** not provided — mocked per `src/utils/OtpMock.ts`
