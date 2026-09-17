# Playwright: Departments (Jobs Management) — admin CRUD for city-scoped department records

## Acceptance criteria

- Admin can view (per-City), search, filter (Status/Last Edited On), sort (Sequence/Last Edited
  On), add (Name/City/Sequence/Image), edit, and activate/deactivate departments, with field-level
  validation.

## Navigation

1. Real, public path: header **More → Careers** → `/career` → **Explore Departments** section —
   real department buttons that open a genuine "Apply for the role" job-application form
   (Full Name/Phone Number/Email/Department (pre-filled)/Upload Resume).
2. Sheet-described admin path (not reachable on this app): Admin Panel → **Jobs Management →
   Departments**.

## Test coverage

- **Scope:** Full — all 34 sheet rows for this module are covered in this batch.
- **Sheet rows included:** 34 (`DEP-001`–`DEP-043`, non-contiguous IDs).

## Scenarios

- **Suggested journey:** `src/tests/departments.spec.ts`
- **Sheet:** rows 748–781 (fifth 150-row batch)

- [ ] **DEP-001** — Listing blank until City selected (adapted — the real page uses the site's
  single global city selector, not a department-specific one)
- [ ] **DEP-002** — Select City shows scoped departments (real, adapted: city already set globally)
- [ ] **DEP-003** — Search department by name (adapted)
- [ ] **DEP-004** — Filter by Status (adapted)
- [ ] **DEP-005** — Filter by Last Edited On range (adapted)
- [ ] **DEP-006** — Sort by Sequence (adapted)
- [ ] **DEP-007** — Sort by Last Edited On (adapted)
- [ ] **DEP-008** — Add a new department (adapted)
- [ ] **DEP-009** — Add department with multiple cities (adapted)
- [ ] **DEP-010** — Edit an existing department (adapted)
- [ ] **DEP-011** — Activate a department (adapted)
- [ ] **DEP-012** — Deactivate a department (adapted)
- [ ] **DEP-013** — Cancel Add redirects without saving (adapted)
- [ ] **DEP-014** — Cancel Edit redirects without saving (adapted)
- [ ] **DEP-020** — Missing Name blocks save (adapted)
- [ ] **DEP-021** — Name below minimum length (adapted)
- [ ] **DEP-022** — Name exceeds maximum length (adapted)
- [ ] **DEP-023** — Name with leading/trailing spaces (adapted)
- [ ] **DEP-024** — Duplicate name within same city (adapted)
- [ ] **DEP-025** — Missing City blocks save (adapted)
- [ ] **DEP-026** — Sequence empty (adapted)
- [ ] **DEP-027** — Sequence non-numeric (adapted)
- [ ] **DEP-028** — Sequence zero or negative (adapted)
- [ ] **DEP-029** — Sequence above maximum (adapted)
- [ ] **DEP-030** — Duplicate sequence within same city (adapted)
- [ ] **DEP-031** — Invalid image format (adapted)
- [ ] **DEP-032** — Search with no matches (adapted)
- [ ] **DEP-033** — Empty state with no departments (adapted)
- [ ] **DEP-034** — Status toggle cancelled (adapted)
- [ ] **DEP-035** — Unauthenticated access blocked `[Negative]` (adapted)
- [ ] **DEP-040** — Name at minimum length boundary (adapted)
- [ ] **DEP-041** — Name at maximum length boundary (adapted)
- [ ] **DEP-042** — Sequence at boundary values (adapted)
- [ ] **DEP-043** — Same department name allowed across different cities (adapted)

## E2E implementation notes

- **Layering:** `src/tests/departments.spec.ts` → `src/modules/DepartmentsModule.ts` →
  `src/pages/DepartmentsPage.ts`.
- **Frontend context:** `/career` (real, public) has a genuine **Explore Departments** section
  with a real department button (**Sales Marketing**, confirmed live) — clicking it opens a real
  "Apply for the role" dialog with Full Name/Phone Number/Email/a pre-filled, disabled
  **Department** field/Upload Resume/Submit — confirmed live. This proves departments are real,
  functional job-application categories, not an admin fiction. There is no separate
  department-specific city selector (the site's single global city button is what determines
  what's shown), and no admin table, search, filter, Add/Edit form, or status toggle exists
  anywhere on this app — checked directly, not assumed.
- **Tags:** `@Regression @P1`.
- **Run:** `npx playwright test src/tests/departments.spec.ts --project=chromium`

## Source

- **Seed method:** Google Sheet (CSV export)
- **Row range:** `DEP-001`–`DEP-043` (sheet rows 748–781 of the fifth 150-row batch)
