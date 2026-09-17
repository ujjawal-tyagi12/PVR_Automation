# CLAUDE.md

Always-loaded project instructions for Claude Code sessions in this repository.

## What this repo is

Playwright + TypeScript E2E framework, **Pages → Modules → Tests** architecture, guarded by a
custom rule engine (`npm run rules:check`). Target app: configure `BASE_URL` /
`API_BASE_URL` in `.env.local` (see `.env.example`).

## Architecture (non-negotiable)

```text
Tests (src/tests/*.spec.ts)
  → Modules (src/modules/*Module.ts)
    → Pages (src/pages/*Page.ts)
```

- Pages: locator arrow functions, simple actions, `constructor(private page: Page) {}`. No
  business logic.
- Modules: orchestrate pages via their methods; use `Logger`; never call `page.locator()`.
- Tests: `test.describe` with `@P0`/`@P1`/`@P2` + `@Smoke`/`@Regression` tags; `test.step()`
  per phase; go through fixtures/modules, never `@pages/` directly.
- No `console.log`, no `page.waitForTimeout()` anywhere in `src/`.

Full standard: [rules/code-standards.md](rules/code-standards.md).

## Path aliases

`@pages/*`, `@modules/*`, `@utils/*`, `@fixtures/*`, `@api/*`, `@config/*`, `@testdata/*` — no
deep relative imports.

## Commands

```bash
npm run build         # tsc type-check
npm run rules:check   # architecture + naming + content gate
npm run lint           # eslint
npx playwright test src/tests/sample.spec.ts --project=chromium --list
```

## Claude Code skills (`.claude/skills/`)

| Skill | Use |
|-------|-----|
| `/setup-framework` | Scaffold or verify this layout in a new repo |
| `/generate-test-cases` | Requirements from module + navigation + stories |
| `/create-md-ticket` | Requirements from Excel/CSV |
| `/playwright-mcp` | Planner → Generator → Healer (MCP-grounded test generation) |
| `/e2e-review` | Review generated tests against architecture + rule engine |

## MCP

- **Playwright MCP** — `.mcp.json`, `npx -y @playwright/mcp@latest`. Confirm with `/mcp`.
- **Chrome MCP** — `claude --chrome` or `/chrome` (Claude in Chrome extension). Use for
  authenticated sessions, live console/network debugging.

Never invent `data-testid`/roles when MCP can read the live page.

## Quality gate before considering work done

```bash
npm run rules:check
npm run build
npm run lint
```
