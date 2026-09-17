# Playwright: Booking Experience Ratings — feedback listing, multi-field search, star/date filters, export

## Acceptance criteria

- Listing shows customer feedback (Customer Name/ID, Email, Phone, IP Address, Device ID, Star Rating, Review Submission Date, optional free-text Message); supports search across all those identifiers, Star Ratings multi-select filter, Review Submission Date range, sort by Star Ratings/Date, pagination, and CSV export.
- Unauthorized roles cannot reach this report.

## Navigation

1. Log in to the Admin Panel (see `admin-login.md`).
2. Navigate to **Reports → Booking Experience Ratings**.

## Test coverage

- **Scope:** Complete — all rows in this batch.
- **Sheet rows included:** 22 of 22 (`BER-001`–`BER-022`).
- **Out of scope:** None within this batch.

## Scenarios

- **Suggested journey:** `src/tests/booking-experience.spec.ts`
- **Sheet:** rows 259–280

- [ ] **BER-001** — Open Booking Experience Ratings listing page
- [ ] **BER-002** — Search by Customer Name
- [ ] **BER-003** — Search by Customer ID
- [ ] **BER-004** — Search by Email
- [ ] **BER-005** — Search by Phone Number
- [ ] **BER-006** — Search by IP Address
- [ ] **BER-007** — Search by Device ID
- [ ] **BER-008** — Filter by Star Ratings (multi-select)
- [ ] **BER-009** — Filter by Review Submission Date range
- [ ] **BER-010** — Sort by Star Ratings
- [ ] **BER-011** — Sort by Review Submission Date
- [ ] **BER-012** — Export CSV with filters applied
- [ ] **BER-013** — Pagination on listing
- [ ] **BER-014** — From Date greater than To Date
- [ ] **BER-015** — Export with no matching records
- [ ] **BER-016** — Search with no matching customer
- [ ] **BER-017** — No feedback records for today
- [ ] **BER-018** — Unauthorized role cannot access Booking Experience report `[Negative]`
- [ ] **BER-019** — Select all 5 star ratings simultaneously
- [ ] **BER-020** — Long free-text Message displays correctly
- [ ] **BER-021** — Export at system-defined limit boundary
- [ ] **BER-022** — Date range with From equal to To

## E2E implementation notes

- **Layering:** `src/tests/booking-experience.spec.ts` → `src/modules/BookingExperienceModule.ts` → `src/pages/BookingExperiencePage.ts`.
- **Frontend context:** No public aggregated-feedback surface exists anywhere on this app (this is an internal report over customer PII — IP/Device ID/Phone — that would never be public). Every scenario asserts confirmed absence.
- **Tags:** `@Regression @P2`; `BER-018` is `@P0` (negative/access-control).
- **Run:** `npx playwright test src/tests/booking-experience.spec.ts --project=chromium`

## Source

- **Seed method:** Google Sheet (CSV export)
- **Row range:** `BER-001`–`BER-022` (rows 259–280 of the second 150-row batch)
