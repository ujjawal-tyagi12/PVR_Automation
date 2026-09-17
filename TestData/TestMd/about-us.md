# Playwright: About Us (Static Management) — Company/Journey/Team/Awards/Brands/Toolbox CRUD

## Acceptance criteria

- All About Us tabs (Company, Journey, Team, Awards, Brands, Brand Toolbox) show **no data until
  Country and Brand filters are selected**; Company is the default tab.
- Each tab supports **Add / Edit** via a form dialog; Company additionally supports **Delete** and
  an **Active/Inactive toggle**, each gated behind a confirmation step that can be cancelled without
  side effects.
- **Country/Brand are read-only on Edit** across tabs (set only at creation).
- Brand Toolbox supports uploading a **ZIP** per Country/Brand combination; a new upload **replaces**
  (not adds to) any existing file, and non-ZIP files are rejected.
- Listings support **sort by Last Edited On** and **filter by Status / date range**.
- Mandatory-field validation blocks Save: **Image required** on visual sections (Company/Journey/
  Team/Awards/Brands), **Country/Brand required** before any Add form can be saved.
- Sequence numbers are **unique across all tabs**; assigning a duplicate is handled per business rule
  (validation or resequencing).
- A role without **Static Management** access cannot reach the About Us section (`ABU-032`,
  Critical/negative).
- An empty Country–Brand combination renders an **empty state**, not an error.

## Navigation

1. Log in to the Admin Panel (see `admin-login.md` for the credential + OTP flow).
2. From the Admin dashboard, go to **Static Management → About Us**.
3. Select **Country** and **Brand** filters — required before any tab renders data.
4. Switch between tabs via the tab strip: **Company / Journey / Team / Awards / Brands / Brand
   Toolbox**.

## Test coverage

- **Scope:** Complete — all About Us rows in the "first 150" execution batch for this run.
- **Sheet rows included:** 34 of 34 (`ABU-001`–`ABU-034`).
- **Out of scope:** None within this batch. Rows beyond `ABU-034` in the full sheet (if any) are out
  of scope for this ticket.

## Scenarios

- **Suggested journey:** `TestData/TestSpecs/about-us.spec.ts`
- **Sheet:** PVR INOX — Admin Portal Test Cases (Web-Only) → default sheet

