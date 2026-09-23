# Playwright: Coming Soon — filters, search, movie cards & Set/Delete Alert visibility

> **Reconciliation note (2026-09-01):** this ticket was originally seeded from `M6-website.pdf`
> (`TC_App_150–171`), a source file that was never saved to this repo and is no longer available —
> only its filename was ever cited. It has been fully rewritten and renumbered from a newly pasted
> raw sheet excerpt, `TC_Web_147–176`, which matches the `TC_WEB_001–447` ID scheme every other
> already-automated Web module in this suite (Movie Details, Cinemas Listing, Offers, Global
> Search, Event Listing/Details, Experience, Curated Shows) was built from. The `TC_Web` sheet is
> now the sole, authoritative source for this module going forward. All `CMS-XXX` scenario IDs
> below are new and map 1:1 to `TC_Web_147–176`; the old `CMS-001–021` IDs sourced from
> `TC_App_150–171` no longer exist — do not cross-reference them.

## Acceptance criteria

- Coming Soon is reachable via `/coming-soon` and loads a full-year listing of unreleased movies
  by default, grouped into weekly sections, with a Year/Month/Week filter bar, quick genre-chip
  filters plus a combined Genre+Language "Filter By" modal (single, combined, and toggle-off
  reset), and a working keyword search (typed, partial, case-insensitive, and no-result states).
- Each movie card shows poster (or placeholder fallback when no poster is uploaded), title,
  runtime, language, certificate, and genre; tapping a card opens its detail page.
- The movie **detail** page (not the listing card) shows a "Set Alert" CTA when no alert exists
  for that movie — feeding into the separate Set/Update/Delete Alert flow (`requirements/movie-alerts.md`).
  "Delete Alert" visibility (when an alert already exists) is out of reach without that flow — see
  Test coverage.

## Navigation

1. Direct URL: `https://inox-uat-web.pvrinox.com/coming-soon`, Mumbai-All, with geolocation
   granted — matches this repo's established direct-URL pattern (`OffersPage.ts`,
   `EventListingPage.ts`, `CuratedShowsPage.ts`). The sheet's own homepage "View All" CTA
   (`TC_Web_147`) was **not reproducible live** — see Test coverage note.
2. On the Coming Soon page: use the "Filter" trigger (opens a Genre/Language modal) and the quick
   genre chips above the Year/Month/Week bar, the search bar, and tap a movie card (the whole card
   is a `<button>`) to reach its detail page at `/coming-soon/{id}`.

## Test coverage

- **Scope:** Complete — all 30 rows from the source sheet (`TC_Web_147–176`), mapped 1:1 to
  `CMS-001–030` (no merges — no literal duplicate rows in this excerpt).
- **Final split: 24 real, automated scenarios (live-grounded) / 6 `test.fixme`.** Every
  `test.fixme` carries its own specific, live-grounded reason inline in `coming-soon.spec.ts`:
  - **No reliable homepage entry point** (`CMS-001`) — grounded 2026-09-01: the live homepage
    currently has no "Coming Soon" section/heading at all (confirmed via a full homepage heading
    dump — only "IN THE SPOTLIGHT" and "Re-Release" sections render), so there is no "View All" CTA
    to click. Matches `curated-shows.md`'s identical `CSH-001/002` finding for its own homepage
    nav path. Every other scenario uses the direct-URL entry point instead.
  - **Voice search recognized-result accuracy is not simulable headless** (`CMS-015`) — no real
    microphone/speech input exists in this sandbox; only the *permission-denied* portion
    (`CMS-016`, kept in scope) is reliably automatable via a `navigator.permissions.query`
    override, consistent with every other module's mic-recognition exclusion in this suite.
  - **No hover-triggered trailer exists on the Coming Soon listing card** (`CMS-026`, `CMS-027`,
    `CMS-028`) — grounded 2026-09-01: hovering over all 5 currently-listed movie cards (with real
    posters and with the placeholder fallback) for 8+ seconds each never rendered a `<video>` or
    `<iframe>` anywhere in the card subtree. Trailer playback is real, but lives only on the movie
    **detail** page (`Watch Trailer` button + a `Trailers` section), reached by clicking the card —
    the same "no trailer on this listing card" finding `curated-shows.md` documented for its own
    listing (`CSH-021`). Since there's no hover-trailer feature on this card at all, "latest trailer
    plays" (multiple exist) and "poster-only fallback" (no trailer) have nothing real to test either.
  - **"Delete Alert" visibility requires a pre-existing alert** (`CMS-030`) — grounded 2026-09-01:
    the movie detail page's alert CTA is real and guest-visible ("Set Alert", confirmed live —
    clicking it as a guest opens a real phone-number login drawer), but reaching the "already has
    an alert" state requires completing the full Set Alert flow (cinema selection, WhatsApp
    opt-in, Save) — that flow is `requirements/movie-alerts.md`'s scope, not yet implemented, and
    explicitly out of scope for this ticket per the boundary between the two modules (this ticket
    only covers *button visibility on Coming Soon itself*, not the alert-management flow).
