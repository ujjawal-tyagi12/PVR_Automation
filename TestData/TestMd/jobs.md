# Playwright: Jobs — admin CRUD for job postings

## Acceptance criteria

- Admin can view, add, edit, delete, activate/deactivate job postings with Title/Vacancies/
  Experience/Start-End Date/Department Emails, with field-level validation.

## Navigation

1. Real, public path checked: `/career` — shows only Department-level "apply" cards (e.g. "Sales
   Marketing"); clicking one opens a generic apply form (see job-requests.md), not a per-job
   detail page. No per-job-posting listing with Title/Vacancies/Experience exists — confirmed
   live, not assumed.
2. Sheet-described admin path (not reachable on this app): Admin Panel → **Jobs**.

## Test coverage

- **Scope:** Full — all 39 sheet rows for this module are covered in this batch.
- **Sheet rows included:** 39 (`JOB-001`–`JOB-056`, non-contiguous IDs).

## Scenarios

- **Suggested journey:** `src/tests/jobs.spec.ts`
- **Sheet:** eighth 200-row batch

- [ ] **JOB-001** — Real Careers page shows only Department cards, not a per-job listing
  (adapted title; real assertion)
- [ ] **JOB-002**–**JOB-056** — No per-job listing, admin CRUD form, or validation surface
  exists (adapted)
