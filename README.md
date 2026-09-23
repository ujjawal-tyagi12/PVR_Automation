# PvrProject — Playwright E2E Framework

TypeScript Playwright automation framework with a strict **Pages → Modules → Tests** layering, a rule engine that enforces it, and a Claude Code agent workflow for generating and healing tests.

## Architecture

```text
Tests (src/tests/*.spec.ts)
  → Modules (src/modules/*Module.ts)
    → Pages (src/pages/*Page.ts)
```

Supporting folders: `src/api/`, `src/fixtures/`, `src/utils/`, `src/config/`, `src/testdata/`.

See [rules/code-standards.md](rules/code-standards.md) for the full conventions and [docs/QUICK_REFERENCE.md](docs/QUICK_REFERENCE.md) for a one-page cheat sheet.

## Getting started

```bash
npm install
npx playwright install chromium
cp .env.example .env.local   # then edit BASE_URL + credentials
npm run build
npm run rules:check
npx playwright test src/tests/sample.spec.ts --project=chromium --list
```

## Commands

| Command | Purpose |
|---------|---------|
| `npm test` | Run the full suite |
| `npm run test:chromium` / `test:firefox` / `test:webkit` / `test:mobile` | Run against one project |
| `npm run test:smoke` / `test:regression` / `test:p0` | Run by tag |
| `npm run test:ui` / `test:headed` / `test:debug` | Interactive runs |
| `npm run test:report` | Open the last HTML report |
| `npm run rules:check` | Validate architecture + naming rules |
| `npm run lint` / `format` | Static checks |
| `npm run build` | Type-check the project |

## Claude Code

This repo targets [Claude Code](https://claude.ai/code). Skills live in `.claude/skills/` as real files (no symlinks):

```bash
claude --chrome
```

Then inside the session: `/setup-framework` → `/generate-test-cases` (or `/create-md-ticket`) → `/playwright-mcp` → `/e2e-review`.

See [.claude/README.md](.claude/README.md) for the full colleague workflow and MCP setup.

## Mobile

Base config already ships a `mobile-chrome` Playwright project and `npm run test:mobile`. For Android device / hybrid app automation, see [docs](.claude/skills/setup-framework/references/mobile-addons.md).
