# Playwright: Amenities Management — listing, add/edit/activate, and Cinema Details integration

## Acceptance criteria

- Listing shows **Serial No., Amenity Name, Created On, Status, Action**, and supports **case-
  insensitive name search**, **Status filter**, **Created On date-range filter**, and **sort by
  Created On**.
- **Add Amenity** requires Name + Sequence + icon (**SVG/PNG only**); a newly added amenity appears
  on the listing and, at its assigned sequence position, in the **Cinema Details → Cinema Management
  Amenity dropdown**.
- **View** shows Amenity Name, Sequence, Created On, Last Edited On, Icon, and Edit/
  Activate-Deactivate actions, all read-only.
- **Edit** allows changing Name/Sequence and replacing the icon (remove via the ✖ on the thumbnail,
  then upload); changes reflect on both the listing and any Cinema Details page using the amenity.
- **Activate/Deactivate** requires confirmation before the status change applies.
- Assigning a **Sequence** already used by another amenity reassigns it to the new one and shifts the
  conflicting amenity down by one (confirmed via a conflict popup), rather than silently failing.
- **Cancel** on Add or Edit discards changes and returns to the listing.
- Validation: Amenity Name required and unique within the chain; icon must be a valid
  **SVG/PNG**; a corrupted/unreadable icon file is rejected with its own error.

## Navigation

1. Log in to the Admin Panel (see `admin-login.md`).
2. Navigate to **Amenities Management** (exact menu path not specified in the sheet; `AMN-008`
   implies it's referenced from **Cinema Details → Cinema Management** as well — confirm both entry
   points via the live app once grounded).

## Test coverage

- **Scope:** Complete — all Amenities Management rows across both 150-row execution batches.
- **Sheet rows included:** 34 of 34 (`AMN-001`–`AMN-016`, `AMN-020`–`AMN-038`). Note: `AMN-017`–
  `AMN-019` and `AMN-029` are gaps in the source sheet's own ID sequence — not a truncation
  artifact.
- **Out of scope:** None within this batch.

## Scenarios

- **Suggested journey:** `TestData/TestSpecs/amenities-management.spec.ts`
- **Sheet:** PVR INOX — Admin Portal Test Cases (Web-Only) → default sheet