- [ ] **ABU-001** — All tabs blank until Country and Brand are selected | Steps: login → Static Management → About Us | Expected: Company tab (default) shows no data until filters selected `[High]`
- [ ] **ABU-002** — Company tab listing loads after selecting filters | Steps: select Country and Brand | Expected: Company table shows Title/Description/Sequence/Last Edited On/Status `[High]`
- [ ] **ABU-003** — Add Company entry | Steps: click Add Company → fill Title/Sequence/Strength rows/Description/Image → Save | Expected: Entry saved; listing updates `[High]`
- [ ] **ABU-004** — Edit Company entry | Steps: click Edit on a Company row → update fields → Save | Expected: Country/Brand read-only; changes reflected in listing `[High]`
- [ ] **ABU-005** — Toggle Company entry Active/Inactive | Steps: click toggle → confirm | Expected: Status updates and frontend visibility changes accordingly `[High]`
- [ ] **ABU-006** — Delete Company entry | Steps: click Delete → confirm | Expected: Entry removed from listing `[High]`
- [ ] **ABU-007** — Switch to Journey tab loads listing | Steps: click Journey tab | Expected: Table shows Year/Title/Overview/Sequence/Status `[High]`
- [ ] **ABU-008** — Add Journey entry | Steps: click Add Journey → fill Country/Brand/Title/Sequence/Description/Image → Save | Expected: Entry saved; listing updates `[High]`
- [ ] **ABU-009** — Edit Journey entry | Steps: click Edit on a Journey row → update Year/Title/Overview/Sequence → Save | Expected: Country/Brand read-only; changes reflected `[High]`
- [ ] **ABU-010** — Switch to Team tab loads listing | Steps: click Team tab | Expected: Table shows Image/Name/Designation/Type/Sequence/Status `[High]`
- [ ] **ABU-011** — Add Team entry | Steps: click Add Team → fill Name/Designation/Type/Image/Overview → Save | Expected: Entry saved; listing updates `[High]`
- [ ] **ABU-012** — Edit Team entry | Steps: click Edit on a Team row → update fields → Save | Expected: Changes reflected in listing `[High]`
- [ ] **ABU-013** — Switch to Awards tab loads listing | Steps: click Awards tab | Expected: Table shows Image/Name/Sponsor/Year/Sequence/Status `[High]`
- [ ] **ABU-014** — Add Awards entry | Steps: click Add Awards → fill Name/Sponsor/Year/Sequence/Image → Save | Expected: Entry saved; listing updates `[High]`
- [ ] **ABU-015** — Edit Awards entry | Steps: click Edit on an Awards row → update fields → Save | Expected: Changes reflected in listing `[High]`
- [ ] **ABU-016** — Switch to Brands tab loads listing | Steps: click Brands tab | Expected: Table shows Image/Name/Sequence/Status `[High]`
- [ ] **ABU-017** — Add Brands entry | Steps: click Add Brands → fill Name/Sequence/Image → Save | Expected: Entry saved; listing updates `[High]`
- [ ] **ABU-018** — Edit Brands entry | Steps: click Edit on a Brands row → update fields → Save | Expected: Changes reflected in listing `[High]`
- [ ] **ABU-019** — Brand Toolbox shows uploaded ZIP for selected combination | Steps: click Brand Toolbox tab with a combination that has an uploaded file | Expected: File and edit icon displayed `[High]`
- [ ] **ABU-020** — Add Toolbox file | Steps: click Add Toolbox → select Country/Brand → upload ZIP → Upload | Expected: File saved for the combination `[High]`
- [ ] **ABU-021** — Replace Brand Toolbox file | Steps: click edit icon → upload new ZIP → Update | Expected: New file replaces previous; available on frontend `[High]`
- [ ] **ABU-022** — Sort listing by Last Edited On | Steps: click sort icon on Last Edited On column | Expected: Listing re-orders ascending/descending `[High]`
- [ ] **ABU-023** — Filter listing by Status | Steps: apply Status filter (Active/Inactive) | Expected: Only matching entries shown `[High]`
- [ ] **ABU-024** — Filter listing by Last Edited On date range | Steps: apply From/To date range | Expected: Only entries within range shown `[High]`
- [ ] **ABU-025** — Cancel Delete retains entry | Steps: click Delete on any tab → cancel confirmation | Expected: Entry remains unchanged `[Medium]`
- [ ] **ABU-026** — Cancel activation toggle leaves status unchanged | Steps: click toggle → cancel confirmation | Expected: Status unchanged `[Medium]`
- [ ] **ABU-027** — Cancel Add/Edit discards changes | Steps: fill Add/Edit form on any tab → click Cancel | Expected: No changes saved `[Medium]`
- [ ] **ABU-028** — Add Company blocked when Image missing | Steps: leave Image empty on Add Company → Save | Expected: Save prevented; validation shown (image required for visual sections) `[Medium]`
- [ ] **ABU-029** — Add entry blocked when Country or Brand not selected | Steps: leave Country/Brand unset on any Add form → Save | Expected: Save prevented; listing/filters remain unselected `[Medium]`
- [ ] **ABU-030** — Duplicate sequence across tabs handled | Steps: assign a sequence number already used elsewhere in About Us → Save | Expected: System enforces sequence uniqueness across all tabs (validation or resequencing per business rule) `[Medium]`
- [ ] **ABU-031** — Brand Toolbox upload blocked for non-ZIP file | Steps: upload a .pdf/.png as toolbox file | Expected: Upload rejected `[Medium]`
- [ ] **ABU-032** — Unauthorized role cannot access About Us section `[Negative]` | Steps: log in as a role without Static Management access → attempt to navigate to About Us | Expected: Section hidden or access denied `[Critical]`
- [ ] **ABU-033** — No entries for selected Country–Brand → empty state | Steps: select a Country–Brand combination with no data on any tab | Expected: Empty state shown `[Low]`
- [ ] **ABU-034** — New Toolbox upload replaces rather than adds a second file | Steps: upload a second ZIP for a combination that already has one | Expected: Only one file remains, the newly uploaded one `[Low]`

## E2E implementation notes

- **Layering:** `TestData/TestSpecs/about-us.spec.ts` → `src/modules/AboutUsModule.ts` →
  `src/pages/AboutUsPage.ts`.
- **Frontend context:** Not yet grounded. The admin CMS is a separate app from the public site
  (`inox-uat-web.pvrinox.com/admin` only renders the public SPA's generic fallback page — confirmed
  by direct navigation). Live selectors must be captured via Playwright MCP against the real admin
  app once its URL + working credentials are available; do not hand-write `data-testid`/role guesses
  into the Page object.
- **Reuse:** Shared login flow from `admin-login.md`/`AdminLoginModule` once grounded; shared
  Country/Brand filter component is likely reused by other static-management tabs.
- **Locators:** Prefer `data-testid` from live DOM inspection; `getByRole`/label fallback only if no
  test id exists.
- **Fixtures/mocks:** None anticipated beyond authenticated session state.
- **Tags:** `@Regression @P1` for High/Medium rows; `@P0` for `ABU-032` (Critical); `@Smoke` candidate:
  `ABU-001`, `ABU-002`, `ABU-003`.
- **Run:** `npx playwright test TestData/TestSpecs/about-us.spec.ts --project=chromium`

## Source

- **Seed method:** Google Sheet (CSV export)
- **File:** "PVR INOX — Admin Portal Test Cases (Web-Only)" —
  `https://docs.google.com/spreadsheets/d/1TGio-P24tVNox7RdMhK-Rkpoa7vVuGy7CxiW7KQY_lg`
- **Sheet:** default/first sheet (single-tab CSV export)
- **Columns:** Test Summary=`Test case Title`, Test Steps=`Test Steps/validation point`, Expected
  Result=`Expected Result (ER)`, Priority=`Priority`
- **Row range:** `ABU-001`–`ABU-034` (first 34 of the first 150 rows executed in this batch)
- **Frontend repo:** not provided; live admin app URL pending confirmation from the user
