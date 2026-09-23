# Playwright: Curated Shows — banners, search, categories, city switching & empty state

> **Reconciliation note (2026-09-01):** this ticket was originally seeded from `M6-website.pdf`
> (`TC_App_077–149`), a source file that was never saved to this repo and is no longer available —
> only its filename was ever cited. It has been fully rewritten and renumbered from a newly pasted
> raw sheet excerpt, `TC_Web_076–146`, which matches the `TC_WEB_001–447` ID scheme every other
> already-automated Web module in this suite (Movie Details, Cinemas Listing, Offers, Global
> Search, Event Listing/Details, Experience) was built from. The `TC_Web` sheet is now the sole,
> authoritative source for this module going forward. All `CSH-XXX` scenario IDs below are new
> and map 1:1 to `TC_Web_076–146`; the old `CSH-001–070` IDs sourced from `TC_App_077–149` no
> longer exist — do not cross-reference them.

## Acceptance criteria

- Curated Shows is reachable directly via `/curated-shows`; a homepage "More"-menu navigation path
  exists in the sheet but was **not reliably reproducible live** (see Test coverage note) — every
  automated scenario here instead uses this repo's established direct-URL pattern.
- The Curated Shows page loads with named categories (each with an info trigger — implemented live
  as a "Learn More" text link, not a separate icon — showing a description popup with a Close CTA)
  and per-category banner images; each category lists its mapped movies.
- Keyword search filters by category name and movie title; a non-matching keyword collapses to the
  same top-level "No Curated Shows Available" state as true no-content, not a distinct
  "no results" state (grounded live).
- Categories render in the same order as the backing feed (no separate "admin sequence" field
  exists); a movie mapped into multiple categories appears once per category.
- When no curated content exists for the selected city, a dedicated empty state renders ("No
  Curated Shows Available" message + a **"Back to Homepage" button** — grounded live; the sheet's
  own wording, "Let's Go" CTA, does not match the real button text) with no stale data, no
  category/banner sections, and a working search no-op — grounded live against UAT, where this is
  the **current real behavior for every UAT city**, not just Mumbai-All.
- **Known, live-grounded gaps** (not automated — see Test coverage for the full list): no admin
  category enable/disable flag, no "See All" control (movies render in a Swiper horizontal
  carousel instead), no personalization/"Recommended" tag logic, no Upcoming/Re-release
  date-filtering logic, no trailer on this listing card, and clicking a movie card does not
  navigate anywhere in this build (confirmed via live click probes, not assumed).

## Navigation

1. Direct URL: `https://inox-uat-web.pvrinox.com/curated-shows`, Mumbai-All, with geolocation
   granted (skips the "Enable Location" modal). Without geolocation granted, a fresh context
   blocks on that modal first (grounded live — CSH-045).
2. The sheet's homepage-nav / "More"-menu path (TC_Web_076/077) was probed live 3 separate times
   (grant geolocation, dismiss overlays, click "More", scroll) and never reliably surfaced a
   "Curated Shows" entry — it appears to be part of a lazily-rendered, scroll-position-dependent
   homepage strip, not a dependable menu item. `CSH-001`/`CSH-002` are `test.fixme` for this
   reason; every other scenario uses the direct-URL entry point instead.
3. On the Curated Shows page: observe category headers (each with a "Learn More" info trigger) and
   movie lists per category (a Swiper.js horizontal carousel, `curated-movie-swiper`); use the
   search bar in place.

## Test coverage

- **Scope:** Complete — all 71 rows from the source sheet (`TC_Web_076–146`), mapped 1:1 to
  `CSH-001–071` (no merges — unlike `movie-details.md`, this sheet had no literal duplicate rows).
