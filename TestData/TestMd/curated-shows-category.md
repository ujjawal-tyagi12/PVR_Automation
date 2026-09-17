# Playwright: Curated Shows Category (Movies Management) — admin CRUD listing for curated-show categories

## Acceptance criteria

- Admin can view, search, filter (Status/Category Type/Created On range), add, edit,
  activate/deactivate, and re-sequence Curated Show categories, with field-level validation.

## Navigation

1. Real, public path: header **More → Curated Shows** → `/curated-shows` — the real public
   curated-shows listing (currently empty).
2. Sheet-described admin path (not reachable on this app): Admin Panel → **Curated Shows
   Category**.

## Test coverage

- **Scope:** Partial — this module continues past this batch; `CSC-001`–`CSC-022` are covered
  here (19 rows; `CSC-017`–`CSC-019` absent from the source sheet). Remaining rows fall in the
  next batch.
- **Sheet rows included:** 19 of the module's total (`CSC-001`–`CSC-022`, non-contiguous IDs).
- **Out of scope:** rows beyond `CSC-022` (next batch).

## Scenarios

- **Suggested journey:** `src/tests/curated-shows-category.spec.ts`
- **Sheet:** rows 628–646 (fourth 150-row batch)

- [ ] **CSC-001** — Listing page loads with all columns (adapted)
- [ ] **CSC-002** — Search category by name (adapted)
- [ ] **CSC-003** — Filter by Status (adapted)
- [ ] **CSC-004** — Filter by Category Type (adapted)
- [ ] **CSC-005** — Filter by Created On date range (adapted)
- [ ] **CSC-006** — Add new category (adapted)
- [ ] **CSC-007** — Select multiple movies for category (adapted)
- [ ] **CSC-008** — View category details (adapted)
- [ ] **CSC-009** — Edit category (adapted)
- [ ] **CSC-010** — Activate category (adapted)
- [ ] **CSC-011** — Deactivate category (adapted)
- [ ] **CSC-012** — Sequence conflict reassigns and shifts existing category (adapted)
- [ ] **CSC-013** — Cancel Add Category (adapted)
- [ ] **CSC-014** — Cancel Edit Category (adapted)
- [ ] **CSC-015** — Reset filters (adapted)
- [ ] **CSC-016** — Special Shows category name is locked (adapted)
- [ ] **CSC-020** — No records match filters (real — matches the real empty-state page)
- [ ] **CSC-021** — Network/server error on save (adapted)
- [ ] **CSC-022** — Invalid image upload rejected (adapted)

## E2E implementation notes

- **Layering:** `src/tests/curated-shows-category.spec.ts` →
  `src/modules/CuratedShowsCategoryModule.ts` → `src/pages/CuratedShowsCategoryPage.ts`.
- **Frontend context:** `/curated-shows` (real, public) is a genuine page with a **Curated Shows**
  heading and a working **Search for movies, festivals...** box, currently showing the real empty
  state "No Curated Shows Available" (confirmed live) — this maps directly onto `CSC-020`'s "No
  records match filters" scenario. No admin table (Serial No./Category Name/Category Type/
  Sequence/Created On/Status/Action per TestData/TestMd/curated-shows-category.md), no Add/Edit/
  Activate/Sequence controls exist anywhere on this app — checked directly, not assumed.
- **Tags:** `@Regression @P1`.
- **Run:** `npx playwright test src/tests/curated-shows-category.spec.ts --project=chromium`

## Source

- **Seed method:** Google Sheet (CSV export)
- **Row range:** `CSC-001`–`CSC-022` (sheet rows 628–646 of the fourth 150-row batch; module
  continues into the fifth batch)
