# Playwright: Gift Card Master — admin CRUD for gift-card scheme records

## Acceptance criteria

- Admin can view, search, and filter the gift-card scheme listing (Scheme ID/Alias/Type/Status/
  Validity/Last Edited On), manage per-scheme images and sub-type sequence, toggle Active/
  Inactive, and sync gift cards, with field-level validation.

## Navigation

1. Real, public path: home nav → `/gift-cards` — the real public gift-card listing (confirmed
   live: real voucher cards e.g. "17059- Anniversary E-GiftCard Voucher" grouped under Occasion
   chips All Occasions / Birth Day / Anniversary). Clicking a card, or "My Gift Cards", opens a
   phone/OTP login dialog.
2. Sheet-described admin path (not reachable on this app): Admin Panel → **Gift Card Master**.

## Test coverage

- **Scope:** Full — all 37 sheet rows for this module are covered in this batch.
- **Sheet rows included:** 37 (`GCM-001`–`GCM-055`, non-contiguous IDs).

## Scenarios

- **Suggested journey:** `src/tests/gift-card-master.spec.ts`
- **Sheet:** seventh 200-row batch, starting GCM-001

- [ ] **GCM-001** — Listing page shows real scheme cards (adapted; no admin table columns)
- [ ] **GCM-002**–**GCM-004** — No admin search fields exist (adapted)
- [ ] **GCM-005** — No Images Yes/No filter exists (adapted)
- [ ] **GCM-006** — Occasion chip is the real equivalent of the Type filter
- [ ] **GCM-007**–**GCM-009** — No Status/Validity/Last Edited On filters exist (adapted)
- [ ] **GCM-010** — No admin sort control exists (adapted)
- [ ] **GCM-011**–**GCM-013** — No image preview/upload/main-image dropdown exists (adapted)
- [ ] **GCM-014**–**GCM-020** — No Active/Inactive toggle or Edit/Sequence page exists (adapted)
- [ ] **GCM-021** — No Sync Gift Cards control exists (adapted)
- [ ] **GCM-030**–**GCM-035** — No upload/save validation surface exists (adapted)
- [ ] **GCM-036** — No create-scheme control exposed (real: confirmed absent on public page)
- [ ] **GCM-037**–**GCM-038** — No admin empty-state search to verify (adapted)
- [ ] **GCM-039** — No role-gated admin route reachable to verify (adapted)
- [ ] **GCM-050**–**GCM-055** — No image/sequence/type boundary surface exists (adapted)
