# Registration — Execution Report

**Run:** chromium, production (`www.pvrinox.com`), 15s/test cap, 2026-08-18

## Registration (TC_ADM_105 – TC_ADM_137)

| # | ID | Status | Description |
|---|---|---|---|
| 105–137 | (33 TCs) | FAIL | Mobile field/auto-detect, OTP→Registration Details, mandatory-field validation, optional email OTP, WhatsApp opt-in, account creation, security/perf/a11y/regression checks |

**Registration totals:** PASS 0 · FAIL 33 · SKIP 0

(Full row-by-row: `requirements/registration.md`)

## Open fails

| ID(s) | Reason |
|---|---|
| TC_ADM_105–137 (all 33) | Same upstream blocker as every other module: `RegisterLoginModule.gotoLogin()`'s "Log in" nav button locator never resolves against production within the 15s cap. Not 33 separate defects — one locator-grounding gap. |

## Open skips (reasons)

None — this module has no `test.fixme()` scenarios; every row is technically automatable via mocking (no OAuth or unreachable-infra dependency).

Saved: `requirements/registration-execution-report.md`
