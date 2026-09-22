# Playwright: Logout (Web)

## Source

PVR INOX Regression Pack (App/Website/Msite), module "Logout", the 4 rows tagged
`App/Web/Msite` (`APP-042`–`APP-045`).

## Acceptance criteria

Logout invalidates the session and redirects home; cancelling the confirmation leaves the
session intact; protected routes aren't reachable after logout; logging out doesn't affect
other real sessions this project has no way to create.

## Navigation

Real, public path: header account icon → Settings → Logout — opens a real confirmation dialog
("Are you sure you want to logout?", "Yes, Logout" / "Stay Logged In"). Same flow already
grounded for `AdminLoginModule.logout()` (Register/Login Screens module, APP-025); this module
composes it read-only and adds the cancel path independently.

## Test coverage

- **Scope:** Full — all 4 Web-tagged sheet rows for this module are covered.
- **Sheet rows included:** 4 (`APP-042`–`APP-045`).

## Scenarios

- **Suggested journey:** `src/tests/logout.spec.ts`
- **Source:** PVR INOX Regression Pack (App/Website/Msite)

- [ ] **APP-042** — Real standard logout flow (composes the already-grounded
  `AdminLoginModule.logout()`)
- [ ] **APP-043** — Real cancel on the logout confirmation ("Stay Logged In") leaves the
  session intact
- [ ] **APP-044** — Real post-logout direct access to a protected route
  (`/dashboard?tab=profile`) redirects away with no protected content shown
- [ ] **APP-045** — Adapted: no native App/second real session exists anywhere in this project
  to test cross-session independence against — same, already-confirmed constraint as APP-023
  (Register/Login Screens module)
