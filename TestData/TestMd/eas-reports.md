# Playwright: EAS (Reports) — admin report of Early Access Screening voting results

## Acceptance criteria

- Admin can view a listing of EAS campaigns, search/filter, open per-campaign voting results
  (search/filter/sort by Voted City/Voted On), see winner status, and manually edit vote counts.

## Navigation

1. Real, public path: `https://early-access.pvrinox.com/` — the same real, live voting subdomain
   used by `eas-management.md`; this is where customers actually cast votes that this report
   would summarize.
2. Sheet-described admin path (not reachable on this app): Admin Panel → **Reports → EAS**.

## Test coverage

- **Scope:** Full — all 14 sheet rows for this module are covered in this batch.
- **Sheet rows included:** 14 (`EAS-001`–`EAS-014`).
- **Note:** this module's `EAS-NNN` IDs collide with the separate "EAS Management" module's own
  `EAS-NNN` IDs — see `eas-management.md`. Kept in a separate spec file (`eas-reports.spec.ts`) to
  avoid ambiguity; sheet IDs are preserved exactly as given in both.

## Scenarios

- **Suggested journey:** `src/tests/eas-reports.spec.ts`
- **Sheet:** rows 807–820 (fifth 150-row batch)

- [ ] **EAS-001** — Open EAS Reports listing page (adapted)
- [ ] **EAS-002** — Search by EAS ID (adapted)
- [ ] **EAS-003** — Search by Campaign Name (adapted)
- [ ] **EAS-004** — Search by Movie Name (adapted)
- [ ] **EAS-005** — Search by Winner City (adapted)
- [ ] **EAS-006** — Filter by Created On Date range (adapted)
- [ ] **EAS-007** — Click View opens Campaign Results page (adapted)
- [ ] **EAS-008** — Results page: search by Customer Name/Email/Phone/Voted City (adapted)
- [ ] **EAS-009** — Results page: filter by Voted City (adapted)
- [ ] **EAS-010** — Results page: filter by Voted On date range (adapted)
- [ ] **EAS-011** — Results page: sort by Voted On (adapted)
- [ ] **EAS-012** — Winner City shows Pending for active campaign (adapted)
- [ ] **EAS-013** — Open Manage Votes shows top 3 cities (adapted)
- [ ] **EAS-014** — Edit vote count and Save (adapted)

## E2E implementation notes

- **Layering:** `src/tests/eas-reports.spec.ts` → `src/modules/EasReportsModule.ts` →
  `src/pages/EasReportsPage.ts`.
- **Frontend context:** `early-access.pvrinox.com` (real, live, confirmed `HTTP 200`) is where
  votes are genuinely cast; the admin report of *who* voted for *what* and *when* (a
  searchable/filterable/sortable per-customer results listing, plus a manual vote-count editor)
  is not reachable by a public visitor — checked directly, not assumed; showing individual voter
  identities to another visitor would be a data leak.
- **Tags:** `@Regression @P2`.
- **Run:** `npx playwright test src/tests/eas-reports.spec.ts --project=chromium`

## Source

- **Seed method:** Google Sheet (CSV export)
- **Row range:** `EAS-001`–`EAS-014` (sheet rows 807–820 of the fifth 150-row batch)
