# Playwright: Careers Page — Static Management admin CRUD for career/office location entries

## Acceptance criteria

- Admin (with Static Management access) can view, sort, filter, and edit per-entry career/office location content (Image, Title, Address, Latitude, Longitude, Description, Brand, Country) with validation rules on Title/Latitude/Longitude/Description length and format.

## Navigation

1. Real, public path: header **More** menu → **Career** → `/career` (the public Careers content page itself).
2. Sheet-described admin path (not reachable on this app): Admin Panel → **Static Management** → **Careers**.

## Test coverage

- **Scope:** Complete — all rows in this batch.
- **Sheet rows included:** 29 of 29 (`CAR-001`–`CAR-043`, non-contiguous IDs).
- **Out of scope:** None within this batch.

## Scenarios

- **Suggested journey:** `src/tests/careers-page.spec.ts`
- **Sheet:** rows 365–393

- [ ] **CAR-001** — View Careers listing
- [ ] **CAR-002** — Open image modal
- [ ] **CAR-003** — Sort by Last Edited On
- [ ] **CAR-004** — Filter by Last Edited On range
- [ ] **CAR-005** — Edit a Careers entry
- [ ] **CAR-006** — Update image on Edit page
- [ ] **CAR-007** — Edit without changing image
- [ ] **CAR-008** — Cancel Edit discards changes
- [ ] **CAR-009** — Entry with no image shows placeholder
- [ ] **CAR-020** — Filter returns no results
- [ ] **CAR-021** — From date greater than To date
- [ ] **CAR-022** — Invalid date range
- [ ] **CAR-023** — Title below minimum length
- [ ] **CAR-024** — Title exceeds maximum length
- [ ] **CAR-025** — Title with leading/trailing spaces
- [ ] **CAR-026** — Latitude out of range
- [ ] **CAR-027** — Latitude non-decimal/empty
- [ ] **CAR-028** — Longitude out of range
- [ ] **CAR-029** — Longitude non-decimal/empty
- [ ] **CAR-030** — Description below minimum length
- [ ] **CAR-031** — Description exceeds maximum length
- [ ] **CAR-032** — Description empty
- [ ] **CAR-033** — Invalid image format
- [ ] **CAR-034** — Image exceeds max size
- [ ] **CAR-035** — Unauthorized access blocked `[Negative]`
- [ ] **CAR-040** — Title at minimum length boundary
- [ ] **CAR-041** — Title at maximum length boundary
- [ ] **CAR-042** — Latitude at boundary values
- [ ] **CAR-043** — Longitude at boundary values

## E2E implementation notes

- **Layering:** `src/tests/careers-page.spec.ts` → `src/modules/CareersModule.ts` → `src/pages/CareersPage.ts`.
- **Frontend context:** `/career` (real, public, reached via header > More > Career) is a content page — "Why PVR INOX?", "Explore Departments" (a department list with an "Apply for the role" application form: Full name/Phone number/Email/Department/Resume upload), and a "Connect With Us" office-address section. None of this is the Static Management CRUD editor the sheet describes (per-entry Image/Title/Address/Latitude/Longitude/Description/Brand/Country/Status/Action) — no such admin listing or editor is reachable anywhere on this app, checked directly against this page and the account sidebar. Every scenario asserts confirmed absence.
- **Tags:** `@Regression @P1`.
- **Run:** `npx playwright test src/tests/careers-page.spec.ts --project=chromium`

## Source

- **Seed method:** Google Sheet (CSV export)
- **Row range:** `CAR-001`–`CAR-043` (sheet rows 365–393 of the third 150-row batch)
