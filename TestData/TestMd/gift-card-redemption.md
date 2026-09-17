# Playwright: Gift Card Redemption — admin report of gift-card redemptions

## Acceptance criteria

- Admin can view, search (Booking ID/Phone/Email/GC Number), and filter (Chain/Platform/
  Redemption Status/Purchased Date) the gift-card redemption report and export CSV.

## Navigation

1. Real, public path checked: the gift-card purchase flow on `/gift-cards` is login-gated
   (phone/OTP), so no redemption report is reachable without admin credentials.
2. Sheet-described admin path (not reachable on this app): Admin Panel → **Gift Card
   Redemption**.

## Test coverage

- **Scope:** Full — all 23 sheet rows for this module are covered in this batch.
- **Sheet rows included:** 23 (`GCR-001`–`GCR-033`, non-contiguous IDs). These IDs are shared
  with the separate Gift Card Retry module in this same batch — kept in a separate spec file
  (`gift-card-retry.spec.ts`) since the two are distinct modules per the sheet.

## Scenarios

- **Suggested journey:** `src/tests/gift-card-redemption.spec.ts`
- **Sheet:** seventh 200-row batch

- [ ] **GCR-001**–**GCR-033** (Redemption) — No admin redemption-report surface exists anywhere
  on this unauthenticated app (all adapted; confirmed absent, not assumed)
