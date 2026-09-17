# Playwright: Booking Management (Reports) — cross-customer booking lookup by Track ID/Phone/Email

## Acceptance criteria

- Admin can look up any customer's booking by Track ID (exact match), Phone Number, or Email; listing exposes a Food Count popup and a full booking-details view per row.

## Navigation

1. Log in to the Admin Panel (see `admin-login.md`).
2. Navigate to **Booking Management**.

## Test coverage

- **Scope:** Complete across two batches — all sheet rows for this module.
- **Sheet rows included:** 27 of 27 (`BKM-001`–`BKM-036`, non-contiguous IDs).
- **Out of scope:** None.

## Scenarios

- **Suggested journey:** `src/tests/booking-management-reports.spec.ts`
- **Sheet:** rows 295–321

- [ ] **BKM-001** — View default listing
- [ ] **BKM-002** — Search by Track ID exact match
- [ ] **BKM-003** — Search by Phone Number
- [ ] **BKM-004** — Search by Email
- [ ] **BKM-005** — View Food Count popup
- [ ] **BKM-006** — View booking details
- [ ] **BKM-007** — Apply additional filters
- [ ] **BKM-008** — Reset filters
- [ ] **BKM-009** — UTM parameters displayed when present
- [ ] **BKM-010** — UTM parameters hidden when absent
- [ ] **BKM-011** — Export CSV with selected parameters
- [ ] **BKM-012** — Multiple invoice numbers shown comma-separated
- [ ] **BKM-013** — View payment gateway Request/Response JSON
- [ ] **BKM-020** — Zero search results
- [ ] **BKM-021** — Server error loading listing
- [ ] **BKM-022** — Invalid email format
- [ ] **BKM-023** — Invalid phone number
- [ ] **BKM-024** — Invalid Track ID (non-numeric)
- [ ] **BKM-025** — Aggregator bookings excluded
- [ ] **BKM-026** — Non-digital-platform transactions excluded
- [ ] **BKM-030** — Track ID search restricts filter options
- [ ] **BKM-031** — Default filter date range boundary
- [ ] **BKM-032** — Export CSV date range at 32-day boundary
- [ ] **BKM-033** — Export CSV date range beyond 32-day boundary
- [ ] **BKM-034** — Default pagination size
- [ ] **BKM-035** — Surcharge shown only with Passport benefit
- [ ] **BKM-036** — Booking ID absent for non-successful bookings

## E2E implementation notes

- **Layering:** `src/tests/booking-management-reports.spec.ts` → `src/modules/BookingManagementReportsModule.ts` → `src/pages/BookingManagementReportsPage.ts`.
- **Frontend context:** This is an admin-side cross-customer lookup (any customer's booking by Track ID/Phone/Email), distinct from the customer-facing "My Bookings" (own bookings only, behind customer login). No public admin equivalent exists; every scenario asserts confirmed absence.
- **Tags:** `@Regression @P2`.
- **Run:** `npx playwright test src/tests/booking-management-reports.spec.ts --project=chromium`

## Source

- **Seed method:** Google Sheet (CSV export)
- **Row range:** `BKM-001`–`BKM-036` (sheet rows 295–321, spanning the second and third 150-row batches)
