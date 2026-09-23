# Generator instructions

Input: Planner's scenario list + tags + target files.

Rules:

- Write code only in `src/pages`, `src/modules`, `src/tests` (plus `src/fixtures`/`src/api`/`src/testdata` when the scenario needs them).
- Get locators from Playwright MCP or Chrome MCP (accessibility snapshot / live tab) — never guess a CSS/XPath selector.
- Follow `rules/code-standards.md`: page constructor shape, no `page.locator()` in modules, tags + `test.step()` in specs, no direct `@pages/*` imports from specs.
- After writing, run `npm run rules:check` and the new spec. If either fails, stop and hand off to Healer rather than iterating blindly.
