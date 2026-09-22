# Playwright: Complete Your Profile / Edit Profile (Web)

## Source

PVR INOX Regression Pack (App/Website/Msite), module "Complete Your Profile / Edit Profile",
the 7 rows tagged `App/Web/Msite` (`APP-034`–`APP-039`, `APP-041`). `APP-040` does not exist in
the sheet (App-only gap).

## Acceptance criteria

New users complete mandatory profile fields after OTP; blank/invalid fields are rejected;
existing users can edit their details and avatar; email changes are gated by verification.

## Navigation

Two real, distinct surfaces, both grounded via direct probe (2026-09-21/22):
- The post-OTP **registration form** (a dialog: First Name*, Last Name, Email*, Submit) — the
  same dialog already grounded for register-login-screens.spec.ts.
- The standalone **"Edit Your Details" page** (a real route, `/dashboard?tab=profile`, not a
  dialog) reached via account-sidebar → Edit profile.

Both forms only enable their submit button once a real keystroke (`pressSequentially`, not
`fill()`) registers as a change — confirmed live via a real failure with `fill()` alone.

## Test coverage

- **Scope:** Full — all 7 Web-tagged sheet rows for this module are covered.
- **Sheet rows included:** 7 (`APP-034`–`APP-039`, `APP-041`).

## Scenarios

- **Suggested journey:** `src/tests/complete-profile-edit-profile.spec.ts`
- **Source:** PVR INOX Regression Pack (App/Website/Msite)

- [ ] **APP-034** — Real mandatory-field registration completes and proceeds past the form
- [ ] **APP-035** — Real mandatory-field validation: Submit stays disabled while required
  fields are blank (the real validation mechanism here — no separate on-submit error text)
- [ ] **APP-036** — Real email "Verify" action on Edit Your Details triggers a visible response
  (adapted: completing real email verification isn't automatable without inbox access)
- [ ] **APP-037** — Real invalid-email-format validation on the registration form
- [ ] **APP-038** — Real Edit Profile update (first name) persists across reload
- [ ] **APP-039** — Real email change: the "Verify" control remains present after saving a new
  email, confirming the change isn't silently trusted without verification
- [ ] **APP-041** — Real avatar picker: selecting a different avatar and updating applies it
