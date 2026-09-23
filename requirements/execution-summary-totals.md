# Execution Summary — Totals Only

**Compiled:** 2026-08-21 · Based on existing repo artifacts (execution reports + grounding notes). No tests re-run.

## Overall

| Metric | Count |
|---|---|
| Total test cases | 546 |
| Live (runnable) tests | 165 |
| Skipped tests (`test.fixme`, with reason) | 381 |

## Last run details

| Run | Date | Environment | Browser | Cap | Tests | Pass | Fail | Skip |
|---|---|---|---|---|--:|--:|--:|--:|
| Login | 2026-08-18 | production (www.pvrinox.com) | chromium | 15s/test | 23 | 0 | 23 | 0 |
| OTP Screen | 2026-08-18 | production (www.pvrinox.com) | chromium | 15s/test | 45 | 0 | 44 | 1 |
| Registration | 2026-08-18 | production (www.pvrinox.com) | chromium | 15s/test | 33 | 0 | 33 | 0 |
| Multi-Device Login | 2026-08-18 | production (www.pvrinox.com) | chromium | 15s/test | 12 | 1 | 11 | 0 |
| Guest Login | 2026-08-18 | production (www.pvrinox.com) | chromium | 15s/test | 8 | 0 | 8 | 0 |
| Home Screen (tool-executed, trace/video captured) | 2026-08-21 | production (www.pvrinox.com) | chromium | 15s/test | 1 | 0 | 1 | 0 |
| **Total** | | | | | **122** | **1** | **120** | **1** |

## Formally executed run (production, 2026-08-18)

| Metric | Count |
|---|---|
| Tests run | 121 |
| Pass | 1 |
| Fail | 119 |
| Skip | 1 |

## Tool-executed with trace/video evidence

| Metric | Count |
|---|---|
| Tests run | 1 |
| Pass | 0 |
| Fail | 1 |

## Skip reasons breakdown

| Category | Count |
|---|---|
| Shared OTP-blocker root cause | 172 |
| Other shared-reason clusters | 51 |
| Out-of-scope by design (App/M-Site, hardware, localization) | 13 |
| Unique single-test reasons | 158 |
| **Total** | **381** |

## Bugs

| Category | Count |
|---|---|
| Confirmed bug with evidence | 1 |
| Automation-blocked fails (locator-grounding gap) | 119 |
| Possible product gaps flagged for review | ~20 |
