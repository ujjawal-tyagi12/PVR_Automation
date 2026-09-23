# Consolidated Execution Report — All Modules

**Compiled:** 2026-08-21 · **Source:** existing repo artifacts only (5 per-module execution reports, `test.fixme()` grounding notes across all 17 spec files, `test-results/`, `playwright-report/`, `tta-report/`). **No tests were re-run to produce this document.**

**Scope:** 17 spec files in `src/tests/` (`sample.spec.ts` excluded — starter template).

---

## 1. Headline numbers

| Metric | Count |
|---|---|
| Total test cases defined across the suite | **546** |
| Live tests (able to execute — `test(...)`) | **165** (30%) |
| Skipped tests (`test.fixme()`, each with a recorded reason) | **381** (70%) |
| Modules with a formal execution run recorded (login/OTP/registration/multi-device-login/guest-login) | 5 (121 tests, all against production, 2026-08-18) |
| Confirmed pass from that run | 1 (TC_ADM_044, mock-only assertion) |
| Confirmed fail from that run | 119 |
| Tests actually executed by the Playwright tool itself (trace/video evidence) | **1** — `HOME-018`, and it **failed** |

---

## 2. Bugs / Failures

### 2.1 The one tool-executed, evidence-backed bug

| ID | Title | Result | Evidence |
|---|---|---|---|
| **HOME-018** | Trending/Spotlight movie tile click → navigates to Movie Detail (`home-screen.spec.ts`, @P0 @Smoke) | **FAIL** | `test-results/home-screen-Home-Screen-HO-7ba93-es-to-Movie-Detail-P0-Smoke-chromium/` — trace.zip, video.webm, screenshot, error-context.md |

**What happened:** the test clicked the first Spotlight tile ("Ramayanam (Hindi)") and waited for a navigation/URL change. The wait timed out after 15s (`page.waitForURL: Timeout 15000ms exceeded`). The page snapshot at failure time shows the homepage fully and correctly rendered (nav, banners, Now Showing, Events, Coming Soon, Experiences, Trailers, Offers all populated) — so the page itself is healthy; the click either isn't triggering navigation, or navigation happens in a way the wait condition doesn't match (e.g. no full `load` event, SPA route change, or a new tab).

This is the **only finding in the entire repo backed by an actual Playwright execution** (trace + video + screenshot). Recommend prioritizing this one for real triage.

### 2.2 FAILs from the 5 formally-run modules (production, 2026-08-18, 15s/test cap)

All 119 fails trace to **two root causes**, not 119 separate product defects:

| Root cause | Modules / TC range affected | Count |
|---|---|---|
| `RegisterLoginModule.gotoLogin()`'s "Log in" nav button locator never resolves against production within the 15s cap — nothing past that first click can execute (locator-grounding gap in `RegisterLoginPage.ts`, marked `TODO(heal)`) | Login (23), OTP Screen (44), Registration (33), Guest Login (8), Multi-Device Login (9 of 11) | 117 |
| No real Admin Portal URL exists in the PRD or was provided — `config.adminBaseUrl` is an acknowledged placeholder guess (`TODO(heal)` in `config/index.ts`) | Multi-Device Login (TC_ADM_042, 043) | 2 |

| Module | PASS | FAIL | SKIP | Report |
|---|---|---|---|---|
| Login (TC_ADM_001–026) | 0 | 23 | 0 | `login-execution-report.md` |
| OTP Screen (TC_ADM_047–091) | 0 | 44 | 1 | `otp-screen-execution-report.md` |
| Registration (TC_ADM_105–137) | 0 | 33 | 0 | `registration-execution-report.md` |
| Multi-Device Login (TC_ADM_035–046) | 1 | 11 | 0 | `multi-device-login-execution-report.md` |
| Guest Login (TC_ADM_027–034) | 0 | 8 | 0 | `guest-login-execution-report.md` |
| **Total** | **1** | **119** | **1** | |

**Why TC_ADM_044 passed:** it's the one scenario that never touches the browser — it asserts directly against the in-memory `DeviceSessionMock` object, so it's immune to the locator-grounding gap.

**Bottom line on this section:** these 119 are **automation-blocked**, not confirmed product defects — every one of them opens via the same nav-button click that doesn't resolve in time. **Next step (already noted in the source reports):** ground the "Log in" locator via a live Playwright MCP / Claude-in-Chrome session against production, then re-run — expected to flip most/all to real PASS or real FAIL in one pass.

### 2.3 Possible real product gaps surfaced during grounding (worth a manual check, not yet confirmed bugs)

These weren't caught by an executed test — they were noted while manually grounding locators for other modules, and each says a specific expected UI element could **not be found at all** on production. Flagging separately because these look like they could be genuine missing-feature findings rather than automation gaps:

