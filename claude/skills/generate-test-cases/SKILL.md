---
name: generate-test-cases
description: Designs structured test cases from scratch (no Excel required). Asks for navigation, test module, scenarios or user stories, and testing types, then generates positive, negative, and API-parity cases into requirements/{module}.md. Use when creating test cases from user stories, designing coverage for a feature, or when the user mentions generate-test-cases, test design, positive/negative cases, or API parity.
disable-model-invocation: true
---

# Generate Test Cases

Design **project-agnostic** test cases from **module + navigation + scenarios/user stories + testing types**. No spreadsheet required.

**Output:** `requirements/{module-name}.md`  
**Template:** [references/ticket-template.md](references/ticket-template.md)  
**Design rules:** [references/design-heuristics.md](references/design-heuristics.md)  
**Example:** [references/example-generated-ticket.md](references/example-generated-ticket.md)

Works in **Claude Code** and **Cursor**. Copy this skill folder into any project's `.claude/skills/` (or `.cursor/skills/`) to reuse.

**When to use which skill**

| Need | Skill |
|------|--------|
| Already have Excel/CSV cases | `/create-md-ticket` |
| Need to **design** cases from stories/scenarios | `/generate-test-cases` (this skill) |
| Implement approved ticket as Playwright code | `/playwright-mcp` |

---

## Step 0: Intake (ask before designing anything)

When `/generate-test-cases` is invoked, ask **all** of the following in one message. Do not invent answers.

```text
I need a few inputs to design test cases:

1. Test module / feature name
   (e.g. Login, Checkout, Admin Users — used for file name + scenario IDs)

2. Navigation to the module (step-by-step)
   (how a user reaches the screen under test, including auth if needed)

3. Source material — pick one or both:
   a) Scenarios (bullets / acceptance points you already have)
   b) User stories (As a… I want… So that… / PRD excerpts / AC list)

4. Testing types to include (multi-select):
   - Positive (happy path / valid data)
   - Negative (invalid, unauthorized, empty, boundary fail)
   - API parity (UI outcome matches underlying API contract)
   - Smoke only (critical path subset)
   - Regression (broader durable coverage)
   - Edge / boundary (limits, empty lists, max length)
   - Access control / RBAC (role-based allow/deny)
   - Other: ________

5. (Optional) Base URL or environment name
6. (Optional) Frontend repo path for enrichment (default: dev-repo/)
7. (Optional) Known APIs / endpoints / contracts for API parity
8. (Optional) Depth: Smoke | Standard | Complete
```

| Answer | Use |
|--------|-----|
| **Module** | `requirements/{module-kebab}.md`, title, PREFIX acronym |
| **Navigation** | Numbered **Navigation** section (verbatim, cleaned) |
| **Scenarios / stories** | Seed for acceptance criteria + case expansion |
| **Testing types** | Which design packs to apply (see heuristics) |
| **Depth** | How many cases: Smoke = critical only; Standard = balanced; Complete = exhaustive feasible |
| **APIs** | Drive API-parity cases; if missing, ask once more or mark parity Out of scope |
| **Frontend repo** | Enrich routes, `data-testid`, components when present |

Wait for answers. If (3) is empty, stop and ask again — do not invent product behavior.

---

## Step 1: Normalize the seed

1. Turn user stories / bullets into a short **Acceptance criteria** list (behavior only, no implementation).
2. Derive a **PREFIX** (2–4 uppercase letters from module name).
3. Map requested testing types to design packs in [design-heuristics.md](references/design-heuristics.md).
4. If `dev-repo/` (or provided path) exists, skim routes/components/`data-testid` for the module — notes only; do not write the ticket yet.
5. If API parity was selected but no API info was given, ask:

```text
API parity was selected. Provide endpoints, sample responses, or OpenAPI/Swagger path — or say "skip API parity".
```

---

## Step 2: Design cases (generic packs)

For **each** acceptance point / story, generate cases only for the selected types:

### Positive
- Happy path with valid data
- Default UI state / defaults after navigation
- Primary CTA success and confirmation/toast/navigation

### Negative
- Invalid / empty / malformed input
- Unauthorized or wrong-role access (when RBAC selected or implied)
- Cancel / dismiss / back without saving
- Duplicate submit / idempotency where relevant

### API parity
- UI success ↔ API success status + key payload fields reflected in UI
- UI error ↔ API error message/code surfaced correctly
- List/filter/sort UI matches API query params and response set
- Empty API payload ↔ empty UI state

### Edge / boundary (if selected)
- Min/max length, zero results, pagination ends, special characters (safe set)

### Access control (if selected)
- Allowed roles can reach module; denied roles cannot (or see read-only)

**Rules**
- Stay product-agnostic: use the user's module/navigation/stories only — no hardcoded app names.
- Prefer **observable** expected results (UI text, URL, enabled/disabled, row counts, status codes).
- One scenario = one primary assertion theme; do not merge positive + negative into one ID.
- Tag each scenario: `Positive` | `Negative` | `API parity` | `Edge` | `RBAC` (+ `@Smoke` / `@Regression` / `@P0`–`@P2` guidance in notes).

Details: [references/design-heuristics.md](references/design-heuristics.md)

---

## Step 3: Coverage preview — user approval required

Present a preview. **Do not write files until the user approves.**

```markdown
## Coverage preview — {Module Title}

**Module file:** `requirements/{module-kebab}.md`
**Seed:** User stories / scenarios (generated — not Excel)
**Depth:** Smoke | Standard | Complete
**Types:** Positive, Negative, API parity, …
**Navigation:** {short summary}

### Acceptance criteria (draft)
- …

### Scenarios ({count})
- [ ] {PREFIX}-001 — {title} `[Positive]` `[P0]`
- [ ] {PREFIX}-002 — {title} `[Negative]` `[P1]`
- [ ] {PREFIX}-003 — {title} `[API parity]` `[P1]`
- …

### Out of scope
- {item}: {reason}

Reply **approve**, or list adds/removes/changes.
```

Iterate until explicit approval (`approve` / `lgtm` / clear confirmation).

---

## Step 4: Write the ticket

After approval:

1. Create `requirements/` if missing.
2. Write `requirements/{module-kebab}.md` using [ticket-template.md](references/ticket-template.md).
3. Fill every section; mark Source seed method as **Generated (stories/scenarios)**.
4. Suggested paths (framework-agnostic names; adjust if the host repo differs):
   - Spec: `src/tests/{module-kebab}.spec.ts`
   - Module: `src/modules/{Module}Module.ts`
   - Page: `src/pages/{Module}Page.ts`
5. Do **not** write Playwright implementation code unless the user asks — next step is `/playwright-mcp`.

---

## Scenario ID conventions

| Pattern | Example |
|---------|---------|
| Prefix | Acronym from module (`Login` → `LOG`, `Admin Users` → `ADM`) |
| Number | `001`, `002`, … grouped: Positive → Negative → API parity → Edge |
| Line format | `- [ ] **PREFIX-001** — {title} \`[Positive]\` \| Steps: … \| Expected: …` |

---

## Quality gate

- [ ] Intake answered (module, navigation, stories/scenarios, testing types)
- [ ] No invented product behavior beyond user seed + explicit heuristics
- [ ] Positive / Negative / API parity (as selected) each represented when feasible
- [ ] User approved coverage preview
- [ ] One `requirements/{module}.md` written
- [ ] Ticket is reusable: no project-specific hardcoding beyond user-provided facts
- [ ] No automation code unless requested

---

## After seeding

Suggest: `/playwright-mcp` with `requirements/{module-kebab}.md`, then `/e2e-review`.
