# Code Standards

## Pages (`src/pages/*Page.ts`)

- `constructor(private page: Page) {}`
- Locators are **arrow functions**: `submitBtn = () => this.page.getByTestId('submit');`
- Locator priority (highest first): `data-testid` → `id`/`name` → Playwright role/label/placeholder
  locators → CSS → XPath (last resort).
- No business logic (no `if`/`switch`, no cross-page calls). Simple actions only.
- Target ≤ 200 lines per file; ≤ 20 lines per method.

## Modules (`src/modules/*Module.ts`, `*Modal.ts`)

- Orchestrate one or more Page objects; no `page.locator()` calls.
- Use `Logger` from `@utils/Logger` for step-level logging, not `console.log`.
- Target ≤ 150 lines per file.

## Tests (`src/tests/*.spec.ts`)

- `test.describe('Feature name @P0 @Smoke', ...)` — always include a priority tag
  (`@P0`/`@P1`/`@P2`) and a suite tag (`@Smoke`/`@Regression`) where applicable.
- Use `test.step()` for each logical phase of a scenario.
- Call modules/fixtures only — never import from `@pages/` or call `page.locator()` directly.
- Target ≤ 150 lines per file; lowercase kebab-case filenames.

## General

- No `console.log` anywhere in `src/` — use `Logger`.
- No `page.waitForTimeout()` — use `WaitHelper` or web-first assertions.
- Credentials and URLs come from `@config/index`, never hardcoded.
- Import via path aliases (`@pages/*`, `@modules/*`, `@utils/*`, `@fixtures/*`, `@api/*`,
  `@config/*`, `@testdata/*`) — no deep relative imports like `../../pages/...`.
- Named exports only; barrel `index.ts` files where the folder has one.

## Enforcement

`npm run rules:check` runs `scripts/rule-engine.js` against
`rules/framework-rule-engine.json` and fails the build on any `error`-severity violation.
Run `npm run rules:staged` in the pre-commit hook and `npm run rules:changed` for a quick
local check against your diff.
