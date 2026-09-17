# Playwright: EAS Management (Screening Management) — admin CRUD for Early Access Screening campaigns

## Acceptance criteria

- Admin can view, filter (Status/Validity/Release Date), search (Movie/Campaign Name), add
  (Campaign Heading/Select Movie/Release Date/EAS Date/Valid From-To/Highlighted Text/Image/
  Trailer URL), edit, and activate/deactivate voting campaigns, with field-level validation.

## Navigation

1. Real, public path: `https://early-access.pvrinox.com/` — a real, separate live subdomain
   (confirmed `HTTP 200`) that hosts each city-voting campaign at
   `early-access.pvrinox.com/{Movie Common Code}` per the sheet's own described URL format
   (`EAS-011`). No currently-active campaign code was available to probe a populated campaign
   page; the root path renders a generic footer-only shell (app store/social links).
2. Sheet-described admin path (not reachable on this app): Admin Panel → **Screening Management →
   EAS Management**.

## Test coverage

- **Scope:** Full — all 25 sheet rows for this module are covered in this batch.
- **Sheet rows included:** 25 (`EAS-001`–`EAS-025`).
- **Note:** this module's `EAS-NNN` IDs collide with the separate "EAS" (Reports) module's own
  `EAS-NNN` IDs — see `eas-reports.md`. Kept in a separate spec file to avoid ambiguity; sheet IDs
  are preserved exactly as given in both.

## Scenarios

- **Suggested journey:** `src/tests/eas-management.spec.ts`
- **Sheet:** rows 782–806 (fifth 150-row batch)

- [ ] **EAS-001** — Listing loads sorted by Created Date descending (adapted)
- [ ] **EAS-002** — Filter listing by Status (adapted)
- [ ] **EAS-003** — Filter listing by Validity range (adapted)
- [ ] **EAS-004** — Filter listing by Release Date range (adapted)
- [ ] **EAS-005** — Search EAS by Movie Name (adapted)
- [ ] **EAS-006** — Search EAS by Campaign Name (adapted)
- [ ] **EAS-007** — Select Movie auto-populates Release Date and Movie Master Code (adapted)
- [ ] **EAS-008** — Admin can override auto-populated Release Date (adapted)
- [ ] **EAS-009** — Create EAS campaign with all required fields (adapted)
- [ ] **EAS-010** — Multiple movies sharing common code show only primary movie (adapted)
- [ ] **EAS-011** — Campaign URL uses Movie Common Code when multiple campaigns exist for same movie (real, adapted: URL format confirmed live, no active campaign to fully exercise)
- [ ] **EAS-012** — Create campaign with Trailer URL (adapted)
- [ ] **EAS-013** — Edit EAS loads existing values (adapted)
- [ ] **EAS-014** — Update campaign dates adjusts voting availability (adapted)
- [ ] **EAS-015** — Update campaign artwork replaces previous image (adapted)
- [ ] **EAS-016** — Update highlighted text reflects immediately (adapted)
- [ ] **EAS-017** — Activate EAS requires confirmation (adapted)
- [ ] **EAS-018** — Deactivate EAS requires confirmation (adapted)
- [ ] **EAS-019** — Cancel Add EAS discards entries (adapted)
- [ ] **EAS-020** — Winning city tie-break by earliest vote-count reached (adapted)
- [ ] **EAS-021** — Submit Add EAS with empty Campaign Heading (adapted)
- [ ] **EAS-022** — EAS Date not earlier than Release Date (adapted)
- [ ] **EAS-023** — Valid To earlier than Valid From (adapted)
- [ ] **EAS-024** — Submit without uploading required image (adapted)
- [ ] **EAS-025** — Expired campaign excluded from voting (adapted)

## E2E implementation notes

- **Layering:** `src/tests/eas-management.spec.ts` → `src/modules/EasManagementModule.ts` →
  `src/pages/EasManagementPage.ts`.
- **Frontend context:** `early-access.pvrinox.com` is a real, separate live subdomain (confirmed
  `HTTP 200`, title "PVR Cinemas") dedicated to the Early Access Screening voting feature — its
  URL scheme (`/{Movie Common Code}`) matches the sheet's own description exactly. With no active
  campaign code available, the root renders a generic footer-only shell; no admin table, search,
  filter, or Add/Edit campaign form exists anywhere on either domain — checked directly, not
  assumed.
- **Tags:** `@Regression @P2`.
- **Run:** `npx playwright test src/tests/eas-management.spec.ts --project=chromium`

## Source

- **Seed method:** Google Sheet (CSV export)
- **Row range:** `EAS-001`–`EAS-025` (sheet rows 782–806 of the fifth 150-row batch)