| Area | Note |
|---|---|
| Homepage — "Quick Book" section | 0 matches anywhere on the page, case-insensitive (HOME-052) |
| Homepage — "ScreenIT" section | chip visibility confirmed false (HOME-056) |
| Homepage — "Curated Shows" section | chip visibility confirmed false (HOME-057) |
| Homepage — IMAX / Experience chips | zero IMAX-related text found anywhere (HOME-020, HOME-021) |
| Homepage — any `<video>` element | none exists; no ambient autoplay banner/trailer anywhere (HOME-024, HOME-040) |
| Homepage — "Book Now" CTA on movie cards | 0 matches; card-click is the only working path (HOME-034) |
| Homepage — favorite/wishlist icons | 0 matches anywhere; "Passport" nav link neither navigates nor prompts login (HOME-060) |
| Movie Detail — "Reset"/"Clear" filters button | 0 matches, confirmed twice (MOV-013) |
| Movie Detail — distance filter / "Enable Location" CTA | 0 matches, confirmed twice (MOV-030) |
| Cinema Listing — "Accessibility" filter | not found as a distinct top-level filter, may be nested (CIN-025, CIN-071) |
| Cinema Listing — search box on cinema-first view | none exists; only present on the movie-first view (CIN-022, CIN-061, CIN-023) |
| Cinema Listing — "Experiences"/"Price Range" filter buttons | present in DOM but fail `toBeVisible()` across 3 grounding passes — likely a horizontally-scrolled/hidden filter strip (CIN-024, CIN-054, CIN-072, CIN-028) |
| Cinema Listing — Map View button | inconsistent visibility across passes, sometimes absent entirely — destabilizes 14 dependent test cases (CIN-004 and its 14 dependents) |
| Login — "Continue as Guest" control | not found anywhere on the environment (TC_ADM_013) |
| Login — OTP rejection (invalid/expired/lockout) | UAT backend accepts any 6-digit code including `000000` — no rejection path exists to test on this environment (TC_ADM_003, 004, 016) |
| Event Listing — "View All" CTA / dedicated listing page | confirmed absent on both environments (EL-002, EL-004–006) |
| Experience — "Watch Trailer" CTA distinct from card | not found (EXP-019); real CTA copy is "Learn More About {EXPERIENCE}", not what the source sheet expected (EXP-011) |

**Recommend routing this list to product/dev for a quick "is this expected" pass** — several of these (Quick Book, ScreenIT, Curated Shows, distance filter, Reset Filters) read like they should exist per the PRD but don't appear on the live build.

---

## 3. Skipped test cases (`test.fixme()`) — 381 total, by reason

### 3.1 Dominant root cause — 172 of 381 (45%)

> **OTP-entry screen never renders after "Get OTP"** — real production `/api/send-phone-otp` response contract is unconfirmed (see `OtpMock.ts` grounding note, 2026-08-18). Needs real backend docs or an authorized manual-login HAR capture to unblock.

This single environment/test-data gap blocks everything downstream of login across 7 files:

| Module | Skipped for this reason |
|---|---|
| Profile Edit | 44 (TC_ADM_172–215) |
| Complete Your Profile | 34 (TC_ADM_138–171) |
| Registration | 31 (TC_ADM_107–137) |
| OTP Screen | 35 (TC_ADM_047–091, all but TC_ADM_080) |
| Register/Login | 19 (REG-001/002/007/008/013/014/015/019/021/023/024/025/027/029/031/032/036/039/040) |
| Multi-Device Login | 8 (TC_ADM_035–041, 046) |
| Guest Login | 1 (TC_ADM_030) |

This is the same underlying gap as the 5 execution-report FAILs in §2.2 — one environment-access blocker responsible for the overwhelming majority of both the FAILs and the SKIPs project-wide.

### 3.2 Other shared-reason clusters (2+ tests each)

| Module | Count | Reason |
|---|---|---|
| Cinemas Listing/Detail | 14 | Map View button visibility inconsistent across grounding passes (CIN-004 family) |
| Register/Login | 3 | Depends on REG-009/010 OAuth grounding (social login itself unconfirmed) |
| Movie Details | 3 | Not independently grounded this pass (MOV-027, 044, 045) |
| Cinemas Listing/Detail | 3 | Depends on CIN-061/022 search UI, which isn't reachable |
| Event Details | 5 | Not confirmed during grounding — page still loading at inspection time |
| Home Screen (visual companion, experience-visual.spec.ts) | 2+2+2 | Depends on EXP-023 Set Alert (login-gated); no distinct description element; no separate Coming Soon section |
| Global Search | 4 | No mic/voice affordance found inside the search dialog (grounded 2026-08-19) |
| Event Listing | 3 | No dedicated Event Listing page exists to hold filters |
| Event Listing | 2 | No distinct "Watch Promo" CTA confirmed on homepage event cards |
| Cinemas Listing/Detail | 2 | Depends on CIN-040 (city-mismatch nudge, itself unconfirmed) |
| Cinemas Listing/Detail | 2 | No movie title long enough to observe truncation as test data |
| Event Details | 2 | Not confirmed during grounding + source sheet leaves expected message blank |

