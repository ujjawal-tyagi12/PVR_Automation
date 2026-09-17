# Playwright: Format Management — admin CRUD for movie-format records (2D/3D/IMAX etc.)

## Acceptance criteria

- Admin can view, search (Format Key/Name), filter (Status/Brand), sync-from-Showbizz, view
  Details, edit (Name/Brand/Description — Format Key is read-only), and activate/deactivate
  formats, with field-level validation.

## Navigation

1. Real path: none found — no admin/settings surface for managing format records exists
   anywhere reachable from BASE_URL.
2. Sheet-described admin path (not reachable on this app): Admin Panel → **Format Management**.

## Test coverage

- **Scope:** Full — all 20 sheet rows for this module are covered in this batch.
- **Sheet rows included:** 20 (`FMT-001`–`FMT-020`).

## Scenarios

- **Suggested journey:** `src/tests/format-management.spec.ts`
- **Sheet:** sixth 150-row batch

- [ ] **FMT-001** — Listing screen displays controls and table (adapted)
- [ ] **FMT-002** — Search by Format Key and Name (adapted)
- [ ] **FMT-003** — Filter by Status and Brand (adapted)
- [ ] **FMT-004** — Sync Formats updates listing (adapted)
- [ ] **FMT-005** — View opens Format Details (adapted)
- [ ] **FMT-006** — Edit Format happy path (adapted)
- [ ] **FMT-007** — Activate format from listing (adapted)
- [ ] **FMT-008** — Deactivate format from Details page (adapted)
- [ ] **FMT-009** — Cancel on Edit discards changes (adapted)
- [ ] **FMT-010** — Format Key not editable (adapted)
- [ ] **FMT-011** — Empty Name rejected (adapted)
- [ ] **FMT-012** — Name below/above length bounds rejected (adapted)
- [ ] **FMT-013** — Empty Brand rejected (adapted)
- [ ] **FMT-014** — Description below/above length bounds rejected (adapted)
- [ ] **FMT-015** — Showbizz sync failure retains prior data (adapted)
- [ ] **FMT-016** — Save failure shows generic error (adapted)
- [ ] **FMT-017** — Duplicate Format Key during sync shows error (adapted)
- [ ] **FMT-018** — Name/Description at exact boundary lengths accepted (adapted)
- [ ] **FMT-019** — Pagination at 25 records per page (adapted)
- [ ] **FMT-020** — Search with no matches (adapted)

## E2E implementation notes

- **Layering:** `src/tests/format-management.spec.ts` → `src/modules/FormatManagementModule.ts`
  → `src/pages/FormatManagementPage.ts`.
- **Frontend context:** No admin/format-management UI exists anywhere on this app — checked the
  header nav, footer, every "More" dropdown item, and `/sitemap.xml` directly (same exhaustive
  method used for `cities.spec.ts`). This module's own error copy (`FMT-017`: "Duplicate
  Experience Key (unexpected)") suggests format and experience records share the same backend Key
  concept — `experience-management.spec.ts` already grounds the real, public counterpart for that
  data. Grounded against the home page (`/`) as the anchor for this module specifically.
- **Tags:** `@Regression @P2`.
- **Run:** `npx playwright test src/tests/format-management.spec.ts --project=chromium`

## Source

- **Seed method:** Google Sheet (CSV export)
- **Row range:** `FMT-001`–`FMT-020` (sixth 150-row batch)
