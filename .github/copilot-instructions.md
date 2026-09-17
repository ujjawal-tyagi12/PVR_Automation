# Copilot / AI Assistant Instructions

This repository enforces a strict **Pages → Modules → Tests** architecture. Any AI-generated
code must follow it:

- `src/pages/*Page.ts` — locator arrow functions + simple actions only, no business logic.
- `src/modules/*Module.ts` / `*Modal.ts` — orchestrate pages via their methods; never call
  `page.locator()`; use `Logger` from `@utils/Logger`, never `console.log`.
- `src/tests/*.spec.ts` — call modules/fixtures only, never import `@pages/` or call
  `page.locator()` directly. Tag every `test.describe` with a priority (`@P0`/`@P1`/`@P2`) and
  suite (`@Smoke`/`@Regression`) tag. Use `test.step()` per phase.
- Import via path aliases (`@pages/*`, `@modules/*`, `@utils/*`, `@fixtures/*`, `@api/*`,
  `@config/*`, `@testdata/*`) — no deep relative imports.
- No `page.waitForTimeout()` — use `WaitHelper` or web-first assertions.
- Ground every locator in a real DOM/accessibility snapshot (Playwright MCP or Claude in
  Chrome) — never invent `data-testid` or roles.

Before proposing code as done, mentally check it against
`rules/framework-rule-engine.json` / `npm run rules:check`, and `rules/code-standards.md`.

Role-specific instructions: `.github/instructions/planner.instructions.md`,
`generator.instructions.md`, `healer.instructions.md`.
