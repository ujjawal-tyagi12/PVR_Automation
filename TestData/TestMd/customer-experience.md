# Playwright: Customer Experience — admin report of submitted feedback

## Acceptance criteria

- Admin can view, filter (Feedback Type/Submission Date), search (Name/Email/Phone), sort, and
  export-to-CSV a report of customer feedback submitted via the public Feedback form.

## Navigation

1. Real, public path: footer **Support → Customer Experience** → `/feedback` — the real public
   feedback-submission form (see `contact-information.md`); the *submissions* it produces are
   what this report is meant to list.
2. Sheet-described admin path (not reachable on this app): Admin Panel → **Reports → Customer
   Experience**.

## Test coverage

- **Scope:** Full — all 19 sheet rows for this module are covered in this batch.
- **Sheet rows included:** 19 (`CXR-001`–`CXR-032`, non-contiguous IDs).

## Scenarios

- **Suggested journey:** `src/tests/customer-experience.spec.ts`
- **Sheet:** rows 671–689 (fifth 150-row batch)

- [ ] **CXR-001** — View default Customer Experience listing (adapted)
- [ ] **CXR-002** — Filter by Feedback Type only (adapted)
- [ ] **CXR-003** — Filter by Submission Date only (adapted)
- [ ] **CXR-004** — Search by Customer Name (adapted)
- [ ] **CXR-005** — Search by Email (adapted)
- [ ] **CXR-006** — Search by Phone Number (adapted)
- [ ] **CXR-007** — Combine Feedback Type and Submission Date filters (adapted)
- [ ] **CXR-008** — Reset filters reloads default dataset (adapted)
- [ ] **CXR-009** — Sort by Submission Date (adapted)
- [ ] **CXR-010** — Export CSV with filters applied (authorized user) (adapted)
- [ ] **CXR-011** — Truncated Message shows preview (adapted)
- [ ] **CXR-020** — No records match criteria (adapted)
- [ ] **CXR-021** — Export CSV hidden for unauthorized user `[Negative]` (adapted)
- [ ] **CXR-022** — Unauthenticated access blocked `[Negative]` (adapted)
- [ ] **CXR-023** — Unauthorized role blocked from Reports module `[Negative]` (adapted)
- [ ] **CXR-024** — Search with no matching results (adapted)
- [ ] **CXR-030** — Submission Date From equals To (single-day boundary) (adapted)
- [ ] **CXR-031** — Feedback Type list reflects Global configuration (real, cross-referenced with the real Feedback Type combobox)
- [ ] **CXR-032** — CSV export includes full Message text beyond UI truncation (adapted)

## E2E implementation notes

- **Layering:** `src/tests/customer-experience.spec.ts` → `src/modules/CustomerExperienceModule.ts`
  → `src/pages/CustomerExperiencePage.ts`.
- **Frontend context:** `/feedback` (real, public) is where these reports' underlying data comes
  from — a genuine feedback form with a real **Feedback Type** combobox — but the admin report
  itself (a searchable/filterable/sortable/exportable listing of *other people's* submissions) is
  not reachable by a public visitor, for the obvious reason that showing one customer's
  submissions to another would be a data leak; checked directly, not assumed. No admin table,
  filter, sort, or export control exists anywhere on this app.
- **Tags:** `@Regression @P2`.
- **Run:** `npx playwright test src/tests/customer-experience.spec.ts --project=chromium`

## Source

- **Seed method:** Google Sheet (CSV export)
- **Row range:** `CXR-001`–`CXR-032` (sheet rows 671–689 of the fifth 150-row batch)
