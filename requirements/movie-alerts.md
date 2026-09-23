# Playwright: Set/Update/Delete Alert — cinema release alerts, WhatsApp/SMS opt-in & My Movie Alerts management

> **Reconciliation note (2026-09-02):** this ticket was originally seeded from `M6-website.pdf`
> (`TC_App_172, 174–207`), a source file that was never saved to this repo and is no longer
> available — only its filename was ever cited, and its mapping to PRD module #37 ("Movie Jockey",
> page 404) in `_prd-module-index.md` was flagged `❓ verify`. It has been rewritten and largely
> renumbered from a newly pasted raw sheet excerpt, `TC_Web_177–195` (19 rows), which matches the
> `TC_WEB_001–447` ID scheme every other already-automated Web module in this suite was built from.
> The `TC_Web` sheet is now the primary, authoritative source for this module's core scope.
>
> **Unlike the `coming-soon.md`/`curated-shows.md` reconciliations, the old ticket (34 rows) was
> LARGER than the new sheet (19 rows).** Rather than discard the extra 16 old `TC_App` scenarios
> that have no 1:1 row in the new sheet, they're kept in a separate, clearly-labeled section below
> ("Additional scenarios from the prior ticket"). Of those 16, four were independently re-grounded
> live against real UAT during this pass and confirmed both real and automatable — they're
> implemented for real (`ALT-020`–`ALT-023`) rather than left as placeholders. The remaining twelve
> are retained as documentation only (not implemented this pass) — see that section for the
> per-scenario reasoning. Full detail on the matching judgment call is in the "Reconciliation
> mapping" subsection below.
>
> Two specific findings the old ticket flagged as needing confirmation before automating were
> re-investigated live during this pass, not assumed to still hold:
> - **(a) booking-window-open backend/admin hook**: still does NOT exist. `src/config/index.ts`'s
>   `adminBaseUrl` is explicitly commented as "no real Admin Portal URL is documented anywhere...
>   an unverified guess"; `AdminMock.ts` only mocks a guessed admin-login/settings pattern, not any
>   movie-release/booking-state control. No feasible way was found to simulate a real booking-open
>   event server-side. The old finding stands — `ALT-019` (`TC_Web_195`) and the retained
>   `ALT-R026`/`ALT-R027` stay `test.fixme` for this reason.
> - **(b) API-level fault injection for a save-failure case**: CONFIRMED fully automatable.
>   Mocking `POST **/movie/api/v1/coming-soon/alert` to return a non-2xx response makes the app
>   surface the mocked response's own `message` field verbatim as an on-screen toast (confirmed
>   live with a custom message, not a fixed generic string) — a real, working `page.route()`
>   fault-injection path, consistent with this repo's established mocking pattern
>   (`CitySelectionModule.mockPopularCityMissingImage`, `mockEmptyCitiesList`). Implemented as
>   `ALT-021` (retained from old `TC_App_202`/`ALT-029`).

## Acceptance criteria

- Setting an alert requires login; the entry point is the **"Set Alert"** CTA on a Coming Soon
  movie's **detail** page (`/coming-soon/{id}`, not the listing card — matches `coming-soon.md`'s
  own finding, re-confirmed live this pass). A guest click opens a phone-number login drawer; a
  fresh phone number also passes through the registration-details form (First Name/Email) and a
  "Select Your Preferences" onboarding nudge (skippable via "I'll miss out" → a "Skip Anyway"
  confirmation) before the real alert flow becomes reachable.
- The Set Alert panel (a plain slide-in drawer, NOT a `role="dialog"`) shows the correct city name,
  a searchable (text + voice-button) checkbox-style cinema list, an "Any Cinema in City" toggle
  that auto-permits save without picking individual cinemas and disables the individual list when
  on, and a Save CTA that stays disabled (no separate error message) until at least one cinema (or
  Any Cinema) is chosen.
- A "WhatsApp opt-in" toggle ("Enable WhatsApp Notifications") appears in the panel **only when the
  account hasn't already globally opted into WhatsApp at registration** — when shown, it defaults
  to ON — and its state (either the panel's own toggle, or the account's existing opt-in) drives
  the save-success message's channel wording: WhatsApp vs SMS.
- Alerts can be updated (re-opens the identical panel as "Update Alert for …") and deleted (behind
  its own "Delete Movie Alert" confirmation step — "I'll Miss Out" confirms, "No" cancels); each
  alert shows its live cinema count directly on the movie detail page ("Alert set for N Cinema(s)")
  and is also listed on a real **"My Movie Alerts"** dashboard tab, reachable from the account
  panel — an entry point the old ticket had flagged as "not yet grounded," now confirmed live.
