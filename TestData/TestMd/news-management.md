# Playwright: News Management — admin CRUD for the public news listing

## Acceptance criteria

- Admin can view (per Brand-Country tab), search, filter (Type/Status/Last Edited On), sort,
  add/edit/delete news items with images, and activate/deactivate, with field-level validation.

## Navigation

1. Real, public path: home → More → **News** → `/news` — the real public news listing
   (confirmed live: real articles with Title/Source/Date/truncated description and "Read More",
   real Year/Month filters, and real category chips All / New Initiatives / Cinema Openings —
   the public equivalent of the sheet's Type filter).
2. Sheet-described admin path (not reachable on this app): Admin Panel → **News Management**.

## Test coverage

- **Scope:** Full — all 42 sheet rows for this module are covered in this batch.
- **Sheet rows included:** 42 (`NWS-001`–`NWS-055`, non-contiguous IDs).

## Scenarios

- **Suggested journey:** `src/tests/news-management.spec.ts`
- **Sheet:** eighth 200-row batch

- [ ] **NWS-001**, **NWS-004** (via real Year/Month filters), **NWS-005** (via real category
  chips) — Real listing/filter grounded
- [ ] **NWS-002**, **NWS-003**, **NWS-006**–**NWS-055** — No Brand-Country tabs, admin CRUD
  form, image upload, or activate/deactivate/delete control exists (adapted)
