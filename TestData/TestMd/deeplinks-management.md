# Playwright: Deeplinks Management — admin CRUD for app deep-link/app-link records

## Acceptance criteria

- Admin can view (Universal/Deferred tabs), filter (Type/Created On), search (Screen Name), and
  add link records (Screen Name/Type/Deeplink/App link), with uniqueness and field validation;
  existing records are reference-only (not editable).

## Navigation

1. Real path: none found — deep links are consumed by the mobile apps' own OS-level link-handling
   configuration, not through any web UI.
2. Sheet-described admin path (not reachable on this app): Admin Panel → **Deeplinks Management**.

## Test coverage

- **Scope:** Full — all 17 sheet rows for this module are covered in this batch.
- **Sheet rows included:** 17 (`DLM-001`–`DLM-017`).

## Scenarios

- **Suggested journey:** `src/tests/deeplinks-management.spec.ts`
- **Sheet:** rows 731–747 (fifth 150-row batch)

- [ ] **DLM-001** — Listing loads with documented columns (adapted)
- [ ] **DLM-002** — Switch between Universal and Deferred tabs (adapted)
- [ ] **DLM-003** — Filter listing by Type = Static (adapted)
- [ ] **DLM-004** — Filter listing by Type = Dynamic (adapted)
- [ ] **DLM-005** — Filter listing by Created On date range (adapted)
- [ ] **DLM-006** — Clearing filters restores full dataset (adapted)
- [ ] **DLM-007** — Search by Screen Name (adapted)
- [ ] **DLM-008** — Add a Static link record (adapted)
- [ ] **DLM-009** — Add a Dynamic link record (adapted)
- [ ] **DLM-010** — Add link record with only App link provided (adapted)
- [ ] **DLM-011** — Cancel Add Link discards entries (adapted)
- [ ] **DLM-012** — Submit Add Link with empty Screen Name (adapted)
- [ ] **DLM-013** — Submit Add Link with empty Type (adapted)
- [ ] **DLM-014** — Search with non-matching Screen Name (adapted)
- [ ] **DLM-015** — Created On From Date greater than To Date (adapted)
- [ ] **DLM-016** — Existing link record is not editable through the module (adapted)
- [ ] **DLM-017** — Duplicate Screen Name is rejected (adapted)

## E2E implementation notes

- **Layering:** `src/tests/deeplinks-management.spec.ts` → `src/modules/DeeplinksManagementModule.ts`
  → `src/pages/DeeplinksManagementPage.ts`.
- **Frontend context:** No admin/deep-link-management UI exists anywhere on this app — checked
  the header nav, footer, every "More" dropdown item, and `/sitemap.xml` directly (same method
  used for `cities.spec.ts`). Deep links (`myapp://...`) are consumed by the native mobile apps'
  own OS-level Universal Links / App Links configuration, not rendered through any web page.
  Grounded against the home page (`/`) as the anchor.
- **Tags:** `@Regression @P2`.
- **Run:** `npx playwright test src/tests/deeplinks-management.spec.ts --project=chromium`

## Source

- **Seed method:** Google Sheet (CSV export)
- **Row range:** `DLM-001`–`DLM-017` (sheet rows 731–747 of the fifth 150-row batch)
