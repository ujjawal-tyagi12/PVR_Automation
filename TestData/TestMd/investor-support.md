# Playwright: Investor Support — admin CRUD for Analyst Coverage / Investor Support listings

## Acceptance criteria

- Admin can view, search, and filter two tabs (Analyst Coverage / Investor Support) with
  Research House/Analyst Name/Email/Status/Action columns, add/edit entries, and toggle
  Active/Inactive.

## Navigation

1. Real, public path: home → **Investor Section** →
   `/investors-section?tab=financials&subtype=investor-support` — the real public tab
   (confirmed live: shows "Investor support content will be available soon." — no functional
   Analyst Coverage / Investor Support sub-tabs or table exist yet).
2. Sheet-described admin path (not reachable on this app): Admin Panel → **Investor Support**.

## Test coverage

- **Scope:** Full — all 23 sheet rows for this module are covered in this batch.
- **Sheet rows included:** 23 (`INVS-001`–`INVS-052`, non-contiguous IDs).

## Scenarios

- **Suggested journey:** `src/tests/investor-support.spec.ts`
- **Sheet:** eighth 200-row batch, starting INVS-001

- [ ] **INVS-001** — Real tab shows the genuine "coming soon" placeholder (adapted title; real
  assertion)
- [ ] **INVS-002**–**INVS-052** — No Analyst Coverage/Investor Support functional tabs, table,
  search, filters, or admin CRUD form exist (adapted)
