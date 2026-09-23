# Curated Shows / Coming Soon / Set-Update-Delete Alert — Execution Report

**Run:** chromium, UAT (`inox-uat-web.pvrinox.com`), Mumbai-All, 2026-09-01/02 · Source sheet: user-pasted `TC_Web_076–195` (reconciled against and superseding the earlier `M6-website.pdf`/`TC_App`-sourced tickets for these 3 modules). Every number below is from a real `npx playwright test` run, with any full-suite failure isolate-retried before being counted as real vs. transient.

## Headline numbers

| Module | Spec file | Total | Live/Pass | `test.fixme` | Ticket |
|---|---|---|---|---|---|
| Curated Shows | `curated-shows.spec.ts` | 71 | **54** | 17 | `curated-shows.md` |
| Coming Soon | `coming-soon.spec.ts` | 30 | **24** | 6 | `coming-soon.md` |
| Set/Update/Delete Alert | `movie-alerts.spec.ts` | 23 | **18** | 5 | `movie-alerts.md` |
| **Total** | | **124** | **96 (77%)** | **28 (23%)** | |

`npm run build` and `npm run rules:check` (84 files) pass clean as of the last change across all three.

---

## 1. Curated Shows (CSH-001–071)

**54 passed / 17 skipped.** Full-suite runs show 1–2 tests flaking under parallel UAT load (transient, different test each run) — all confirmed clean on isolated retry.

**Key finding:** UAT has **no curated-shows content configured for any of its 11 cinema-cities** (confirmed via direct API check per city, not just Mumbai as the original ticket assumed) — this is why the largest passing cluster is the empty-state UI (CSH not shown, "Back to Homepage" CTA, no stale-data-on-city-switch, etc.), while content-dependent scenarios use `page.route()` mocking against the real API field shapes pulled from the live Next.js bundle.

**Skips (17):** no "See All" control exists (carousel, not list) · movie-card click doesn't navigate even when mocked · no admin enable/disable flag, category-sequence field, personalization, or date-filter logic found in the real source · no trailer on the listing card · homepage "More"-menu nav path unreproducible.

**Sheet corrections found:** empty-state CTA text is "Back to Homepage" not "Let's Go" · an empty category still renders its heading · a failed API call falls back to the same empty state, not a distinct error.

---

## 2. Coming Soon (CMS-001–030)

**24 passed / 6 skipped.** Stable across repeated runs, no flakiness observed.

**Skips (6):** no hover-trailer capability exists on the listing card at all (trailer only on the movie detail page — same pattern as Curated Shows, confirmed independently) · no "Coming Soon" section exists on the homepage right now · "Delete Alert" needs an alert to already exist, which needs the Movie Alerts flow (correctly deferred to that module).

**Real bugs found (in the generated test code, fixed):** a locator regex missing whitespace Playwright inserts around an accessible-name separator · a card-click race asserting against a stale pre-navigation DOM.

**Mic-permission finding:** denied mic fires a real native `alert()` — wording differs slightly from Curated Shows' own alert text (first observed copy inconsistency across modules).

---

## 3. Set/Update/Delete Alert (ALT-001–023)

**18 passed / 5 skipped**, 23 total (18 primary scenarios mapped 1:1 to the pasted sheet + 4 additional scenarios re-grounded live from the old ticket's larger scope, e.g. My Movie Alerts page, save-failure injection). 12 further old-ticket scenarios were retained in the ticket as documented-but-not-implemented (this UAT dataset has only 3 real cinemas — too few to test list scrolling, multi-city display, etc.).

**Skips (5):**
- **ALT-006** — no 5-cinema max-selection limit enforced anywhere, client or server (contradicts the source sheet)
- **ALT-008** — voice-recognition accuracy, standing exclusion across the whole suite
- **ALT-013** — a genuine product race condition, root-caused via 3 rounds of POST-body trace comparison: clicking "Update Alert" right after adding a cinema can silently submit without it — a real backend/frontend state-desync with no discoverable DOM signal to wait on
- **ALT-017** — Mumbai's two sub-cities map to an identical parent record server-side, nothing distinguishable to assert
- **ALT-019** — no backend/admin hook exists to trigger booking-open auto-removal

**Mic-permission finding:** denied mic fires a real `alert()` — text is **word-for-word identical to Coming Soon's**, and differs from Curated Shows'. Across all 3 modules, this is now a 2-vs-1 wording split worth a product/copy consistency check.

**Other real findings:** no "mandatory selection" error message exists (Save just stays disabled) · WhatsApp toggle defaults ON regardless of the account's prior opt-out · session-expiry redirects to homepage with a `?sidebar=login` marker (confirms the original ticket's premise after a first wrong assumption was corrected).

---

## Cross-module pattern

All 3 modules hit the same class of `test.fixme`: features the source sheet assumes exist but live grounding shows don't (limits, sequencing, personalization, hover-trailers, See All), rather than automation-tooling gaps. None were guessed — every skip cites a specific live check performed against UAT.

Saved: `requirements/curated-shows-coming-soon-movie-alerts-execution-report.md`
