# Copilot instructions

This repo enforces a strict layering: `src/tests` → `src/modules` → `src/pages`. Never suggest code that skips a layer (a spec calling `page.locator()` directly, a module importing `@pages/*` without going through a page class, etc).

- New page objects go in `src/pages/*Page.ts`, take `constructor(private page: Page) {}`, and expose locators as arrow functions.
- New modules go in `src/modules/*Module.ts`, orchestrate pages, and never call `page.locator()` directly.
- New specs go in `src/tests/*.spec.ts`, are tagged `@P0`/`@P1`/`@P2` + `@Smoke`/`@Regression`, use `test.step()`, and import only modules/fixtures — never `@pages/*` directly.
- Use the path aliases (`@pages/*`, `@modules/*`, `@utils/*`, `@fixtures/*`, `@api/*`, `@config/*`, `@testdata/*`) instead of relative imports.
- No `console.log` (use `src/utils/Logger.ts`) and no `page.waitForTimeout()` (use auto-waiting locators or `src/utils/WaitHelper.ts`).
- Validate suggestions against `npm run rules:check` before treating a change as complete.

Full conventions: [`rules/code-standards.md`](../rules/code-standards.md). Task-specific guidance: [`instructions/generator.instructions.md`](instructions/generator.instructions.md), [`instructions/planner.instructions.md`](instructions/planner.instructions.md), [`instructions/healer.instructions.md`](instructions/healer.instructions.md).
