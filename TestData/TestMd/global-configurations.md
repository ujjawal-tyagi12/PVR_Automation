# Playwright: Global Configurations — admin key/value system settings

## Acceptance criteria

- Admin can view, search (Type/Sub Type), filter, sort, and paginate global configuration
  entries per brand (PVR/INOX tabs), add/edit entries with JSON/HTML values, use "Same as
  Above" to copy across brands, with field-level validation.

## Navigation

1. Real, public path checked: header nav, footer, every "More" dropdown item, and direct URL
   guesses — no global-configurations UI reachable without admin credentials.
2. Sheet-described admin path (not reachable on this app): Admin Panel → **Global
   Configurations**.

## Test coverage

- **Scope:** Full — all 23 sheet rows for this module are covered in this batch.
- **Sheet rows included:** 23 (`GCF-001`–`GCF-023`).

## Scenarios

- **Suggested journey:** `src/tests/global-configurations.spec.ts`
- **Sheet:** seventh 200-row batch

- [ ] **GCF-001**–**GCF-023** — No admin global-configurations surface exists anywhere on this
  app (all adapted; confirmed absent, not assumed)
