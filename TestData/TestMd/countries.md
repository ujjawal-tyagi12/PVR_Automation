# Playwright: Countries — admin master-data listing (view-only)

## Acceptance criteria

- Admin can view and search a paginated, view-only list of configured countries (Country
  ID/Name/ISO Code/Phone Code) and open per-country Details (Currency/Latitude/Longitude); no
  create/edit/delete.

## Navigation

1. Real path: none found — this is a single-country (India) app with no country
   listing/switcher/selector anywhere on this app.
2. Sheet-described admin path (not reachable on this app): Admin Panel → **Countries**.

## Test coverage

- **Scope:** Full — all 15 sheet rows for this module are covered in this batch.
- **Sheet rows included:** 15 (`CTY-001`–`CTY-015`).

## Scenarios

- **Suggested journey:** `src/tests/countries.spec.ts`
- **Sheet:** rows 613–627 (fourth 150-row batch)

- [ ] **CTY-001** — Listing screen displays search bar and table (adapted)
- [ ] **CTY-002** — Search by country name returns match (adapted)
- [ ] **CTY-003** — Search by phone code returns match (adapted)
- [ ] **CTY-004** — View opens Country Details (adapted)
- [ ] **CTY-005** — Country Details shows all fields (adapted)
- [ ] **CTY-006** — Pagination at 25 records per page (adapted)
- [ ] **CTY-007** — Search with no matches shows error message (adapted)
- [ ] **CTY-008** — No create-country option available (real, structural corollary)
- [ ] **CTY-009** — No edit/delete actions on listing (real, structural corollary)
- [ ] **CTY-010** — Empty search input (adapted)
- [ ] **CTY-011** — Search term with special characters (adapted)
- [ ] **CTY-012** — Case-insensitive search boundary (adapted)
- [ ] **CTY-013** — Partial phone code search (adapted)
- [ ] **CTY-014** — Single-country dataset boundary (real: this app genuinely serves one country, India)
- [ ] **CTY-015** — Last page of pagination with partial page (adapted)

## E2E implementation notes

- **Layering:** `src/tests/countries.spec.ts` → `src/modules/CountriesModule.ts` →
  `src/pages/CountriesPage.ts`.
- **Frontend context:** No admin/country-listing UI exists anywhere on this app — checked the
  header nav, footer, every "More" dropdown item, and `/sitemap.xml` directly (same exhaustive
  method used for `cities.spec.ts`). Grounded against the home page (`/`) as the anchor. One
  scenario (`CTY-014`) has a genuinely real, checkable corollary: this app serves exactly one
  country (India) end-to-end — every phone field, address, and currency observed across every
  other module is India-only, which is itself the real "single-country dataset" state the sheet
  describes as a boundary case.
- **Tags:** `@Regression @P2`.
- **Run:** `npx playwright test src/tests/countries.spec.ts --project=chromium`

## Source

- **Seed method:** Google Sheet (CSV export)
- **Row range:** `CTY-001`–`CTY-015` (sheet rows 613–627 of the fourth 150-row batch)
