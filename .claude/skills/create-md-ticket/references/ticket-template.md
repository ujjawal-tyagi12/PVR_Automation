# Playwright: {Module Title} — {Feature summary}

## Acceptance criteria

- {Derived from Test Objective / Expected Result columns}
- {One bullet per major behavior}

## Navigation

1. {From user navigation answer}
2. {…}

## Test coverage

- **Scope:** {Regression | Smoke | Complete (feasible from sheet)} — {brief note}
- **Sheet rows included:** {count} of {total}
- **Out of scope:** {Non-feasible or excluded rows with reason}

## Scenarios

- **Suggested journey:** `src/tests/{feature-kebab}.spec.ts`
- **Sheet:** `{filename}` → `{SheetName}`

- [ ] **{PREFIX}-001** — {Test Summary} | Steps: {abbreviated} | Expected: {abbreviated}
- [ ] **{PREFIX}-002** — …

## E2E implementation notes

- **Layering:** `src/tests/{feature-kebab}.spec.ts` → `src/modules/{Feature}Module.ts` → `src/pages/{Feature}Page.ts`
- **Frontend context:** {Routes, components, selectors found under `dev-repo/` — or "Not provided."}
- **Reuse:** {Existing pages/modules/fixtures}
- **Locators:** {Prefer data-testid from dev-repo; getByRole fallback}
- **Fixtures / mocks:** {From framework defaults or dev-repo API patterns}
- **Tags:** `@Regression` / `@Smoke` / `@P0` per coverage choice
- **Run:** `npx playwright test src/tests/{feature-kebab}.spec.ts --project=chromium`

## Source

- **Seed method:** Excel/CSV
- **File:** `{path/to/test-cases.xlsx}`
- **Sheet:** `{SheetName}`
- **Columns:** Test Summary=`{col}`, Test Objective=`{col}`, Test Steps=`{col}`, Expected Result=`{col}`
- **Frontend repo:** `dev-repo/` {path or "not provided"}