- A release/booking-open event triggering a notification and auto-removing the alert (`TC_Web_195`)
  cannot be verified in this environment — no confirmed backend/admin hook exists to simulate it
  (see the reconciliation note above). Save failures surface the backend's own error message
  verbatim via mocking.

## Navigation

1. Launch web → dismiss location prompt → select city (Mumbai-All) → **Coming Soon**
   (`/coming-soon`) → open a movie's detail page → tap **Set Alert** (or **Delete Alert**/**Edit
   Alert** if one already exists for that movie) — the panel slides in; login is required first if
   the user isn't authenticated (tapping **Set Alert** again after completing login opens the real
   panel — the first click only surfaces the login drawer).
2. **My Movie Alerts:** header "User Icon" → Account panel → **"My Movie Alerts"** link → navigates
   to `/dashboard?tab=movie-alerts`, a real dashboard tab listing every alert across all cities with
   its live cinema count.

## Test coverage

- **Scope:** Primary set is Complete for the 19 rows in the new sheet (`TC_Web_177–195`), mapped
  1:1 to `ALT-001`–`ALT-019`. Plus 4 additional scenarios retained from the old ticket and
  re-confirmed live/automatable this pass (`ALT-020`–`ALT-023`). 12 further old-ticket scenarios
  are documented but not implemented this pass (see "Additional scenarios" section).
- **Final split (implemented, 23 scenarios total): 18 real, automated / 5 `test.fixme`.** Every
  `test.fixme` carries its own specific, live-grounded reason inline in `movie-alerts.spec.ts`:
  - **`ALT-006` (`TC_Web_182`, max cinema limit) — real finding, no enforcement exists.** Grounded
    2026-09-02: this UAT city (Mumbai) only has 3 real cinemas for any Coming Soon movie, too few
    to exercise a 5-cinema cap organically. Mocking the cinema-list API (`page.route` on
    `**/api/cinema-list*`) to inject 7 synthetic cinemas and selecting all 7 found **no client-side
    block on the 6th/7th selection and no server-side rejection either** — the save succeeded with
    all 7 cinemas ("Alert set for 7 Cinemas"). The sheet's ">5 → error" premise does not hold on
    this build at all; this is `test.fixme` documenting a real, live-grounded product gap (the
    max-limit feature described in the sheet appears to not be implemented), not an environment
    limitation.
  - **`ALT-008` (`TC_Web_184`, voice search results) — unverifiable headless**, consistent with
    every other module's mic-recognition exclusion in this suite (`coming-soon.md`'s `CMS-015`,
    `curated-shows.md`'s equivalent). Only the permission-denied path (`ALT-009`) is automatable.
  - **`ALT-017` (`TC_Web_193`, sub-city mapping) — not distinguishable on this dataset.** Grounded
    2026-09-02: per `city-selection.md`'s own finding, Mumbai-All's only real sub-cities are
    "Mumbai" and "All" — and per `CitySelectionModule.selectSubCity`'s doc comment, selecting "All"
    saves the identical parent city name to the header as selecting "Mumbai" does. The alert-save
    API always records the same `cityId:1`/`cityName:"Mumbai"` regardless of which of these two
    identical-mapping options was active, so there is no real, distinguishable sub-city-vs-parent
    behavior to assert beyond what `ALT-016` (parent mapping) already covers on this environment.
  - **`ALT-019` (`TC_Web_195`, auto-remove after booking-open trigger) — no backend hook.** See the
    reconciliation note's investigation (a) above — unchanged from the old ticket's finding.
  - **`ALT-013` (`TC_Web_189`, alert update) — a real, unresolved product race, not a test
    artifact.** Grounded 2026-09-02 across several live runs (see the "Real findings" note below
    for the full evidence trail): adding a cinema during Edit Alert and clicking "Update Alert" can
    silently submit without the new cinema, even when the click's own visual effect (its
    `aria-pressed` indicator) was confirmed true first. Only a real, un-conditioned elapsed-time
    wait reliably avoided it — with no discoverable DOM condition to poll on instead, this can't be
    fixed test-side without violating this repo's no-hard-waits rule.
