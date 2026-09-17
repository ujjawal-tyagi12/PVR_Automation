# Playwright: Configuration Management — backend admin settings screen

## Acceptance criteria

- Admin can set homepage banner timing, OTP validity/resend cooldown, checkout countdown, F&B
  pickup windows, flash-message copy, movie-category day thresholds, PVR Jockey redirect mode,
  seat-availability color thresholds, dynamic branding, donation defaults, cart item limits,
  max logged-in devices, trending-section rotation, and map-view thresholds.

## Navigation

1. Real path: none found — no admin/settings surface exists anywhere reachable from BASE_URL.
2. Sheet-described admin path (not reachable on this app): Admin Panel → **Configuration
   Management**.

## Test coverage

- **Scope:** Full — all 20 sheet rows for this module are covered in this batch.
- **Sheet rows included:** 20 (`CGM-001`–`CGM-020`).

## Scenarios

- **Suggested journey:** `src/tests/configuration-management.spec.ts`
- **Sheet:** rows 534–553 (fourth 150-row batch)

- [ ] **CGM-001** — Homepage Banner Timer controls rotation interval (adapted)
- [ ] **CGM-002** — OTP Validity Duration enforced (adapted)
- [ ] **CGM-003** — Resend OTP cooldown enforced (adapted)
- [ ] **CGM-004** — Movie Booking Confirmation Timer controls checkout countdown (adapted)
- [ ] **CGM-005** — Pickup Time for Counter reflected in F&B order (adapted)
- [ ] **CGM-006** — Advance Booking Flash Message shows configured text and duration (adapted)
- [ ] **CGM-007** — Movie category classification days respected (adapted)
- [ ] **CGM-008** — PVR Jockey mode configuration (in-app) (adapted)
- [ ] **CGM-009** — PVR Jockey mode configuration (WhatsApp redirect) (adapted)
- [ ] **CGM-010** — Booking Percentage Color thresholds applied to seat layout (adapted)
- [ ] **CGM-011** — Dynamic Logo reflects brand/platform configuration (adapted)
- [ ] **CGM-012** — Donations feature enabled with configured default amount (adapted)
- [ ] **CGM-013** — Cart Item Limit enforced (adapted)
- [ ] **CGM-014** — Maximum Logged-in Devices enforced (real, cross-referenced with ADL-004's device-limit flow)
- [ ] **CGM-015** — Trending movies count and rotation interval applied (adapted)
- [ ] **CGM-016** — Map filter default/max distance and default view applied (adapted)
- [ ] **CGM-017** — Map View enabled/disabled by cinema-count threshold (adapted)
- [ ] **CGM-018** — Missing configuration falls back to default cancellation-policy text (adapted)
- [ ] **CGM-019** — Exceeding Cart Item Limit blocked (adapted)
- [ ] **CGM-020** — Exceeding Maximum Logged-in Devices blocks/evicts oldest session (real, adapted)

## E2E implementation notes

- **Layering:** `src/tests/configuration-management.spec.ts` →
  `src/modules/ConfigurationManagementModule.ts` → `src/pages/ConfigurationManagementPage.ts`.
- **Frontend context:** No admin/settings UI exists anywhere on this app — checked the header nav,
  footer, every "More" dropdown item, and the sitemap (`/sitemap.xml`) directly, same exhaustive
  method used for `cities.spec.ts`. This module's settings are diffuse across many different
  frontend surfaces rather than one screen, so scenarios are grounded against the home page (`/`)
  as the common anchor. Two scenarios (`CGM-014`/`CGM-020`, the logged-in-device limit) have a
  real, observable corollary already covered live in `admin-login.spec.ts` (ADL-004's "Device
  Limit Reached" dialog) — referenced here rather than re-implemented, since re-triggering it
  requires the same heavy multi-login setup already exercised there.
- **Tags:** `@Regression @P2`.
- **Run:** `npx playwright test src/tests/configuration-management.spec.ts --project=chromium`

## Source

- **Seed method:** Google Sheet (CSV export)
- **Row range:** `CGM-001`–`CGM-020` (sheet rows 534–553 of the fourth 150-row batch)
