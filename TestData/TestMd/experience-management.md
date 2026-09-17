# Playwright: Experience Management — admin CRUD listing for cinema experience formats

## Acceptance criteria

- Admin can view, search (Experience Key/Name), filter (Status), sync from Showbizz, toggle Global/Default sequencing logic, activate/deactivate, and edit per-experience records (Sequence, Nudge Sequence, up to 5 Trailer URLs, up to 12 Features, Description, T&Cs, Image/Icon) with field-level validation and sequence-conflict handling.

## Navigation

1. Real, public path: header **Experiences** nav link → `/experiences` (the real public content page).
2. Sheet-described admin path (not reachable on this app): Admin Panel → **Experience Management**.

## Test coverage

- **Scope:** Complete — all rows for this module.
- **Sheet rows included:** 30 of 30 (`EXP-001`–`EXP-030`).
- **Out of scope:** None.

## Scenarios

- **Suggested journey:** `src/tests/experience-management.spec.ts`
- **Sheet:** rows 885–914

- [ ] **EXP-001** — Listing screen displays controls and table
- [ ] **EXP-002** — Search by Experience Key and Name
- [ ] **EXP-003** — Filter by Status
- [ ] **EXP-004** — Sync Experiences updates listing
- [ ] **EXP-005** — Toggle Global/Default Logic with confirmation
- [ ] **EXP-006** — Activate/Deactivate experience from listing
- [ ] **EXP-007** — View opens Experience Details with all fields
- [ ] **EXP-008** — Ellipsis image menu View opens zoom/rotate modal
- [ ] **EXP-009** — Ellipsis image menu Download
- [ ] **EXP-010** — Edit Experience happy path
- [ ] **EXP-011** — Upload and remove image via thumbnail
- [ ] **EXP-012** — Cancel on Edit discards changes
- [ ] **EXP-013** — New Showbizz-synced experience defaults to Inactive
- [ ] **EXP-014** — Add multiple trailer URLs up to 5
- [ ] **EXP-015** — Search with no matches
- [ ] **EXP-016** — Experience Key not editable
- [ ] **EXP-017** — Empty Name rejected
- [ ] **EXP-018** — Name below/above length bounds rejected
- [ ] **EXP-019** — Sequence empty/non-numeric rejected
- [ ] **EXP-020** — Sequence below minimum/above maximum rejected
- [ ] **EXP-021** — Nudge Experience Sequence validation matrix
- [ ] **EXP-022** — Features exceed max count/length rejected
- [ ] **EXP-023** — Description/T&Cs length bounds rejected
- [ ] **EXP-024** — Invalid Trailer URL rejected
- [ ] **EXP-025** — 6th trailer URL rejected
- [ ] **EXP-026** — Unsupported Image/Icon format rejected
- [ ] **EXP-027** — Showbizz sync failure retains prior data
- [ ] **EXP-028** — Save failure shows generic error
- [ ] **EXP-029** — Sequence conflict reassigns and shifts
- [ ] **EXP-030** — Inactive experience excluded from sequence conflict until reactivated

## E2E implementation notes

- **Layering:** `src/tests/experience-management.spec.ts` → `src/modules/ExperienceManagementModule.ts` → `src/pages/ExperienceManagementPage.ts`.
- **Frontend context:** `/experiences` (real, public, header nav link) is a content page with real, distinct experience entries (Insignia, MX4D, ScreenX, Kiddles, ONYX DINER) — each showing a genuine "Format features" list, a "TERMS & CONDITIONS" section, a trailer video, and a "Movies Showing in &lt;Experience&gt;" search, asserted directly as real content (proof test, `EXP-001`). This is the CMS's published output, not its editor — no admin table with Sync Experiences/Global-Default Logic/search/filter, and no Edit/Details CRUD page with Experience Key/Sequence/Trailer/Features fields exist anywhere on this app, checked directly. Every other scenario asserts confirmed absence.
- **Tags:** `@Regression @P1`.
- **Run:** `npx playwright test src/tests/experience-management.spec.ts --project=chromium`

## Source

- **Seed method:** Google Sheet (CSV export)
- **Row range:** `EXP-001`–`EXP-030` (sheet rows 885–914, requested out of sequence alongside Events Management)