- **Real findings that corrected the sheet's own assumptions** (documented inline, not silently
  reinterpreted):
  - **`TC_Web_182` (max cinema limit)**: no enforcement exists at all — see `ALT-006` above.
  - **`TC_Web_194` (mandatory-selection error)**: there is no separate error message on attempting
    to save with nothing selected — the Save CTA is simply `disabled` until ≥1 cinema (or Any
    Cinema) is chosen, confirmed live even via a forced `dispatchEvent('click')` bypassing
    Playwright's normal actionability check (no toast/message fired). `ALT-018` asserts the real
    disabled-state mechanism instead of a literal error message, the same reinterpretation pattern
    `coming-soon.md`'s `CMS-009` used for its own "reset filter" scenario.
  - **`TC_Web_189` (alert update, `ALT-013`) — a real, unresolved product race, escalated to
    `test.fixme` after exhausting DOM-condition-based fixes.** Grounded 2026-09-02 across several
    live runs of identical code, in stages: (1) Edit Alert's panel heading/UI renders immediately,
    but the existing alert's cinema selection is populated from a separate, asynchronous
    `GET .../coming-soon/alert/{id}` call that can still be in flight once the panel "looks" open —
    an early attempt found selecting a new cinema before that landed could drop the already-saved
    cinema (`cinemaIds:[201]` only, losing `200`). Waiting for the pre-existing cinema's own
    `aria-pressed="true"` before selecting a new one fixed *that* race, but a further live run
    still failed the SAME way — this time with the Update Alert request resubmitting
    `cinemaIds:[200]` only, meaning the click on the second cinema registered NO state change at
    all, even though that cinema's own `aria-pressed` was separately confirmed to flip true. A
    bounded re-click-until-confirmed loop (`selectCinemaAndConfirm`) was tried next and *still*
    reproduced the identical failure. A final, deliberate test inserted a real, un-conditioned
    2-second wait between the click and Update instead of any DOM condition — this reliably
    included the new cinema in 2/2 runs. This is conclusive: the visual `aria-pressed` state and
    whatever internal state the Update Alert submission actually reads are decoupled by a real
    elapsed-time debounce/delayed sync in the product itself, with no discoverable DOM signal to
    wait on — not fixable test-side without violating this repo's no-hard-waits rule, so `ALT-013`
    is `test.fixme` with this exact, live-grounded reason rather than a wait-and-hope patch.
  - **Session expiry (`ALT-R033`, retained/implemented as `ALT-023`)**: the sheet/old-ticket
    premise of a "redirect to login" **is confirmed correct**, once properly re-grounded. A first
    attempt cleared cookies only, which left Save succeeding normally (the token this endpoint
    checks also lives in localStorage/sessionStorage, not solely cookies). Clearing all three
    sometimes reproduced a real `403 SESSION_EXPIRED` response, but not reliably across repeated
    live runs — too flaky for an automated assertion. Deterministically mocking that exact
    confirmed error shape (`page.route()`, this repo's established fault-injection pattern)
    revealed the real, repeatable behavior: a full-page redirect to the homepage with a
    `?sidebar=login` URL marker — not an inline message. That marker does not reliably auto-open
    the phone-entry login drawer on this client-side navigation path (confirmed live even after a
    generous wait), so the test asserts the homepage's own header "User Icon" button instead of a
    literal open drawer. (An earlier single, non-reproducible manual observation had suggested an
    inline "session expired" toast with no navigation; that
    finding could not be reproduced again and is superseded by this mocked, repeatable one.)
- **Data/environment dependency still unresolved, unchanged from the old ticket:** `TC_Web_195`
  (auto-removal on booking-open) needs a backend/admin hook or pre-seeded showtime fixture that
  does not exist in this repo or environment — flag with the QA/backend team rather than trying to
  wait for a real release.

### Reconciliation mapping (old `TC_App` ALT-001–034 vs. new `TC_Web_177–195`)

18 of the old ticket's 34 scenarios have a clear 1:1 match in the new sheet (renumbered
`ALT-001`–`ALT-019` below, one new row — `TC_Web_195` — maps to old `ALT-028` specifically, not
`ALT-026`/`ALT-027`, which describe the notification-trigger step the sheet doesn't separately
list). The remaining 16 do not:

