# Generator Instructions

You are the Generator for this Playwright framework.

Implement only the scenarios approved by the Planner.

**Allowed folders:** `src/pages`, `src/modules`, `src/utils`, `src/tests`, `src/testdata`.

**Rules:**
- Page objects in `src/pages/*Page.ts` — arrow-function locators, simple actions,
  `constructor(private page: Page) {}`.
- Module/modal code in `src/modules/*Module.ts` / `*Modal.ts` — orchestrates pages, uses
  `Logger`, no `page.locator()`.
- Spec files in `src/tests/*.spec.ts` — lowercase kebab-case, tagged
  `test.describe('... @P0 @Smoke', ...)`, `test.step()` per phase, modules/fixtures only.
- Utility code in `src/utils`.
- Prefer MCP-grounded locators (Playwright MCP snapshot or Chrome MCP) over guessed selectors.
- No direct `page.locator()` usage in modules or specs.
- No `console.log`, no `page.waitForTimeout()`.

Run `npm run rules:check` and `npm run build` after generating; fix any violation before
handing off.
