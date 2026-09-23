---
name: create-md-ticket
description: Converts Excel/CSV test-case files into structured Playwright requirement tickets (.md). Maps sheet columns, asks feature/coverage/navigation questions, enriches from dev-repo frontend code, drafts scenarios for approval, then writes requirements/{module}.md. Use when seeding requirements from spreadsheets, writing test tickets, or when the user mentions create-md-ticket, Excel test cases, or CSV requirements.
disable-model-invocation: true
---

# Create MD Ticket

Turn **Excel/CSV test-case files** into **one `.md` ticket per module** for Playwright automation in this framework.

**No spreadsheet?** Use `/generate-test-cases` instead — it designs positive, negative, and API-parity cases from module + navigation + user stories.

**Output:** `requirements/{module-name}.md`  
**Template:** [references/ticket-template.md](references/ticket-template.md)  
**Example:** [references/example-dashboard-view-toggle.md](references/example-dashboard-view-toggle.md)  
**Excel ingest:** [references/excel-ingest.md](references/excel-ingest.md)  
**Frontend context:** `dev-repo/` at project root (when provided)

Works in **Cursor** and **Claude Code**.

---

## Step 0: Get the test-case file

When `/create-md-ticket` is invoked, ask for the requirements file first:

```text
Provide the path to your test-case Excel or CSV file.
```

**Only Excel/CSV is supported** (`.xlsx`, `.xls`, `.csv`). Do not accept screenshots or ad-hoc repo scraping as the primary seed.

Read the file to discover sheet names (Excel) and column headers before the next questions.

---

## Step 1: Sheet and column mapping (ask immediately after file access)

Ask **both** in one message (or use AskQuestion):

### 1. Which sheet?

```text
Which sheet do you want to refer to in {filename}?
```

- List all sheet names from the workbook.
- CSV: skip — treat as single sheet; say so to the user.

### 2. Which columns?

```text
Which columns should I use? Common fields:
- Test Summary
- Test Objective
- Test Steps
- Expected Result

Map each to a column header in your file (or N/A if missing).
```

Show discovered headers from the chosen sheet. Store the mapping for scenario generation.

Details: [references/excel-ingest.md](references/excel-ingest.md)

---

## Step 2: Feature, coverage, navigation, frontend repo

After sheet/column answers, ask:

```text
1. Feature to automate?
2. Coverage you want:
   - Regression
   - Smoke
   - Complete — all tests in the sheet that are feasible to automate
3. Navigation to the module/feature (step-by-step)?
4. (Optional) Frontend dev repo path or URL for better coverage and understanding?
   Default local path: dev-repo/
```

| Answer | Use |
|--------|-----|
| **Feature** | Module slug (`{feature-kebab}.md`), ticket title, scenario prefix acronym |
| **Regression** | Tag `@Regression`; subset of high-value rows if sheet is large — confirm in preview |
| **Smoke** | Tag `@Smoke`; minimal critical path from sheet |
| **Complete** | All feasible rows from mapped columns; exclude non-automatable in Out of scope |
| **Navigation** | Numbered **Navigation** section |
| **Frontend repo** | Clone/read `dev-repo/` or user path; enrich locators, routes, components |

Wait for answers before ingesting rows into scenarios.

---

## Step 3: Ingest rows + frontend context

1. Parse mapped columns from the chosen sheet — one row → one scenario candidate.
2. Assign IDs: `{PREFIX}-{NNN}` (PREFIX = 2–4 letter acronym from feature name).
3. **If `dev-repo/` exists or user provided a frontend path**, read before writing tickets:
   - Routes/pages for the feature
   - Components, `data-testid`, forms, modals
   - Auth/MFA flow if navigation mentions login
   - API calls relevant to UI under test
4. Map to architecture: **Tests → Modules → Pages** ([playwright-mcp references](../playwright-mcp/references/rules.md)).
5. Merge sheet steps/expected with frontend findings in **E2E implementation notes**.

Do **not** write `requirements/*.md` yet.

---

## Step 4: Coverage preview — user approval required

Present:

```markdown
## Coverage preview — {Feature Title}

**Module file:** `requirements/{module-name}.md`
**Source:** `{file}` → sheet `{SheetName}`
**Columns:** Summary=`…`, Objective=`…`, Steps=`…`, Expected=`…`
**Coverage:** Regression | Smoke | Complete
**Navigation:** login → MFA → dashboard
**Frontend context:** dev-repo/{path used}

### Scenarios ({count})
- [ ] PREFIX-001 — {Test Summary} (row {n})
- [ ] PREFIX-002 — …

### Out of scope
- Row {n}: {reason — not feasible / manual / out of feature}

Reply **approve**, or list adds/removes/changes.
```

Iterate until the user confirms.

---

## Step 5: Write final ticket

After explicit approval:

1. Create `requirements/` if missing.
2. Write `requirements/{module-name}.md` using [ticket-template.md](references/ticket-template.md).
3. Fill: Acceptance criteria, Navigation, Test coverage, Scenarios (with sheet row refs), E2E implementation notes (include `dev-repo` findings), Source.
4. E2E paths must use this repo:
   - Spec: `src/tests/{feature}.spec.ts`
   - Module: `src/modules/{Feature}Module.ts`
   - Page: `src/pages/{Feature}Page.ts`
5. **Run** command: `npx playwright test src/tests/{feature}.spec.ts --project=chromium`

---

## Ticket rules

| Section | Rule |
|---------|------|
| **Title** | `Playwright: {Area} — {feature summary}` |
| **Acceptance criteria** | From Test Objective + Expected Result columns |
| **Navigation** | From user answer (step 2) |
| **Test coverage** | Scope + row counts + Out of scope |
| **Scenarios** | One checkbox per included sheet row; link to PREFIX ID |
| **E2E notes** | Layering + **dev-repo** selectors/routes when available |
| **Source** | File, sheet, column mapping, frontend path |

Match structure of [example-dashboard-view-toggle.md](references/example-dashboard-view-toggle.md) where applicable.

---

## Scenario ID conventions

| Pattern | Example |
|---------|---------|
| Prefix | Uppercase acronym from feature (2–4 chars) |
| Number | `001`, `002`, … matching sheet order |
| Checkbox | `- [ ] **PREFIX-001** — {Test Summary}` |

---

## Quality gate

- [ ] Excel/CSV file read; sheet + columns confirmed by user
- [ ] Feature, coverage, navigation answered
- [ ] `dev-repo/` consulted when path exists or user provided repo
- [ ] User approved coverage preview
- [ ] One `requirements/{module}.md` written
- [ ] No Playwright code unless user asks after ticket is done

---

## After seeding

Suggest next steps (same on Cursor or Claude Code):

1. `/playwright-mcp` Planner with `requirements/{module-name}.md` (MCP-grounded generate + heal)
2. `/e2e-review`

On Claude Code, prefer a session started with `claude --chrome` so Playwright MCP + Claude in Chrome are available for implementation.
