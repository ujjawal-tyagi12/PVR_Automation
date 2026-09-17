# Playwright: Gift Card Retry — admin tool to retry/refund failed gift-card generation

## Acceptance criteria

- Admin can search a Track ID, view a per-denomination generation-status table, retry pending
  card generation, and trigger refunds for cards that remain pending after retry.

## Navigation

1. Real, public path checked: the gift-card purchase flow on `/gift-cards` is login-gated
   (phone/OTP), so no retry/refund surface for failed generations is reachable without admin
   credentials.
2. Sheet-described admin path (not reachable on this app): Admin Panel → **Gift Card Retry**.

## Test coverage

- **Scope:** Full — all 16 sheet rows for this module are covered in this batch.
- **Sheet rows included:** 16 (`GCR-001`–`GCR-022`, non-contiguous IDs). These IDs are shared
  with the separate Gift Card Redemption module in this same batch — kept in a separate spec
  file (`gift-card-redemption.spec.ts`) since the two are distinct modules per the sheet.

## Scenarios

- **Suggested journey:** `src/tests/gift-card-retry.spec.ts`
- **Sheet:** seventh 200-row batch

- [ ] **GCR-001**–**GCR-022** (Retry) — No admin retry/refund surface exists anywhere on this
  unauthenticated app (all adapted; confirmed absent, not assumed)
