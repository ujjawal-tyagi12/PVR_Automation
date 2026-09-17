# Playwright: Food Category Management — admin CRUD for F&B category records

## Acceptance criteria

- Admin can view, search, filter (Last Edited On), sync-from-Showbizz, view Details, edit
  (Sequence/F&B Image/Kiosk Image — Name is read-only), and resolve sequence conflicts for food
  categories, with field-level validation.

## Navigation

1. Real, public path: header **Food → Order Anytime → Explore Menu** → select a cinema → pickup
   time → `/food/menu?cinemaId={id}` — the real public food-ordering menu, whose category filter
   chips (e.g. "Hot beverages 5", "Breakfast 1", "Burger 1", "Combos 10", "Popcorn 2") are exactly
   the categories this module manages.
2. Sheet-described admin path (not reachable on this app): Admin Panel → **Food Category
   Management**.

## Test coverage

- **Scope:** Full — all 26 sheet rows for this module are covered in this batch.
- **Sheet rows included:** 26 (`FCM-001`–`FCM-035`, non-contiguous IDs).

## Scenarios

- **Suggested journey:** `src/tests/food-category-management.spec.ts`
- **Sheet:** rows (sixth 150-row batch, `Email SMS Action` block)

- [ ] **FCM-001** — View listing (adapted; real category chips shown instead)
- [ ] **FCM-002** — Search by Name (adapted)
- [ ] **FCM-003** — Filter by Last Edited On range (adapted)
- [ ] **FCM-004** — Sync Food Categories (adapted)
- [ ] **FCM-005** — View category details (adapted)
- [ ] **FCM-006** — Navigate to Edit from Details (adapted)
- [ ] **FCM-007** — Edit sequence successfully (adapted)
- [ ] **FCM-008** — Upload images via Edit screen (adapted)
- [ ] **FCM-009** — Upload images via listing action icon (adapted)
- [ ] **FCM-010** — Confirm sequence conflict (adapted)
- [ ] **FCM-011** — Cancel sequence conflict (adapted)
- [ ] **FCM-012** — Cancel edit discards changes (adapted)
- [ ] **FCM-013** — New synced category placed at end without sequence (adapted)
- [ ] **FCM-020** — Unsupported image file type (adapted)
- [ ] **FCM-021** — Image exceeds max size (adapted)
- [ ] **FCM-022** — Hotlinked image rejected (adapted)
- [ ] **FCM-023** — Sync failure (adapted)
- [ ] **FCM-024** — Save failure (adapted)
- [ ] **FCM-025** — Non-numeric sequence input (adapted)
- [ ] **FCM-026** — Sequence zero or negative (adapted)
- [ ] **FCM-030** — Sequence at minimum boundary (1) (adapted)
- [ ] **FCM-031** — Sequence at maximum boundary (1000) (adapted)
- [ ] **FCM-032** — Sequence exceeding maximum boundary (1001) (adapted)
- [ ] **FCM-033** — Sequence left blank (optional) (adapted)
- [ ] **FCM-034** — Sync does not overwrite manual edits (adapted)
- [ ] **FCM-035** — Name field is non-editable (adapted)

## E2E implementation notes

- **Layering:** `src/tests/food-category-management.spec.ts` →
  `src/modules/FoodCategoryManagementModule.ts` → `src/pages/FoodCategoryManagementPage.ts`.
- **Frontend context:** `/food/menu?cinemaId=200&cinemaName=INOX%20Megaplex` (real, public,
  reached via Food → Order Anytime → Explore Menu → cinema → pickup time) shows real category
  filter chips with live item counts — confirmed live. No admin table, search, sync control, or
  Edit form (Sequence/images) exists anywhere on this app — checked directly, not assumed. Shares
  its real anchor page with `food-items-management.spec.ts`.
- **Tags:** `@Regression @P1`.
- **Run:** `npx playwright test src/tests/food-category-management.spec.ts --project=chromium`

## Source

- **Seed method:** Google Sheet (CSV export)
- **Row range:** `FCM-001`–`FCM-035` (sixth 150-row batch)
