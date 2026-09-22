# Playwright: Splash Screen — per-platform version control (Web)

## Source

PVR INOX Regression Pack (App/Website/Msite), module "Splash Screen", the one row tagged
`App/Web/Msite` (`APP-007`; rows `APP-001`–`APP-006` are App-only per the Platform column and
are out of scope for this Web suite per the project's Web-inclusion rule).

## Acceptance criteria

Force/soft update logic applies independently per platform and brand, as configured via
Admin > Version Management.

## Navigation

Real, public path: the home page (`/`) — checked directly for any splash-style loading screen
or "Update Required"/"Update Available" prompt. Neither exists: a website always serves its
latest deployed version directly, with no app-store-mediated update gate. Confirmed live,
2026-09-21.

## Test coverage

- **Scope:** Full — the 1 Web-tagged sheet row for this module is covered.
- **Sheet rows included:** 1 (`APP-007`).

## Scenarios

- **Suggested journey:** `src/tests/splash-screen.spec.ts`
- **Source:** PVR INOX Regression Pack (App/Website/Msite), rows APP-001–APP-280

- [ ] **APP-007** — Confirms no version-gate/update-prompt concept exists on the web platform
  (adapted; real assertion of confirmed absence)
