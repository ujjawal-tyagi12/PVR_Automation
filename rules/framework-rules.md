# Framework Rules — Reference

Machine-readable source of truth: [`framework-rule-engine.json`](./framework-rule-engine.json).
Human-readable coding conventions: [`code-standards.md`](./code-standards.md).

## Rule IDs

| ID | Checks |
|----|--------|
| `placement-page` | `*Page.ts` lives under `src/pages/` |
| `placement-module` | `*Module.ts` lives under `src/modules/` |
| `placement-spec` | `*.spec.ts` lives under `src/tests/` |
| `naming-page-pascal` | Page files are PascalCase + `Page.ts` |
| `naming-module-pascal` | Module files are PascalCase + `Module.ts` |
| `naming-spec-kebab` | Spec files are kebab-case + `.spec.ts` |
| `content-page-constructor` | Pages take `constructor(private page: Page)` |
| `content-module-no-locator` | Modules never call `page.locator()` |
| `content-spec-no-page-import` | Specs never `import ... from '@pages/...'` |
| `content-spec-tags` | Specs carry a `@P0`/`@P1`/`@P2`/`@Smoke`/`@Regression` tag |
| `content-spec-test-step` | Specs use `test.step(...)` |
| `general-no-console` | No `console.log` in `src/` |
| `general-no-wait-for-timeout` | No `page.waitForTimeout()` in `src/` |

## Running the checks

```bash
npm run rules:check     # full src/ tree
npm run rules:changed   # files changed vs HEAD (falls back to full scan outside git)
npm run rules:staged    # staged files only (used by the pre-commit hook)
```

Exit code is non-zero when any rule fails, so CI and `.husky/pre-commit` both gate on it.

## Editing rules

Add or adjust entries in `framework-rule-engine.json`. Each rule supports:

- `match` / `excludeMatch` — glob against the repo-relative path (`*` = one path segment, `**` = any depth).
- `requireDir` — the file's directory must equal this exact path.
- `namingPattern` — regex the basename must match.
- `requirePatterns` / `forbidPatterns` — regexes tested against file content.

Keep `code-standards.md` in sync when you change a rule's intent.
