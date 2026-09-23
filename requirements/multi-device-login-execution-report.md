# Multi-Device Login — Execution Report

**Run:** chromium, production (`www.pvrinox.com`), 15s/test cap, 2026-08-18

## Multi-Device Login (TC_ADM_035 – TC_ADM_046)

| # | ID | Status | Description |
|---|---|---|---|
| 035–043, 045, 046 | (11 TCs) | FAIL | Single/two-device login, 3rd-device warning popup, Cancel/Continue, kill-app-mid-popup, prior-logout re-login, Admin login-settings config, invalid-credentials prompt, popup UI |
| 044 | TC_ADM_044 | **PASS** | Session-state model after oldest-session logout |

**Multi-Device Login totals:** PASS 1 · FAIL 11 · SKIP 0

(Full row-by-row: `requirements/multi-device-login.md`)

## Open fails

| ID(s) | Reason |
|---|---|
| TC_ADM_035–041, 045, 046 (9) | Same upstream blocker as every other module: `RegisterLoginModule.gotoLogin()`'s "Log in" nav button locator never resolves against production within the 15s cap. |
| TC_ADM_042, 043 (2) | Separate, expected blocker: no real Admin Portal URL exists anywhere in the PRD or was provided — `config.adminBaseUrl` is an acknowledged guess (see `TODO(heal)` in `config/index.ts`). |

## Why TC_ADM_044 passed

It's the one scenario in the whole 5-module run that never touches the browser — it asserts directly against the in-memory `DeviceSessionMock` object (`src/utils/DeviceSessionMock.ts`), which is why it's immune to the locator-grounding gap affecting everything else.

## Open skips (reasons)

None — no `test.fixme()` scenarios in this module.

Saved: `requirements/multi-device-login-execution-report.md`
