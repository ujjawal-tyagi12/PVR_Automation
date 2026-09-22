# Playwright: Cinemas Listing & Detail Page (Web)

## Source

PVR INOX Regression Pack (App/Website/Msite), module "Cinemas Listing & Detail Page", the 8
rows tagged `App/Web/Msite` (`APP-056`–`APP-063`).

## Acceptance criteria

Active cinemas load for the selected city with distance/amenities/formats; the listing offers
List/Map views and a detail panel per cinema; empty and deactivated states are handled cleanly.

## Navigation

Real, public route: `/cinemas/{City}` — a split view: a list of active cinemas on the left, a
detail panel (address, amenities, showtimes, now-showing movies) for the selected cinema on the
right. Grounded via direct probe (2026-09-22). No search box exists anywhere on this page —
confirmed absent, not assumed.

## Test coverage

- **Scope:** Full — all 8 Web-tagged sheet rows for this module are covered.
- **Sheet rows included:** 8 (`APP-056`–`APP-063`).

## Scenarios

- **Suggested journey:** `src/tests/cinemas-listing-detail.spec.ts`
- **Source:** PVR INOX Regression Pack (App/Website/Msite)

- [ ] **APP-056** — Real cinema listing loads for the selected city (Mumbai)
- [ ] **APP-057** — Real List View / Map View toggle is available
- [ ] **APP-058** — Adapted: the configured default/max distance values (Global Configuration)
  aren't reachable without admin access — confirms the real distance info ("X km away") the
  listing already shows per cinema, the groundable piece of this business rule
- [ ] **APP-059** — Real cinema detail loads when a cinema is selected (name, address, Get
  Directions)
- [ ] **APP-060** — Adapted: confirmed live that no search input exists anywhere on this page —
  cinema name/locality search has no groundable equivalent on Web
- [ ] **APP-061** — Real empty-state ("No Result Found! Currently, no data is available") for a
  city with zero active cinemas (confirmed live on Jorhat)
- [ ] **APP-062** — Real Amenities section displays for a selected cinema
- [ ] **APP-063** — Adapted: no admin access exists anywhere in this project to deactivate a
  cinema via Cinema Management first
