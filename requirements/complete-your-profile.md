# Playwright: Complete Your Profile — post-login profile-completion nudge

## Acceptance criteria

- Logged-in users with an incomplete profile see a "Complete your profile" nudge.
- "Maybe Later" dismisses the nudge temporarily and redirects Home; it reappears each session until the profile is complete.
- Gender, Date of Birth, Marital Status are all optional; Anniversary Date is optional unless Marital Status = Married, in which case it's mandatory.
- Anniversary Date field only renders when Marital Status = Married; must be a past/present date, not future.
- DOB must reflect a minimum age of 13.
- Save success/failure show the documented copy; saved data reflects in the Profile section and syncs to the Admin Panel.
- No XSS/HTML injection possible; traffic is HTTPS; session timeout triggers auto-logout.

## Navigation

1. Log in successfully with an account that has an incomplete profile.
2. The profile-completion nudge is shown (on Home or immediately post-login).

## Test coverage

- **Scope:** Regression — every row in the source sheet's "Complete Your Profile" module.
- **Types included:** Positive, Negative, Security, Performance/Analytics (proxy), Accessibility (proxy), Cross-browser/responsive
- **Scenarios included:** 34 (TC_ADM_138–171), all automated — none skipped, none `test.fixme()` (no OAuth/unreachable-infra dependency in this module).
- **Out of scope:** none.

## Scenarios

- **Suggested journey:** `src/tests/complete-your-profile.spec.ts`
- **Seed:** User-provided test-case sheet, "Complete Your Profile" module rows TC_ADM_138–171

| ID | Title | Priority | Status |
|---|---|---|---|
| TC_ADM_138 | Nudge displayed for incomplete profiles | High | Automated |
| TC_ADM_139 | "Maybe Later" hides nudge, redirects Home | Medium | Automated |
| TC_ADM_140 | Nudge reappears until profile completed | High | Automated |
| TC_ADM_141 | All fields optional except anniversary when married | High | Automated |
| TC_ADM_142 | Anniversary mandatory when Married | High | Automated |
| TC_ADM_143 | DOB below age 13 restricted | High | Automated |
| TC_ADM_144 | Gender field optional | Medium | Automated |
| TC_ADM_145 | Gender radio buttons (Male/Female/Other) | Medium | Automated |
| TC_ADM_146 | Gender selection persists after saving | High | Automated |
| TC_ADM_147 | Anniversary field visible only when Married | High | Automated |
| TC_ADM_148 | Anniversary field hidden when Single | Medium | Automated |
| TC_ADM_149 | Anniversary mandatory when Married (duplicate of 142) | High | Automated |
| TC_ADM_150 | Error message on save failure | High | Automated (mocked 500) |
| TC_ADM_151 | API response 200/success on save | High | Automated |
| TC_ADM_152 | No sensitive data exposed on save failure | High | Automated (asserts our own mock's payload shape) |
| TC_ADM_153 | Success/error message color standards | Medium | Automated (computed-style color check) |
| TC_ADM_154 | Future anniversary date rejected | Medium | Automated |
| TC_ADM_155 | Success message after saving (duplicate of 151) | High | Automated |
| TC_ADM_156 | Data reflects under Profile section | High | Automated |
| TC_ADM_157 | Data syncs with Admin Panel | High | Automated (asserts mocked admin-sync contract) |
| TC_ADM_158 | Behavior on API failure (duplicate of 150) | High | Automated |
| TC_ADM_159 | Nudge visual alignment/layout | Medium | Automated (`toHaveScreenshot()` baseline) |
| TC_ADM_160 | Field input format (calendar & dropdown function) | Medium | Automated |
| TC_ADM_161 | No XSS/HTML injection | Medium | Automated |
| TC_ADM_162 | HTTPS / secure API calls | High | Automated |
| TC_ADM_163 | Session timeout security (auto-logout) | High | Automated (mocked 401) |
| TC_ADM_164 | Backend validation messages surfaced | Medium | Automated (mocked 400) |
| TC_ADM_165 | Cross-browser (Chrome/Safari/Edge/Firefox) | High | Automated (meaningful under `--project=firefox/webkit`; Opera not configured in this project) |
| TC_ADM_166 | Android/iOS responsive layout | High | Automated (viewport matrix + `mobile-chrome` project) |
| TC_ADM_167 | Tab navigation & screen-reader labels | High | Automated (role/name presence + Tab key, not a full screen-reader audit) |
| TC_ADM_168 | GA4 event on Submit and Skip | High | Automated (network-beacon proxy) |
| TC_ADM_169 | Invalid DOB format entered manually | Medium | Automated |
| TC_ADM_170 | "Maybe Later" button clarity/accessibility | High | Automated |
| TC_ADM_171 | Data integration Profile ↔ Admin DB (duplicate of 157) | High | Automated |

## E2E implementation notes

- **Layering:** `src/tests/complete-your-profile.spec.ts` → `ProfileCompletionModule`/`RegisterLoginModule` (reused for login) → `ProfileCompletionPage`/`RegisterLoginPage`.
- **APIs:** `src/utils/ProfileMock.ts` (profile status/save); `src/utils/OtpMock.ts` (login precondition). No real network traffic reaches production.
- **Locators:** Best-effort guesses from PRD UC5 (pages 25-26) and the sheet's own copy ("Maybe Later", field validation text) — **not** live-grounded the way `RegisterLoginPage.ts` was for the login flow. See `TODO(heal)` in `ProfileCompletionPage.ts`.
- **Proxy techniques:** same caveats as `otp-screen.md`/`registration.md` — GA4 via network beacon, HTTPS via URL inspection, color-standard check via `getComputedStyle`, no axe-core for accessibility.
- **Tags:** `@P0`/High → `@Smoke` on 138,141,142,150,151,156,162,163; rest `@Regression`.
- **Run:** `npx playwright test src/tests/complete-your-profile.spec.ts --project=chromium`

## Source

- **Seed method:** User-provided test-case sheet (pasted)
- **Module:** Complete Your Profile
- **Testing types:** Regression (all rows)
- **IDs:** Original `TC_ADM_XXX` IDs preserved.
- **Frontend repo:** not provided
- **API contract:** not provided — mocked per `src/utils/ProfileMock.ts`
