# OTP-Unblock Automation Report

**Compiled:** 2026-08-25 · **Scope:** the 172 test cases previously skipped for one shared reason ("OTP-entry screen never renders after 'Get OTP'") across 7 spec files, per the user's decision to convert whichever of these could now be automated after the reCAPTCHA/CAPTCHA finding — see `production-uat-functional-gaps.md`. Everything here was verified with real test runs against the live UAT environment (`inox-uat-web.pvrinox.com`), not just written and assumed to work.

---

## 1. What unblocked this

Production (`www.pvrinox.com`) gates login behind a real Google reCAPTCHA that headless automation cannot pass — this was the true cause of the 136 automation-blocked fails recorded in the original execution reports (§2.2 of `consolidated-execution-report.md`), not a locator bug.

UAT (`inox-uat-web.pvrinox.com`) has no such gate: `login.spec.ts` already proved (2026-08-20) that its real OTP backend accepts **any 6-digit code** as valid (e.g. `'123456'`) — a standard QA bypass on this environment. That pattern had only been applied to `login.spec.ts` itself; the other 6 files sharing the same OTP-blocked reason had never been updated to use it. This effort applied it across all of them.

---

## 2. Results by file

| Spec file | Before | After | Net converted |
|---|---|---|---|
| otp-screen.spec.ts | 9 live / 36 skip | 30 live / 15 fixme | +21 |
| registration.spec.ts | 2 live / 31 skip | 28 live / 5 fixme | +26 |
| register-login.spec.ts | 6 live / 34 skip | 23 live / 20 fixme | +17 (of 19 targeted; 2 more genuine reasons found later) |
| multi-device-login.spec.ts | 4 live / 8 skip | 11 live / 2 fixme | +7 |
| guest-login.spec.ts | 7 live / 1 skip | 7 live / 2 fixme | +0 (1 stayed fixme — re-verified genuine; 1 new unrelated finding added) |
| complete-your-profile.spec.ts | 1 live / 34 skip | 27 live / 8 fixme | +26 |
| profile-edit.spec.ts | 1 live / 44 skip | 36 live / 9 fixme | +35 |
| **Total (these 7 files)** | **30 live / 188 fixme** | **162 live / 61 fixme** | **+132** |

**Whole-suite totals** (all 17 spec files, sample.spec.ts excluded):

| Metric | Before this effort | After |
|---|---|---|
| Total test cases | 546 | 551 (a few new cases surfaced during live grounding) |
| Live (runnable) | 165 (30%) | 297 (54%) |
| Skipped (`test.fixme`) | 381 (70%) | 254 (46%) |

All conversions verified with `npm run build` (clean), `npm run rules:check` (67 files, no violations), and real `npx playwright test` runs against UAT — not just written and assumed passing.

---

## 3. Real bugs / findings discovered along the way

These came out of actually running the converted tests against the live site, not from the original skip-reason audit:

| Finding | Detail |
|---|---|
| **Real device-session limit is 3, not 2** | The source sheet assumed a 2-device limit. Live testing confirmed the real UAT app allows exactly 3 concurrent sessions per phone number silently; a 4th triggers a real "Device Limit Reached" dialog with Cancel/Continue. |
| **Login/registration drawer doesn't auto-close** | After a successful registration or login submit, the slide-in drawer stays mounted and keeps the header `aria-hidden`, blocking the account-panel button. Fixed with a proactive Escape-dismiss. |
| **Registration Submit button has a validation debounce** | Clicking immediately after filling fields could silently no-op on a still-disabled button — real client-side validation needs a moment to settle. Fixed by waiting for "enabled" before clicking (applied project-wide to similar buttons). |
| **`emailMinLength` test data was invalid** | The sheet's assumed 5-character minimum email (`a@b.c`) is actually rejected by real validation (single-character domain/TLD labels fail); the true minimum is 8 characters. Test data corrected, finding documented. |
| **Date-picker year dropdown is fragile for distant years** | The DOB/Anniversary calendar's year selector has 126 options; selecting a year far from the default view (e.g. 1986) is unreliable under real site load — a virtualized-list/scroll timing issue. Partially mitigated with explicit scroll-into-view; a few edge-case tests remain flaky under heavy load. |
| **"Complete Your Profile" nudge only shows once** | Contrary to the sheet's "reappears until profile completed" assumption, the nudge is gated by a `localStorage` flag set the moment it first renders — confirmed via a live two-session check, it does not reappear on a fresh session with the same account. |
| **Profile Edit screen: no Cancel button, button says "Update" not "Save"** | The sheet described a Save/Cancel pair; the real screen only has an "Update" button, nothing else. |
| **Email-change OTP is real, unlike login OTP** | On Profile Edit, changing the email address sends a real OTP to that inbox — this one does NOT accept an arbitrary code the way login OTP does. Success/expiry paths can't be driven end-to-end without real inbox access; the failure path (wrong code → real error) is fully testable and was implemented. |
| **UAT cinema/event data is sparse, unrelated to this batch** | Already documented in `production-uat-functional-gaps.md` — noted here only as context for why some UAT-dependent tests elsewhere in the suite still can't be fully exercised. |

---

## 4. What's still skipped, and why (61 remaining in these 7 files)

None of these 61 are stale — every one carries a fresh, live-grounded 2026-08-24/25 reason, not the old "OTP screen never renders" note. Representative categories:

- **Real backend/inbox access required**: email-change OTP success/expiry (profile-edit.spec.ts), can't be driven without a real mailbox.
- **UI element confirmed absent**: no Cancel button on Profile Edit, no Verified/Unverified indicator on that screen, no distinct "Verify Email" control on the registration form.
- **Hardware/SIM/OAuth-dependent** (register-login.spec.ts): social login, SIM auto-detect, SMS auto-read — need real devices or live OAuth grounding, unrelated to the OTP fix.
- **Business-rule contradictions found live**: date-picker calendar disables future years outright (can't test an unmocked future-date rejection the way the sheet describes); GA4 events batch into a POST body a shared helper can't currently read (tooling gap, not a product gap).

Full per-test reasons are in each spec file's `test.fixme()` call.

---

## 5. Environment issues hit during this work (not code defects)

- **UAT server transient errors**: `inox-uat-web.pvrinox.com` intermittently returned real `502`/`504` errors under the sustained load of this session's testing. Confirmed via health-check + isolated retry each time — every such failure cleared on retry once the server was healthy again.
- **Sandbox memory pressure**: this dev environment's limited RAM (shared with the real desktop browser and IDE) caused a couple of large test runs to be OOM-killed mid-run. Resolved by cleaning up orphaned processes and re-running in smaller batches.

Both are documented in memory for future sessions so they're recognized quickly rather than mistaken for code bugs.

---

*Source: live test runs against `inox-uat-web.pvrinox.com`, 2026-08-24/25. Build and architecture-rule checks pass clean at time of writing.*
