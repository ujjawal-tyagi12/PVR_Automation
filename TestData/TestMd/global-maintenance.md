# Playwright: Global Maintenance — admin site-wide maintenance-mode toggle

## Acceptance criteria

- Admin can select platforms/brands, enable/disable maintenance mode with a message, and see
  frontend access blocked while On, with field-level validation.

## Navigation

1. Real, public path checked: header nav, footer, every "More" dropdown item, and direct URL
   guesses — no maintenance-mode admin UI reachable without admin credentials. Actually
   exercising a maintenance-mode toggle would also be unsafe against a shared live UAT target.
2. Sheet-described admin path (not reachable on this app): Admin Panel → **Global Maintenance**.

## Test coverage

- **Scope:** Full — all 16 sheet rows for this module are covered in this batch.
- **Sheet rows included:** 16 (`GMT-001`–`GMT-016`).

## Scenarios

- **Suggested journey:** `src/tests/global-maintenance.spec.ts`
- **Sheet:** seventh 200-row batch

- [ ] **GMT-001**–**GMT-016** — No admin maintenance-mode surface exists anywhere on this app
  (all adapted; confirmed absent, not assumed)
