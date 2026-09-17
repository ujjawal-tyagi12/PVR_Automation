# Playwright: Gift Card Purchase Reports — admin report of gift-card purchase transactions

## Acceptance criteria

- Admin can view, search (Track ID/Phone/Email), and filter (Chain/Platform/Status/Payment
  Status/Purchased Date) the gift-card purchase transaction report, view quantity/detail
  pop-ups, and export CSV.

## Navigation

1. Real, public path checked: `/gift-cards` purchase flow is login-gated (phone/OTP), so no
   report of transactions is reachable without admin credentials.
2. Sheet-described admin path (not reachable on this app): Admin Panel → **Gift Card Purchase
   Reports**.

## Test coverage

- **Scope:** Full — all 22 sheet rows for this module are covered in this batch.
- **Sheet rows included:** 22 (`GCP-001`–`GCP-044`, non-contiguous IDs).

## Scenarios

- **Suggested journey:** `src/tests/gift-card-purchase-reports.spec.ts`
- **Sheet:** seventh 200-row batch

- [ ] **GCP-001**–**GCP-044** — No admin purchase-report surface exists anywhere on this
  unauthenticated app (all adapted; confirmed absent, not assumed)
