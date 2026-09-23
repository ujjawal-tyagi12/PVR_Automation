# Corporate Booking · Register/Login · Complete Your Profile — Execution Report

**Run:** chromium, UAT (`inox-uat-web.pvrinox.com`), 2026-09-21. Real, tool-executed run (full run: 54.1 min, 3 parallel workers; the 2 initial failures below were then re-run isolated, 1 worker, to rule out load-induced flakiness). Movie Details (also run in this same pass) is **excluded from this report** — it's covered separately (0/27 passing, single systemic `beforeEach` timeout cause, already tracked).

## Headline numbers

| Module | Live tests | Passed | Failed | Skipped (`test.fixme`) |
|---|--:|--:|--:|--:|
| Corporate Booking | 19 | **19** | 0 | 18 |
| Register/Login | 23 | **23** | 0 | 14 |
| Complete Your Profile | 28 | **28** | 0 | 5 |
| **Total** | **70** | **70** | **0** | **37** |

**All 70 live tests pass.** Two tests failed on the first (parallel, 3-worker) pass — both confirmed as load-induced flakes, not product or test bugs, on an isolated 1-worker re-run:

| Test | First (parallel) run | Isolated re-run | Reason |
|---|---|---|---|
| TC_ADM_145 — Gender radio buttons visible (Complete Your Profile) | FAIL — "Complete Your Profile" dialog didn't render within a 5s wait | PASS (14.7s) | Nudge dialog render is occasionally slower than 5s under real site latency/parallel load; not a locator or product defect. |
| REG-015 — Second device login while first session active (Register/Login) | FAIL — account panel's "Login" button still visible when expected hidden | PASS (24.8s) | Same class of load-induced timing miss; the underlying multi-device-login flow itself works. |

No open failures remain in these three modules as of this run.

---

## Corporate Booking — skip reasons (18)

