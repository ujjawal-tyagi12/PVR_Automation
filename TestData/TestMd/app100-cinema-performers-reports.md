# Playwright: APP100 Cinema Performers Reports — cinema-level activity listing, filters, export

## Acceptance criteria

- Listing shows current-day APP100 activity by cinema; supports single/multi cinema selection (with in-dropdown search), search bar by Cinema Name/ID, Date Range filter, and CSV export.
- Cinemas with zero activity still appear in the listing; invalid date ranges and no-match filter combinations are handled gracefully.

## Navigation

1. Log in to the Admin Panel (see `admin-login.md`).
2. Navigate to **Reports → APP100 Cinema Performers Reports**.

## Test coverage

- **Scope:** Complete — all rows in this batch.
- **Sheet rows included:** 15 of 15 (`ACP-001`–`ACP-043`, non-contiguous IDs as in the source sheet).
- **Out of scope:** None within this batch.

## Scenarios

- **Suggested journey:** `src/tests/app100-cinema-performers-reports.spec.ts`
- **Sheet:** PVR INOX — Admin Portal Test Cases (Web-Only) → default sheet, rows 176–190

- [ ] **ACP-001** — View listing page with current-day default data
- [ ] **ACP-002** — Select a single cinema
- [ ] **ACP-003** — Select multiple cinemas
- [ ] **ACP-004** — Search cinema dropdown by name
- [ ] **ACP-005** — Search bar by Cinema Name
- [ ] **ACP-006** — Search bar by Cinema ID
- [ ] **ACP-007** — Filter by valid Date Range
- [ ] **ACP-008** — Export CSV
- [ ] **ACP-020** — No records found for filter combination
- [ ] **ACP-021** — Invalid Date Range
- [ ] **ACP-022** — Search with non-existent Cinema Name/ID
- [ ] **ACP-040** — Cinema with zero activity still listed
- [ ] **ACP-041** — Cinema search with special characters
- [ ] **ACP-042** — Date Range boundary — From equal to To
- [ ] **ACP-043** — Export CSV with no filters applied

## E2E implementation notes

- **Layering:** `src/tests/app100-cinema-performers-reports.spec.ts` → `src/modules/App100CinemaPerformersReportsModule.ts` → `src/pages/App100CinemaPerformersReportsPage.ts`.
- **Frontend context:** No public page on `inox-uat-web.pvrinox.com` references "APP100" anywhere (checked directly via site-wide text search) — this is an internal loyalty-app performance report with no customer-facing equivalent. Every scenario asserts the confirmed absence of the described control against the closest available real page (home).
- **Tags:** `@Regression @P2`.
- **Run:** `npx playwright test src/tests/app100-cinema-performers-reports.spec.ts --project=chromium`

## Source

- **Seed method:** Google Sheet (CSV export)
- **Row range:** `ACP-001`–`ACP-043` (rows 176–190 of the second 150-row batch)