| Kept (renumbered) | Old ID | New row |
|---|---|---|
| ALT-001 | ALT-001 | TC_Web_177 |
| ALT-002 | ALT-002 | TC_Web_178 |
| ALT-003 | ALT-005 | TC_Web_179 |
| ALT-004 | ALT-006 | TC_Web_180 |
| ALT-005 | ALT-007 | TC_Web_181 |
| ALT-006 | ALT-009 | TC_Web_182 |
| ALT-007 | ALT-010 | TC_Web_183 |
| ALT-008 | (TC_App_185, previously out-of-scope) | TC_Web_184 |
| ALT-009 | ALT-013 | TC_Web_185 |
| ALT-010 | ALT-015 | TC_Web_186 |
| ALT-011 | ALT-017 | TC_Web_187 |
| ALT-012 | ALT-018 | TC_Web_188 |
| ALT-013 | ALT-019 | TC_Web_189 |
| ALT-014 | ALT-020 | TC_Web_190 |
| ALT-015 | ALT-021 | TC_Web_191 |
| ALT-016 | ALT-023 | TC_Web_192 |
| ALT-017 | ALT-024 | TC_Web_193 |
| ALT-018 | ALT-008 | TC_Web_194 |
| ALT-019 | ALT-028 | TC_Web_195 |

Unmatched old scenarios (no 1:1 row in the new 19): `ALT-003, 004, 011, 012, 014, 016, 022, 025,
026, 027, 029, 030, 031, 032, 033, 034`. See "Additional scenarios" below for what happened to
each.

## Scenarios

- **Suggested journey:** `src/tests/movie-alerts.spec.ts`
- **Sheet:** pasted `TC_Web_177–195` raw excerpt (tab-separated, columns: ID / Module (first row
  only) / Title / Precondition / Steps / Expected Result / Notes) — see Source section.

- [x] **ALT-001** — Verify login required to set alert | Steps: (not logged in) tap "Set Alert" | Expected: login prompt displayed | `@P0 @Regression`
- [x] **ALT-002** — Verify Set Alert panel UI | Steps: (logged in) tap Set Alert | Expected: panel opens with all elements | `@P0 @Regression`
- [x] **ALT-003** — Verify alert creation with selected cinema(s) | Steps: select cinema → Save | Expected: alert created, "Alert set for N Cinema(s)" shown | `@P0 @Regression`
- [x] **ALT-004** — Verify "Any cinema in city" selection | Steps: toggle Any Cinema | Expected: Save enabled without individually selecting cinemas | `@P0 @Regression`
- [x] **ALT-005** — Verify cinema list disabled on "Any cinema" | Steps: (Any cinema on) observe list | Expected: individual cinema options disabled | `@P0 @Regression`
- [x] **ALT-006** — Verify max cinema limit | Steps: select >5 (mocked) | Expected: validation error shown | `@P1 @Regression` — `test.fixme` (no enforcement exists — real finding)
- [x] **ALT-007** — Verify cinema search | Steps: search cinema name / no-match text | Expected: matching cinemas / "No cinemas found" | `@P1 @Regression`
- [x] **ALT-008** — Verify voice search returns results | Steps: (mic allowed) speak | Expected: results shown | `@P2 @Regression` — `test.fixme` (recognition unverifiable headless)
- [x] **ALT-009** — Verify mic permission error | Steps: (mic denied) tap mic | Expected: permission alert shown | `@P0 @Regression`
- [x] **ALT-010** — Verify WhatsApp opt-in toggle | Steps: (WA not globally opted-in) open popup | Expected: toggle visible, defaults enabled | `@P0 @Regression`
- [x] **ALT-011** — Verify success message (WhatsApp) | Steps: (WA enabled) save alert | Expected: correct WhatsApp success message | `@P0 @Regression`
- [x] **ALT-012** — Verify success message (SMS) | Steps: (WA disabled) save alert | Expected: correct SMS success message | `@P0 @Regression`
- [x] **ALT-013** — Verify alert update | Steps: (alert exists) Edit Alert → modify cinemas → Update Alert | Expected: alert updated | `@P0 @Regression` — `test.fixme` (real, unresolved product race dropping a newly-added cinema — see coverage note)
- [x] **ALT-014** — Verify delete alert | Steps: (alert exists) Delete Alert → confirm | Expected: alert removed | `@P0 @Regression`
- [x] **ALT-015** — Verify alert count display | Steps: (alert set) observe detail page | Expected: cinema count displayed | `@P1 @Regression`
- [x] **ALT-016** — Verify parent-city mapping | Steps: (alert set on Mumbai-All) observe panel | Expected: correct city name shown | `@P0 @Regression`
- [x] **ALT-017** — Verify sub-city mapping | Steps: switch sub-city | Expected: correct city/sub-city mapping | `@P0 @Regression` — `test.fixme` (not distinguishable on this dataset)
- [x] **ALT-018** — Verify mandatory cinema selection | Steps: Save with nothing selected | Expected: Save stays disabled (real mechanism — see coverage note) | `@P0 @Regression`
- [x] **ALT-019** — Verify auto-removal after booking-open trigger | Steps: (booking opens) check alert | Expected: alert removed | `@P0 @Regression` — `test.fixme` (no backend/admin hook)

