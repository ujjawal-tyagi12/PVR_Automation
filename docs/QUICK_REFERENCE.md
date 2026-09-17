# Quick Reference

## Setup

```bash
npm install
npx playwright install chromium
cp .env.example .env.local
npm run build && npm run rules:check && npm run lint
```

## Everyday commands

| Task | Command |
|------|---------|
| Run everything | `npm test` |
| Run one spec | `npx playwright test src/tests/sample.spec.ts` |
| Headed / UI mode | `npm run test:headed` / `npm run test:ui` |
| Debug | `npm run test:debug` |
| Smoke only | `npm run test:smoke` |
| Show last report | `npm run test:report` |
| Architecture gate | `npm run rules:check` |
| Type-check | `npm run build` |

## Adding a feature

1. `src/pages/{Feature}Page.ts` — locators + simple actions.
2. `src/modules/{Feature}Module.ts` — orchestrates the page(s).
3. `src/fixtures/index.ts` — add a fixture if the module needs one.
4. `src/tests/{feature-kebab}.spec.ts` — `test.describe` with tags, `test.step()` per phase.
5. `npm run rules:check && npm run build && npm test`.

## Tags

`@P0` `@P1` `@P2` — priority. `@Smoke` `@Regression` — suite. Combine in the
`test.describe` title, e.g. `test.describe('Checkout @P0 @Regression', ...)`.

## Path aliases

`@pages/*` `@modules/*` `@utils/*` `@fixtures/*` `@api/*` `@config/*` `@testdata/*`

## Claude Code flow

`/setup-framework` → `/generate-test-cases` or `/create-md-ticket` → `/playwright-mcp` →
`/e2e-review`. Details: [ai-agents/index.mdx](ai-agents/index.mdx).
