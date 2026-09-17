# Playwright: Corporate Bookings — admin report of submitted requests + Static Management banner config

## Acceptance criteria

- Admin can view/filter/sort/export a report of customer-submitted corporate-booking requests
  (`CBR-*`), and separately manage the per-Brand/Country banner image shown on the public
  Corporate Booking page (`CPB-*`).

## Navigation

1. Real, public path: header **More → Corporate Booking** → `/corporate-booking` — the real
   public "Exclusive Corporate Screenings" booking-request form.
2. Sheet-described admin paths (not reachable on this app): Admin Panel → **Reports → Corporate
   Bookings** (`CBR-*`); Admin Panel → **Static Management → Corporate Bookings** (`CPB-*`).

## Test coverage

- **Scope:** Full — all 35 sheet rows for this module are covered in this batch.
- **Sheet rows included:** 35 (`CBR-001`–`CBR-020`, 20 rows; `CPB-001`–`CPB-018`, 15 rows,
  non-contiguous — `CPB-007`–`CPB-009` absent from the source sheet).

## Scenarios

- **Suggested journey:** `src/tests/corporate-bookings.spec.ts`
- **Sheet:** rows 578–612 (fourth 150-row batch)

- [ ] **CBR-001** — Listing loads with default current-day dataset (adapted)
- [ ] **CBR-002** — Listing displays all documented columns (adapted)
- [ ] **CBR-003** — Filter by Movie Type only (adapted)
- [ ] **CBR-004** — Filter by City only (adapted)
- [ ] **CBR-005** — Filter by Submission Date range only (adapted)
- [ ] **CBR-006** — Filter by Select Country dropdown (adapted)
- [ ] **CBR-007** — Keyword search by Name (adapted)
- [ ] **CBR-008** — Keyword search by Email (adapted)
- [ ] **CBR-009** — Keyword search by Phone Number (adapted)
- [ ] **CBR-010** — Combine multiple filters (adapted)
- [ ] **CBR-011** — Sort by Submission Date ascending/descending (adapted)
- [ ] **CBR-012** — F&B Requirements displays Yes/No correctly (adapted)
- [ ] **CBR-013** — Copy to Self displays Yes/No correctly (adapted)
- [ ] **CBR-014** — Export filtered dataset to CSV (adapted)
- [ ] **CBR-015** — Exported CSV contains full untruncated content (adapted)
- [ ] **CBR-016** — No records found state (adapted)
- [ ] **CBR-017** — Search with non-matching keyword (adapted)
- [ ] **CBR-018** — Export CSV hidden/disabled without export permission `[Negative]` (adapted)
- [ ] **CBR-019** — Invalid date range (From after To) (adapted)
- [ ] **CBR-020** — Submission Date range boundary is inclusive (adapted)
- [ ] **CPB-001** — Listing page shows all predefined combinations (adapted)
- [ ] **CPB-002** — Edit page opens with read-only Brand/Country and current banner (adapted)
- [ ] **CPB-003** — Upload new banner image shows preview (adapted)
- [ ] **CPB-004** — Save with confirmation updates banner (adapted)
- [ ] **CPB-005** — Last Edited On updates after save (adapted)
- [ ] **CPB-006** — Cancel discards changes (adapted)
- [ ] **CPB-010** — Unsupported image format rejected (adapted)
- [ ] **CPB-011** — Image upload failure shows error (adapted)
- [ ] **CPB-012** — Save failure shows error (adapted)
- [ ] **CPB-013** — Admin cannot create a new combination (real)
- [ ] **CPB-014** — Admin cannot delete an existing combination (real)
- [ ] **CPB-015** — Unauthorized role cannot access Corporate Bookings section `[Negative]` (adapted)
- [ ] **CPB-016** — Navigating away without saving discards changes (adapted)
- [ ] **CPB-017** — Save without uploading a new image retains existing banner (adapted)
- [ ] **CPB-018** — Cancelling the Save confirmation pop-up performs no update (adapted)

## E2E implementation notes

- **Layering:** `src/tests/corporate-bookings.spec.ts` → `src/modules/CorporateBookingsModule.ts`
  → `src/pages/CorporateBookingsPage.ts`.
- **Frontend context:** `/corporate-booking` (real, public) is a genuine "Exclusive Corporate
  Screenings" request form — City*/Cinema*/Date*/Movie Type*/Preferred Show Time*/Number of
  Seats* (placeholder "50-999")/F&B Requirements/Other Requirements, with a disabled **Next**
  button until required fields are filled — confirmed live. This is a customer-facing submission
  form, not an admin report of submitted requests (`CBR-*`) and not an editable banner-management
  screen (`CPB-*`); no admin table, filter, sort, export, or edit control exists anywhere on this
  app — checked directly, not assumed. `AffiliatesManagementPage` also references this same URL as
  an unrelated "closest thematically-related page"; this module is its genuine functional owner.
- **Tags:** `@Regression @P1`.
- **Run:** `npx playwright test src/tests/corporate-bookings.spec.ts --project=chromium`

## Source

- **Seed method:** Google Sheet (CSV export)
- **Row range:** `CBR-001`–`CBR-020`, `CPB-001`–`CPB-018` (sheet rows 578–612 of the fourth
  150-row batch)
