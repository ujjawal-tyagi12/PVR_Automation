# Login — Execution Report

**Run:** chromium, production (`www.pvrinox.com`), 15s/test cap, 2026-08-18

## Login (TC_ADM_001 – TC_ADM_026, minus removed social-login rows)

| # | ID | Status | Description |
|---|---|---|---|
| 001–010, 013–022, 024–026 | (23 TCs) | FAIL | All 23 automated scenarios — mobile field, OTP verify/invalid/expired/resend, registration validation, deactivated account, device limit, captcha, T&C links, URL masking |

**Login totals:** PASS 0 · FAIL 23 · SKIP 0

(Full row-by-row: `requirements/login.md`)

## Open fails

| ID(s) | Reason |
|---|---|
| TC_ADM_001–010, 013–022, 024–026 (all 23) | Every scenario opens via `RegisterLoginModule.gotoLogin()`, whose first action is clicking the "Log in" nav button (`getByRole('button', { name: /log ?in/i })`). That locator never resolves against the real production site within the 15s cap, so nothing past that first click can run. This is a **locator-grounding gap, not 23 separate product defects** — see `RegisterLoginPage.ts` `TODO(heal)`. |

## Open skips (reasons)

None — this module has no `test.fixme()` scenarios (the two that existed here, TC_ADM_012 and the OAuth trigger tests TC_ADM_011/023, were removed along with the Social Login module).

**Next step:** ground the "Log in" locator via a live Playwright MCP / Claude-in-Chrome session (production, read-only), then re-run — expected to flip most or all 23 to PASS/real-FAIL in one pass.

Saved: `requirements/login-execution-report.md`
