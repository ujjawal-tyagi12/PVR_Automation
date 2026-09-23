# Playwright: {Module Title} — {Feature summary}

## Acceptance criteria

- {From user stories / scenarios — one bullet per behavior}
- {…}

## Navigation

1. {From user navigation answer}
2. {…}

## Test coverage

- **Scope:** {Smoke | Standard | Complete} — {brief note}
- **Types included:** Positive, Negative, API parity, {Edge, RBAC, …}
- **Scenarios included:** {count}
- **Out of scope:** {Excluded items with reason}

## Scenarios

- **Suggested journey:** `src/tests/{module-kebab}.spec.ts`
- **Seed:** Generated from user stories / scenarios

### Positive

- [ ] **{PREFIX}-001** — {title} `[Positive]` | Steps: {…} | Expected: {…}

### Negative

- [ ] **{PREFIX}-010** — {title} `[Negative]` | Steps: {…} | Expected: {…}

### API parity

- [ ] **{PREFIX}-020** — {title} `[API parity]` | Steps: {…} | Expected: {…}

### Edge / RBAC (if selected)

- [ ] **{PREFIX}-030** — {title} `[Edge|RBAC]` | Steps: {…} | Expected: {…}

## E2E implementation notes

- **Layering:** `src/tests/{module-kebab}.spec.ts` → `src/modules/{Module}Module.ts` → `src/pages/{Module}Page.ts`
- **Frontend context:** {Routes, components, selectors — or "Not provided."}
- **APIs:** {Endpoints / contracts used for parity — or "Not provided."}
- **Reuse:** {Existing pages/modules/fixtures if known}
- **Locators:** Prefer `data-testid` / role+name; avoid brittle CSS
- **Fixtures / mocks:** {Auth, storage, API mocks if needed}
- **Tags:** `@Smoke` / `@Regression` / `@P0`–`@P2` per scenario guidance above
- **Run:** `npx playwright test src/tests/{module-kebab}.spec.ts --project=chromium`

## Source

- **Seed method:** Generated (stories/scenarios)
- **Module:** `{Module Title}`
- **Testing types:** {list}
- **Depth:** {Smoke | Standard | Complete}
- **User stories / scenarios provided:** {yes — summarized in Acceptance criteria}
- **Frontend repo:** `{path or "not provided"}`
- **API contract:** `{path/notes or "not provided"}`