- [ ] **AMN-001** — Listing page loads with all columns | Steps: navigate to Amenities Management | Expected: table shows Serial No., Amenity Name, Created On, Status, Action `[High]`
- [ ] **AMN-002** — Search amenity by name | Steps: enter a valid amenity name in Search Bar | Expected: listing filters to matching amenity/amenities `[High]`
- [ ] **AMN-003** — Search is case-insensitive | Steps: search "child" then search "Child" | Expected: both searches return identical results `[High]`
- [ ] **AMN-004** — Filter by Status Active | Steps: open Filter → select Status = Active → apply | Expected: listing shows only active amenities `[High]`
- [ ] **AMN-005** — Filter by Created On date range | Steps: open Filter → set start and end date → apply | Expected: listing shows only amenities created within the range `[High]`
- [ ] **AMN-006** — Sort by Created On | Steps: click sort icon next to Created On | Expected: list reorders by Created On date `[High]`
- [ ] **AMN-007** — Add new amenity | Steps: click Add Amenity → fill Amenity Name, Sequence, upload icon → click Add | Expected: amenity created; appears on listing page `[High]`
- [ ] **AMN-008** — New amenity appears in Cinema Details Amenity dropdown | Steps: create a new amenity with a sequence → open Cinema Details > Cinema Management Amenity dropdown | Expected: new amenity is available in its added sequence position `[High]`
- [ ] **AMN-009** — View amenity details | Steps: click View icon for an amenity | Expected: Amenity Details page shows Amenity Name, Sequence, Created On, Last Edited On, Icon, Edit and Activate/Deactivate buttons, all read-only `[High]`
- [ ] **AMN-010** — Edit amenity | Steps: click Edit icon → modify Amenity Name and Sequence → click Update | Expected: changes saved; reflected on listing and Cinema Details page where amenity is applied `[High]`
- [ ] **AMN-011** — Remove and replace icon on Edit page | Steps: on Edit page, click the cross (✖) on the icon thumbnail → upload a new icon | Expected: existing icon removed; new icon uploaded and previewed `[High]`
- [ ] **AMN-012** — Activate amenity with confirmation | Steps: click Activate/Deactivate toggle on an inactive amenity → confirm | Expected: amenity status changes to Active after confirmation `[High]`
- [ ] **AMN-013** — Deactivate amenity with confirmation | Steps: click Activate/Deactivate toggle on an active amenity → confirm | Expected: amenity status changes to Inactive after confirmation `[High]`
- [ ] **AMN-014** — Sequence conflict reassigns and shifts existing amenity | Steps: assign a sequence already used by Amenity A to new Amenity B → confirm on conflict popup | Expected: Amenity B takes the requested sequence; Amenity A's sequence shifts down by one `[High]`
- [ ] **AMN-015** — Cancel Add Amenity | Steps: on Add Amenity page, fill fields → click Cancel | Expected: no amenity created; admin returned to listing page `[High]`
- [ ] **AMN-016** — Cancel Edit Amenity | Steps: on Edit Amenity page, modify a field → click Cancel | Expected: changes discarded; admin returned to Amenities Listing page `[High]`
- [ ] **AMN-020** — Empty amenity name | Steps: leave Amenity Name blank → click Add | Expected: "Amenity name is required." `[Medium]`
- [ ] **AMN-021** — Duplicate amenity name | Steps: enter a name matching an existing amenity in the same chain → click Add | Expected: "Amenity name already exists." `[Medium]`
- [ ] **AMN-022** — Invalid icon format | Steps: upload a .jpg file as the amenity icon | Expected: "Please upload a valid icon in SVG/PNG format." `[Medium]`
- [ ] **AMN-023** — Corrupted icon file | Steps: upload a corrupted/unreadable icon file | Expected: "Unable to process icon. Please upload a valid file." `[Medium]`
- [ ] **AMN-024** — Sequence non-numeric | Steps: enter Sequence = "abc" → click Add
- [ ] **AMN-025** — Database/API load failure | Steps: open Amenities Management while backend is unavailable
- [ ] **AMN-026** — Network failure on save | Steps: submit Add/Edit form while network is unavailable
- [ ] **AMN-027** — Search yields no results | Steps: search for a non-existent amenity name
- [ ] **AMN-028** — Non-admin role cannot access module `[Negative]`
- [ ] **AMN-030** — No amenities exist | Steps: open Amenities Management with zero amenities configured
- [ ] **AMN-031** — Amenity Name minimum length boundary (3 chars)
- [ ] **AMN-032** — Amenity Name below minimum length (2 chars)
- [ ] **AMN-033** — Amenity Name maximum length boundary (100 chars)
- [ ] **AMN-034** — Amenity Name exceeds maximum length (101 chars)
- [ ] **AMN-035** — Sequence minimum boundary (1)
- [ ] **AMN-036** — Sequence maximum boundary (1000)
- [ ] **AMN-037** — Sequence out of range (1001)
- [ ] **AMN-038** — Amenity Name with disallowed special characters

## E2E implementation notes

- **Layering:** `src/tests/amenities-management.spec.ts` (mirrored to `TestData/TestSpecs/`) →
  `src/modules/AmenitiesManagementModule.ts` → `src/pages/AmenitiesManagementPage.ts`.
- **Frontend context — grounded:** `inox-uat-web.pvrinox.com` has no admin CMS reachable from
  anywhere in its UI (exhaustively checked across the first batch). A cinema detail page
  (`/cinemas/Mumbai`) shows at most a single "wheelchair accessible" icon per cinema — no itemized
  amenities list, no Add/Edit/CRUD surface. Every scenario in this module (both batches) asserts
  that confirmed absence directly rather than being skipped.
- **Tags:** `@Regression @P1`; `@Smoke` candidate: `AMN-001`.
- **Run:** `npx playwright test src/tests/amenities-management.spec.ts --project=chromium`

## Source

- **Seed method:** Google Sheet (CSV export)
- **File:** "PVR INOX — Admin Portal Test Cases (Web-Only)" —
  `https://docs.google.com/spreadsheets/d/1TGio-P24tVNox7RdMhK-Rkpoa7vVuGy7CxiW7KQY_lg`
- **Row range:** `AMN-001`–`AMN-023` (rows 131–150 of the first batch) and `AMN-024`–`AMN-038`
  (rows 151–164 of the second batch)
