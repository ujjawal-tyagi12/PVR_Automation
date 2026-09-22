# Playwright: Seat Layout Screen (Web)

## Source

PVR INOX Regression Pack (App/Website/Msite), module "Seat Layout Screen", the 11 rows tagged
`App/Web/Msite` (`APP-106`–`APP-116`).

## Acceptance criteria

Seat layout loads with categories/pricing; seats select/deselect with live price updates;
cross-category selection and over-limit selection are blocked; wheelchair/companion rules,
race conditions, and mid-selection showtime loss are handled.

## Navigation

Real route: reached by clicking a real showtime button on `/moviesessions/{City}/{Movie}/{Id}`
→ `/seatLayout/{encoded-params}`. Grounded via direct probe (2026-09-22) using
Ramayanam(Hindi) (id 30212, Mumbai) — live catalog data that will naturally rotate.

## Test coverage

- **Scope:** Partial — 6 of 11 cases are real and fully groundable; 5 need either a
  deterministically-locatable wheelchair seat (no distinguishing accessible name found), a
  second concurrent session, or server-side showtime manipulation, none reachable within budget.
- **Sheet rows included:** 11 (`APP-106`–`APP-116`).

## Scenarios

- **Suggested journey:** `src/tests/seat-layout-screen.spec.ts`
- **Source:** PVR INOX Regression Pack (App/Website/Msite)

- [ ] **APP-106** — Real seat layout loads with categories (Executive/Club/Royal/Royal
  Recliner) and pricing
- [ ] **APP-107** — Real seat selection updates price and enables Continue
- [ ] **APP-108** — Real cross-category selection is blocked with the exact configured message
- [ ] **APP-109** — Adapted: wheelchair seats have no distinguishing accessible name to locate
  deterministically within budget
- [ ] **APP-110** — Adapted: same constraint as APP-109
- [ ] **APP-111** — Adapted: companion seats have the same locating constraint as APP-109
- [ ] **APP-112** — Adapted: a real concurrent booking race needs a second live session outside
  this project's reach
- [ ] **APP-113** — Real max-seat-selection limit (10) blocks the 11th seat with the exact
  configured message
- [ ] **APP-114** — Adapted: server-side showtime removal mid-selection isn't triggerable from
  this project
- [ ] **APP-115** — Real color-coding legend (Available/Occupied/Selected/Wheelchair/Wheelchair
  Companion) is shown
- [ ] **APP-116** — Real seat deselection reverts the layout to its empty-selection state
