# Playwright: APP100 Redemption Reports — redemption listing, brand/cinema/date filters, export

## Acceptance criteria

- Listing shows redemption counts by cinema; supports search by cinema name, Brand filter (PVR/INOX), multi-cinema filter, Date Range filter (combinable), and CSV export.

## Navigation

1. Log in to the Admin Panel (see `admin-login.md`).
2. Navigate to **Reports → APP100 Redemption Reports**.

## Test coverage

- **Scope:** Complete — all rows in this batch.
- **Sheet rows included:** 15 of 15 (`ARD-001`–`ARD-043`, non-contiguous IDs as in the source sheet).
- **Out of scope:** None within this batch.

## Scenarios

- **Suggested journey:** `src/tests/app100-redemption-reports.spec.ts`
- **Sheet:** rows 207–221

- [ ] **ARD-001** — View listing page with redemption columns
- [ ] **ARD-002** — Search by cinema name
- [ ] **ARD-003** — Filter by Brand — PVR
- [ ] **ARD-004** — Filter by Brand — INOX
- [ ] **ARD-005** — Filter by multiple cinemas
- [ ] **ARD-006** — Filter by valid Date Range
- [ ] **ARD-007** — Export CSV
- [ ] **ARD-008** — Combine Brand and Cinema filters
- [ ] **ARD-020** — No records found for filter combination
- [ ] **ARD-021** — Invalid Date Range
- [ ] **ARD-022** — Search with non-existent cinema name
- [ ] **ARD-040** — Cinema with all-zero redemption counts
- [ ] **ARD-041** — Date Range boundary — From equal to To
- [ ] **ARD-042** — Combine Brand, Cinema, and Date Range filters
- [ ] **ARD-043** — Export CSV with no filters applied

## E2E implementation notes

- **Layering:** `src/tests/app100-redemption-reports.spec.ts` → `src/modules/App100RedemptionReportsModule.ts` → `src/pages/App100RedemptionReportsPage.ts`.
- **Frontend context:** No public "APP100" surface exists anywhere on this app (checked directly). Internal redemption report with no customer-facing equivalent; every scenario asserts confirmed absence.
- **Tags:** `@Regression @P2`.
- **Run:** `npx playwright test src/tests/app100-redemption-reports.spec.ts --project=chromium`

## Source

- **Seed method:** Google Sheet (CSV export)
- **Row range:** `ARD-001`–`ARD-043` (rows 207–221 of the second 150-row batch)
