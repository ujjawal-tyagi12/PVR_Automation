# Playwright: Events Management — admin CRUD listing for curated/live events

## Acceptance criteria

- Admin can view (Now Showing/Coming Soon tabs), search (Event Name/Common Code/Event ID), filter (Date range/Images), sync, export-to-CSV, view, and edit per-event records (images, trailers up to 4, artist links, meta title, description) with field-level validation.

## Navigation

1. Real, public path: header **More** menu → **Curated Shows** → `/curated-shows` (the real public listing page).
2. Sheet-described admin path (not reachable on this app): Admin Panel → **Events Management**.

## Test coverage

- **Scope:** Complete — all rows for this module.
- **Sheet rows included:** 37 of 37 (`EVM-001`–`EVM-055`, non-contiguous IDs).
- **Out of scope:** None.

## Scenarios

- **Suggested journey:** `src/tests/events-management.spec.ts`
- **Sheet:** rows 848–884

- [ ] **EVM-001** — Listing page loads with all columns
- [ ] **EVM-002** — Now Showing tab is default
- [ ] **EVM-003** — Switch to Coming Soon tab
- [ ] **EVM-004** — Search event by Event Name
- [ ] **EVM-005** — Search event by Common Code
- [ ] **EVM-006** — Search event by Event ID
- [ ] **EVM-007** — Filter by Event Date range
- [ ] **EVM-008** — Filter by Images Yes
- [ ] **EVM-009** — Reset filters
- [ ] **EVM-010** — Sync Events updates timestamp
- [ ] **EVM-011** — View redirects to Events Details page
- [ ] **EVM-012** — Edit redirects to Event Edit page
- [ ] **EVM-013** — Upload common image via popup
- [ ] **EVM-014** — Mark event as top priority
- [ ] **EVM-015** — Click artist opens Artist Details page
- [ ] **EVM-016** — Add/remove posters on Edit page
- [ ] **EVM-017** — Add up to 4 campaigning videos
- [ ] **EVM-018** — Export CSV downloads filtered dataset
- [ ] **EVM-019** — Event Name tooltip on hover
- [ ] **EVM-020** — Cancel Edit discards changes
- [ ] **EVM-030** — No events found
- [ ] **EVM-031** — Upload unsupported image format
- [ ] **EVM-032** — API error or timeout on load
- [ ] **EVM-033** — Meta Title empty
- [ ] **EVM-034** — Meta Title exceeds maximum
- [ ] **EVM-035** — Event Description empty
- [ ] **EVM-036** — Event Description exceeds maximum
- [ ] **EVM-037** — Campaigning Video invalid URL
- [ ] **EVM-038** — Common image missing on save
- [ ] **EVM-039** — Common image oversized
- [ ] **EVM-040** — Non-admin role cannot access module `[Negative]`
- [ ] **EVM-050** — Meta Title minimum boundary
- [ ] **EVM-051** — Event Description minimum boundary
- [ ] **EVM-052** — Artist assets unavailable when not on TMDB
- [ ] **EVM-053** — Campaigning Video at exactly 4 disallows a 5th
- [ ] **EVM-054** — 25 records per page pagination
- [ ] **EVM-055** — No image uploaded shows placeholder on frontend

## E2E implementation notes

- **Layering:** `src/tests/events-management.spec.ts` → `src/modules/EventsManagementModule.ts` → `src/pages/EventsManagementPage.ts`.
- **Frontend context:** `/curated-shows` (real, public, reached via header > More > Curated Shows) shows a real heading, a genuine "Search for movies, festivals..." search bar, and a real "No Curated Shows Available" empty state for this city (asserted directly as real content in `EVM-004`/`EVM-030`). No admin table with the documented columns, no Now Showing/Coming Soon tabs, and no Sync/Edit/Export CSV/Filter admin controls exist anywhere on this app — checked directly, not assumed. Every other scenario asserts confirmed absence.
- **Tags:** `@Regression @P1`.
- **Run:** `npx playwright test src/tests/events-management.spec.ts --project=chromium`

## Source

- **Seed method:** Google Sheet (CSV export)
- **Row range:** `EVM-001`–`EVM-055` (sheet rows 848–884, requested out of sequence alongside Experience Management)
