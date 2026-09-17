# PVR Playwright Framework

Playwright + TypeScript E2E automation framework with a strict **Pages → Modules → Tests**
architecture, enforced by a custom rule engine, and wired up for AI-assisted test generation
via Claude Code.

> Replace `BASE_URL` / `API_BASE_URL` below with the real app under test once you customize
> this template — see [Customize project identity](#customize-project-identity).

## Architecture

```text
Tests (src/tests/*.spec.ts)
  → Modules (src/modules/*Module.ts)
    → Pages (src/pages/*Page.ts)
```

Supporting layers: `src/api/` (REST clients), `src/fixtures/` (Playwright test extensions),
`src/utils/` (Logger, WaitHelper, DataGenerator, ApiHelper, reporter), `src/config/`
(env-driven config), `src/testdata/` (static fixtures + types).

See [docs/ARCHITECTURE.html](docs/ARCHITECTURE.html) and
[docs/QUICK_REFERENCE.md](docs/QUICK_REFERENCE.md) for more detail.

## Getting started

```bash
npm install
npx playwright install chromium
cp .env.example .env.local   # fill in BASE_URL, API_BASE_URL, TEST_USERNAME, TEST_PASSWORD
npm run build
npm run rules:check
npm run lint
npx playwright test src/tests/sample.spec.ts --project=chromium --list
```

## Scripts

| Script | Purpose |
|--------|---------|
| `npm test` | Run the full suite (all configured projects) |
| `npm run test:headed` / `test:ui` / `test:debug` | Local debugging modes |
| `npm run test:chromium` / `test:firefox` / `test:webkit` / `test:mobile` | Single-project runs |
| `npm run test:smoke` / `test:regression` / `test:p0` | Tag-filtered runs |
| `npm run test:report` | Open the last HTML report |
| `npm run test:ci` | CI-friendly run (chromium, list+html+json reporters) |
| `npm run lint` / `lint:fix` | ESLint |
| `npm run format` / `format:check` | Prettier |
| `npm run build` | TypeScript type-check |
| `npm run clean` | Remove build/test output folders |
| `npm run rules:check` / `rules:changed` / `rules:staged` | Rule engine gate |
| `npm run agents:init` | Install Playwright browsers + OS deps |

## Customize project identity

| File | Change |
|------|--------|
| `package.json` | `name`, `description`, `author` |
| `README.md` / `CLAUDE.md` | Project title, app under test, URLs |
| `.env.example` / `.env.local` | `BASE_URL`, `API_BASE_URL`, `TEST_USERNAME`, `TEST_PASSWORD` |
| `playwright.config.ts` | Default `baseURL` fallback |
| `src/testdata/*.json` | Target app test data |

Keep the folder layout, path aliases, rule engine structure, and `Sample*` starter pattern
until you add your first real feature (rename `SamplePage.ts` → `{Feature}Page.ts`, etc.).

## Claude Code

This repo ships Claude Code skills under `.claude/skills/`:

```text
/setup-framework       scaffold / verify this layout in a new repo
/generate-test-cases    generate requirements/{module}.md from stories
/create-md-ticket       generate requirements/{module}.md from Excel/CSV
/playwright-mcp         Planner -> Generator -> Healer test generation (MCP-grounded)
/e2e-review             review generated tests against the architecture + rule engine
```

Launch with `claude --chrome` (Playwright MCP comes from `.mcp.json`; Chrome MCP is the
Claude in Chrome extension). See [.claude/README.md](.claude/README.md) and
[CLAUDE.md](CLAUDE.md).

## CI/CD

GitHub Actions workflows live in `.github/workflows/` (`playwright.yml`, `smoke-tests.yml`).
A `Jenkinsfile`, `Dockerfile`, and `docker-compose.yml` are provided for teams running CI
outside GitHub Actions.
