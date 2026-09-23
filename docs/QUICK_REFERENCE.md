# Quick Reference

## Setup

```bash
npm install
npx playwright install chromium
cp .env.example .env.local
```

## Everyday commands

```bash
npm run build            # type-check
npm run rules:check       # architecture + naming rules
npm run lint
npm test                  # full suite (all projects)
npm run test:chromium     # single browser
npm run test:smoke        # @Smoke tagged
npm run test:p0           # @P0 tagged
npm run test:ui           # interactive UI mode
npm run test:report       # open last HTML report
```

## Adding a feature

1. `src/pages/{Feature}Page.ts` — locators + thin actions, `constructor(private page: Page)`.
2. `src/modules/{Feature}Module.ts` — orchestrates the page(s), no `page.locator()`.
3. `src/tests/{feature-kebab}.spec.ts` — tag with `@P0`/`@P1`/`@P2` + `@Smoke`/`@Regression`, use `test.step()`.
4. `npm run rules:check` before committing.

## Path aliases

```text
@pages/*     src/pages/*
@modules/*   src/modules/*
@utils/*     src/utils/*
@fixtures/*  src/fixtures/*
@api/*       src/api/*
@config/*    src/config/*
@testdata/*  src/testdata/*
```

## Claude Code

```bash
claude --chrome
```

`/setup-framework` → `/generate-test-cases` (or `/create-md-ticket`) → `/playwright-mcp` → `/e2e-review`

Full docs: [../rules/code-standards.md](../rules/code-standards.md), [../.claude/README.md](../.claude/README.md).
