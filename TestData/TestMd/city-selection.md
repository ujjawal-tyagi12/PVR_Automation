# Playwright: City Selection (Web)

## Source

PVR INOX Regression Pack (App/Website/Msite), module "City Selection", the 5 rows tagged
`App/Web/Msite` (`APP-051`–`APP-055`).

## Acceptance criteria

Users can search and select a city, applied app-wide; unmatched searches show a clear message;
popular cities are offered for quick selection; the selection persists across reloads and takes
precedence over auto-detected geolocation on conflict.

## Navigation

Real, public path: header location button → "Select Your City" dialog (search box, "Popular
cities" quick-select, "All cities" full list) — grounded via direct probe (2026-09-22).

## Test coverage

- **Scope:** Full — all 5 Web-tagged sheet rows for this module are covered.
- **Sheet rows included:** 5 (`APP-051`–`APP-055`).

## Scenarios

- **Suggested journey:** `src/tests/city-selection.spec.ts`
- **Source:** PVR INOX Regression Pack (App/Website/Msite)

- [ ] **APP-051** — Real search-and-select applies the chosen city app-wide (header updates,
  dialog closes)
- [ ] **APP-052** — Real "City Not Found!" message for a search with no matches
- [ ] **APP-053** — Real "Popular cities" quick-select section is shown
- [ ] **APP-054** — Real city selection persists across a reload
- [ ] **APP-055** — Real conflict resolution: confirmed live that a manually selected city
  (Pune) still wins over auto-detected geolocation (still granted for Mumbai) on reload — the
  same real mechanism as APP-054, viewed from the conflict angle the sheet asks about
