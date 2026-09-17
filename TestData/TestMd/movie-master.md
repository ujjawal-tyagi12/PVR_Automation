# Playwright: Movie Master — admin CRUD for the master movie catalog

## Acceptance criteria

- Admin can view, search (Movie Name/Common Code/Movie ID), filter (Release Date/Images/Common
  Code/Trailers/Languages), sort, export CSV, and edit movie records (Meta Title/Synopsis/
  Trailers/Images), with field-level validation.

## Navigation

1. Real, public path: `/coming-soon` — the same real, public, week-grouped movie listing
   already grounded for `coming-soon.spec.ts` (batch 4), reused here as the public equivalent of
   the master movie catalog. Real search and a real FILTER BY panel (Genre/Language) are
   confirmed live.
2. Sheet-described admin path (not reachable on this app): Admin Panel → **Movie Master**.

## Test coverage

- **Scope:** Full — all 35 sheet rows for this module are covered in this batch.
- **Sheet rows included:** 35 (`MM-001`–`MM-035`).

## Scenarios

- **Suggested journey:** `src/tests/movie-master.spec.ts`
- **Sheet:** eighth 200-row batch

- [ ] **MM-001**, **MM-002**, **MM-009**, **MM-020** — Real listing/search/filter/empty-state
  grounded (adapted title where the sheet's column names differ)
- [ ] **MM-003**–**MM-008**, **MM-010**–**MM-019**, **MM-021**–**MM-035** — No admin CRUD table,
  Common Code/Movie ID search, Release Date filter, Sync/Export/Edit/Upload control, or
  validation surface exists (adapted)
