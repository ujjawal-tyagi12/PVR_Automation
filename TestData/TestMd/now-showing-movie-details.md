# Playwright: Now Showing Movies Details Page (Web)

## Source

PVR INOX Regression Pack (App/Website/Msite), module "Now Showing Movies Details Page", the 9
rows tagged `App/Web/Msite` (`APP-068`–`APP-076`).

## Acceptance criteria

Movie details load with full metadata; trailer plays; showtimes are color-coded, sorted, date-
and format-filterable, and show language/subtitle info; sold-out/lapsed shows are handled
correctly.

## Navigation

Real, public route: `/moviesessions/{City}/{MovieSlug}/{MovieId}` — a combined details +
showtime page. Grounded via direct probe (2026-09-22) against a live now-showing title
(`Ramayanam(Hindi)`, id `30212`, Mumbai) — the exact movie/id is live catalog data and will
naturally change as titles rotate out of "Now Showing"; the page structure and locators
grounded here are what's stable.

## Test coverage

- **Scope:** Full — all 9 Web-tagged sheet rows for this module are covered.
- **Sheet rows included:** 9 (`APP-068`–`APP-076`).

## Scenarios

- **Suggested journey:** `src/tests/now-showing-movie-details.spec.ts`
- **Source:** PVR INOX Regression Pack (App/Website/Msite)

- [ ] **APP-068** — Real movie details load (title, genre, language, rating, synopsis)
- [ ] **APP-069** — Real trailer playback opens a real dialog with a video iframe
- [ ] **APP-070** — Real showtime color-coding legend (Available/Filling Fast/Sold Out/Lapsed)
  is shown
- [ ] **APP-071** — Adapted: no live Sold Out showtime was reliably reachable across probes to
  click deterministically — confirms the legend (APP-070) as the reachable piece of this rule
- [ ] **APP-072** — Adapted: verifying a showtime disappears after its real stop-time passes
  isn't practically waitable in an automated test
- [ ] **APP-073** — Real showtimes render in ascending chronological order (verified
  programmatically from the displayed times)
- [ ] **APP-074** — Real date selector updates the showtime grid
- [ ] **APP-075** — Real format/experience filter control is reachable
- [ ] **APP-076** — Real language/subtitle info displays per showtime (Wheelchair/Subtitle
  icons)
