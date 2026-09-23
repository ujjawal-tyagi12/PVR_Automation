# Excel/CSV Ingest Reference

Requirements come **only** from Excel (`.xlsx`, `.xls`) or CSV files.

## Step A — Obtain file

Ask the user for the test-case file path (workspace-relative or absolute). Read the file before column/sheet questions if you need to list available sheet names.

## Step B — Sheet selection (Excel only)

For `.xlsx` / `.xls`, ask:

```text
Which sheet do you want to use in {filename}?
```

List sheet names discovered in the file. For **CSV**, skip this step (single sheet).

## Step C — Column mapping

Ask which columns map to requirement fields. Present discovered header names from the chosen sheet:

```text
Which columns should I use?

Common mappings:
- Test Summary
- Test Objective
- Test Steps
- Expected Result

Map each field to a column header in your file (or say N/A if not present).
```

| Ticket field | Typical column headers |
|--------------|------------------------|
| Scenario title | Test Summary, Test Case Title, Summary |
| Objective / acceptance | Test Objective, Description, Objective |
| Steps | Test Steps, Steps, Procedure |
| Expected outcome | Expected Result, Expected, Verification |
| Priority / type (optional) | Priority, Test Type, Category |

Store the user's mapping and use it for every row when building scenarios.

## Parsing

- **CSV:** Read with standard tools; first row = headers unless user says otherwise.
- **Excel:** Read named sheet only; preserve row order for scenario IDs.
- Skip empty rows.
- Map each data row → one scenario candidate (`PREFIX-NNN`).

## Feasibility filter (coverage = Complete)

When user picks **Complete (feasible from sheet)**, include rows that are:

- UI-automatable via Playwright (not manual-only, not backend-only unless API layer exists)
- Have enough steps + expected result to write a spec

Mark excluded rows in **Out of scope** with reason (e.g. "manual visual check", "requires hardware").

## Source section in ticket

```markdown
## Source

- **Seed method:** Excel/CSV
- **File:** `{path/to/file.xlsx}`
- **Sheet:** `{SheetName}` (or `N/A` for CSV)
- **Columns:** Summary=`{col}`, Objective=`{col}`, Steps=`{col}`, Expected=`{col}`
- **Frontend context:** `dev-repo/` (if provided)
```
