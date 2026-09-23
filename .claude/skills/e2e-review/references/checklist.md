# E2E Review Checklist

Review code produced by `/playwright-mcp` (Generator/Healer) against this checklist. Score each section **Pass**, **Partial**, or **Fail** with file paths and concrete fixes.

Run automated gate first:

```bash
npm run rules:check
npm run build
```

Include rule-engine failures in the review output.

---

## 1. Architecture (Pages → Modules → Tests)

Reference: [playwright-mcp/references/rules.md](../../playwright-mcp/references/rules.md)

| Check | Pass | Fail signal |
|-------|------|-------------|
| Tests call modules/fixtures only | No `@pages/` imports in `src/tests/*.spec.ts` | Direct `LoginPage`, `@pages/*`, or `page.locator()` in specs |
| Modules orchestrate pages | Module uses `this.loginPage.fillUsername()` | `page.locator()`, `getByRole()` inside `*Module.ts` |
| Pages hold locators + simple actions | Arrow-function locators; no `if`/`switch` | Business logic, conditionals, cross-page calls in `*Page.ts` |
| Layer not skipped | Test → Module → Page chain visible | Test imports and uses Page directly |
| Fixtures used | `authenticatedPage`, module fixtures from `src/fixtures/` | Duplicate `new XPage(page)` in every test |
| Utils for shared infra | Waits/logging in `src/utils/` | Ad-hoc helpers duplicated across modules |

**Partial:** Minor violation in one file with clear fix (e.g. one stray locator in module).

---

## 2. Naming & placement

Reference: `rules/framework-rule-engine.json`

| Layer | File pattern | Folder |
|-------|--------------|--------|
| Page | `{Feature}Page.ts` (PascalCase) | `src/pages/` |
| Module | `{Feature}Module.ts` or `*Modal.ts` | `src/modules/` |
| Spec | `{feature-kebab}.spec.ts` (lowercase, hyphens) | `src/tests/` |
| Utility | PascalCase `*Helper.ts`, `Logger.ts`, etc. | `src/utils/` |

| Check | Pass | Fail signal |
|-------|------|-------------|
| File in correct folder | Matches `mustBeUnder` rules | `LoginPage.ts` under `src/modules/` |
| Spec naming | `login.spec.ts`, `dashboard-view-toggle.spec.ts` | `Login.spec.ts`, `login_test.ts` |
| Describe tags | `@P0` / `@P1` / `@P2` / `@Smoke` / `@Regression` in `test.describe` title | Missing priority or suite tag |
| Path aliases | `@pages/`, `@modules/`, `@utils/` | Deep relative imports `../../pages/` |
| Exports | Named exports; `index.ts` barrels where repo uses them | Default export on page/module classes |

---

## 3. Locator strategy (page object layer only)

Apply priority **top to bottom**. Flag when a lower tier is used and a higher tier is available in the DOM/requirements ticket.

| Priority | Strategy | Examples |
|----------|----------|----------|
| **a** | `data-testid` / `data-testvalue` | `getByTestId('submit')`, `[data-testid="login-modal"]` |
| **b** | `id`, `name` | `#username`, `input[name="email"]` |
| **c** | Playwright locators | `getByRole('button', { name: 'Submit' })`, `getByLabel`, `getByPlaceholder`, `getByText` (prefer role/label over raw text) |
| **d** | CSS selectors | `.btn-primary`, `[type="submit"]` |
| **e** | XPath | `xpath=...`, `//div[@class=...]` — last resort |

| Check | Pass | Fail signal |
|-------|------|-------------|
| Locators are arrow functions | `submitBtn = () => this.page.getByTestId('x')` | Property locators or inline locators in actions |
| Highest viable priority | testid/role used when ticket or DOM provides them | XPath for elements with stable `data-testid` |
| No locators outside pages | — | Locators in modules or specs |
| Stable selectors | Role + name, test ids | Brittle CSS (nth-child, deep hierarchy) or long XPath |
| No banned patterns | — | `page.waitForTimeout()`, `console.log` |

**Partial:** Mixed quality (e.g. testid on primary actions but CSS for secondary labels when `getByLabel` fits).

---

## 4. File & method length (industry norms)

| Artifact | Target | Warn (Partial) | Fail |
|----------|--------|----------------|------|
| `*Page.ts` | ≤ 200 lines | 201–280 | > 280 |
| `*Module.ts` | ≤ 150 lines | 151–220 | > 220 |
| `*.spec.ts` | ≤ 150 lines | 151–220 | > 220 |
| Single method | ≤ 20 lines | 21–35 | > 35 |

| Check | Pass | Fail signal |
|-------|------|-------------|
| Single responsibility | One page/feature per file | God page with login + checkout + profile |
| Spec readability | Scenarios grouped; steps delegated to module | 100+ line test with inline UI clicks |
| Split recommendation | — | Suggest `{Feature}Page.ts` + `{Feature}SectionPage.ts` or extract module workflows |

Count lines with `wc -l` on changed files during diff review.

---

## 5. Test quality (spec layer)

| Check | Pass | Fail signal |
|-------|------|-------------|
| `test.describe()` grouping | Feature + tags in title | Flat tests with no describe |
| `test.step()` | Key flows wrapped | No steps in multi-step scenarios |
| Data & config | `config`, `testdata`, env | Hardcoded URLs/passwords in spec |
| Assertions | In page/module or clear `expect` in spec | Excessive assertion noise in spec |
| Cleanup | `afterEach` / fixture teardown when needed | Leaked state between tests |

---

## 6. Requirement alignment (when ticket exists)

If `requirements/{module}.md` exists from `/create-md-ticket`:

| Check | Pass | Fail signal |
|-------|------|-------------|
| Scenario IDs covered | Specs map to PREFIX-00x scenarios | Missing approved scenarios |
| Navigation matches ticket | Same auth/path steps | Skipped MFA or wrong entry route |
| Out of scope respected | No extra flows | Tests for excluded features |

---

## Output format

```markdown
# E2E Review — {scope}

**Scope:** {files or `origin/base...HEAD`}
**Rule engine:** Pass | Fail ({n} violations)

## Summary
| Section | Result |
|---------|--------|
| 1. Architecture | Pass / Partial / Fail |
| 2. Naming | … |
| 3. Locators | … |
| 4. File length | … |
| 5. Test quality | … |
| 6. Requirement alignment | N/A / … |

## Findings (priority order)
### 🔴 Fail — must fix
- `path/to/file.ts:line` — issue — suggested fix

### 🟡 Partial — should fix
- …

### 🟢 Pass — notes
- …

## Commands run
- `npm run rules:check`
- `npm run build`
```

Prioritize **risks and checklist gaps** over repeating the full diff.
