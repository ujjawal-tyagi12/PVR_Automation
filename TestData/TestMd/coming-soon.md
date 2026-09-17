# Playwright: Coming Soon (Movies Management) — admin CRUD listing for upcoming-movie records

## Acceptance criteria

- Admin can view, search (Movie Name/Common Code/Movie ID), filter (Release Date range/Images/Common
  Code/Trailers), sync, export-to-CSV, view, edit, activate/deactivate, and upload images/trailers for
  Coming Soon movie records, with field-level validation on the edit form.

## Navigation

1. Real, public path: header **Coming Soon** tab (home page) or **More → (equivalent)** → `/coming-soon`
   — the real public upcoming-movies listing.
2. Sheet-described admin path (not reachable on this app): Admin Panel → **Coming Soon (Movies
   Management)**.

## Test coverage

- **Scope:** Full — all 37 sheet rows for this module are covered in this batch.
- **Sheet rows included:** 37 (`CSM-001`–`CSM-055`, non-contiguous IDs).

## Scenarios

- **Suggested journey:** `src/tests/coming-soon.spec.ts`
- **Sheet:** rows 497–533 (fourth 150-row batch)

- [ ] **CSM-001** — Listing page loads with all columns (adapted)
- [ ] **CSM-002** — Search movie by Movie Name (real)
- [ ] **CSM-003** — Search movie by Common Code (adapted)
- [ ] **CSM-004** — Search movie by Movie ID (adapted)
- [ ] **CSM-005** — Filter by Release Date range (adapted)
- [ ] **CSM-006** — Filter by Images Yes (adapted)
- [ ] **CSM-007** — Filter by Common Code Yes (adapted)
- [ ] **CSM-008** — Filter by Trailers Yes (adapted)
- [ ] **CSM-009** — Reset filters (real, via "Clear All")
- [ ] **CSM-010** — Sync Movies updates timestamp (adapted)
- [ ] **CSM-011** — View redirects to Movies Details page (adapted)
- [ ] **CSM-012** — Edit redirects to Movies Edit page (adapted)
- [ ] **CSM-013** — Upload common image via popup (adapted)
- [ ] **CSM-014** — Activate a movie (adapted)
- [ ] **CSM-015** — Deactivate a movie (adapted)
- [ ] **CSM-016** — Manual Showbizz sync for selected movie (adapted)
- [ ] **CSM-017** — Select single synopsis source (adapted)
- [ ] **CSM-018** — Upload up to 4 trailers (adapted)
- [ ] **CSM-019** — Regional image overrides common image (adapted)
- [ ] **CSM-020** — Export CSV downloads filtered dataset (adapted)
- [ ] **CSM-021** — Movie auto-moves to Now Showing when booking opens (adapted)
- [ ] **CSM-030** — No movies found (real, adapted copy)
- [ ] **CSM-031** — Upload unsupported image format (adapted)
- [ ] **CSM-032** — API error or timeout on load (adapted)
- [ ] **CSM-033** — Meta Title empty (adapted)
- [ ] **CSM-034** — Synopsis exceeds maximum (adapted)
- [ ] **CSM-035** — Trailer with invalid URL (adapted)
- [ ] **CSM-036** — Image missing on save (adapted)
- [ ] **CSM-037** — Image oversized (adapted)
- [ ] **CSM-038** — Adult Movie Description below minimum (adapted)
- [ ] **CSM-039** — Non-admin role cannot access module `[Negative]` (adapted)
- [ ] **CSM-050** — Synopsis minimum boundary (adapted)
- [ ] **CSM-051** — Movie mapped to multiple cities shows different statuses (adapted)
- [ ] **CSM-052** — Coming Soon movie displays placeholder when no image uploaded (adapted)
- [ ] **CSM-053** — Coming Soon movies excluded from Curated Shows (adapted)
- [ ] **CSM-054** — Upcoming release visible up to 1 year ahead (adapted)
- [ ] **CSM-055** — Trailer at exactly 4 disallows a 5th (adapted)

## E2E implementation notes

- **Layering:** `src/tests/coming-soon.spec.ts` → `src/modules/ComingSoonModule.ts` →
  `src/pages/ComingSoonPage.ts`.
- **Frontend context:** `/coming-soon` (real, public) is a genuine, rich listing — week-grouped movie
  cards (e.g. "Week 39 | 25 Sep - 01 Oct") with real release dates/duration/language/certificate/genre,
  a working **Search for upcoming Movies** box (confirmed live: searching "Jana" isolates "Jana
  Nayagan" and hides other movies), a **FILTER BY** panel (Genre/Language checkboxes, **Clear All**,
  **Show Results**), and a real "Movies Not Found!" / "No movies found for this keyword" empty state
  (confirmed live). No admin table (Serial No./Movie ID/Alias Name/Common Code/Trailers/Status/Action),
  no Common Code/Movie ID search, no date-range filter, no Sync/Export CSV/View/Edit/Activate/Upload
  controls exist anywhere on this app — checked directly, not assumed.
- **Tags:** `@Regression @P1`.
- **Run:** `npx playwright test src/tests/coming-soon.spec.ts --project=chromium`

## Source

- **Seed method:** Google Sheet (CSV export)
- **Row range:** `CSM-001`–`CSM-055` (sheet rows 497–533 of the fourth 150-row batch)
