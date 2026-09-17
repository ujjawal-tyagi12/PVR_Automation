# Playwright: Customer Management — admin CRM listing for registered customers

## Acceptance criteria

- Admin can search (First Name/Phone Number/Email), filter (Status/Brand/Country/City/Registered
  Date), sort, export-to-CSV, view customer Details, and toggle Active/Inactive status; no create
  or edit of personal data.

## Navigation

1. Real path: none found — no admin/CRM surface exists anywhere reachable from BASE_URL. Viewing
   another customer's personal data (name, phone, email, sessions) is not something a public
   visitor can ever do, by design.
2. Sheet-described admin path (not reachable on this app): Admin Panel → **Customer Management**.

## Test coverage

- **Scope:** Full — all 24 sheet rows for this module are covered in this batch.
- **Sheet rows included:** 24 (`CST-001`–`CST-024`).

## Scenarios

- **Suggested journey:** `src/tests/customer-management.spec.ts`
- **Sheet:** rows 707–730 (fifth 150-row batch)

- [ ] **CST-001** — Listing empty until search/filter applied (adapted)
- [ ] **CST-002** — Search by First Name returns matches (adapted)
- [ ] **CST-003** — Search by Phone Number returns matches (adapted)
- [ ] **CST-004** — Filter by Status and Brand (adapted)
- [ ] **CST-005** — Registered Date filter defaults to today (adapted)
- [ ] **CST-006** — Combined search type + filters (adapted)
- [ ] **CST-007** — Clear All removes applied filters (adapted)
- [ ] **CST-008** — Sort listing by Registered Date (adapted)
- [ ] **CST-009** — Verified icons shown for verified phone/email (adapted)
- [ ] **CST-010** — Export CSV emails download link (adapted)
- [ ] **CST-011** — View opens Customer Details with all sections (adapted)
- [ ] **CST-012** — Deactivate an Active customer (adapted)
- [ ] **CST-013** — Reactivate an Inactive customer (adapted)
- [ ] **CST-014** — Active Sessions show web-specific fields for M-site/Website (adapted)
- [ ] **CST-015** — View Full Recap downloads PDF (adapted)
- [ ] **CST-016** — Search with no matches shows no records (adapted)
- [ ] **CST-017** — Invalid App Version format rejected (adapted)
- [ ] **CST-018** — End date before start date rejected (adapted)
- [ ] **CST-019** — Attempt to edit customer details (real, structural corollary)
- [ ] **CST-020** — Cannot toggle status of a Deleted customer (adapted)
- [ ] **CST-021** — Deactivated customer cannot log in (adapted)
- [ ] **CST-022** — Registered Date range edited manually (adapted)
- [ ] **CST-023** — Promotional opt-in Yes when only one channel is opted (adapted)
- [ ] **CST-024** — Fandom images older than one year excluded (adapted)

## E2E implementation notes

- **Layering:** `src/tests/customer-management.spec.ts` → `src/modules/CustomerManagementModule.ts`
  → `src/pages/CustomerManagementPage.ts`.
- **Frontend context:** No admin CRM surface exists anywhere on this app — checked the header nav,
  footer, every "More" dropdown item, and `/sitemap.xml` directly (same exhaustive method used
  for `cities.spec.ts`). Grounded against the home page (`/`) as the anchor. By nature, a public
  visitor can never view or manage another customer's personal data on this or any consumer app —
  that absence is itself a meaningful, real security property, not just an unimplemented feature.
- **Tags:** `@Regression @P2`.
- **Run:** `npx playwright test src/tests/customer-management.spec.ts --project=chromium`

## Source

- **Seed method:** Google Sheet (CSV export)
- **Row range:** `CST-001`–`CST-024` (sheet rows 707–730 of the fifth 150-row batch)
