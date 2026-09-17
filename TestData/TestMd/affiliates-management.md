# Playwright: Affiliates Management — listing, add/edit accounts, and class-scoped access

## Acceptance criteria

- Listing shows **Name, Username, Password, Created On, Action**, sorted by Created Date (latest
  first), and supports **search by Name/Username**, **Created On date-range filter**, **sort by
  Created On**, and **pagination**.
- **Add Affiliate** requires Name/Username/Password; **Classes** is optional — leaving it unselected
  grants access to inventory across **all** classes, selecting one or more **restricts** visibility
  to those classes, and removing all selected classes on Edit **restores full access**.
- **Edit** pre-populates existing values; **Cancel** on either Add or Edit discards changes with no
  row created/altered.
- Uniqueness: duplicate **Name** or **Username** is rejected with an "already exists" error.
- Field validation: Name/Username/Password required (whitespace-only counts as empty), length bounds
  **3–100 characters** (both boundaries individually verified).
- A class-restricted affiliate cannot see inventory belonging to a class it wasn't assigned.

## Navigation

1. Log in to the Admin Panel (see `admin-login.md`).
2. Open **Affiliates Management** from the admin navigation (exact menu path not specified in the
   sheet — confirm via live app once grounded).

## Test coverage

- **Scope:** Complete — all Affiliates Management rows in the "first 150" execution batch for this
  run.
- **Sheet rows included:** 20 of 20 (`AFM-001`–`AFM-020`).
- **Out of scope:** None within this batch.

## Scenarios

- **Suggested journey:** `TestData/TestSpecs/affiliates-management.spec.ts`
- **Sheet:** PVR INOX — Admin Portal Test Cases (Web-Only) → default sheet

- [ ] **AFM-001** — View Affiliates Management listing | Steps: open Affiliates Management | Expected: table shows Name, Username, Password, Created On, Action columns, sorted by Created Date (latest first) `[High]`
- [ ] **AFM-002** — Search affiliate by Name | Steps: enter a known affiliate Name in search | Expected: listing filters to matching account(s) `[High]`
- [ ] **AFM-003** — Search affiliate by Username | Steps: enter a known Username in search | Expected: listing filters to matching account(s) `[High]`
- [ ] **AFM-004** — Filter by Created On date range | Steps: open filter icon → set From/To dates → apply | Expected: listing shows only affiliates created within the range `[High]`
- [ ] **AFM-005** — Sort by Created On | Steps: click sort icon on Created On | Expected: rows reorder by creation date `[High]`
- [ ] **AFM-006** — Paginate listing | Steps: change records-per-page and navigate via Next/Previous | Expected: table updates to show the corresponding page/record count `[High]`
- [ ] **AFM-007** — Add affiliate without class restriction | Steps: click Add Affiliate → fill Name, Username, Password → leave Classes unselected → Add | Expected: account created; affiliate can access inventory across all classes `[High]`
- [ ] **AFM-008** — Add affiliate with class restriction | Steps: fill Name, Username, Password → select one or more Classes → Add | Expected: account created; affiliate's inventory visibility limited to selected classes only `[High]`
- [ ] **AFM-009** — Edit an existing affiliate | Steps: click Edit on a row → change Name/Password → Save | Expected: existing values pre-populated before edit; changes saved and reflected in listing `[High]`
- [ ] **AFM-010** — Update class assignment updates access immediately | Steps: edit an affiliate's Classes selection → Save | Expected: inventory visibility for that affiliate updates immediately to reflect the new selection `[High]`
- [ ] **AFM-011** — Removing all assigned classes restores full access | Steps: edit an affiliate with restricted classes → remove all selected classes → Save | Expected: affiliate regains access to inventory across all classes `[High]`
- [ ] **AFM-012** — Cancel Add discards entered values | Steps: on Add Affiliate, fill fields → Cancel | Expected: returns to listing without saving; no new row created `[High]`
- [ ] **AFM-013** — Cancel Edit discards changes | Steps: on Edit Affiliate, change a field → Cancel | Expected: returns to listing without saving; original values unchanged `[High]`
- [ ] **AFM-014** — Duplicate Username rejected | Steps: add an affiliate with a Username that already exists | Expected: "Name already exists" (username-uniqueness error) shown; not saved `[Medium]`
- [ ] **AFM-015** — Empty mandatory fields blocked | Steps: leave Name, Username, or Password blank → Add | Expected: "Name is required" / "Password is required" shown as applicable; submission blocked `[Medium]`
- [ ] **AFM-016** — Name/Username/Password with only spaces rejected | Steps: enter only spaces in Name, Username, or Password → Add | Expected: field treated as empty; "...is required" error shown `[Medium]`
- [ ] **AFM-017** — Duplicate Name rejected | Steps: add an affiliate with a Name that already exists | Expected: "Name already exists" shown; not saved `[Medium]`
- [ ] **AFM-018** — Name/Username/Password below minimum length | Steps: enter a 2-character value for Name, Username, or Password → Add | Expected: "...must be at least 3 characters" shown for the corresponding field `[Low]`
- [ ] **AFM-019** — Name/Username/Password at maximum length boundary | Steps: enter exactly 100 characters for a field → Add; then 101 characters → Add | Expected: 100 chars accepted; 101 chars rejected with "...cannot exceed 100 characters" `[Low]`
- [ ] **AFM-020** — Restricted affiliate cannot see unassigned-class inventory | Steps: create an affiliate restricted to one class → log in/query as that affiliate for inventory in a different class | Expected: inventory belonging to the unassigned class is not visible to the affiliate `[Low]`

## E2E implementation notes

- **Layering:** `TestData/TestSpecs/affiliates-management.spec.ts` →
  `src/modules/AffiliatesManagementModule.ts` → `src/pages/AffiliatesManagementPage.ts`.
- **Frontend context:** Not yet grounded. Live admin app URL/credentials pending.
- **Reuse:** Listing search/filter/sort/pagination pattern likely shared with
  `amenities-management.md`'s listing — worth checking for a common `ListingPage`/table helper once
  both are grounded live, rather than duplicating locators.
- **Locators:** `data-testid` preferred; role/label fallback.
- **Fixtures/mocks:** `AFM-020` (cross-affiliate access check) needs either a second authenticated
  context for the restricted affiliate or an API-level check — decide once the affiliate login/auth
  model is understood from the live app.
- **Tags:** `@Regression @P1`; `@Smoke` candidate: `AFM-001`, `AFM-007`.
- **Run:** `npx playwright test TestData/TestSpecs/affiliates-management.spec.ts --project=chromium`

## Source

- **Seed method:** Google Sheet (CSV export)
- **File:** "PVR INOX — Admin Portal Test Cases (Web-Only)" —
  `https://docs.google.com/spreadsheets/d/1TGio-P24tVNox7RdMhK-Rkpoa7vVuGy7CxiW7KQY_lg`
- **Sheet:** default/first sheet (single-tab CSV export)
- **Columns:** Test Summary=`Test case Title`, Test Steps=`Test Steps/validation point`, Expected
  Result=`Expected Result (ER)`, Priority=`Priority`
- **Row range:** `AFM-001`–`AFM-020` (rows 111–130 of the first 150 rows executed in this batch)
- **Frontend repo:** not provided; live admin app URL pending confirmation from the user
