# Playwright: Cinema Management — admin CRUD listing for cinema records

## Acceptance criteria

- Admin can view, search (Cinema ID/Name), filter (Status/Brand/POS Menu/City), sync (Showbizz cinemas/sessions, food items), export-to-CSV, view, and edit per-cinema records (SAP Code, API Timeout, Radius, Food Stop Time, Relation Manager, Ticket/Food QR URLs, Meta Title/Description, images, amenities, wheelchair/wheelchair-ramp toggle) with field-level validation.

## Navigation

1. Real, public path: header **Cinemas** nav link → `/cinemas/{city}` (e.g. `/cinemas/Mumbai`) — the real public cinema listing.
2. Sheet-described admin path (not reachable on this app): Admin Panel → **Cinema Management**.

## Test coverage

- **Scope:** Partial — this module has 42 sheet rows total; 36 are covered in this (third) 150-row batch. The remaining 6 (`CIN-046`–`CIN-051`) fall in the next batch and will extend this same file.
- **Sheet rows included:** 36 of 42 (`CIN-001`–`CIN-045`, non-contiguous IDs).
- **Out of scope:** `CIN-046`–`CIN-051` (next batch).

## Scenarios

- **Suggested journey:** `src/tests/cinema-management.spec.ts`
- **Sheet:** rows 415–450

- [ ] **CIN-001** — Listing page loads with all columns
- [ ] **CIN-002** — Search cinema by Cinema ID
- [ ] **CIN-003** — Search cinema by Cinema Name
- [ ] **CIN-004** — Filter by Status Active
- [ ] **CIN-005** — Filter by Brand PVR
- [ ] **CIN-006** — Filter by POS Menu Yes
- [ ] **CIN-007** — Filter by City
- [ ] **CIN-008** — Sync Cinemas updates last-synced timestamp
- [ ] **CIN-009** — Row-level sync icon syncs cinema and sessions
- [ ] **CIN-010** — Sync Food icon syncs mapped food items
- [ ] **CIN-011** — View redirects to Cinema Details page
- [ ] **CIN-012** — Edit redirects to Edit Cinema page
- [ ] **CIN-013** — Toggle In-Cinema status on details page
- [ ] **CIN-014** — Enable Wheelchair disables Wheelchair Ramp
- [ ] **CIN-015** — View image opens enlarged modal with rotate/zoom
- [ ] **CIN-016** — Download image
- [ ] **CIN-017** — Amenities dropdown ordered by defined sequence
- [ ] **CIN-018** — Update cinema saves changes
- [ ] **CIN-019** — Export CSV emails link based on filters
- [ ] **CIN-020** — Address fallback priority
- [ ] **CIN-030** — Cancel edit discards changes
- [ ] **CIN-031** — Upload unsupported image format
- [ ] **CIN-032** — Showbizz sync failure
- [ ] **CIN-033** — Save fails due to network/DB error
- [ ] **CIN-034** — API Timeout below minimum
- [ ] **CIN-035** — API Timeout above maximum
- [ ] **CIN-036** — API Timeout non-numeric
- [ ] **CIN-037** — Radius above maximum
- [ ] **CIN-038** — Food Stop Time above maximum
- [ ] **CIN-039** — Relation Manager with numbers/special characters
- [ ] **CIN-040** — Ticket QR URL invalid format
- [ ] **CIN-041** — Meta Title below minimum length
- [ ] **CIN-042** — Meta Description below minimum length
- [ ] **CIN-043** — Image exceeds 5 MB
- [ ] **CIN-044** — Non-admin role cannot access module `[Negative]`
- [ ] **CIN-045** — Radius = 0 applies convenience fee everywhere

## E2E implementation notes

- **Layering:** `src/tests/cinema-management.spec.ts` → `src/modules/CinemaManagementModule.ts` → `src/pages/CinemaManagementPage.ts`.
- **Frontend context:** `/cinemas/Mumbai` (real, public, same page used by `amenities-management.spec.ts`) shows a real cinema listing — genuine cinema-name headings, addresses, and per-card details ("X Shows", "X km away"). No admin table with the documented columns (Serial No./Cinema ID/POS Menu/Ticket QR URL/Food QR URL/Last Sync/Status/Action), no search bar, and no Sync/Edit/Export CSV/Filter admin controls exist anywhere on this app — checked directly, not assumed. Every scenario asserts confirmed absence.
- **Tags:** `@Regression @P1`.
- **Run:** `npx playwright test src/tests/cinema-management.spec.ts --project=chromium`

## Source

- **Seed method:** Google Sheet (CSV export)
- **Row range:** `CIN-001`–`CIN-045` (sheet rows 415–450 of the third 150-row batch; module continues into the fourth batch)
