---
name: setup-framework
description: Bootstraps a new Playwright TypeScript test project matching this repo's current layout — SamplePage/SampleModule/sample.spec starter, .claude agent layout (skills + settings), Playwright MCP (.mcp.json), Claude in Chrome, rule engine in rules/ and scripts/, fixtures with path aliases, CI, Docker, and docs. Use when creating a similar framework, scaffolding E2E automation, or when the user mentions setup-framework, framework template, web automation, or mobile automation.
disable-model-invocation: true
---

# Setup Playwright Framework

Create a **new repository** that matches the **current golden template** in this project: same files, architecture, `.claude/` agent layout, and starter code.

**Golden template**: the repository where this skill lives. Copy from it unless the user points at another path.

**File inventory**: [references/template-manifest.md](references/template-manifest.md) — **source of truth** for every file to generate/copy.

**Claude Code target:** skills are real files in `.claude/skills/` (no symlinks, no `.cursor/`). Colleagues run `claude --chrome`, then the slash flow `/setup-framework` → env → `/generate-test-cases` (or `/create-md-ticket`) → `/playwright-mcp` → `/e2e-review`. Playwright MCP comes from `.mcp.json`; Chrome MCP is Claude in Chrome (`--chrome`).

---

## Step 0: Ask setup type (mandatory — do this first)

When `/setup-framework` is invoked, **stop and ask** before copying files:

```text
Which setup do you want?

1. Playwright for Web
2. Playwright for Mobile
```

| Choice | Path |
|--------|------|
| **1 — Web** | Copy full manifest → customize → verify |
| **2 — Mobile** | Web setup first, then [mobile add-ons](references/mobile-addons.md) |

---

## Architecture (non-negotiable)

```text
Tests (src/tests/*.spec.ts)
  → Modules (src/modules/*Module.ts)
    → Pages (src/pages/*Page.ts)
```

Supporting: `src/api/`, `src/fixtures/`, `src/utils/`, `src/config/`, `src/testdata/`.

**Starter files shipped in every scaffold** (rename when adding real features):

| Layer | File |
|-------|------|
| Page | `src/pages/SamplePage.ts` |
| Module | `src/modules/SampleModule.ts` |
| Spec | `src/tests/sample.spec.ts` |
| Fixtures | `src/fixtures/index.ts`, `src/fixtures/auth.fixture.ts` |

Fixtures use path aliases: `@pages/*`, `@modules/*`, `@config/*`.

---

## What to replicate (current golden template)

Copy **every path** in [template-manifest.md](references/template-manifest.md). Do not cherry-pick only `src/`.

| Set | Paths |
|-----|-------|
| **Source** | Full `src/` tree (api, config, fixtures, modules, pages, tests, testdata, utils) |
| **Root config** | `playwright.config.ts`, `tsconfig.json`, `package.json`, lint/format/editor files |
| **Rule engine** | `rules/` (rule-engine config + standards), `scripts/rule-engine.js` |
| **Docs** | `docs/` (QUICK_REFERENCE, ARCHITECTURE, `ai-agents/`) |
| **Claude Code** | `.claude/skills/` (5 real skill folders), `.claude/settings.json`, `.claude/README.md`, root `.mcp.json`, `CLAUDE.md` |
| **Git hooks** | `.husky/`, `commitlint.config.js`, `.lintstagedrc` |
| **CI/CD** | `.github/`, `Jenkinsfile`, `Dockerfile`, `docker-compose.yml` |
| **Docs** | `README.md`, `CLAUDE.md`, `mint.json` |
| **Env** | `.env.example`, `.gitignore` |
| **Optional** | `requirements/.gitkeep` (for `/generate-test-cases` / `/create-md-ticket` output) |

### Skills copied with every scaffold

```text
.claude/skills/setup-framework/
.claude/skills/generate-test-cases/
.claude/skills/playwright-mcp/
.claude/skills/create-md-ticket/
.claude/skills/e2e-review/
```

Copy these as **plain directories**. Claude Code discovers `/setup-framework`, `/generate-test-cases`, `/playwright-mcp`, `/create-md-ticket`, `/e2e-review` from them at session start.

---

## Bootstrap workflow

