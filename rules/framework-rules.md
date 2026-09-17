# Repository Rules Snapshot

## Folder Mapping

- `src/pages`: page objects only (`*Page.ts`)
- `src/modules`: workflow logic (`*Module.ts`, `*Modal.ts`)
- `src/utils`: utility helpers and reusable infra
- `src/api`: REST API clients
- `src/fixtures`: Playwright `test`/`expect` extensions
- `src/testdata`: static fixtures data + types
- `src/tests`: spec files (`*.spec.ts`)

## Architectural Constraints

- Tests call modules/fixtures, not page locators directly.
- Modules use page methods, not `page.locator()`.
- Page objects expose locator arrow functions and simple actions.

## Validation Gate

Run the rule engine before opening a PR:

```bash
npm run rules:check
```

See [code-standards.md](code-standards.md) for the full standard and
[framework-rule-engine.json](framework-rule-engine.json) for the machine-enforced rule set.
