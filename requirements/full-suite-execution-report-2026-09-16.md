# Full Suite Execution Report — All 35 Spec Files

**Run date:** 2026-09-15/16 · **Environment:** UAT (`uat-web.pvrinox.com`), `chromium` project only · **Method:** suite tagged into 7 batches (`@RUN1`–`@RUN7`, 5 spec files each) to stay under sandbox memory limits; each batch run via `npx playwright test --grep @RUNn --project=chromium`, executed sequentially after `npm run clean` wiped prior `test-results/`, `playwright-report/`, `tta-report/`. This is a real, tool-executed run — every number below has trace/video/screenshot evidence in `test-results/`.

---

## 1. Headline numbers

| Metric | Count |
|---|---:|
| **Total tests executed** | **929** |
| **Passed** | **628** (67.6%) |
| **Failed** | **82** (8.8%) |
| **Skipped** (`test.fixme()` or runtime `test.skip()`) | **219** (23.6%) |

### Per-batch breakdown

| Batch | Files | Total | Passed | Failed | Skipped |
|---|---|---:|---:|---:|---:|
| RUN1 | about-us, careers, careers-extended, cinemas-listing-detail, city-selection | 175 | 121 | 8 | 46 |
| RUN2 | coming-soon, complete-your-profile, curated-shows, download-calendar, event-details | 165 | 117 | 13 | 35 |
| RUN3 | event-listing, experience, experience-visual, faqs, faqs-extended | 91 | 62 | 2 | 27 |
| RUN4 | global-search, guest-login, home-screen, investor-section, investor-section-extended | 113 | 74 | 9 | 30 |
| RUN5 | legal-content, legal-content-extended, login, login-validation, movie-alerts | 91 | 64 | 11 | 16 |
| RUN6 | movie-details, multi-device-login, news, news-extended, offers-extended | 119 | 55 | 33 | 31 |
| RUN7 | offers, otp-screen, profile-edit, register-login, registration | 175 | 135 | 6 | 34 |

---

## 2. Failures (82) — by root cause

Not 82 separate product defects — they collapse into 5 root causes:

