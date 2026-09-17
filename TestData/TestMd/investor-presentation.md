# Playwright: Investor Presentation — admin CRUD for the public investor-presentation archive

## Acceptance criteria

- Admin can view, search (Name/Year), filter (Status), sort, and paginate the investor
  presentation listing, add/edit entries with Image/PDF, toggle Active/Inactive, and bulk-upload
  a "10 Years Highlight" CSV, with field-level validation.

## Navigation

1. Real, public path: home → **Investor Section** →
   `/investors-section?tab=financials&subtype=investor-presentation` — the real public archive
   (confirmed live: real yearly cards each with a working Download button, rendered in
   descending-year order, with genuine duplicate-year cards, e.g. six "2017" cards — the public
   equivalent of "multiple presentations for same year"). An "All Years" combobox filters the
   list.
2. Sheet-described admin path (not reachable on this app): Admin Panel → **Investor
   Presentation**.

## Test coverage

- **Scope:** Full — all 30 sheet rows for this module are covered in this batch.
- **Sheet rows included:** 30 (`INP-001`–`INP-030`).

## Scenarios

- **Suggested journey:** `src/tests/investor-presentation.spec.ts`
- **Sheet:** seventh 200-row batch

- [ ] **INP-001** — Real listing loads with genuine yearly cards (adapted title; real assertion)
- [ ] **INP-003** — Real "All Years" combobox is the public equivalent of Search by Year
- [ ] **INP-006** — Real listing is already ordered descending by year (public equivalent of Sort)
- [ ] **INP-007** — Real Download button is present and clickable on each card
- [ ] **INP-017** — Real page shows only publicly-published presentations
- [ ] **INP-018** — Real listing has genuine duplicate-year cards
- [ ] **INP-020** — Real "10 Years Highlight" is a sibling public data tab (genuine
  "Operational Highlights" FY16–FY25 table), not the sheet's admin CSV-upload popup — confirmed
  live, not assumed, after this exact confusion caused a real first-run test failure
- [ ] **INP-002**, **INP-004**–**INP-005**, **INP-008**–**INP-016**, **INP-019**,
  **INP-021**–**INP-030** — No admin CRUD form, Name search, Status filter, CSV-upload file
  input, or pagination control exists (adapted)
