# Playwright: Audit Reports — admin action log listing, filters, Pre/Post data diff popups

## Acceptance criteria

- Listing shows admin action audit entries; supports Module filter, User Name/Email search, User dropdown search, Created On date range, sort by Created On, pagination, and CSV export.
- Pre/Post Data Log cells show a hover preview and a click-to-open popup with a copy action for the full JSON payload, including large payloads without truncation.
- Unauthorized roles cannot reach Audit Reports.

## Navigation

1. Log in to the Admin Panel (see `admin-login.md`).
2. Navigate to **Reports → Audit Reports**.

## Test coverage

- **Scope:** Complete — all rows in this batch.
- **Sheet rows included:** 22 of 22 (`AUD-001`–`AUD-022`).
- **Out of scope:** None within this batch.

## Scenarios

- **Suggested journey:** `src/tests/audit-reports.spec.ts`
- **Sheet:** rows 222–243

- [ ] **AUD-001** — Open Audit Reports listing page
- [ ] **AUD-002** — Filter by Select Module
- [ ] **AUD-003** — Search by User Name
- [ ] **AUD-004** — Search by User Email
- [ ] **AUD-005** — Filter by User dropdown with search
- [ ] **AUD-006** — Filter by Created On Date range
- [ ] **AUD-007** — Sort by Created On Date
- [ ] **AUD-008** — Hover Pre Data Log shows full JSON
- [ ] **AUD-009** — Click Pre Data Log opens popup with copy
- [ ] **AUD-010** — Hover Post Data Log shows full JSON
- [ ] **AUD-011** — Click Post Data Log opens popup with copy
- [ ] **AUD-012** — Export CSV with filters applied
- [ ] **AUD-013** — Pagination on listing
- [ ] **AUD-014** — From Date greater than To Date
- [ ] **AUD-015** — Export with no matching records
- [ ] **AUD-016** — Search/filter with no matches
- [ ] **AUD-017** — Unauthorized role cannot access Audit Reports `[Negative]`
- [ ] **AUD-018** — Select Module lists each sub-module independently
- [ ] **AUD-019** — Copy option copies full Pre Data Log JSON
- [ ] **AUD-020** — Copy option copies full Post Data Log JSON
- [ ] **AUD-021** — Large dataset in Pre/Post log scrolls without truncation
- [ ] **AUD-022** — Combine Module + User + Date range filters

## E2E implementation notes

- **Layering:** `src/tests/audit-reports.spec.ts` → `src/modules/AuditReportsModule.ts` → `src/pages/AuditReportsPage.ts`.
- **Frontend context:** No public audit-log surface exists anywhere on this app (an admin action log is inherently internal/back-office). Every scenario asserts confirmed absence against the closest available real page (home).
- **Tags:** `@Regression @P2`; `AUD-017` is `@P0` (negative/access-control).
- **Run:** `npx playwright test src/tests/audit-reports.spec.ts --project=chromium`

## Source

- **Seed method:** Google Sheet (CSV export)
- **Row range:** `AUD-001`–`AUD-022` (rows 222–243 of the second 150-row batch)