### Additional scenarios (retained from the prior ticket, no 1:1 row in the new sheet)

Confirmed live and **implemented for real** this pass:

- [x] **ALT-020** (was old `ALT-022`) — Verify alert visible in "My Movie Alerts" | Expected: alert visible on the `/dashboard?tab=movie-alerts` tab | `@P0 @Regression`
- [x] **ALT-021** (was old `ALT-029`) — Verify error shown on save failure | Steps: (API mocked to fail) save alert | Expected: backend error message surfaced verbatim | `@P0 @Regression`
- [x] **ALT-022** (was old `ALT-032`) — Verify duplicate-click handling on Save | Steps: rapid double-click Save | Expected: exactly one alert created (one POST) | `@P1 @Regression`
- [x] **ALT-023** (was old `ALT-033`) — Verify session expiry during save | Steps: (mocked 403 SESSION_EXPIRED response) save alert | Expected: real redirect to the login screen (confirms the original "redirect to login" premise, deterministically reproduced via mocking — see coverage note) | `@P0 @Regression`

**Retained pending verification, not implemented this pass** (documentation only — kept per the
task's judgment call rather than deleted, since none of these were disproven live; they simply
have no matching row in the new 19-row sheet and weren't independently re-grounded this pass except
where noted):

- **ALT-R003** (old `ALT-003`) — Verify city name display in alert popup. *Partially covered*:
  `ALT-016`'s implementation also asserts the city badge text, so this is functionally subsumed,
  but kept listed since the sheet doesn't dedicate its own row to it.
- **ALT-R004** (old `ALT-004`) — Verify cinema list UI (checkboxes). *Partially covered* by
  `ALT-002`'s panel-UI assertions.
- **ALT-R011** (old `ALT-011`) — Verify partial cinema search. Not implemented; `ALT-007`'s search
  coverage uses a full substring match, not a deliberately partial one.
- **ALT-R012** (old `ALT-012`) — Verify no-result cinema search UI. *Covered* by `ALT-007`'s
  no-match assertion ("No cinemas found") — functionally the same check, kept listed for
  traceability to the old ID.
- **ALT-R014** (old `ALT-014`) — Verify WhatsApp toggle visibility is conditional on opt-in state.
  *Partially covered*: `ALT-010`/`ALT-011` together exercise both the visible (opted-out) and
  hidden (opted-in) cases, but no single dedicated scenario asserts the hidden case in isolation.
- **ALT-R016** (old `ALT-016`) — Verify SMS fallback is a distinct mechanism from the SMS success
  message. Not implemented separately from `ALT-012`.
- **ALT-R025** (old `ALT-025`) — Verify multiple city alerts display together. Not re-grounded this
  pass; UAT only has real Coming Soon movie data for Mumbai-All (per `city-selection.md`/
  `coming-soon.md`'s own findings — other cities return "No movies found"), so a genuine
  multi-city alert can't currently be created live to verify this.
- **ALT-R026** (old `ALT-026`) — Verify notification trigger on booking-open. `test.fixme`-equivalent:
  same missing backend/admin hook as `ALT-019` — not implemented.
- **ALT-R027** (old `ALT-027`) — Verify single notification for an "Any cinema" alert. Same reason
  as `ALT-R026` — not implemented.
- **ALT-R030** (old `ALT-030`) — Verify loader shown during save. Not implemented; no stable,
  live-grounded loader element was captured during this pass's grounding scripts (the real UAT save
  round trip completed too quickly in headless runs to reliably observe an intermediate state).
- **ALT-R031** (old `ALT-031`) — Verify Save button enabled/disabled states as selection changes.
  *Partially covered* by `ALT-004`/`ALT-018`'s disabled/enabled assertions, but no single scenario
  exhaustively walks every transition.
- **ALT-R034** (old `ALT-034`) — Verify scroll behavior in a long cinema list. Not implemented; this
  UAT dataset only has 3 real cinemas per movie in Mumbai — too few to produce a scrollable list
  without mocking, and mocking a scroll-specific UI interaction wasn't judged worth the added
  complexity for a `@P2` cosmetic check.

