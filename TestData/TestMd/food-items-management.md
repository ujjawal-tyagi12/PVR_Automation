# Playwright: Food Items Management — admin CRUD/reporting for per-cinema food-item records

## Acceptance criteria

- Admin selects a cinema to view its food items (with rich per-item metadata), searches, filters
  (Category/Best Seller/Type/Date range), inspects Add Ons/Combo/Allergens/Price-Info pop-ups,
  syncs from Showbizz, and exports to CSV. No add/edit/delete controls (view/report-only).

## Navigation

1. Real, public path: header **Food → Order Anytime → Explore Menu** → select a cinema → pickup
   time → `/food/menu?cinemaId={id}` — the real public food-ordering menu: a genuine "cinema
   selection required first" flow (matches `FIM-001`/`FIM-002` exactly), real items with
   name/price/veg icon/allergen-info button, and a real working search ("Search for Item").
2. Sheet-described admin path (not reachable on this app): Admin Panel → **Food Items
   Management**.

## Test coverage

- **Scope:** Full — all 25 sheet rows for this module are covered in this batch.
- **Sheet rows included:** 25 (`FIM-001`–`FIM-033`, non-contiguous IDs).

## Scenarios

- **Suggested journey:** `src/tests/food-items-management.spec.ts`
- **Sheet:** sixth 150-row batch

- [ ] **FIM-001** — Listing blank until cinema selected (real, adapted: URL param not a UI dropdown)
- [ ] **FIM-002** — Select cinema shows food items list (real)
- [ ] **FIM-003** — Search food item by name (real)
- [ ] **FIM-004** — Suggestive search on cinema selection (adapted)
- [ ] **FIM-005** — Filter by Food Category (multi-select) (real, adapted control name — category chips)
- [ ] **FIM-006** — Filter by Best Seller Yes (adapted)
- [ ] **FIM-007** — Filter by Type Veg/Non-Veg/NA (adapted; real veg icon shown per item instead)
- [ ] **FIM-008** — Filter by Date Range (adapted)
- [ ] **FIM-009** — Add Ons info pop-up (adapted)
- [ ] **FIM-010** — Combo info pop-up (adapted)
- [ ] **FIM-011** — Allergens count pop-up (real, adapted: real "Allergen information" button)
- [ ] **FIM-012** — Price Info pop-up (adapted; real single price shown per item instead)
- [ ] **FIM-013** — Price Info reflects applied Date Range (adapted)
- [ ] **FIM-014** — Image thumbnail opens modal (adapted)
- [ ] **FIM-015** — Sync Food Items updates timestamp (adapted)
- [ ] **FIM-016** — Export CSV downloads filtered dataset (adapted)
- [ ] **FIM-020** — Search without selecting cinema (adapted)
- [ ] **FIM-021** — Sync failure shows error (adapted)
- [ ] **FIM-022** — No matching records (real, adapted copy)
- [ ] **FIM-023** — Non-admin role cannot access module `[Negative]` (adapted)
- [ ] **FIM-024** — No add/edit/delete controls exposed (real, structural corollary)
- [ ] **FIM-030** — Type shown as Blank when unavailable from Showbizz (adapted)
- [ ] **FIM-031** — Default Date Range is current date (adapted)
- [ ] **FIM-032** — Only single cinema selectable (real, adapted: URL param is inherently single-cinema)
- [ ] **FIM-033** — Switching cinema refreshes listing (adapted)

## E2E implementation notes

- **Layering:** `src/tests/food-items-management.spec.ts` → `src/modules/FoodItemsManagementModule.ts`
  → `src/pages/FoodItemsManagementPage.ts`.
- **Frontend context:** `/food/menu?cinemaId=200&cinemaName=INOX%20Megaplex` (real, public) shows
  real food items (e.g. "Coke Regular" ₹179, "Ins - Samosa (2pcs.)" ₹195 with a veg icon and an
  "Allergen information" button) and a real, working search ("Search for Item" — confirmed live:
  typing "Coke" isolates "Coke Regular"; a nonsense query shows the real "No Result Found!" /
  "Trying searching with some other relevant keyword." empty state). The search input is
  `readonly` and only accepts keyboard input after a `click()` focuses it — `fill()` alone times
  out; use `click()` then `page.keyboard.type()`. No admin table, per-item Add Ons/Combo/Price-Info
  pop-ups, Sync/Export controls, or add/edit/delete actions exist anywhere on this app — checked
  directly, not assumed. Shares its real anchor page with `food-category-management.spec.ts`.
- **Tags:** `@Regression @P1`.
- **Run:** `npx playwright test src/tests/food-items-management.spec.ts --project=chromium`

## Source

- **Seed method:** Google Sheet (CSV export)
- **Row range:** `FIM-001`–`FIM-033` (sixth 150-row batch)
