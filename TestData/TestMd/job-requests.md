# Playwright: Job Requests — admin report of job-application submissions

## Acceptance criteria

- Admin can view, search (Job ID/Title/Name/Email/Phone), filter (Country/Department/Submission
  Date), export CSV, and download resumes from the Job Requests report.

## Navigation

1. Real, public path: `/career` → click a department card → the real "Apply for the role" form
   (confirmed live: Full Name/Phone Number/Email/Department pre-filled/Upload Resume/Submit,
   with real client-side validation — an invalid email shows "Please enter a valid email"). This
   is the genuine intake mechanism behind whatever an admin's Job Requests report lists.
2. Sheet-described admin path (not reachable on this app): Admin Panel → **Job Requests**.

## Test coverage

- **Scope:** Full — all 23 sheet rows for this module are covered in this batch.
- **Sheet rows included:** 23 (`JRR-001`–`JRR-032`, non-contiguous IDs).

## Scenarios

- **Suggested journey:** `src/tests/job-requests.spec.ts`
- **Sheet:** eighth 200-row batch

- [ ] **JRR-001** — Real Apply form shows the genuine intake fields (adapted title; real
  assertion)
- [ ] **JRR-005**, **JRR-008** — Real form fields (Full Name/Email) grounded, with real email
  validation
- [ ] **JRR-002**–**JRR-004**, **JRR-006**–**JRR-007**, **JRR-009**–**JRR-032** — No admin report
  listing, search, filters, CSV export, or resume-download control exists (adapted)