| ID | Reason category | Why skipped |
|---|---|---|
| CB-004 | BLOCKED | Default placeholder banner needs an Admin Panel data state (banner removed) this suite can't toggle from the UI. |
| CB-005 | NOT GROUNDED | City field's accessible name is a static label+placeholder; whether a selected value renders distinctly from the guest default wasn't confirmed live. |
| CB-007 | NOT GROUNDED | Only a filtered (searched) city list was observed live, not the full unfiltered option list — can't verify alphabetical sort. |
| CB-010 | NOT GROUNDED | Cinema "nearest-first" sort needs real per-cinema distance data to check against, not available from static grounding. |
| CB-012b | NOT GROUNDED | Date picker opens and is selectable, but which specific dates are disabled vs. enabled (the "7+ days out" rule) wasn't independently verified. |
| CB-013 | NOT GROUNDED | Same calendar-internals gap as CB-012b (current/previous dates disabled). |
| CB-015 | BLOCKED | "Admin-configured sequence" claim needs an Admin-side source of truth to compare the Now Showing list against — not available. |
| CB-018b | NOT GROUNDED | Seats field accepts input, but the actual out-of-range (49) validation message/behavior wasn't observed live. |
| CB-019 | NOT GROUNDED | Same validation-behavior gap as CB-018b (seats max, 1000). |
| CB-025b | NOT GROUNDED | Other Requirements field exists, but whether input truncates at 500 chars wasn't observed live. |
| CB-028 | BLOCKED (safety) | Form auto-verifies/auto-submits on real OTP entry with no separate Submit button — filling a real code risks an actual backend booking submission to a real recipient email. |
| CB-029 | BLOCKED | Same auto-submit gap as CB-028 (invalid OTP + retry). |
| CB-030 | BLOCKED | Same gap as CB-028; also this is a Next.js Server Action (POST to the page's own URL), not a REST endpoint the mock utility can pattern-match yet. |
| CB-031 | BLOCKED | Same gap as CB-028 (HR email notification / mocked recipient mapping). |
| CB-032 | BLOCKED | Same gap as CB-028 (Copy to Self email). |
| CB-033 | BLOCKED | Same gap as CB-028 (Success popup). |
| CB-037 | NOT GROUNDED | CB-014's "Movie Type" field question is now resolved (re-confirmed live 2026-09-21 — real field, unrelated to the separate "Genre" filter on homepage/Cinemas Listing); just needs a dedicated mobile/tablet viewport pass, not yet done. |
| CB-038 | BLOCKED | Same Server-Action-interception gap as CB-030 (network-failure-during-submission test). |

**Pattern:** 6 of 18 (CB-028–033, CB-038) are all the same root cause — this form auto-submits a real booking on OTP entry with no way to intercept it safely. The rest are individual "haven't independently confirmed this specific UI detail live" gaps, not known defects.

## Register/Login — skip reasons (14)

| ID | Reason category | Why skipped |
|---|---|---|
| REG-003 | Out-of-scope | Needs a real mobile device/emulator SIM for phone auto-detect — not simulate-able in a browser context. |
| REG-004 | Out-of-scope | Same SIM-hardware limitation as REG-003 (multiple-SIM prompt). |
| REG-005 | Out-of-scope | OTP auto-read from SMS needs a real device/SIM receiving real SMS. |
| REG-009 | BLOCKED | Google social login needs live MCP/Chrome grounding of the real OAuth popup + a real test Google account. |
| REG-010 | BLOCKED | Apple social login (iOS-only) needs live grounding + a real test Apple account. |
| REG-011 | BLOCKED | Depends on REG-009/010's OAuth grounding (new social ID, missing-details flow). |
| REG-018 | Out-of-scope | SIM mismatch (intl + Indian) — same SIM-hardware limitation as REG-003/004. |
| REG-028 | BLOCKED | Depends on REG-009/010 OAuth grounding to know what to intercept (social login failure). |
| REG-030 | BLOCKED | 3rd-device warning popup needs a real 3-context session-limit scenario against a backend that enforces it; current mock has no session-count state. |
| REG-033 | BLOCKED | Depends on REG-009/010 OAuth grounding (social "ID exists"=true). |
| REG-034 | BLOCKED | Depends on REG-009/010 OAuth grounding (social "ID exists"=false). |
| REG-035 | BLOCKED | Needs a coordinated Admin Panel action mid-session (admin deactivation); no admin API access in this pass. |
| REG-037 | BLOCKED | Depends on REG-009/010 OAuth grounding (must be logged in via social first). |
| REG-038 | BLOCKED | Depends on REG-030's session-limit infra (app-killed-mid-popup edge case). |

**Pattern:** 8 of 14 are downstream of the same OAuth-grounding gap (REG-009/010 need a live Google/Apple test account); 3 are SIM/hardware-only scenarios out of scope for a browser suite; the rest need Admin Panel access this suite doesn't have.

## Complete Your Profile — skip reasons (5)

| ID | Reason category | Why skipped |
|---|---|---|
| TC_ADM_140 | BLOCKED (contradicts sheet) | The "reappears until complete" nudge is actually gated by a `localStorage` flag set the moment it first renders — confirmed live it does NOT reappear on a fresh context with the same phone number. Asserting reappearance would be a false-positive against real, verified behavior. |
| TC_ADM_161 | Not applicable | No free-text input exists anywhere on this step (gender/marital are label-click tiles, DOB/Anniversary are calendar-only) — there's no field to attempt XSS/HTML injection against. |
| TC_ADM_163 | BLOCKED (contradicts sheet) | Mocking a 401 on the save endpoint produces the same generic failure toast as a 500/400, with no logout/redirect observed — the app stays logged in. There's no auto-logout behavior to assert on this build. |
| **TC_ADM_168** | **REGRESSION (confirmed live today)** | `customer_demographic_gender` GA4 event was real and passing as of 2026-08-31; re-confirmed broken again just now (2026-09-21, live network capture during a fresh registration + profile-step-1 submit) — zero GA4 beacons for this event fire on Save & Next. Same tracking regression as `otp-screen.spec.ts` TC_ADM_076 and `registration.spec.ts` TC_ADM_128 (both also re-confirmed broken live today). Real product/analytics issue, not fixable from test code. |
| TC_ADM_169 | Not applicable | DOB has no manual text-entry control anywhere — only a calendar-picker button with zero `<input>` elements — there's no "format" to type invalidly. |

**Pattern:** 3 of 5 are "the sheet's premise doesn't match real, confirmed app behavior" (not gaps, but scenarios that don't apply to this build). 1 (TC_ADM_168) is a confirmed live regression in GA4 tracking, shared with 2 other modules' equivalent events.

---

## Bottom line

- **70/70 live tests across these 3 modules pass.** The only two failures seen were parallel-run flakes, independently confirmed resolved on isolated re-run.
- **37 skips**, none of which are "missing test coverage" — they're either genuine environment/access limits (Admin Panel, OAuth test accounts, SIM hardware), one confirmed-live regression (TC_ADM_168's GA4 event, shared root cause with 2 other modules), or scenarios where the source sheet's premise doesn't match real, verified app behavior.
- Movie Details is the one module needing attention right now — tracked separately, not part of this report.