- **Real findings that corrected the sheet's own assumptions** (documented inline, not silently
  reinterpreted):
  - **`TC_Web_175`/`TC_Web_176` ("Set Alert"/"Delete Alert" button visible) do not exist on the
    Coming Soon listing card at all** — grounded live by dumping the full card DOM for a real movie
    card: no "Set Alert"/"Delete Alert" text or button anywhere in the card subtree (confirmed via
    both a text search and a full HTML dump). The real button only exists on the movie **detail**
    page reached by clicking the card. `CMS-029` is reinterpreted to check detail-page visibility
    instead of a literal list-card check.
  - **"Same date, random order" (`TC_Web_168`) does not hold live** — grounded via 3 independent
    fresh-context page loads: the four same-release-date movies (`Varanasi (film)`, `King (2026
    film)`, `MISSION: IMPOSSIBLE - THE FINAL RECKONING`, `PROJECT HAIL MARY`, all "Releasing On 26
    Dec'26") rendered in the **exact same order every time** — not shuffled per load. `CMS-022` is
    reinterpreted to assert the real behavior (a stable, repeatable order), not the sheet's literal
    "random order" expectation.
  - **The genre "reset" mechanism (`TC_Web_155`) is re-clicking the same selected chip to toggle
    it off** — grounded live: there is no separate "Reset"/"Clear" control on the main filter bar
    (only a "Clear All" button inside the separate "Filter By" modal, which is a distinct UI path
    covered by `CMS-020`/`CMS-021`'s combined-filter scenario). `CMS-009` asserts the real
    toggle-off mechanism.
  - **A dedicated "Filter By" modal exists** (Genre and Language tabs, checkboxes, "Clear All" /
    dynamic "Show N Result(s)" buttons) in addition to the quick genre chips on the main bar — not
    explicitly called out in the sheet's wording but is the real mechanism `TC_Web_165`/`166`
    (language filter / multi-filter combination) map onto, since language has no quick-chip
    equivalent on the main bar.
- **No separate JSON API backs this page's movie list** (unlike `curated-shows.md`'s
  `GET /api/curated-shows`) — a full network trace during page load showed only
  `auth/session`, `get-city-list`, `detect-city`, `experience-listing-image`, and `config-user`
  calls; the movie data is baked into the page's server-rendered/RSC payload directly. This means
  the "empty week" (`CMS-011`) and "image fallback" (`CMS-024`) scenarios use real, currently-live
  UAT data states instead of `page.route()` mocking (Oct/Week 40 currently has zero movies; "Jana
  Nayagan" currently has no uploaded poster and shows the real fallback graphic) — flagged as a
  live-data-drift risk if UAT content changes, documented inline in `ComingSoonPage.ts`.
- **Environment finding (grounded 2026-09-01 against UAT):** `/coming-soon` for Mumbai-All is
  populated with real movies (`Jana Nayagan` in Week 39/Sep, four movies in Week 52/Dec — Varanasi
  (film), King (2026 film), Mission: Impossible - The Final Reckoning, Project Hail Mary), genre
  chips (Action/Adventure/Animation/Crime/Musical/Science Fiction/Thriller — alphabetical, real),
  a Genre+Language "Filter By" modal, a working search bar, and per-card navigation to
  `/coming-soon/{id}` detail pages with a real "Set Alert" CTA.

## Scenarios

- **Suggested journey:** `src/tests/coming-soon.spec.ts`
- **Sheet:** pasted `TC_Web_147–176` raw excerpt (tab-separated, columns: ID / Module / Title /
  Precondition / Steps / Expected / Notes) — see Source section.

- [x] **CMS-001** — View All CTA navigation from homepage | `@P0 @Regression` — `test.fixme` (no reliable homepage entry point)
- [x] **CMS-002** — Coming Soon page layout | `@P1 @Regression`
- [x] **CMS-003** — Filter section UI (Year/Month/Week visible) | `@P1 @Regression`
- [x] **CMS-004** — Default listing shows full-year movies | `@P0 @Regression`
- [x] **CMS-005** — Month filter selection shows correct movies | `@P0 @Regression`
- [x] **CMS-006** — Week filter selection shows correct movies | `@P0 @Regression`
- [x] **CMS-007** — Later month auto-selected when filter matches a future week | `@P1 @Regression`
- [x] **CMS-008** — Selected filter is visually highlighted | `@P1 @Regression`
- [x] **CMS-009** — Reset filter (toggle the selected chip off) | `@P1 @Regression` (real mechanism — see coverage note)
- [x] **CMS-010** — Empty state message for a week/month with no movies | `@P1 @Regression`
- [x] **CMS-011** — Search by typing shows relevant results | `@P0 @Regression`
- [x] **CMS-012** — Partial search shows matching results | `@P1 @Regression`
- [x] **CMS-013** — Case-insensitive search | `@P1 @Regression`
- [x] **CMS-014** — No-result search UI | `@P1 @Regression`
- [x] **CMS-015** — Voice search returns results (mic allowed) | `@P2 @Regression` — `test.fixme` (recognition unverifiable headless)
- [x] **CMS-016** — Mic permission error shows a real alert | `@P1 @Regression`
- [x] **CMS-017** — Genre filter chips render in alphabetical order | `@P2 @Regression`
- [x] **CMS-018** — Genre filter shows correct results | `@P0 @Regression`
- [x] **CMS-019** — Language filter shows correct results | `@P0 @Regression`
- [x] **CMS-020** — Multiple filters (genre + language) combine correctly | `@P1 @Regression`
- [x] **CMS-021** — Movies sorted ascending by release date | `@P1 @Regression`
- [x] **CMS-022** — Same-date movies render in a stable order | `@P2 @Regression` (reinterpreted — see coverage note)
- [x] **CMS-023** — Movie card UI elements (poster/name/genre/language) visible | `@P0 @Regression`
- [x] **CMS-024** — Image fallback placeholder shown when no poster exists | `@P1 @Regression`
- [x] **CMS-025** — Tapping a movie card opens its detail page | `@P0 @Regression`
- [x] **CMS-026** — Hover autoplay plays the trailer | `@P1 @Regression` — `test.fixme` (no trailer on this card)
- [x] **CMS-027** — Latest trailer plays when multiple exist | `@P1 @Regression` — `test.fixme` (same reason as CMS-026)
- [x] **CMS-028** — Poster-only fallback when no trailer exists | `@P1 @Regression` — `test.fixme` (same reason as CMS-026)
- [x] **CMS-029** — "Set Alert" CTA visible when no alert exists | `@P0 @Regression` (reinterpreted — real button is on the detail page, not the list card)
- [x] **CMS-030** — "Delete Alert" CTA visible when an alert exists | `@P0 @Regression` — `test.fixme` (requires the not-yet-implemented Set Alert flow — out of scope)

## E2E implementation notes

- **Layering:** `src/tests/coming-soon.spec.ts` → `src/modules/ComingSoonModule.ts` →
  `src/pages/ComingSoonPage.ts`.
- **Frontend context:** No `dev-repo/` provided. Grounded via read-only headless Playwright against
  UAT (`inox-uat-web.pvrinox.com`, Mumbai-All), 2026-09-01. Scratchpad `ground-coming-soon-*.js`
  scripts hold the raw diagnostics this file's tests and `ComingSoonPage.ts`/`ComingSoonModule.ts`'s
  doc comments build on.
- **Reuse:** city bootstrap reuses `LocationHelper.grantMumbaiGeolocation`/`dismissPromoPopup`,
  same as `CuratedShowsModule.ts`. Mic-denied forcing reuses the same
  `navigator.permissions.query` override pattern `CuratedShowsModule.forceMicrophonePermissionDenied`
  established (this module's own alert message text differs slightly — see Test coverage note).
- **Locators:** the "Filter" trigger has no clean accessible name (its computed name mixes an icon
  alt with the "Filter" label), so it's targeted via `locator('button').filter({ hasText: 'Filter' })`
  rather than `getByRole('button', { name: 'Filter' })`. The "Filter By" modal's "Show Results"
  button has a **dynamic label** (`"Show 1 Result"`, `"Show 3 Results"`, …) — matched via
  `getByRole('button', { name: /show \d+ results?/i })`, not an exact string. Genre/language
  checkboxes inside the modal are visually hidden (`opacity-0`) native inputs — clicked via their
  visible label text, not the checkbox role directly. Movie cards are themselves `<button>`
  elements; a sticky filter bar (`comming_soon_sticky`, real class name) can intercept a card click
  after scrolling — reuses `force: true` after `scrollIntoViewIfNeeded()`, the same overlay-click
  workaround `LocationHelper.ts` documents for this site generally.
- **Fixtures / mocks:** none needed — see Test coverage's "no separate JSON API" note. The two
  scenarios that would typically need mocking (empty week, no-poster movie) both have a real,
  currently-live UAT data state instead.
- **Tags:** `@Regression` throughout (Complete coverage, no `@Smoke` in this pasted excerpt's
  implicit priority); `@P0` for default listing/filter/search/navigation/alert-visibility core
  paths, `@P1` for secondary filter/search/trailer/highlight behavior, `@P2` for cosmetic/ordering
  checks and the unverifiable voice-recognition scenario — inferred consistent with the
  equivalent-role scenarios in `curated-shows.md`/`movie-details.md` (no explicit Priority column
  in this pasted excerpt).
- **Run:** `npx playwright test src/tests/coming-soon.spec.ts --project=chromium`

## Source

- **Seed method:** raw sheet excerpt pasted directly into the task (tab-separated rows,
  `TC_Web_147–176`); supersedes the earlier `M6-website.pdf`/`TC_App_150–171` seed, which is no
  longer available in any form (never saved to disk, only cited by filename).
- **File:** none saved to disk — pasted excerpt only, matching the citation style of every other
  `TC_WEB`-numbered module in this suite (see `curated-shows.md`'s own Source section).
- **Sheet:** N/A — single "Website" test-case excerpt, "Coming soon" module section.
- **Columns:** ID, Module (first row only), Title, Precondition, Steps, Expected Result, Notes.
- **Frontend repo:** not provided — grounded instead against live UAT
  (`inox-uat-web.pvrinox.com`).
