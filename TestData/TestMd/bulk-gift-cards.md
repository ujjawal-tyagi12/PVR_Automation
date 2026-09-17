# Playwright: Bulk Gift Cards — B2B request form, admin reports listing, and Static Management banner editor

## Acceptance criteria

- **BGR-\*** (19 rows): Admin can view, filter (Location, Submission Date range), search (Name/Email/Phone), sort, paginate, and export-to-CSV a listing of every Bulk Gift Card request submitted via the public form.
- **BGCS-\*** (24 rows): Admin (with Static Management access) can view and edit a per-Brand/Country (PVR India, PVR Sri Lanka, INOX India, INOX Sri Lanka) promotional banner image, with upload/preview/save/cancel and format validation.

## Navigation

1. Real, public path: header **More** menu → **Bulk Gift Card** → `/bulk-gift-cards` (the B2B request form itself).
2. Sheet-described admin paths (not reachable on this app — see notes below):
   - Log in to the Admin Panel → **Reports** → **Bulk Gift Cards** (BGR-\*).
   - Log in to the Admin Panel → **Static Management** (BGCS-\*).

## Test coverage

- **Scope:** Complete — all rows in this batch.
- **Sheet rows included:** 43 of 43 (`BGR-001`–`BGR-019`, `BGCS-001`–`BGCS-032`, non-contiguous IDs).
- **Out of scope:** None within this batch.

## Scenarios

- **Suggested journey:** `src/tests/bulk-gift-cards.spec.ts`
- **Sheet:** rows 322–364

- [ ] **BGR-001** — Listing loads with default current-day dataset
- [ ] **BGR-002** — Listing displays all documented columns
- [ ] **BGR-003** — Filter by Location only
- [ ] **BGR-004** — Filter by Submission Date range only
- [ ] **BGR-005** — Keyword search by Name
- [ ] **BGR-006** — Keyword search by Email
- [ ] **BGR-007** — Keyword search by Phone Number
- [ ] **BGR-008** — Reset filters restores default dataset
- [ ] **BGR-009** — Change record count per page
- [ ] **BGR-010** — Sort by Location
- [ ] **BGR-011** — Sort by Submission Date
- [ ] **BGR-012** — Copy to Self displays Yes/No correctly
- [ ] **BGR-013** — Export filtered dataset to CSV
- [ ] **BGR-014** — Exported CSV contains full Message content
- [ ] **BGR-015** — No records found state
- [ ] **BGR-016** — Search with non-matching keyword
- [ ] **BGR-017** — Export CSV hidden/disabled without export permission `[Negative]`
- [ ] **BGR-018** — Invalid date range (From after To)
- [ ] **BGR-019** — Submission Date range boundary is inclusive
- [ ] **BGCS-001** — View listing of pre-configured entries
- [ ] **BGCS-002** — Listing displays all four Brand–Country combinations
- [ ] **BGCS-003** — Last Edited On timestamp visible per row
- [ ] **BGCS-004** — Open Edit page for a record
- [ ] **BGCS-005** — Preview uploaded image before save
- [ ] **BGCS-006** — Save confirmation pop-up appears
- [ ] **BGCS-007** — Confirm Save updates banner
- [ ] **BGCS-008** — Save updates Last Edited On timestamp
- [ ] **BGCS-009** — Upload new image replaces existing image
- [ ] **BGCS-010** — Save without changing image persists prior image
- [ ] **BGCS-011** — Upload JPG image
- [ ] **BGCS-012** — Upload PNG image
- [ ] **BGCS-013** — Upload JPEG image
- [ ] **BGCS-020** — Cancel on Edit page discards changes
- [ ] **BGCS-021** — Invalid image format rejected
- [ ] **BGCS-022** — Image upload failure shows error
- [ ] **BGCS-023** — Save failure shows error and retains edit state
- [ ] **BGCS-024** — Navigate away without saving does not persist changes
- [ ] **BGCS-025** — Unauthorized role cannot access Bulk Gift Cards static management `[Negative]`
- [ ] **BGCS-026** — No Add control available on listing
- [ ] **BGCS-027** — No Delete control available on listing
- [ ] **BGCS-030** — Image upload is non-mandatory on save
- [ ] **BGCS-031** — Brand and Country fields remain read-only
- [ ] **BGCS-032** — Editing one combination does not affect others

## E2E implementation notes

- **Layering:** `src/tests/bulk-gift-cards.spec.ts` → `src/modules/BulkGiftCardsModule.ts` → `src/pages/BulkGiftCardsPage.ts`.
- **Frontend context:** `/bulk-gift-cards` (real, public, reached via header > More > Bulk Gift Card) is the B2B *request* form — Name/Email/Mobile Number/Location/Company Name/Message/Copy to Self + Get OTP. Its fields genuinely correlate with the sheet's BGR-002 documented columns (minus admin-only Request ID/Submission Date), which is a real, verifiable fact asserted directly (BGR-002, BGR-012). Neither the admin **reports listing** over these submissions (BGR-\*) nor the **Static Management** per-Brand/Country banner editor (BGCS-\*) has any reachable surface on this app — checked directly against this page and the account sidebar (no Static Management entry point anywhere, pre- or post-login inspection). Every such scenario asserts confirmed absence.
- **Tags:** `@Regression @P1`.
- **Run:** `npx playwright test src/tests/bulk-gift-cards.spec.ts --project=chromium`

## Source

- **Seed method:** Google Sheet (CSV export)
- **Row range:** `BGR-001`–`BGCS-032` (sheet rows 322–364 of the third 150-row batch)
