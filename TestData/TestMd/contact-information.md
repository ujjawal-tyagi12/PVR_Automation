# Playwright: Contact Information — admin CRUD listing for Brand/Country contact-detail combinations

## Acceptance criteria

- Admin can view, edit, and save per-Brand/Country contact details (Email/Phone/WhatsApp/Contact
  Centre Timings/Operating Days) with field-level validation; no create/delete.

## Navigation

1. Real, public path: footer **Support → Customer Experience** → `/feedback` — the real public
   feedback form plus a static **Contact Us** block.
2. Sheet-described admin path (not reachable on this app): Admin Panel → **Static Management →
   Contact Information**.

## Test coverage

- **Scope:** Full — all 24 sheet rows for this module are covered in this batch.
- **Sheet rows included:** 24 (`CTI-001`–`CTI-026`, non-contiguous IDs; `CTI-010`/`CTI-011` absent
  from the source sheet).

## Scenarios

- **Suggested journey:** `src/tests/contact-information.spec.ts`
- **Sheet:** rows 554–577 (fourth 150-row batch)

- [ ] **CTI-001** — Listing page shows all predefined combinations (adapted)
- [ ] **CTI-002** — Edit page opens with read-only Brand/Country and pre-filled values (adapted)
- [ ] **CTI-003** — Update Contact Email with valid format (adapted)
- [ ] **CTI-004** — Update Contact Phone Number with valid digits and country code (adapted)
- [ ] **CTI-005** — Update WhatsApp Number with valid format (adapted)
- [ ] **CTI-006** — Update Contact Centre Timings with Start < End (adapted)
- [ ] **CTI-007** — Update Operating Days with Start ≤ End (adapted)
- [ ] **CTI-008** — Save updates Last Edited On (adapted)
- [ ] **CTI-009** — Sri Lanka combination accepts 9-digit phone number (adapted)
- [ ] **CTI-012** — Invalid email format rejected (adapted)
- [ ] **CTI-013** — Phone number with non-digit characters rejected (adapted)
- [ ] **CTI-014** — Phone number outside 10–15 digit range rejected (adapted)
- [ ] **CTI-015** — Start Time not earlier than End Time rejected (adapted)
- [ ] **CTI-016** — Operating Start Day after End Day rejected (adapted)
- [ ] **CTI-017** — Invalid WhatsApp number format rejected (adapted)
- [ ] **CTI-018** — Save fails due to API error (adapted)
- [ ] **CTI-019** — Filter with no matching results (adapted)
- [ ] **CTI-020** — Admin cannot create a new entry (real)
- [ ] **CTI-021** — Admin cannot delete an existing entry (real)
- [ ] **CTI-022** — Unauthorized role cannot access Contact Information section `[Negative]` (adapted)
- [ ] **CTI-023** — No records available → empty state (adapted)
- [ ] **CTI-024** — Editing without changes performs no update (adapted)
- [ ] **CTI-025** — Partial update saves only valid fields (adapted)
- [ ] **CTI-026** — Email at exact boundary lengths accepted (adapted)

## E2E implementation notes

- **Layering:** `src/tests/contact-information.spec.ts` → `src/modules/ContactInformationModule.ts`
  → `src/pages/ContactInformationPage.ts`.
- **Frontend context:** `/feedback` (real, public, "Customer Experience" heading) shows a genuine
  feedback form (Name/Phone Number/Email/Feedback Type/Feedback/Get OTP) and a real, static
  **Contact Us** block — `feedback@pvrinox.com` (mailto), `+91-8800900009` (tel), a WhatsApp link
  (`wa.me/918860558660`), and "9:00 AM to 7:00 PM, Mon-Fri" timings — confirmed live. This is one
  static, read-only block for the whole site, not a per-Brand/Country admin table with Edit/Save;
  no Add or Delete control exists anywhere on this app — checked directly, not assumed.
- **Tags:** `@Regression @P1`.
- **Run:** `npx playwright test src/tests/contact-information.spec.ts --project=chromium`

## Source

- **Seed method:** Google Sheet (CSV export)
- **Row range:** `CTI-001`–`CTI-026` (sheet rows 554–577 of the fourth 150-row batch)
