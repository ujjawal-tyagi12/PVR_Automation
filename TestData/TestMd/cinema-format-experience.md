# Playwright: Cinema Format/Experience (Web)

## Source

PVR INOX Regression Pack (App/Website/Msite), module "Cinema Format/Experience", the 4 rows
tagged `App/Web/Msite` (`APP-064`–`APP-067`).

## Acceptance criteria

Active formats/experiences display with name/description/imagery; a selected format's detail
shows associated content; format-mismatch popups and newly admin-added experiences reflect
correctly.

## Navigation

Real, public route: `/experiences` — a carousel of active formats (INSIGNIA, ONYX DINER, MX4D,
ScreenX, Kiddles) with a detail panel (Format features, "Movies Showing in {Format}", Terms &
Conditions) for the default one. Grounded via direct probe (2026-09-22).

## Test coverage

- **Scope:** Full — all 4 Web-tagged sheet rows for this module are covered.
- **Sheet rows included:** 4 (`APP-064`–`APP-067`).

## Scenarios

- **Suggested journey:** `src/tests/cinema-format-experience.spec.ts`
- **Source:** PVR INOX Regression Pack (App/Website/Msite)

- [ ] **APP-064** — Real format/experience listing (INSIGNIA, MX4D, ScreenX, etc.)
- [ ] **APP-065** — Real format detail shows associated content (features, movies showing)
- [ ] **APP-066** — Adapted: the configured mismatch-popup message (Global Configuration) isn't
  reachable without admin access
- [ ] **APP-067** — Adapted: no admin access exists anywhere in this project to add a new
  experience via Experience Management first
