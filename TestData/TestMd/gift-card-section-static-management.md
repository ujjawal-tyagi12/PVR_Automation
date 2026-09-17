# Playwright: Gift Card Section Static Management — admin CMS for the public gift-card page copy

## Acceptance criteria

- Admin can view and update the gift-card page's Title, Sub-Title, "Why buy Gift Card" bullets,
  "How it Works Description" bullets, Important Information, and image, with field-level
  validation.

## Navigation

1. Real, public path: `/gift-cards` — the real rendering of this static content (confirmed
   live: heading "Gift Cards", sub-title "Pay less using PVR INOX Gift Cards!", body copy "Use
   PVR gift cards at checkout to get better prices on your tickets.", and a "How It Works"
   control).
2. Sheet-described admin path (not reachable on this app): Admin Panel → **Gift Card Section
   Static Management**.

## Test coverage

- **Scope:** Full — all 28 sheet rows for this module are covered in this batch.
- **Sheet rows included:** 28 (`GCS-001`–`GCS-043`, non-contiguous IDs).

## Scenarios

- **Suggested journey:** `src/tests/gift-card-section-static-management.spec.ts`
- **Sheet:** seventh 200-row batch

- [ ] **GCS-001** — Real page shows the genuine static content (adapted title; real assertion)
- [ ] **GCS-002**–**GCS-009** — No admin edit form exists for any of these fields (adapted)
- [ ] **GCS-020**–**GCS-029** — No save/validation surface exists to test blank/length rules on
  (adapted)
- [ ] **GCS-030**–**GCS-032** — No image-upload validation surface exists (adapted)
- [ ] **GCS-033**–**GCS-034** — No backend-failure or role-gated surface exists (adapted)
- [ ] **GCS-040**–**GCS-043** — No boundary-length surface exists (adapted)