- **Final split: 58 real, automated scenarios (all passing live) / 13 `test.fixme`.** Every
  `test.fixme` carries its own specific, live-grounded reason inline in `curated-shows.spec.ts` —
  not a blanket "no data" excuse. Summary by root cause:
  - **No "See All" control exists** (`CSH-017`, `CSH-018`) — confirmed absent from the real
    shipped Next.js bundle (searched ~296KB across 4 chunks); movies render in a Swiper.js
    horizontal carousel (`curated-movie-swiper`, real class name) instead.
  - **RESOLVED 2026-09-07 — movie-card click does navigate** (`CSH-019`, `CSH-034`, `CSH-035`,
    `CSH-044`, previously `test.fixme` on a "dead handler" theory). Re-grounded by reading the
    actual shipped `onClick` handler source directly (not guessing): it reads a `movie.filmId`
    field the original mock never set (only `filmCommonCode`, a different field), so the click
    silently no-opped on every attempt. Adding `filmId` (plus, for Special Shows, a second real
    `categoryName` field feeding the session URL's `?curatedType=` param) to
    `curatedShowsData.ts`'s builders makes the real click genuinely navigate to
    `/moviesessions/{city}/{slug}/{filmId}` — confirmed live, including with a real
    currently-showing UAT film id rendering a fully working session page. `CSH-044` (guest booking
    flow) needed no separate fix — this file never logs in, so it was already guest-scoped.
  - **No "headsup" message on the special-show session page** (`CSH-036`, still `test.fixme`) — a
    real, separate gap from the click, confirmed by landing directly on a real
    `/moviesessions/...?curatedType=...` URL (with the click fix now working) and finding no
    "headsup" text/dialog anywhere on the page, with or without clicking a showtime.
  - **No admin enable/disable flag, category-sequence field, personalization/"Recommended" logic,
    or Upcoming/Re-release date-filtering logic exists** in the real source or live API response
    (`CSH-014`, `CSH-015`, `CSH-024`, `CSH-025`, `CSH-026`, `CSH-029`, `CSH-030`). Category *order*
    IS testable (DOM order mirrors feed order — `CSH-039`), just not an admin toggle.
  - **No trailer exists on this listing card** (`CSH-021`) — trailer playback lives on the Movie
    Details page (see `movie-details.md`'s own real trailer coverage), confirmed absent here by
    source search.
  - **Homepage nav path unreliable** (`CSH-001`, `CSH-002`) — see Navigation section above.
- **Real findings that corrected the sheet's own assumptions** (documented inline, not silently
  reinterpreted):
  - The empty-state CTA's real text is **"Back to Homepage"**, not the sheet's "Let's Go"
    (`CSH-055`).
  - A category configured with an empty `movies: []` **still renders its own heading** — it does
    NOT disappear, contradicting `CSH-047`'s sheet wording. (Only a *search filtered to zero
    matches* hides a category entirely — a different code path, covered by `CSH-008`.)
  - Aborting the curated-shows API (simulating no internet, `CSH-037`) falls back to the exact
    same empty-state UI — no distinct "error message" as the sheet expects, but a real, graceful,
    non-crashing degradation.
  - Voice search (`CSH-009`) partially reacts, unlike `CitySelectionPage`'s own earlier "no
    reaction at all" finding: a denied microphone permission fires a real native `alert()` —
    "Microphone permission is blocked. Please enable it in browser settings." — caught and
    asserted live. The deeper "recognized keyword returns matches" behavior remains unverifiable
    headless (same posture as this ticket's own prior TC_App_085 exclusion).
- **Environment finding (re-confirmed 2026-09-01, grounded against UAT):** `/curated-shows`
  returns the empty state for **every UAT city with a cinema** (11 distinct `cityId`s checked
  directly via `GET /api/curated-shows?cityId=...`, including Mumbai/`cityId=1`) — a platform-wide
  gap, not a Mumbai-specific one. This is why the largest real cluster here is the empty-state
  suite (`CSH-053–071`, mirroring the sheet's own largest cluster, `TC_Web_128–146`); all
  content-present scenarios are driven via `page.route()` mocking of the real API, using field
  names extracted directly from the shipped bundle (see `curatedShowsData.ts`), not guessed.
  City-switching scenarios (`CSH-022`, `CSH-046`, `CSH-062`, `CSH-063`, `CSH-070`) are similarly
  mocked per-`cityId` since no real UAT city has content to switch *to*.

## Scenarios

- **Suggested journey:** `src/tests/curated-shows.spec.ts`
- **Sheet:** pasted `TC_Web_076–146` raw excerpt (tab-separated, columns: ID / Module / Title /
  Precondition / Steps / Expected / Notes) — see Source section.

- [x] **CSH-001** — Curated Shows menu visible on homepage nav | `@P0 @Regression` — `test.fixme` (unreliable live)
- [x] **CSH-002** — Access Curated Shows from More menu | `@P0 @Regression` — `test.fixme` (unreliable live)
- [x] **CSH-003** — Page loads with banners and categories | `@P0 @Regression`
- [x] **CSH-004** — Promotional banners displayed | `@P1 @Regression`
- [x] **CSH-005** — Multiple banners display correctly while scrolling | `@P1 @Regression`
- [x] **CSH-006** — Search bar visible | `@P1 @Regression`
- [x] **CSH-007** — Movie search by keyword | `@P0 @Regression`
- [x] **CSH-008** — Search with no result | `@P1 @Regression`
- [x] **CSH-009** — Voice search: denied-mic real alert | `@P1 @Regression` (reinterpreted — see coverage note)
- [x] **CSH-010** — Category name displayed | `@P1 @Regression`
- [x] **CSH-011** — Info trigger ("Learn More") visible | `@P2 @Regression`
- [x] **CSH-012** — Tap info trigger shows description + Close CTA | `@P1 @Regression`
- [x] **CSH-013** — Close CTA closes info popup | `@P2 @Regression`
- [x] **CSH-014** — Only enabled categories displayed | `@P1 @Regression` — `test.fixme` (no enable flag)
- [x] **CSH-015** — Disabled category not shown | `@P0 @Regression` — `test.fixme` (no enable flag)
- [x] **CSH-016** — Movie list under category | `@P0 @Regression`
- [x] **CSH-017** — "See All" appears >10 movies | `@P1 @Regression` — `test.fixme` (feature absent)
- [x] **CSH-018** — "See All" navigates to full listing | `@P0 @Regression` — `test.fixme` (feature absent)
- [x] **CSH-019** — Tap movie card navigates to booking flow | `@P0 @Regression` (real — fixed mock `filmId` field)
- [x] **CSH-020** — Movie poster/genre visible | `@P1 @Regression`
- [x] **CSH-021** — Trailer/throwback accessible | `@P1 @Regression` — `test.fixme` (not on this card)
- [x] **CSH-022** — Curated shows are city specific | `@P0 @Regression` (mocked per-city)
- [x] **CSH-023** — Validation message no curated shows | `@P0 @Regression`
- [x] **CSH-024** — Personalization recommended movies | `@P1 @Regression` — `test.fixme` (no such logic)
- [x] **CSH-025** — Recommended tag visible | `@P1 @Regression` — `test.fixme` (no such logic)
- [x] **CSH-026** — Default sorting, no personalization | `@P1 @Regression` — `test.fixme` (no sort logic)
- [x] **CSH-027** — Auto category "Now Showing" appears | `@P1 @Regression` (reinterpreted — renders when in feed)
- [x] **CSH-028** — Auto category hidden when disabled | `@P1 @Regression` (folded into empty-state)
- [x] **CSH-029** — "Upcoming" shows unreleased movies | `@P1 @Regression` — `test.fixme` (no filter logic)
- [x] **CSH-030** — "Re-release" >3 months | `@P1 @Regression` — `test.fixme` (no filter logic)
- [x] **CSH-031** — Custom category manually mapped | `@P0 @Regression`
- [x] **CSH-032** — Custom category hidden when disabled | `@P2 @Regression` (folded into empty-state)
- [x] **CSH-033** — Special Show category displays mapped movies | `@P0 @Regression`
- [x] **CSH-034** — Tap special show movie → session page | `@P0 @Regression` (real — fixed mock `filmId` field)
- [x] **CSH-035** — Special show filter remains applied | `@P1 @Regression` (real — asserts `curatedType` persists on the session URL)
- [x] **CSH-036** — Headsup message on session select | `@P1 @Regression` — `test.fixme` (no such element on the real session page)
- [x] **CSH-037** — Internet disconnection handling | `@P0 @Regression` (graceful fallback, not distinct error)
- [x] **CSH-038** — Page reload restores | `@P1 @Regression`
- [x] **CSH-039** — Category sequence follows feed order | `@P1 @Regression`
- [x] **CSH-040** — Movie in multiple categories appears in each | `@P1 @Regression`
- [x] **CSH-041** — Movie removed from category no longer appears | `@P1 @Regression`
- [x] **CSH-042** — Banner header desc matches feed data | `@P1 @Regression`
- [x] **CSH-043** — Guest user can access | `@P0 @Regression`
- [x] **CSH-044** — Booking flow works for guest | `@P0 @Regression` (real — fixed mock `filmId` field)
- [x] **CSH-045** — Location permission required before access | `@P1 @Regression`
- [x] **CSH-046** — Switching city updates content | `@P0 @Regression` (mocked per-city)
- [x] **CSH-047** — Empty category not displayed | `@P1 @Regression` (real behavior contradicts sheet — see coverage note)
- [x] **CSH-048** — Large number of categories scroll | `@P2 @Regression`
- [x] **CSH-049** — Horizontal scroll for movie list | `@P2 @Regression` (real Swiper carousel)
- [x] **CSH-050** — Vertical layout for movie list | `@P2 @Regression` (reinterpreted — category stacking)
- [x] **CSH-051** — Performance, multiple categories | `@P2 @Regression`
- [x] **CSH-052** — Consistent behavior on Web | `@P1 @Regression` (no unexpected console errors)
- [x] **CSH-053** — No curated shows message (selected city) | `@P0 @Smoke`
- [x] **CSH-054** — Message content matches configured text | `@P1 @Regression`
- [x] **CSH-055** — Homepage-redirect CTA visible | `@P0 @Regression` (real text: "Back to Homepage")
- [x] **CSH-056** — Tap CTA redirects homepage | `@P0 @Smoke`
- [x] **CSH-057** — Homepage loads after CTA | `@P0 @Regression`
- [x] **CSH-058** — Reaccess shows message again | `@P1 @Regression`
- [x] **CSH-059** — No category sections when empty | `@P1 @Regression`
- [x] **CSH-060** — No promo banners when empty | `@P1 @Regression`
- [x] **CSH-061** — Search bar behavior when empty | `@P1 @Regression`
- [x] **CSH-062** — Switching to city with content | `@P1 @Regression` (mocked)
- [x] **CSH-063** — Switching back to no-content city | `@P1 @Regression` (mocked)
- [x] **CSH-064** — Guest sees no-curated-shows message | `@P1 @Regression`
- [x] **CSH-065** — Logged-in sees no-curated-shows message | `@P1 @Regression` (real OTP login)
- [x] **CSH-066** — No backend error, empty API response | `@P1 @Regression`
- [x] **CSH-067** — Internet disconnects after page load | `@P1 @Regression`
- [x] **CSH-068** — UI layout doesn't break when empty | `@P1 @Regression`
- [x] **CSH-069** — CTA clickable on Web | `@P1 @Regression`
- [x] **CSH-070** — No stale data after city change | `@P1 @Regression` (mocked)
- [x] **CSH-071** — Performance, empty state | `@P2 @Regression`

## E2E implementation notes

- **Layering:** `src/tests/curated-shows.spec.ts` → `src/modules/CuratedShowsModule.ts` →
  `src/pages/CuratedShowsPage.ts`, plus a shared mock-data builder in `src/testdata/curatedShowsData.ts`.
- **Frontend context:** No `dev-repo/` provided. Grounded via read-only headless Playwright against
  UAT (`inox-uat-web.pvrinox.com`, Mumbai-All), 2026-09-01, including reading the real shipped
  Next.js bundle directly (`_next/static/chunks/*.js`) to extract true field names for the mock
  payloads — not guessed. See `CuratedShowsPage.ts`/`CuratedShowsModule.ts` doc comments for the
  full grounding trail.
- **Reuse:** city bootstrap reuses `LocationHelper.grantMumbaiGeolocation`/`dismissPromoPopup`;
  city-switching scenarios reuse `CitySelectionModule`. **Bug fix applied during this grounding
  pass:** `CitySelectionPage.headerCityButton()`'s selector (`button[data-slot="drawer-trigger"]`)
  was not unique page-wide — Curated Shows' own "Learn More" popup uses the identical Radix
  drawer-trigger primitive, causing a strict-mode violation. Scoped to the "Map Point Icon" the
  header button always renders; this is a shared-file fix, not a Curated-Shows-only one.
- **Mocking:** `page.route()` intercepts the real `GET /api/curated-shows?cityId=...` proxy route,
  either replacing `curatedShows[]` wholesale (`mockCuratedShows`) or branching by `cityId`
  (`mockCuratedShowsPerCity`) for the city-switch scenarios — same `route.fetch()` +
  `route.fulfill({ response, json })` pattern `CitySelectionModule.ts` established. Internet-
  disconnection scenarios reuse `OffersModule.ts`'s `route.abort('internetdisconnected')` pattern.
- **Known sandbox flakiness:** individual test runs occasionally hit a transient UAT `504 Gateway
  Time-out` under load (matches the `sandbox-resource-constraints` project memory) — always
  resolved on an isolated single-test retry; not a defect in this suite.
- **Tags:** `@Smoke` for the two primary entry/redirect paths (`CSH-053`, `CSH-056`); `@P0` for
  navigation/empty-state/city-specificity paths; `@P1` for secondary category/search/resilience
  behavior; `@P2` for scroll/performance/cosmetic checks — per the source sheet's implicit priority
  (no explicit Priority column in this pasted excerpt; inferred consistent with the equivalent-role
  scenarios in `movie-details.md`/`city-selection.md`).
- **Run:** `npx playwright test src/tests/curated-shows.spec.ts --project=chromium`

## Source

- **Seed method:** raw sheet excerpt pasted directly into the task (tab-separated rows,
  `TC_Web_076–146`); supersedes the earlier `M6-website.pdf`/`TC_App_077–149` seed, which is no
  longer available in any form (never saved to disk, only cited by filename).
- **File:** none saved to disk — pasted excerpt only, matching the citation style of
  `_PVR INOX__ Test Cases - M4 _ Website (1).pdf` (also never saved, per `movie-details.md`'s own
  Source section) that every other `TC_WEB`-numbered module in this suite was built from.
- **Sheet:** N/A — single "Website" test-case excerpt, "Curated Shows" module section.
- **Columns:** ID, Module (first row only), Title, Precondition, Steps, Expected Result, Notes.
- **Frontend repo:** not provided — grounded instead against live UAT
  (`inox-uat-web.pvrinox.com`) and its shipped client bundle.
