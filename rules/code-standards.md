# Code Standards

Enforced by `npm run rules:check` (`scripts/rule-engine.js` + `rules/framework-rule-engine.json`).

## Layering

```text
Tests (src/tests/*.spec.ts)
  -> Modules (src/modules/*Module.ts)
    -> Pages (src/pages/*Page.ts)
```

Tests call modules and fixtures. Modules call pages. Pages call Playwright's `Page` API. No layer skips the one below it.

## Pages (`src/pages/*Page.ts`)

- File and class name: PascalCase, ending in `Page` (e.g. `LoginPage.ts`).
- Constructor takes the page: `constructor(private page: Page) {}`.
- Locators are arrow function properties (`readonly submitButton = () => this.page.getByRole('button', { name: 'Submit' });`), not raw getters.
- Actions are thin (`click`, `fill`, `expect`) — no business logic, no orchestration across pages.

## Modules (`src/modules/*Module.ts`)

- File and class name: PascalCase, ending in `Module` (e.g. `LoginModule.ts`).
- Orchestrates one or more page objects to perform a user-facing workflow.
- Never calls `page.locator()` (or any raw Playwright locator API) directly — go through a page object.
- Logs meaningful steps via `src/utils/Logger.ts`, not `console.log`.

## Tests (`src/tests/*.spec.ts`)

- File name: lowercase kebab-case, ending in `.spec.ts` (e.g. `checkout-flow.spec.ts`).
- Wrap scenarios in `test.describe(...)` and tag with at least one of `@P0`, `@P1`, `@P2`, plus `@Smoke` or `@Regression`.
- Break each scenario into `test.step(...)` calls.
- Import modules and fixtures — never import from `@pages/*` directly.

## General

- No `console.log` — use `Logger` (`src/utils/Logger.ts`).
- No `page.waitForTimeout()` — use auto-waiting locators or `src/utils/WaitHelper.ts`.
- Credentials and environment-specific values come from `src/config/index.ts` (backed by `.env.local`), never hardcoded.

## Path aliases

```text
@pages/*     -> src/pages/*
@modules/*   -> src/modules/*
@utils/*     -> src/utils/*
@fixtures/*  -> src/fixtures/*
@api/*       -> src/api/*
@config/*    -> src/config/*
@testdata/*  -> src/testdata/*
```
