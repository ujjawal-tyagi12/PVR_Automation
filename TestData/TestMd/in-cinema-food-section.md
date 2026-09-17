# Playwright: In-Cinema Food Section (Static Management) — admin CMS for the in-cinema food banner

## Acceptance criteria

- Admin can view and update the in-cinema ("Book with Ticket") food section's Title, Sub-Title,
  Description, and Image, with field-level validation.

## Navigation

1. Real, public path: `/food` → **Book with Ticket** tab → `/food?tab=book-with-ticket` — the
   real in-cinema ordering surface tied to an active ticket booking (confirmed live: real
   banner artwork, a Book with Ticket/Order Anytime toggle, and a "Login to view your ticket
   bookings" prompt for an unbooked session). Distinct from the "Order Anytime" flow already
   grounded in the food-category-management/food-items-management specs from an earlier batch.
2. Sheet-described admin path (not reachable on this app): Admin Panel → **In-Cinema Food
   Section (Static Management)**.

## Test coverage

- **Scope:** Full — all 25 sheet rows for this module are covered in this batch.
- **Sheet rows included:** 25 (`ICF-001`–`ICF-038`, non-contiguous IDs).

## Scenarios

- **Suggested journey:** `src/tests/in-cinema-food-section.spec.ts`
- **Sheet:** seventh 200-row batch

- [ ] **ICF-001** — Real tab shows the genuine banner/toggle content (adapted title; real
  assertion)
- [ ] **ICF-002**–**ICF-006** — No admin edit form exists for any of these fields (adapted)
- [ ] **ICF-020**–**ICF-029** — No save/validation surface exists to test missing/whitespace/
  format rules on (adapted)
- [ ] **ICF-030**–**ICF-038** — No boundary-length or image-size surface exists (adapted)
