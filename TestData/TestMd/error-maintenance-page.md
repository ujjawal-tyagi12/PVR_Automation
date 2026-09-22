# Playwright: Error Page & Maintenance Page (Web)

## Source

PVR INOX Regression Pack (App/Website/Msite), module "Error Page & Maintenance Page", the 4
rows tagged `App/Web/Msite`/`Website/M-Site` (`APP-097`–`APP-100`). `APP-096` does not exist in
the sheet (App-only gap).

## Acceptance criteria

Maintenance mode blocks access with a clear message and restores normally when disabled; API
failures show a friendly retry page; invalid routes show a styled 404, not a raw server error.

## Navigation

Real, public: an invalid route (`/this-page-does-not-exist-zzz`) renders a real, styled
empty-state page (illustration + "Back To Home" link) — status 200 (client-side SPA routing).
Grounded via direct probe (2026-09-22).

## Test coverage

- **Scope:** Partial — the real 404 behavior is covered; maintenance-mode and true backend-
  API-failure cases need admin access / deeper request interception outside this budget.
- **Sheet rows included:** 4 (`APP-097`–`APP-100`).

## Scenarios

- **Suggested journey:** `src/tests/error-maintenance-page.spec.ts`
- **Source:** PVR INOX Regression Pack (App/Website/Msite)

- [ ] **APP-097** — Adapted: no admin access exists to enable maintenance mode first
- [ ] **APP-098** — Adapted: same constraint as APP-097
- [ ] **APP-099** — Adapted: a hard offline navigation fails at the browser level
  (`net::ERR_INTERNET_DISCONNECTED`) before the app's own JS ever gets a chance to render a
  friendly error page — confirmed live no raw stack trace leaks either way; a genuine
  backend-API-only failure would need request-level interception beyond this budget
- [ ] **APP-100** — Real styled 404 page for an invalid route, with a working "Back To Home"
  link
