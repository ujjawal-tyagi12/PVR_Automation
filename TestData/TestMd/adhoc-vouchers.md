# Playwright: Adhoc Vouchers — listing, sync, filters, and voucher edit (T&C/images)

## Acceptance criteria

- The listing shows **mixed adhoc vouchers across categories** with all listing columns by default.
- **Sync Adhoc Vouchers** pulls the latest vouchers from **Showbizz** and updates the **Last Synced
  Date/Time** indicator.
- Listing supports **Cinema selection**, **Name search**, **multi-select Type filter**, and
  **Last Edited On date-range filter**.
- **View** opens a Details page (Name, Type, Price, Strike Off Price, Valid From/To, Last Edited On,
  T&C, Know More Image, App Image, Web Image); **Edit** from there opens a screen where base fields
  are **read-only** and only **T&C** and the three images are editable.
- Saving valid T&C/image changes updates **Last Edited On** and reflects across **App/Web/M-Site**.
- Validation: T&C is bounded (**10–10,000 characters**, both boundaries individually verified as
  accepted); images must be **JPG/PNG**, **≤5 MB** (5 MB itself accepted), and **uploaded, not
  hotlinked**.
- A backend/network failure during Save shows an error and leaves existing data unchanged.
- Editing one voucher does not affect a sibling voucher sharing the same Type.

## Navigation

1. Log in to the Admin Panel (see `admin-login.md`).
2. Open **Adhoc Vouchers** from the admin navigation (exact menu path not specified in the sheet —
   confirm via live app once grounded).
3. Use the Cinema dropdown / search / filters on the listing, or drill into **View → Edit** for a
   single voucher.

## Test coverage