### 3.3 Out-of-scope by design (App/M-Site-only, or hardware-dependent — not blockers, just not automatable here)

| Reason | Count / examples |
|---|---|
| App/M-Site-only feature; this project automates desktop Web | HOME-050, HOME-053, MOV-049, EXP-001, EXP-054, EL-003, EL-012 |
| Native OS `getUserMedia()` permission prompt — no in-page DOM to assert on | EXP-015, EXP-064, MOV-011/012 (mic/voice search) |
| Real SIM/hardware needed (auto-detect phone, multi-SIM, SMS auto-read) | REG-003, REG-004, REG-005, REG-018 |
| Chromium-only Playwright config — no cross-browser project set up | HOME-059 |
| Localization — conditional per source sheet, no locale requirement documented in PRD | TC_ADM_080 |

### 3.4 Per-file totals (fixme / live / total)

| Spec file | Skipped | Live | Total |
|---|--:|--:|--:|
| cinemas-listing-detail.spec.ts | 61 | 14 | 75 |
| profile-edit.spec.ts | 44 | 1 | 45 |
| movie-details.spec.ts | 35 | 14 | 49 |
| otp-screen.spec.ts | 36 | 9 | 45 |
| complete-your-profile.spec.ts | 34 | 1 | 35 |
| register-login.spec.ts | 34 | 6 | 40 |
| home-screen.spec.ts | 33 | 27 | 60 |
| registration.spec.ts | 31 | 2 | 33 |
| experience-visual.spec.ts | 16 | 24 | 40 |
| experience.spec.ts | 15 | 13 | 28 |
| event-details.spec.ts | 12 | 2 | 14 |
| multi-device-login.spec.ts | 8 | 4 | 12 |
| event-listing.spec.ts | 9 | 5 | 14 |
| login.spec.ts | 6 | 10 | 16 |
| global-search.spec.ts | 5 | 20 | 25 |
| login-validation.spec.ts | 1 | 6 | 7 |
| guest-login.spec.ts | 1 | 7 | 8 |
| **Total** | **381** | **165** | **546** |

### 3.5 Uniquely-blocked test cases (one reason, one test — not grouped)

**158 fixme reasons are unique to a single test case** — each is its own distinct blocker: missing negative/edge test data (e.g. no Sold Out showtime, no zero-showtime movie, no lapsed showtime, no admin-priority data), a specific UI element genuinely not found during live grounding (see §2.3 — several of these overlap with possible real bugs), or a dependency on another still-unconfirmed scenario. Full verbatim list (all 158, with file/line/exact reason) is preserved in the per-file grep data used to compile this report — available on request if a line-by-line audit is needed; not reproduced here in full to keep this document readable.

Representative spread by module: Cinemas Listing/Detail (43 unique), Movie Details (32 unique), Home Screen (33 unique — all unique, no shared reasons in that file), Experience + Experience-visual (25 unique combined), Register/Login (12 unique), Event Details/Listing (9 unique combined), Login/Login-validation (7 unique).

---

## 4. Report artifacts that contributed **no** data

| Artifact | Why it doesn't count as execution evidence |
|---|---|
| `playwright-report/index.html` | Embeds a `report.json` for `movie-details.spec.ts` only, with `"total":49, "expected":0, "unexpected":0, "skipped":49`, every test at `duration:0`. This is a listing/never-executed snapshot, not a real run — it does confirm the 35/14 fixme/live split for that file but nothing else. |
| `tta-report/summary.json` | Empty/stale: `{"status":"passed","total":0,"passed":0,"failed":0,"skipped":0,"tests":[]}`. |

---

## 5. Recommended next actions (priority order)

1. **Triage HOME-018** — the one real, evidence-backed failure (trace/video available). Confirm whether the click genuinely doesn't navigate, or the wait condition is wrong.
2. **Ground the "Log in" nav-button locator** in `RegisterLoginPage.ts` — unblocks 117 of the 136 recorded FAILs and would let those modules actually re-run for real pass/fail signal instead of a blocked-at-step-1 state.
3. **Get the real `/api/send-phone-otp` contract** (backend docs or an authorized HAR capture) — unblocks 172 of 381 skips (45% of all skipped coverage) across Profile Edit, Complete Your Profile, Registration, OTP Screen, Register/Login, Multi-Device Login, Guest Login.
4. **Send the §2.3 "possible product gaps" list to product/dev** for a quick confirm/deny pass — several read like real missing features (Quick Book, ScreenIT, Curated Shows section, Reset Filters button, distance filter) rather than automation gaps.
5. Everything else in §3.3 (App/M-Site-only, hardware-dependent, localization) is **out of scope by design**, not a gap to chase.

---

*Compiled from: `requirements/{login,otp-screen,registration,multi-device-login,guest-login}-execution-report.md`, `test.fixme()` grounding notes in `src/tests/*.spec.ts`, `test-results/`, `playwright-report/index.html`, `tta-report/summary.json`. No new test execution was performed.*
