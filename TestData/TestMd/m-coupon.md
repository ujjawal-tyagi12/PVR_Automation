# Playwright: M-Coupon — admin CMS for the M-Coupon marketing page

## Acceptance criteria

- Admin can view and update the M-Coupon static page's images (Web/App/Card), benefit titles
  (add/delete), and "How to Claim & Link M-Coupon" rich text, with field-level validation.

## Navigation

1. Real, public path checked: common URL guesses (`/m-coupon`, `/mcoupon`), header nav, and
   footer — no public M-Coupon page or admin UI reachable without admin credentials.
2. Sheet-described admin path (not reachable on this app): Admin Panel → **M-Coupon**.

## Test coverage

- **Scope:** Full — all 31 sheet rows for this module are covered in this batch.
- **Sheet rows included:** 31 (`MCP-001`–`MCP-045`, non-contiguous IDs).

## Scenarios

- **Suggested journey:** `src/tests/m-coupon.spec.ts`
- **Sheet:** eighth 200-row batch

- [ ] **MCP-001**–**MCP-045** — No admin M-Coupon surface exists anywhere on this app (all
  adapted; confirmed absent, not assumed)