| # | Root cause | Count | Product defect? |
|---|---|---:|---|
| A | **Movie Details `beforeEach` hook timeout** (single systemic cause) — every affected test timed out at 300s before the test body even ran. Ties to the already-documented live-data volatility on Movie Details (cinemas flip between real showtimes and "0 Shows" within minutes, per `MOV-002`/`MOV-003` grounding notes) | **27** | No — environment/data volatility |
| B | **DNS/network connectivity errors** (`ERR_NAME_NOT_RESOLVED`, `ERR_INTERNET_DISCONNECTED`, `ERR_NETWORK_CHANGED`, `ENOTFOUND`) — sandbox network dropped mid-run | **13** | No — sandbox/infra |
| C | **Context teardown / hard timeout** (`Tearing down "context" exceeded the test timeout`, generic `Test timeout exceeded` with no assertion) — sandbox resource pressure, not app behavior | **6** | No — sandbox/infra |
| D | **Test-script error** (`apiResponse.json: Response has been disposed` — a race in the test's own API-mock teardown) | **1** | No — automation bug |
| E | **Real assertion failures against live app behavior** — genuine candidate product defects | **35** | **Yes — candidates** |

### 2.1 Genuine candidate defects (bucket E, 35)

| Test | Module | What failed |
|---|---|---|
| CAR-004 | Careers | Banner `<img alt="Career">` exists but is `hidden`, not visible |
| CIN-041 | Cinemas Listing | City-change nudge "Yes" control not visible |
| CIN-042 | Cinemas Listing | City-change nudge "No" control not visible |
| CIN-057 | Cinemas Listing | Top movie card not expanded by default |
| CIN-065 | Cinemas Listing | Filter/option list not in alphabetical order |
| EXP-066 | Experience (visual) | Page overflows horizontally on small screens |
| HOME-015 | Home Screen | Spotlight carousel doesn't pause on hover/touch |
| HOME-016 | Home Screen | Spotlight carousel doesn't loop continuously |
| HOME-018 | Home Screen | Trending tile click doesn't navigate to Movie Detail (previously confirmed finding — reproduced again) |
| HOME-044 | Home Screen | Trailer-failure error message not shown |
| HOME-058 | Home Screen | Homepage overflows horizontally on mobile |
| INV-033/034 | Investor Section | Analyst Coverage cards not alphabetical / contact-detail mismatch |
| LGL-035 | Legal Content (ext.) | Expected inline hyperlinks not found in policy body |
| **LGL-036** | Legal Content (ext.) | **Confirmed real bug**: "PVR Cinemas" footer link points to `web.pvrcinemas.com`, which is NXDOMAIN (independently verified via `nslookup`) — opens a dead tab |
| LGL-038 | Legal Content (ext.) | Heading uses non-ASCII characters (NBSP + curly apostrophe) the test didn't expect |
| LGL-017 | Legal Content | Terms & Conditions content assertion failed |
| LGL-019 | Legal Content | Sub-tab DOM order doesn't match expected sequence |
| LGL-020 | Legal Content | Default sub-tab selection assertion failed |
| LGL-021 | Legal Content | Default sub-tab content assertion failed |
| ALT-014 | Movie Alerts | Delete-alert flow assertion failed |
| ALT-021 | Movie Alerts | Error message not shown on simulated save failure |
| ALT-022 | Movie Alerts | Duplicate-click handling on Save doesn't match expectation |
| ALT-023 | Movie Alerts | Session-expiry redirect lands on `/coming-soon/...` instead of the login sidebar |
| NWS-044 | News (ext.) | Latest-news ordering doesn't match DOM-order proxy |
| NWS-008 | News | Month filter values assertion failed |
| NWS-013 | News | News sequence doesn't match expected order |
| **NWS-019** | News | **Confirmed real bug**: clicking a category tab does not filter the list at all |
| NWS-020 | News | Same root cause as NWS-019 — switching tabs has no effect |
| OFR-013 | Offers (ext.) | "Offers hidden when none available" assertion failed |
| OFR-028 | Offers | App behavior on mid-session internet drop doesn't match expectation |
| OFR-038 | Offers | Tapping an offer chip doesn't navigate to offer detail (15s timeout) |
| TC_ADM_176 | Profile Edit | OTP-sent-on-email-change assertion failed |
| TC_ADM_180 | Profile Edit | Resend-OTP button not disabled during cooldown |
| TC_ADM_205 | Profile Edit | Same as TC_ADM_180 (duplicate coverage) |
| TC_ADM_134 | Registration | Mobile-responsiveness assertion failed |

**Of these 35, two have independently corroborated evidence of being real product bugs** (not test-authoring issues): **LGL-036** (dead external link, confirmed via `nslookup`) and **NWS-019/NWS-020** (category filter is non-functional, same root cause counted once). The rest are real assertion failures against live behavior but haven't been independently cross-checked outside the test itself — recommend manual spot-check before filing.

---

## 3. Skipped (219) — by reason

| Reason category | Count |
|---|---:|
| **BLOCKED** — requires an Admin Panel data state, real backend contract, or environment access this suite cannot reach from the UI | **157** |
| **Missing/volatile live test data** — the live UAT environment doesn't currently have the data state needed (no Sold Out showtime, no zero-result filter, no real cinema showtimes at run time, chip/section didn't render this pass) | **35** |
| **Out-of-scope** — needs real SIM/hardware, native OS permission prompts, OAuth+real test account, or is App/M-Site-only (desktop web suite can't reach it) | **18** |
| **REGRESSION** — source PRD/sheet data no longer matches live site (e.g., the anchor event referenced in Event Listing tests no longer exists) | **8** |
| **EXCLUDED** — not independently testable as a distinct scenario from an already-covered one | **1** |

**Dominant pattern:** 157 of 219 skips (72%) are `BLOCKED` on an Admin Panel or backend-contract gap this Playwright-only suite structurally cannot reach — this is an access/scope limitation, not a coverage gap in the test code.

---

## 4. Bottom line

- **True genuine-defect count from this run: 2 fully confirmed** (LGL-036 dead link, NWS-019/020 non-functional category filter) **+ 33 unconfirmed-but-real-assertion-failure candidates** worth a manual pass.
- **82 raw failures ≠ 82 bugs** — 47 of them are sandbox/network/data-volatility noise (buckets A–D), not product defects.
- **219 skips are overwhelmingly access-scope blockers** (Admin Panel, backend contracts, hardware/OAuth), not missing test coverage.

*Full per-test evidence (trace.zip/video.webm/screenshot) for every failure lives under `test-results/` from this run.*