```text
- [ ] 1. Create target directory / confirm empty repo
- [ ] 2. Copy all paths from template-manifest.md (includes .claude/ + .mcp.json)
- [ ] 3. Verify rules:check wiring (scripts/ + rules/ — see manifest)
- [ ] 4. Confirm all five .claude/skills/*/SKILL.md exist as real files
- [ ] 5. Customize project identity
- [ ] 6. npm install
- [ ] 7. npx playwright install chromium
- [ ] 8. cp .env.example .env.local (edit BASE_URL + credentials)
- [ ] 9. npm run clean && npm run build
- [ ] 10. npm run rules:check
- [ ] 11. npm run lint
- [ ] 12. npx playwright test src/tests/sample.spec.ts --project=chromium --list
- [ ] 13. Claude Code: claude --chrome → /mcp confirms playwright; skills under /
```

### Step 2: Copy from template

```bash
rsync -av \
  --exclude node_modules --exclude dist --exclude test-results \
  --exclude playwright-report --exclude tta-report --exclude .env.local \
  --exclude package-lock.json --exclude .DS_Store --exclude .auth \
  /path/to/golden-template/ /path/to/new-project/
```

Run manifest **verify copy completeness** commands after rsync.

### Step 3: Wire rule engine (required)

Update `package.json`:

```json
"rules:check": "node scripts/rule-engine.js --config=rules/framework-rule-engine.json",
"rules:changed": "node scripts/rule-engine.js --config=rules/framework-rule-engine.json --changed",
"rules:staged": "node scripts/rule-engine.js --config=rules/framework-rule-engine.json --staged"
```

### Step 4: Customize project identity

| File | Change |
|------|--------|
| `package.json` | `name`, `description`, `author` |
| `README.md` | Project title, app under test, URLs |
| `CLAUDE.md` | Same; keep commands and architecture |
| `.env.example` / `.env.local` | `BASE_URL`, `API_BASE_URL`, `TEST_USERNAME`, `TEST_PASSWORD` |
| `playwright.config.ts` | Default `baseURL` fallback if needed |
| `src/testdata/*.json` | Target app test data |

**Keep unchanged:** folder layout, path aliases, rule engine structure, layer boundaries, Sample* starter files (until first real feature).

### Step 5–7: Install and env

```bash
cd /path/to/new-project
npm install
npx playwright install chromium
cp .env.example .env.local
```

Both `playwright.config.ts` and `src/config/index.ts` load `.env.local`:

```typescript
dotenv.config({ path: '.env.local' });
```

### Step 8–11: Verify

```bash
npm run clean
npm run build
npm run rules:check
npm run lint
npx playwright test src/tests/sample.spec.ts --project=chromium --list
```

`rules:check` and `build` must pass before setup is complete.

---

## Mobile setup

Web manifest first, then [references/mobile-addons.md](references/mobile-addons.md).

Base template already includes `mobile-chrome` in `playwright.config.ts` and `test:mobile` in `package.json`. Mobile path adds Android device/WebView fixtures and env vars.

---

## Coding rules (summary)

From `rules/code-standards.md` and `rules/framework-rule-engine.json`:

- **Pages**: locator arrow functions; no business logic; `constructor(private page: Page) {}`
- **Modules**: orchestrate pages only; `Logger`; no `page.locator()`
- **Tests**: `test.describe` with `@P0`/`@P1`/`@P2`/`@Smoke`/`@Regression`; `test.step()`; modules/fixtures — no direct `@pages/` imports
- **General**: no `console.log`; no `page.waitForTimeout()`; credentials from config

## Path aliases

```typescript
"@pages/*" → src/pages/*
"@modules/*" → src/modules/*
"@utils/*" → src/utils/*
"@fixtures/*" → src/fixtures/*
"@api/*" → src/api/*
"@config/*" → src/config/*
"@testdata/*" → src/testdata/*
```

## NPM scripts

See [references/tech-stack.md](references/tech-stack.md) for the full current script list including `test:mobile`, `test:ci`, `agents:init`, and `clean`.

---

## After setup

Colleague path (Cursor **or** Claude Code — same skills):

1. Credentials: `.env.local` from `.env.example`
2. Seed requirements: `/generate-test-cases` (from stories) or `/create-md-ticket` (from Excel) → `requirements/{module}.md`
3. Implement tests: `/playwright-mcp` (Planner → Generator → Healer; MCP-grounded)
4. Review output: `/e2e-review`
5. Wire CI secrets for `BASE_URL` and test credentials

**Claude Code launch:** `claude --chrome` (Playwright MCP from `.mcp.json` + Claude in Chrome). See `CLAUDE.md` and `.claude/README.md`.

## Additional resources

- [template-manifest.md](references/template-manifest.md) — complete file list
- [tech-stack.md](references/tech-stack.md) — versions, scripts, env vars
- [mobile-addons.md](references/mobile-addons.md) — mobile delta
- [../playwright-mcp/SKILL.md](../playwright-mcp/SKILL.md) — implementation workflow
