# CLAUDE.md

Always-loaded instructions for Claude Code working in this repository.

## What this repo is

A Playwright + TypeScript E2E automation framework with a strict layered architecture:

```text
Tests (src/tests/*.spec.ts)
  → Modules (src/modules/*Module.ts)
    → Pages (src/pages/*Page.ts)
```

Never skip a layer: tests call modules/fixtures, modules call pages, pages call Playwright's `Page` API. Full rules: [rules/code-standards.md](rules/code-standards.md).

## Commands

```bash
npm install
npm run build           # type-check
npm run rules:check      # architecture + naming rules (must pass)
npm run lint
npm test                 # full suite
npx playwright test src/tests/sample.spec.ts --project=chromium --list
```

`rules:check` and `build` must both pass before considering a change done.

## Path aliases

`@pages/*`, `@modules/*`, `@utils/*`, `@fixtures/*`, `@api/*`, `@config/*`, `@testdata/*` — all resolve under `src/`. Use them instead of relative `../../` imports.

## Working with tests

- New feature: add a `{Feature}Page.ts` in `src/pages/`, a `{Feature}Module.ts` in `src/modules/`, and a `{feature-kebab}.spec.ts` in `src/tests/`. Keep the `Sample*` starter files as reference/until the first real feature is added.
- Tag every spec with a priority (`@P0`/`@P1`/`@P2`) and a suite (`@Smoke`/`@Regression`), and use `test.step()` per logical action.
- Use Playwright MCP (`.mcp.json`) for locator discovery — prefer accessibility-role locators over CSS/XPath.
- Credentials come from `.env.local` (git-ignored) via `src/config/index.ts` — never hardcode or print secrets.

## Skills

`.claude/skills/` — real directories, discovered at session start:

- `/setup-framework` — scaffold or verify this layout in a new repo
- `/generate-test-cases` — turn stories/navigation into `requirements/{module}.md`
- `/create-md-ticket` — turn an Excel/CSV sheet into `requirements/{module}.md`
- `/playwright-mcp` — Planner → Generator → Healer test-authoring loop (MCP-grounded)
- `/e2e-review` — review generated tests against `rules/code-standards.md`

## MCP

| Server | Source | Role |
|--------|--------|------|
| Playwright MCP | `.mcp.json` | Accessibility snapshots, deterministic locators for generate/heal |
| Chrome (Claude in Chrome) | `claude --chrome` | Live authenticated browser session |

Verify with `/mcp` inside a session.
