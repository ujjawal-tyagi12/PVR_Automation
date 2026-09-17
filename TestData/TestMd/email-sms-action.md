# Playwright: Email SMS Action — admin notification-log lookup and resend

## Acceptance criteria

- Admin searches notification history by Track ID (+ Purpose Type), Phone Number, or Email ID,
  optionally filtered by Notification Type, and can resend Email/SMS/WhatsApp per record, with
  channel/status-based eligibility rules.

## Navigation

1. Real path: none found — a public visitor being able to look up and resend *other people's*
   OTP/notification history by phone or email would be a severe data leak and account-takeover
   vector; no such surface exists anywhere on this app, by design.
2. Sheet-described admin path (not reachable on this app): Admin Panel → **Email SMS Action**.

## Test coverage

- **Scope:** Full — all 23 sheet rows for this module are covered in this batch.
- **Sheet rows included:** 23 (`ESA-001`–`ESA-032`, non-contiguous IDs).

## Scenarios

- **Suggested journey:** `src/tests/email-sms-action.spec.ts`
- **Sheet:** sixth 150-row batch

- [ ] **ESA-001** — Search by Track ID with purpose type (adapted)
- [ ] **ESA-002** — Search by Phone Number (adapted)
- [ ] **ESA-003** — Search by Email ID (adapted)
- [ ] **ESA-004** — Filter by optional Notification Type (adapted)
- [ ] **ESA-005** — Resend Email notification (adapted)
- [ ] **ESA-006** — Resend SMS notification (adapted)
- [ ] **ESA-007** — Resend WhatsApp notification (adapted)
- [ ] **ESA-008** — Cancel resend confirmation (adapted)
- [ ] **ESA-009** — Resend eligible for Sent status (adapted)
- [ ] **ESA-010** — Resend eligible for Failed status (adapted)
- [ ] **ESA-011** — Track ID search returns multiple records (adapted)
- [ ] **ESA-020** — No results found (adapted)
- [ ] **ESA-021** — Search with no parameter entered (adapted)
- [ ] **ESA-022** — Track ID search without purpose type (adapted)
- [ ] **ESA-023** — Invalid Track ID format (adapted)
- [ ] **ESA-024** — Invalid phone number (adapted)
- [ ] **ESA-025** — Invalid email format (adapted)
- [ ] **ESA-026** — Resend disabled for NA status (adapted)
- [ ] **ESA-027** — Resend fails due to service error (adapted)
- [ ] **ESA-028** — Resend unavailable for Registration OTP (adapted)
- [ ] **ESA-030** — Switching Search Type resets input (adapted)
- [ ] **ESA-031** — Resend creates a new attempt entry (adapted)
- [ ] **ESA-032** — Date & Time reflects original trigger time (adapted)

## E2E implementation notes

- **Layering:** `src/tests/email-sms-action.spec.ts` → `src/modules/EmailSmsActionModule.ts` →
  `src/pages/EmailSmsActionPage.ts`.
- **Frontend context:** No admin notification-log surface exists anywhere on this app — checked
  the header nav, footer, every "More" dropdown item, and `/sitemap.xml` directly (same
  exhaustive method used for `cities.spec.ts`). Being able to look up and resend another
  customer's OTP/notification history by phone or email is not something a public visitor can
  ever do on this or any consumer app — that absence is itself a meaningful security property.
  Grounded against the home page (`/`) as the anchor.
- **Tags:** `@Regression @P2`.
- **Run:** `npx playwright test src/tests/email-sms-action.spec.ts --project=chromium`

## Source

- **Seed method:** Google Sheet (CSV export)
- **Row range:** `ESA-001`–`ESA-032` (sixth 150-row batch)