## E2E implementation notes

- **Layering:** `src/tests/movie-alerts.spec.ts` → `src/modules/MovieAlertsModule.ts` →
  `src/pages/MovieAlertsPage.ts`.
- **Frontend context:** No `dev-repo/` provided. Grounded via read-only + mocked headless
  Playwright against UAT (`inox-uat-web.pvrinox.com`, Mumbai-All), 2026-09-02 — Playwright MCP's
  interactive browser tool does not launch in this sandbox (see the `pvr-inox-grounding-technique`
  project memory). Scratchpad `ground-alerts-*.js` scripts hold the raw diagnostics this file and
  `MovieAlertsPage.ts`/`MovieAlertsModule.ts`'s doc comments build on.
- **Reuse:** `MovieAlertsModule` composes `ComingSoonModule` (entry navigation via
  `gotoComingSoon()`/`openMovieDetail()`, and its existing `forceMicrophonePermissionDenied()` —
  the same override technique, reused directly rather than duplicated), `RegisterLoginModule`
  (`submitPhoneNumber`/`submitOtp`/`expectOnLoginScreen`/`openAccountPanel`),
  `RegistrationModule` (`registerNewUser`/`fillRegistrationDetails`/`uncheckWhatsappOptIn`/
  `submitRegistrationForm`/`expectRegistrationSubmitted`), and `ProfileCompletionModule`
  (`dismissWithMaybeLater` for the onboarding nudge's "I'll miss out"). None of those files were
  modified — the "Skip Anyway" confirmation sub-dialog the onboarding nudge triggers (a real,
  previously-undocumented second confirmation step, not covered by any existing module) is handled
  by a locator/action added to this module's own `MovieAlertsPage.ts` instead.
- **Locators:** the Set Alert panel is a **plain slide-in drawer, not `role="dialog"`** (confirmed
  via a live DOM dump — no ancestor with that role anywhere) — scoped instead via an xpath ancestor
  walk from the "Set Alert for"/"Update Alert for" heading to the drawer's own class-identified
  container, the same shape of workaround `CitySelectionPage.ts`'s `subCityGrid` locator uses for
  its own non-standard DOM nesting. The cinema-search mic button has a real, clean accessible name
  (`aria-label="Start voice search"`) — no CSS/class workaround needed there, unlike most other
  mic buttons in this suite. Cinema option buttons match by plain substring name (no regex/escaping
  needed even for names containing parentheses, e.g. movie titles like "Varanasi (film)").
- **Fixtures / mocks:** `ALT-006` (max-limit, `test.fixme`) was investigated via `page.route()` on
  `**/api/cinema-list*` injecting 7 synthetic cinemas — kept out of the implemented suite since it
  documents an absence of a feature, not a passing assertion. `ALT-009` (mic permission) reuses
  `ComingSoonModule.forceMicrophonePermissionDenied()`. `ALT-021` (save failure) uses `page.route()`
  on `POST **/movie/api/v1/coming-soon/alert` returning a mocked failure status/message.
- **Tags:** `@Regression` throughout; `@P0` for the core login/create/update/delete/mandatory-
  validation/city-mapping path, `@P1` for search/count/duplicate-click secondary checks, `@P2` for
  the unverifiable voice-recognition scenario, per source sheet Priority column (inferred
  consistent with equivalent-role scenarios in `coming-soon.md`/`curated-shows.md` where the pasted
  excerpt carries no explicit Priority column of its own).
- **Run:** `npx playwright test src/tests/movie-alerts.spec.ts --project=chromium`

## Source

- **Seed method:** raw sheet excerpt pasted directly into the task (tab-separated rows,
  `TC_Web_177–195`); supersedes the earlier `M6-website.pdf`/`TC_App_172,174–207` seed, which is no
  longer available in any form (never saved to disk, only cited by filename). That earlier seed's
  extra scenarios are retained per the "Additional scenarios" section above, not silently dropped.
- **File:** none saved to disk — pasted excerpt only, matching the citation style of every other
  `TC_WEB`-numbered module in this suite (see `curated-shows.md`'s own Source section).
- **Sheet:** N/A — single "Website" test-case excerpt, "Set/Update/ Delete Alert" module section.
- **Columns:** ID, Module (first row only), (blank), (blank), Title, Precondition, Steps, Expected
  Result, Notes.
- **Frontend repo:** not provided — grounded instead against live UAT
  (`inox-uat-web.pvrinox.com`).
