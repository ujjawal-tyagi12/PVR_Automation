# Playwright: Change Password — admin self-service password update

## Acceptance criteria

- Logged-in admin can change their own password via Profile → Change Password CTA, entering Current/New/Confirm Password with masking, reveal toggles, and format validation (8–16 chars, uppercase + special character required), with lockout after 3 incorrect current-password attempts in 10 minutes.

## Navigation

1. Sheet-described path (not reachable on this app): login → admin name menu → Profile → Change Password CTA.
2. Real path checked instead: header account icon → **Settings** (pre-login; post-login state is unreachable — see `admin-profile.md`).

## Test coverage

- **Scope:** Complete — all rows in this batch.
- **Sheet rows included:** 21 of 21 (`CPW-001`–`CPW-032`, non-contiguous IDs).
- **Out of scope:** None within this batch.

## Scenarios

- **Suggested journey:** `src/tests/change-password.spec.ts`
- **Sheet:** rows 394–414

- [ ] **CPW-001** — Navigate to Change Password screen from Admin Profile
- [ ] **CPW-002** — Password fields masked by default
- [ ] **CPW-003** — Eye icon reveals and re-masks Current Password
- [ ] **CPW-004** — Eye icon reveals and re-masks New Password
- [ ] **CPW-005** — Eye icon reveals and re-masks Confirm New Password
- [ ] **CPW-006** — Successful password change redirects to login and invalidates other sessions
- [ ] **CPW-007** — New password at exact minimum length (8 chars) with all required character classes succeeds
- [ ] **CPW-010** — Empty Current Password blocks submit
- [ ] **CPW-011** — Empty New Password blocks submit
- [ ] **CPW-012** — Empty Confirm New Password blocks submit
- [ ] **CPW-013** — Incorrect current password is rejected
- [ ] **CPW-014** — New password missing an uppercase letter is rejected
- [ ] **CPW-015** — New password missing a special character is rejected
- [ ] **CPW-016** — Confirm New Password not matching New Password shows error
- [ ] **CPW-017** — New password same as current password is rejected
- [ ] **CPW-018** — Cancel discards entered values
- [ ] **CPW-019** — Three incorrect current-password attempts within 10 minutes triggers lockout `[Negative]`
- [ ] **CPW-020** — Unauthenticated/expired session cannot access Change Password screen `[Negative]`
- [ ] **CPW-030** — New password at exact maximum length (16 chars) succeeds
- [ ] **CPW-031** — New password exceeding maximum length (17 chars) is rejected
- [ ] **CPW-032** — New password below minimum length (7 chars) is rejected

## E2E implementation notes

- **Layering:** `src/tests/change-password.spec.ts` → `src/modules/ChangePasswordModule.ts` → `src/pages/ChangePasswordPage.ts`.
- **Frontend context:** This app's only login mechanism is the real customer phone+OTP dialog — already confirmed in `admin-login.md`/spec (`ADL-002`: no password field exists anywhere on this app; `ADL-018`: no confirm-password field either). The pre-login account sidebar's Settings screen was checked directly (2026-09-01) and contains only "Appearance" and content links (Privacy Policy/Terms & Conditions/Terms of Use/FAQs) — no password-change surface. Since there is no password-based login at all, a Change Password screen cannot exist on this app. Every scenario asserts confirmed absence.
- **Tags:** `@Regression @P1`.
- **Run:** `npx playwright test src/tests/change-password.spec.ts --project=chromium`

## Source

- **Seed method:** Google Sheet (CSV export)
- **Row range:** `CPW-001`–`CPW-032` (sheet rows 394–414 of the third 150-row batch)