- **Scope:** Complete — all Adhoc Vouchers rows in the "first 150" execution batch for this run.
- **Sheet rows included:** 24 of 24 (`ADV-001`–`ADV-012`, `ADV-020`–`ADV-026`, `ADV-030`–`ADV-034`).
  Note: `ADV-013`–`ADV-019` and `ADV-027`–`ADV-029` are gaps in the source sheet's own ID sequence
  (not present in this module's block) — not a truncation artifact of this batch.
- **Out of scope:** None within this batch.

## Scenarios

- **Suggested journey:** `TestData/TestSpecs/adhoc-vouchers.spec.ts`
- **Sheet:** PVR INOX — Admin Portal Test Cases (Web-Only) → default sheet

- [ ] **ADV-001** — View default listing | Steps: login → open Adhoc Vouchers | Expected: mixed adhoc vouchers across categories shown with all columns `[High]`
- [ ] **ADV-002** — Sync Adhoc Vouchers | Steps: click Sync Adhoc Vouchers | Expected: latest vouchers fetched from Showbizz; Last Synced Date/Time updated `[High]`
- [ ] **ADV-003** — Select Cinema filters listing | Steps: select a cinema from the dropdown | Expected: listing updates for the selected cinema `[High]`
- [ ] **ADV-004** — Search vouchers by Name | Steps: enter a voucher name in the search bar | Expected: matching vouchers shown `[High]`
- [ ] **ADV-005** — Filter by Type (multi-select) | Steps: select two or more Type values | Expected: listing shows vouchers matching any selected type `[High]`
- [ ] **ADV-006** — Filter by Last Edited On range | Steps: apply From–To date range | Expected: listing filtered accordingly `[High]`
- [ ] **ADV-007** — View voucher details | Steps: click View action | Expected: Details page shows Name, Type, Price, Strike Off Price, Valid From/To, Last Edited On, T&C, Know More Image, App Image, Web Image `[High]`
- [ ] **ADV-008** — Navigate to Edit from Details | Steps: on Details page, click Edit | Expected: Edit screen opens with read-only base fields and editable T&C/images `[High]`
- [ ] **ADV-009** — Edit Terms & Conditions successfully | Steps: update T&C text within limits → Save | Expected: saved; Last Edited On updated; reflected on App/Web/M-Site `[High]`
- [ ] **ADV-010** — Upload Know More Image | Steps: upload a valid Know More image → Save | Expected: image saved and reflected `[High]`
- [ ] **ADV-011** — Upload App Image and Web Image | Steps: upload valid App and Web images → Save | Expected: images saved and reflected `[High]`
- [ ] **ADV-012** — Upload image via listing action icon | Steps: click Upload Image icon on listing → upload valid image | Expected: image saved `[High]`
- [ ] **ADV-020** — Valid To earlier than Valid From | Steps: attempt to save with an underlying Valid To < Valid From state | Expected: validation error shown; Save action blocked `[Medium]`
- [ ] **ADV-021** — Image upload failure (invalid format) | Steps: upload an unsupported file type | Expected: "Unsupported file type. Only JPG or PNG allowed."; existing image unchanged `[Medium]`
- [ ] **ADV-022** — Image exceeds max size | Steps: upload an image over 5 MB | Expected: "File size must not exceed 5 MB."; existing image unchanged `[Medium]`
- [ ] **ADV-023** — Hotlinked image rejected | Steps: attempt to link an external image URL | Expected: "Please upload the image instead of linking to an external URL." `[Medium]`
- [ ] **ADV-024** — T&C exceeds max length | Steps: enter more than 10,000 characters in T&C → Save | Expected: "T&C cannot exceed 10,000 characters."; save blocked `[Medium]`
- [ ] **ADV-025** — T&C below recommended minimum | Steps: enter fewer than 10 characters in T&C → Save | Expected: "T&C should be at least 10 characters for clarity." `[Medium]`
- [ ] **ADV-026** — Save failure (backend error) | Steps: trigger a network/server error during Save | Expected: error message shown; existing data unchanged `[Medium]`
- [ ] **ADV-030** — T&C at max length boundary (10,000 chars) | Steps: enter exactly 10,000 characters in T&C → Save | Expected: accepted and saved `[Low]`
- [ ] **ADV-031** — T&C at min length boundary (10 chars) | Steps: enter exactly 10 characters in T&C → Save | Expected: accepted and saved `[Low]`
- [ ] **ADV-032** — Image at exact 5MB boundary | Steps: upload an image exactly 5 MB in size | Expected: accepted `[Low]`
- [ ] **ADV-033** — Multiple vouchers with same Type are independent | Steps: edit one of two vouchers sharing the same Type | Expected: only the edited voucher changes; the sibling voucher remains unaffected `[Low]`
- [ ] **ADV-034** — Zero search results | Steps: search a name that matches no vouchers | Expected: empty listing shown `[Low]`

## E2E implementation notes

- **Layering:** `TestData/TestSpecs/adhoc-vouchers.spec.ts` → `src/modules/AdhocVouchersModule.ts` →
  `src/pages/AdhocVouchersPage.ts`.
- **Frontend context:** Not yet grounded. Live admin app URL/credentials pending; do not invent
  `data-testid`/roles for the listing/details/edit screens — capture via Playwright MCP once
  reachable.
- **Reuse:** Shared login flow from `admin-login.md`; file-upload helper likely shared with
  `about-us.md` (Brand Toolbox ZIP) and `amenities-management.md` (icon upload) once a common upload
  component is confirmed in the live DOM.
- **Locators:** `data-testid` preferred once available; role/label fallback.
- **Fixtures/mocks:** `ADV-026` (backend error) likely needs a route intercept/mock — reuse
  `src/api/` patterns once the real API base path is known.
- **Tags:** `@Regression @P1`; `@Smoke` candidate: `ADV-001`, `ADV-007`.
- **Run:** `npx playwright test TestData/TestSpecs/adhoc-vouchers.spec.ts --project=chromium`

## Source

- **Seed method:** Google Sheet (CSV export)
- **File:** "PVR INOX — Admin Portal Test Cases (Web-Only)" —
  `https://docs.google.com/spreadsheets/d/1TGio-P24tVNox7RdMhK-Rkpoa7vVuGy7CxiW7KQY_lg`
- **Sheet:** default/first sheet (single-tab CSV export)
- **Columns:** Test Summary=`Test case Title`, Test Steps=`Test Steps/validation point`, Expected
  Result=`Expected Result (ER)`, Priority=`Priority`
- **Row range:** `ADV-001`–`ADV-034` (rows 35–58 of the first 150 rows executed in this batch)
- **Frontend repo:** not provided; live admin app URL pending confirmation from the user
