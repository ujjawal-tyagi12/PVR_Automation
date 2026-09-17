# Playwright: APP100 Error Reports — exception listing, platform filters, record detail

## Acceptance criteria

- Listing shows current-day APP100 redemption failures; supports search by `Str_Exception`, Platform filter (iOS/Android/M-Site/Website/All), Date Range filter, and a per-record detail view distinguishing Redeemed vs Failed status.

## Navigation

1. Log in to the Admin Panel (see `admin-login.md`).
2. Navigate to **Reports → APP100 Error Reports**.

## Test coverage

- **Scope:** Complete — all rows in this batch.
- **Sheet rows included:** 16 of 16 (`AER-001`–`AER-043`, non-contiguous IDs as in the source sheet).
- **Out of scope:** None within this batch.

## Scenarios

- **Suggested journey:** `src/tests/app100-error-reports.spec.ts`
- **Sheet:** rows 191–206

- [ ] **AER-001** — View listing page with current-day default data
- [ ] **AER-002** — Search by Str_Exception
- [ ] **AER-003** — Filter by Platform — iOS
- [ ] **AER-004** — Filter by Platform — Android
- [ ] **AER-005** — Filter by Platform — M-Site
- [ ] **AER-006** — Filter by Platform — Website
- [ ] **AER-007** — Filter by Platform — All
- [ ] **AER-008** — Filter by valid Date Range
- [ ] **AER-009** — View error record details
- [ ] **AER-020** — No records found for filter combination
- [ ] **AER-021** — Invalid Date Range
- [ ] **AER-022** — Search with non-matching Str_Exception
- [ ] **AER-040** — Multiple failed attempts in same booking logged separately
- [ ] **AER-041** — Date Range boundary — From equal to To
- [ ] **AER-042** — Combine Platform and Date Range filters
- [ ] **AER-043** — Status distinguishes Redeemed vs Failed

## E2E implementation notes

- **Layering:** `src/tests/app100-error-reports.spec.ts` → `src/modules/App100ErrorReportsModule.ts` → `src/pages/App100ErrorReportsPage.ts`.
- **Frontend context:** No public "APP100" surface exists anywhere on this app (checked directly). Internal error/exception report with no customer-facing equivalent; every scenario asserts confirmed absence.
- **Tags:** `@Regression @P2`.
- **Run:** `npx playwright test src/tests/app100-error-reports.spec.ts --project=chromium`

## Source

- **Seed method:** Google Sheet (CSV export)
- **Row range:** `AER-001`–`AER-043` (rows 191–206 of the second 150-row batch)
