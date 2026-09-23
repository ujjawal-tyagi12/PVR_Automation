# Tech Stack Reference

Synced with the current golden template.

## package.json dependencies

```json
{
  "devDependencies": {
    "@playwright/test": "^1.57.0",
    "@types/node": "^25.0.6",
    "dotenv": "^17.2.3",
    "typescript": "^5.9.3"
  }
}
```

ESLint, Prettier, Husky, lint-staged, and commitlint are configured via root config files (`.eslintrc.json`, `.prettierrc`, `.husky/`, `.lintstagedrc`, `commitlint.config.js`).

## package.json scripts (current golden template)

```json
"test", "test:headed", "test:ui", "test:debug",
"test:chromium", "test:firefox", "test:webkit", "test:mobile",
"test:smoke", "test:regression", "test:p0", "test:report", "test:ci",
"lint", "lint:fix", "format", "format:check",
"build", "clean",
"rules:check", "rules:changed", "rules:staged",
"agents:init"
```

Wire `rules:*` to `scripts/rule-engine.js` — see [template-manifest.md](template-manifest.md).

## TypeScript (tsconfig.json highlights)

- `target`: ES2020
- `strict`: true
- `module`: commonjs
- `resolveJsonModule`: true
- `outDir`: `./dist`
- Path aliases:

```json
"@pages/*": ["src/pages/*"],
"@modules/*": ["src/modules/*"],
"@utils/*": ["src/utils/*"],
"@fixtures/*": ["src/fixtures/*"],
"@api/*": ["src/api/*"],
"@config/*": ["src/config/*"],
"@testdata/*": ["src/testdata/*"]
```

## Playwright (playwright.config.ts highlights)

- `testDir`: `./src/tests`
- `timeout`: 60000
- `fullyParallel`: true
- `retries`: 2 in CI, 0 locally
- `workers`: 2 in CI, 3 locally
- Reporters: `CustomTTAReporter`, html, json, list
- Projects: `chromium`, `firefox`, `webkit`, `mobile-chrome` (Pixel 5)
- `use.baseURL` from `process.env.BASE_URL`
- `dotenv.config({ path: '.env.local' })`

## Starter files generated at scaffold

| File | Role |
|------|------|
| `src/pages/SamplePage.ts` | Page object template (arrow locators, actions, assertions) |
| `src/modules/SampleModule.ts` | Module template (orchestrates SamplePage, Logger) |
| `src/tests/sample.spec.ts` | Spec template (tags, test.step, module usage, fixtures) |
| `src/fixtures/index.ts` | Extends Playwright test with samplePage, sampleModule, authenticatedPage |
| `src/fixtures/auth.fixture.ts` | authTest / authenticatedTest with storage state |

## Environment variables (.env.example)

| Variable | Purpose |
|----------|---------|
| `BASE_URL` | App under test (Playwright baseURL) |
| `API_BASE_URL` | REST API root |
| `TEST_USERNAME` | Default login user |
| `TEST_PASSWORD` | Default login password |
| `API_TIMEOUT` | API client timeout ms |
| `LOG_LEVEL` | Logger verbosity |

Loaded in `playwright.config.ts` and `src/config/index.ts` via `.env.local`.

## Rule engine

- Config: `rules/framework-rule-engine.json`
- CLI: `scripts/rule-engine.js`
- NPM: `npm run rules:check`

Validates:

- Placement: `*Page.ts` → `src/pages/`, `*Module.ts` → `src/modules/`, `*.spec.ts` → `src/tests/`
- Naming: PascalCase pages/modules; lowercase kebab specs
- Content: arrow locators in pages; no `page.locator()` in modules; no `@pages/` in specs; tags + `test.step()` in specs

## Claude Code (MCP)

| Piece | Location |
|-------|----------|
| Playwright MCP | `.mcp.json` → `npx -y @playwright/mcp@latest` |
| Chrome MCP | `claude --chrome` / `/chrome` (Claude in Chrome extension) |
| Skills | `.claude/skills/*` (real folders) |
| Settings | `.claude/settings.json` |

## Reports

| Output | Location |
|--------|----------|
| TTA custom HTML | `tta-report/` |
| Playwright HTML | `playwright-report/` |
| JSON results | `test-results/results.json` |
| Traces/videos | `test-results/` on failure |

## Mobile add-on

See [mobile-addons.md](mobile-addons.md). Base template already includes `mobile-chrome` project and `test:mobile` script.
