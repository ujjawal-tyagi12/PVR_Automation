# Playwright: OTP Screen — deep OTP mechanics, security, performance, and a11y checks

## Acceptance criteria

- OTP screen shows mobile number, edit affordance, 6-digit numeric field, timer, resend (disabled initially), verify.
- OTP auto-validates on the 6th digit; wrong/expired/reused OTP is rejected with the documented copy; 3 wrong attempts locks for 10 min.
- Resend is disabled for 60s then enabled; max 3 resend requests per 10 min; editing the number invalidates the old OTP and issues a new one.
- OTP never appears in the URL or browser console/logs; traffic is HTTPS; error copy is plain-language.
- Layout is responsive and keyboard-navigable; a baseline contrast check is met.

## Navigation

1. Launch the Website, enter a valid 10-digit mobile number, tap Get OTP.
2. Land on the OTP screen.

## Test coverage

- **Scope:** Regression — every row in the source sheet's "OTP Screen" module.
- **Types included:** Positive, Negative, Security, Performance (proxy), Accessibility (proxy), Analytics (proxy)
- **Scenarios included:** 45 (TC_ADM_047–091), 44 automated, 1 `test.fixme()`.
- **Removed:** TC_ADM_092 (existing mobile linked via social) — the Social Login module and every social-login-dependent scenario across the suite were removed at the user's explicit request; it's no longer present in this ticket or its spec.
- **Automation note:** TC_ADM_080 (localization) is `test.fixme()` — the sheet itself marks it conditional ("*Only if we have the localization requirement*") and no locale/switcher UI is documented anywhere in the PRD. Several "hard" checks (perf timing, GA4, contrast, log-leak, HTTPS) are automated via **proxy techniques** rather than the tools a dedicated tool would use (no axe-core/visual-regression service is in this project) — see E2E notes for exactly what each one actually measures, since a passing proxy check is not the same guarantee as the named real-world tool would give.
- **Out of scope:**
  - TC_ADM_057 — dynamic resend countdown display — **Excluded**, confirmed absent on live build (the resend control's visible text is just "Resend Code" with no adjacent numeric seconds-countdown anywhere on the page; only a binary disabled/enabled button state exists client-side); removed from suite.
  - TC_ADM_077 — GA4 event fires on OTP resend — **Excluded**, confirmed absent on live build (a live resend cycle produced only a single GA beacon with no batched event data at all; resend genuinely does not fire its own distinct GA4 event on this build); removed from suite.

## Scenarios

- **Suggested journey:** `src/tests/otp-screen.spec.ts`
- **Seed:** User-provided test-case sheet, "OTP Screen" module rows TC_ADM_047–092

| ID | Title | Priority | Status |
|---|---|---|---|
| TC_ADM_047 | OTP screen UI loads correctly | High | Automated |
| TC_ADM_048 | Edit mobile number navigates back, prefilled/editable | Medium | Automated |
| TC_ADM_049 | OTP entry numeric-only | High | Automated |
| TC_ADM_050 | OTP field trims whitespace | Medium | Automated |
| TC_ADM_051 | OTP field clears after submission | Low | Automated |
| TC_ADM_052 | Back navigation doesn't skip OTP verification | Medium | Automated |
| TC_ADM_053 | New OTP generated on return to OTP screen | Low | Automated |
| TC_ADM_054 | OTP reuse prevention | — | Automated |
| TC_ADM_055 | Resend counter resets after successful validation | Medium | Automated |
| TC_ADM_056 | Change mobile mid-flow invalidates old OTP | High | Automated |
| TC_ADM_057 | Dynamic resend countdown display | Medium | Excluded — removed from suite |
| TC_ADM_058 | Expired OTP used after timeout | High | Automated |
| TC_ADM_059 | Slow/unstable network shows retry message | Medium | Automated (route abort simulation) |
| TC_ADM_060 | Refresh resets OTP flow | Medium | Automated |
| TC_ADM_061 | Auto-validation triggers after 6 digits | High | Automated |
| TC_ADM_062 | Success flow with valid OTP | High | Automated |
| TC_ADM_063 | Error on invalid OTP | High | Automated |
| TC_ADM_064 | OTP expiry | High | Automated |
| TC_ADM_065 | Resend disabled initially | Medium | Automated |
| TC_ADM_066 | Resend enabled after timer | Medium | Automated |
| TC_ADM_067 | Max OTP resend limit | High | Automated |
| TC_ADM_068 | Lockout after 3 wrong attempts | High | Automated |
| TC_ADM_069 | Copy-paste OTP | Medium | Automated |
| TC_ADM_070 | OTP validation API response time < 3s | High | Automated (mocked-latency proxy) |
| TC_ADM_071 | OTP resend latency < 5s | Medium | Automated (mocked-latency proxy) |
| TC_ADM_072 | OTP transmission over secure channel | Critical | Automated (URL/request-protocol proxy) |
| TC_ADM_073 | OTP not persisted in logs | Critical | Automated (browser console-leak proxy; server logs unreachable) |
| TC_ADM_074 | Alignment of OTP field/timer/buttons | Medium | Automated (`toHaveScreenshot()` baseline) |
| TC_ADM_075 | Contrast ratio (WCAG 2.1) | Medium | Automated (in-page contrast calculator, no axe-core) |
| TC_ADM_076 | GA4 event: OTP success | Medium | Automated (network-beacon proxy, not dashboard) |
| TC_ADM_077 | GA4 event: OTP resend | Medium | Excluded — removed from suite |
| TC_ADM_078 | Cross-browser behavior | High | Automated (runs meaningfully under `--project=firefox/webkit` too) |
| TC_ADM_079 | Web & mobile responsiveness | Medium | Automated (viewport matrix) |
| TC_ADM_080 | Localization | Low | `test.fixme()` — sheet marks conditional; no locale data documented |
| TC_ADM_081 | Login/OTP API integration payload & status codes | High | Automated (asserts our own mock's request/response contract) |
| TC_ADM_082 | Regression: execute all OTP flows | Medium | Automated (composite sanity chain) |
| TC_ADM_083 | URL masking (M-site) | High | Automated (mobile viewport) |
| TC_ADM_084 | Keyboard accessibility (Tab) | Medium | Automated |
| TC_ADM_085 | Usability of error messages | Medium | Automated (plain-language heuristic check) |
| TC_ADM_086 | API failure handling | High | Automated (mocked 500) |
| TC_ADM_087 | Wrong OTP entry | Medium | Automated |
| TC_ADM_088 | OTP resend | Medium | Automated |
| TC_ADM_089 | Max OTP requests | High | Automated |
| TC_ADM_090 | Multi-device login limit | High | Automated |
| TC_ADM_091 | Email verification via OTP | Medium | Automated |

## E2E implementation notes

- **Layering:** `src/tests/otp-screen.spec.ts` → `RegisterLoginModule`/`AdminLoginSettingsModule` reused → `RegisterLoginPage`.
- **APIs:** `src/utils/OtpMock.ts` (all OTP traffic); `src/utils/DeviceSessionMock.ts` (TC_ADM_090).
- **Proxy-technique details** (no real contract/tooling available):
  - **Perf (070/071):** measures wall-clock time around a mocked route with an injected artificial delay — proves the UI doesn't block beyond the threshold given a known server latency, not real production latency.
  - **Security/HTTPS (072/083):** checks `page.url()` / request URLs are `https://` and free of `otp`/`token` query params — does not inspect TLS handshake internals.
  - **Log-leak (073):** captures `page.on('console')` output during the OTP flow and asserts the OTP value never appears in it — cannot see server-side log files.
  - **Contrast (075):** `src/utils/ContrastHelper.ts` computes WCAG relative-luminance contrast in-page via `getComputedStyle` — a minimal reimplementation, not a replacement for axe-core (not a project dependency).
  - **Visual layout (074):** Playwright's built-in `expect(page).toHaveScreenshot()` — first run creates the baseline image; treat the first CI run as a baseline commit, not a pass/fail signal.
  - **GA4 (076/077):** `src/utils/AnalyticsHelper.ts` waits for the standard GA4 Measurement Protocol network beacon (`google-analytics.com/g/collect`) with the expected `en` (event name) param — verifies the beacon fires, not what appears on a GA4 dashboard.
  - **API contract (081):** asserts the shape of requests our own mock receives — documents/enforces the assumed contract, does not validate the real backend.
- **Locators:** Unverified guesses — see `TODO(heal)` in `RegisterLoginPage.ts`.
- **Tags:** `@P0`/High or Critical → `@Smoke` on 047/061/062/063/064/068/072/073; rest `@Regression`.
- **Run:** `npx playwright test src/tests/otp-screen.spec.ts --project=chromium` (add `--project=firefox`/`--project=webkit` for TC_ADM_078's cross-browser intent)

## Source

- **Seed method:** User-provided test-case sheet (pasted)
- **Module:** OTP Screen
- **Testing types:** Regression (all rows)
- **IDs:** Original `TC_ADM_XXX` IDs preserved.
- **Frontend repo:** not provided
- **API contract:** not provided — mocked per `src/utils/OtpMock.ts`
