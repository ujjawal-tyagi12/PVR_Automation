# Playwright: Avatar — Default assignment, gallery, and persistence

## Acceptance criteria

- On completing registration, a new user is assigned a default avatar matching the Gender selected during onboarding (Female → Female avatar, Male → Male avatar), visible in the profile/account section right after account creation.
- Edit Profile has an Avatar section with **View** (opens a full preview, closable) and **Edit** (opens an Avatar Gallery) controls.
- The Avatar Gallery pre-highlights the user's currently-assigned avatar, shows every configured avatar, and lets the user select a different one (highlighting the new selection without yet saving).
- Saving the gallery selection updates the profile avatar; the new avatar then appears everywhere it's shown (header/profile/account) and persists across a page refresh and a logout/login cycle.
- Closing the gallery without selecting/saving leaves the existing avatar unchanged.

## Navigation

1. Log in via the existing OTP-bypass flow (`config.otpBypassCode`, per `otp-flow-automation-solved` project memory) — reuse `RegisterLoginModule`.
2. Open the account/profile menu → **Edit Profile** → **Avatar** section.
3. For AVT-001/002 (default assignment by gender), the path is a **fresh registration**, not a login: phone + OTP → the real "Complete Your Profile" 4-step wizard's **step 1** (per `ProfileCompletionPage.ts`'s grounded doc comment) → select Gender ("Male"/"Female") → Save & Next → check the resulting default avatar. The sheet's "Sign up with Gender = X" framing undersells this — Gender is set during this onboarding step, not at the initial phone/OTP signup itself.

## Test coverage

- **Scope:** Complete — all 16 of the sheet's "Avatar" rows.
- **Sheet rows included:** 16 of 16 (TC_Web_355–TC_Web_370). None excluded.
- **Not yet automated/grounded** — this ticket was seeded from the sheet only; no implementation or live grounding of the Avatar section/gallery UI has happened yet. Treat every locator in the eventual `AvatarPage.ts` as a guess needing live confirmation, consistent with `pvr-inox-grounding-technique` project memory.
- **No mocking needed here** — unlike Corporate Booking/Bulk Gift Card, saving an avatar only changes our own automation test account's own display avatar. It has no external side effects (no email, no other party's data), so AVT-012 (save) should be a real save against a real dedicated test account, consistent with how `profile-edit.spec.ts` already performs real profile edits.
- **AVT-001/002 need two real signups** (one per gender) — reuse the existing registration/OTP-bypass flow already established in `register-login.spec.ts`/`registration.spec.ts`; do not create more than the two accounts actually needed for this pair of scenarios.

## Scenarios

- **Suggested journey:** `src/tests/avatar.spec.ts`
- **Source file:** `_PVR INOX __ Test Cases .xlsx` → sheet `M8 | Website`

- [ ] **AVT-001** — Default Female avatar assignment | Steps: sign up, select Gender=Female in Complete Your Profile | Expected: Female default avatar assigned
- [ ] **AVT-002** — Default Male avatar assignment | Steps: sign up, select Gender=Male in Complete Your Profile | Expected: Male default avatar assigned
- [ ] **AVT-003** — Avatar displayed after account creation | Steps: complete registration | Expected: default avatar visible in profile/account section
- [ ] **AVT-004** — Avatar section availability | Steps: navigate to Edit Profile | Expected: Avatar section with View and Edit options displayed
- [ ] **AVT-005** — Avatar preview | Steps: click View | Expected: full avatar preview opens
- [ ] **AVT-006** — Close preview | Steps: click Close | Expected: returns to Edit Profile
- [ ] **AVT-007** — Avatar Gallery opens | Steps: click Edit | Expected: gallery opens successfully
- [ ] **AVT-008** — Default Female avatar highlighted | Steps: open gallery as a Female-default user | Expected: assigned Female avatar pre-selected/highlighted
- [ ] **AVT-009** — Default Male avatar highlighted | Steps: open gallery as a Male-default user | Expected: assigned Male avatar pre-selected/highlighted
- [ ] **AVT-010** — All avatars displayed | Steps: scroll gallery | Expected: all configured avatars visible
- [ ] **AVT-011** — Selecting another avatar | Steps: select a different avatar | Expected: newly selected avatar highlighted
- [ ] **AVT-012** — Profile avatar updates *(real save — see Test coverage)* | Steps: save changes | Expected: profile avatar updates successfully
- [ ] **AVT-013** — Avatar updates across website | Steps: navigate to Header/Profile/Account | Expected: updated avatar appears everywhere
- [ ] **AVT-014** — Persistence after refresh | Steps: refresh browser | Expected: updated avatar remains
- [ ] **AVT-015** — Persistence after logout/login | Steps: logout, login | Expected: updated avatar retained
- [ ] **AVT-016** — Close gallery without selecting | Steps: close popup without selecting | Expected: existing avatar remains unchanged

## E2E implementation notes

- **Layering:** `src/tests/avatar.spec.ts` → `src/modules/AvatarModule.ts` → `src/pages/AvatarPage.ts`.
- **Frontend context:** Not provided (no `dev-repo/`) — ground live via headless Playwright from Bash/Node (interactive Playwright MCP fails in this sandbox — see `pvr-inox-grounding-technique` project memory).
- **Reuse:** `RegisterLoginModule` (OTP-bypass login/signup), `ProfileCompletionPage`/`ProfileCompletionModule` (real step-1 Gender selection — note its non-`role="radio"` `label[for=...]` pattern, same likely to apply to Avatar Gallery's selection controls; check for it during grounding rather than assuming standard roles), `ProfileEditPage`/`ProfileEditModule` (Edit Profile entry point).
- **Test data:** two dedicated test accounts (or two fresh OTP-bypass signups) — one per gender — reused across AVT-001/002/008/009 rather than one-off throwaway accounts per test.
- **Fixtures / mocks:** none needed — this module has no OTP-gated backend submission with external side effects; a real save is fine.
- **Tags:** `@Regression`, priority per the sheet's Priority column; `chromium` project per repo convention.
- **Run:** `npx playwright test src/tests/avatar.spec.ts --project=chromium`

## Source

- **Seed method:** Excel
- **File:** `/home/user/Downloads/_PVR INOX __ Test Cases .xlsx`
- **Sheet:** `M8 | Website`
- **Columns:** Test Summary=`Test case Title`, Test Objective=`Pre Conditions`, Test Steps=`Test Steps/validation point`, Expected Result=`Expected Result  (ER)`, Priority=`Priority`
- **Frontend repo:** `dev-repo/` not provided
