# Template Manifest

Copy these paths from the golden template repository when bootstrapping a new project.

**Last synced with golden template:** current repo state (Sample* starter, `.claude/` agent layout, root `rules/` + `scripts/` + `docs/`, Claude Code `.mcp.json`).

---

## Source code (`src/`)

```text
src/
├── api/
│   ├── AuthApi.ts
│   ├── OrderApi.ts
│   ├── ProductApi.ts
│   └── index.ts
├── config/
│   └── index.ts
├── fixtures/
│   ├── auth.fixture.ts          # authTest, authenticatedTest; uses @pages, @config
│   └── index.ts                 # test, expect; samplePage, sampleModule, authenticatedPage
├── modules/
│   ├── SampleModule.ts          # starter module (login/home flows)
│   └── index.ts                 # export { SampleModule }
├── pages/
│   ├── SamplePage.ts            # starter page object (locators + actions)
│   └── index.ts                 # export { SamplePage }
├── tests/
│   └── sample.spec.ts           # starter spec (@P0/@P1/@Smoke/@Regression tags)
├── testdata/
│   ├── products.json
│   ├── types.ts
│   └── users.json
└── utils/
    ├── ApiHelper.ts
    ├── CustomTTAReporter.ts
    ├── DataGenerator.ts
    ├── Logger.ts
    ├── WaitHelper.ts
    └── index.ts
```

### Starter pattern (copy as-is, rename when adding features)

| Layer | Starter file | Replace with |
|-------|--------------|--------------|
| Page | `SamplePage.ts` | `{Feature}Page.ts` |
| Module | `SampleModule.ts` | `{Feature}Module.ts` |
| Spec | `sample.spec.ts` | `{feature-kebab}.spec.ts` |

Fixtures import via path aliases: `@pages/*`, `@modules/*`, `@config/*`.

---

## Root configuration

```text
playwright.config.ts
tsconfig.json
package.json
.env.example
.gitignore
.editorconfig
.eslintrc.json
.eslintignore
.prettierrc
.prettierignore
.lintstagedrc
.dockerignore
commitlint.config.js
README.md
CLAUDE.md
mint.json
.mcp.json                 # Claude Code: Playwright MCP (@playwright/mcp)
```

---

## Rule engine, docs (repo root)

```text
rules/
├── framework-rule-engine.json
├── code-standards.md
└── framework-rules.md

scripts/
└── rule-engine.js

docs/
├── QUICK_REFERENCE.md
├── ARCHITECTURE.html
├── images/
└── ai-agents/
    ├── index.mdx
    ├── class-plan.mdx
    ├── planner-healer-generator.mdx
    ├── mcp-without-hallucination.mdx
    ├── rule-engine.mdx
    ├── skills-and-prompts.mdx
    └── 10-slide-class-deck.mdx
```

---

## Claude Code layout (`.claude/` + MCP)

Skills are **real directories** — no symlinks, no `.cursor/` dependency.

```text
.claude/
├── README.md
├── settings.json          # team permissions + enable project MCP
└── skills/
    ├── setup-framework/
    │   ├── SKILL.md
    │   └── references/
    ├── generate-test-cases/
    │   ├── SKILL.md
    │   └── references/
    ├── playwright-mcp/
    │   ├── SKILL.md
    │   ├── agents/
    │   └── references/
    ├── create-md-ticket/
    │   ├── SKILL.md
    │   └── references/
    └── e2e-review/
        ├── SKILL.md
        └── references/

.mcp.json                  # Playwright MCP server for Claude Code
CLAUDE.md                  # always-loaded project instructions
```

**Chrome MCP (Claude in Chrome):** not in `.mcp.json`. Colleagues run `claude --chrome` (or `/chrome`). Documented in `.claude/README.md` and `playwright-mcp/references/mcp-claude-code.md`.

Copy `.claude/` recursively (`rsync -av`, `cp -R`). Do not convert skill folders into symlinks — a missing target silently disables the skill.

---

## Requirements output folder (optional at scaffold)

```text
requirements/
└── .gitkeep
```

---

## Git hooks

```text
.husky/
├── pre-commit
└── commit-msg
```

---

## CI/CD and containers

```text
.github/
├── copilot-instructions.md
├── workflows/
│   ├── playwright.yml
│   └── smoke-tests.yml
└── instructions/
    ├── generator.instructions.md
    ├── planner.instructions.md
    └── healer.instructions.md

Jenkinsfile
Dockerfile
docker-compose.yml
```

---

## Wire rule engine after copy (required)

The rule engine lives at the repo root. `package.json` scripts should read:

```json
"rules:check": "node scripts/rule-engine.js --config=rules/framework-rule-engine.json",
"rules:changed": "node scripts/rule-engine.js --config=rules/framework-rule-engine.json --changed",
"rules:staged": "node scripts/rule-engine.js --config=rules/framework-rule-engine.json --staged"
```

---

## Exclude from copy (regenerate locally)

```text
node_modules/
dist/
test-results/
playwright-report/
tta-report/
.env.local
package-lock.json
.DS_Store
.auth/
```

---

## Verify copy completeness

```bash
test -f src/pages/SamplePage.ts
test -f src/modules/SampleModule.ts
test -f src/tests/sample.spec.ts
test -f src/fixtures/index.ts
test -f rules/framework-rule-engine.json
test -f scripts/rule-engine.js
test -f CLAUDE.md
test -f .mcp.json
test -f .claude/settings.json
test -f .claude/README.md
test -f .claude/skills/playwright-mcp/SKILL.md
test -f .claude/skills/setup-framework/SKILL.md
test -f .claude/skills/generate-test-cases/SKILL.md
test -f .claude/skills/create-md-ticket/SKILL.md
test -f .claude/skills/e2e-review/SKILL.md
```
