# Playwright: Annual Reports (Financials) — listing, year-linked Start/End, and document download

## Acceptance criteria

- Listing shows report entries with Start Year/End Year, a Status, and a downloadable Document; supports search by Name/Year, Status filter, and sort by Start/End Year.
- Add creates a report by selecting a Start Year (auto-populating End Year) with optional Image/PDF upload; Edit pre-populates existing values and recalculating End Year when Start Year changes.
- Active/Inactive toggle is confirmation-gated in both directions; Cancel on Add/Edit/toggle discards changes.
- Unauthorized roles cannot reach Annual Reports.

## Navigation

1. Log in to the Admin Panel (see `admin-login.md`).
2. Navigate to **Financials → Annual Reports**.

## Test coverage

- **Scope:** Complete — all Annual Reports rows in this batch.
- **Sheet rows included:** 25 of 25 (`ANR-001`–`ANR-025`).
- **Out of scope:** None within this batch.

## Scenarios

- **Suggested journey:** `src/tests/annual-reports.spec.ts` (mirrored to `TestData/TestSpecs/`)
- **Sheet:** PVR INOX — Admin Portal Test Cases (Web-Only) → default sheet, rows 151–175

- [ ] **ANR-001** — Open Annual Reports listing page
- [ ] **ANR-002** — Search by Name/Year
- [ ] **ANR-003** — Filter by Status Active
- [ ] **ANR-004** — Filter by Status Inactive
- [ ] **ANR-005** — Sort by Start Year
- [ ] **ANR-006** — Sort by End Year
- [ ] **ANR-007** — Click Document View downloads PDF
- [ ] **ANR-008** — Click Add opens Add page
- [ ] **ANR-009** — Selecting Start Year auto-populates End Year
- [ ] **ANR-010** — Create report with all fields
- [ ] **ANR-011** — Create report without optional Image/PDF
- [ ] **ANR-012** — Click Edit opens Edit page pre-populated
- [ ] **ANR-013** — Edit Start Year updates End Year and Save
- [ ] **ANR-014** — Cancel Add returns to listing
- [ ] **ANR-015** — Cancel Edit returns to listing
- [ ] **ANR-016** — Toggle Active to Inactive via confirmation
- [ ] **ANR-017** — Toggle Inactive to Active via confirmation
- [ ] **ANR-018** — Multiple reports for same year
- [ ] **ANR-019** — Documents listed in descending creation order
- [ ] **ANR-020** — Pagination on listing
- [ ] **ANR-021** — Save without selecting Start Year
- [ ] **ANR-022** — End Year field is non-editable directly
- [ ] **ANR-023** — Cancel status-change confirmation
- [ ] **ANR-024** — Unauthorized role cannot access Annual Reports `[Negative]`
- [ ] **ANR-025** — Changing Start Year on Edit recalculates End Year again

## E2E implementation notes

- **Layering:** `src/tests/annual-reports.spec.ts` → `src/modules/AnnualReportsModule.ts` → `src/pages/AnnualReportsPage.ts`.
- **Frontend context — real find:** `https://inox-uat-web.pvrinox.com/investors-section?tab=financials&subtype=annual-report` is a **real, public** page with an "Annual Report" tab showing per-year `article` cards (e.g. "2024-25") each with a **Download** button, plus an "All Years" filter combobox. This is the CMS's published output — content-display scenarios (ANR-001, ANR-005/006-adjacent listing, ANR-007) are grounded against it directly. No Add/Edit/Toggle/Status-filter/search-by-name control exists on this public page — CRUD scenarios assert that confirmed absence.
- **Locators:** `data-testid` preferred if later grounded via an authenticated admin session; role/label used here since only the public output was reachable.
- **Tags:** `@Regression @P1`; `@Smoke`: `ANR-001`, `ANR-007`.
- **Run:** `npx playwright test src/tests/annual-reports.spec.ts --project=chromium`

## Source

- **Seed method:** Google Sheet (CSV export)
- **File:** "PVR INOX — Admin Portal Test Cases (Web-Only)" — `https://docs.google.com/spreadsheets/d/1TGio-P24tVNox7RdMhK-Rkpoa7vVuGy7CxiW7KQY_lg`
- **Row range:** `ANR-001`–`ANR-025` (rows 151–175 of the second 150-row batch)
