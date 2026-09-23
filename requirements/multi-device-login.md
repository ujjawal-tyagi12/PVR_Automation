# Playwright: Multi-Device Login — device session limit enforcement

## Acceptance criteria

- A user can log in from a single device successfully.
- Up to the configured max (default 2) devices can be logged in simultaneously.
- Logging in on a device beyond the limit shows a warning popup identifying the oldest session, with Cancel/Continue.
- Cancel returns to Login without affecting existing sessions; Continue logs out the oldest session and proceeds.
- Killing the app without choosing is treated as Cancel.
- If a previously-logged-in device was already logged out manually, a new device can log in directly without the popup.
- Max device limit is admin-configurable (dropdown, 1–5).

## Navigation

1. Launch the Website on a device (browser context) not yet at the device limit.
2. Log in with a registered phone number + OTP.
3. Repeat on additional device/browser contexts to reach and exceed the limit.

## Test coverage

- **Scope:** Regression — every row in the source sheet's "Multi-Device Login" module.
- **Types included:** Positive, Negative, Config
- **Scenarios included:** 12 (TC_ADM_035–046), all automated — none skipped.
- **Out of scope:** none.

## Scenarios

- **Suggested journey:** `src/tests/multi-device-login.spec.ts`
- **Seed:** User-provided test-case sheet, "Multi-Device Login" module rows TC_ADM_035–046

| ID | Title | Priority | Status |
|---|---|---|---|
| TC_ADM_035 | Single-device login succeeds | High | Automated |
| TC_ADM_036 | Two devices logged in simultaneously | High | Automated |
| TC_ADM_037 | 3rd device triggers device-limit warning popup | High | Automated |
| TC_ADM_038 | Cancel on popup returns to Login, existing sessions unaffected | High | Automated |
| TC_ADM_039 | Continue on popup logs out oldest session, proceeds on new device | High | Automated |
| TC_ADM_040 | Killing the app mid-popup is treated as Cancel | Medium | Automated |
| TC_ADM_041 | Login succeeds directly when a previous device was already logged out | High | Automated |
| TC_ADM_042 | Configure max device limit via Admin Panel | Medium | Automated |
| TC_ADM_043 | Admin dropdown shows options 1–5 | Low | Automated |
| TC_ADM_044 | Session state updates correctly after oldest-session logout | High | Automated |
| TC_ADM_045 | Invalid credentials → prompted for 10-digit mobile | Medium | Automated |
| TC_ADM_046 | Popup UI layout and button labels | Low | Automated |

## E2E implementation notes

- **Layering:** `src/tests/multi-device-login.spec.ts` → `RegisterLoginModule`/`AdminLoginSettingsModule` → `RegisterLoginPage`/`AdminLoginSettingsPage`.
- **APIs:** `src/utils/DeviceSessionMock.ts` — an in-memory simulation of the device-session-limit rule (no real backend/session API available); shared across multiple mocked `Page`/context instances within a test to represent multiple physical devices hitting one backend. `src/utils/AdminMock.ts` mocks the Admin Panel login-settings save for TC_ADM_042/043.
- **Locators:** Unverified guesses. `config.adminBaseUrl` is an unverified guess too (no real Admin Portal URL exists anywhere in the PRD or was provided) — see `TODO(heal)` comments.
- **Known speculative link:** TC_ADM_039/040's "Continue" flow assumes the real app resends verify-OTP with a `{ forceLogout: true }` body on Continue — this request shape is a guess (`DeviceSessionMock.ts` docblock); the mock reacts to it, but whether the real (ungrounded) app actually sends it is unverified.
- **Tags:** `@P0`/High → `@Smoke` on 035/036/037; rest `@Regression`.
- **Run:** `npx playwright test src/tests/multi-device-login.spec.ts --project=chromium`

## Source

- **Seed method:** User-provided test-case sheet (pasted)
- **Module:** Multi-Device Login
- **Testing types:** Regression (all rows)
- **IDs:** Original `TC_ADM_XXX` IDs preserved.
- **Frontend repo:** not provided
- **API contract:** not provided — mocked per `src/utils/DeviceSessionMock.ts` / `src/utils/AdminMock.ts`
