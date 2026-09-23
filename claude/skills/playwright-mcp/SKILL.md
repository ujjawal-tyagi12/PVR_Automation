---
name: playwright-mcp
description: Teach and implement Playwright AI agent workflows (Planner, Generator, Healer) with MCP and repository guardrails. Use when preparing workshops, generating Playwright tests with architecture constraints, or enforcing deterministic code generation through a rule engine.
---

# Playwright AI MCP Tutor Skill

Use this skill to teach or execute AI-assisted test automation in this repository.

Skill files live in `.claude/skills/playwright-mcp/` and load automatically in Claude Code.

## Claude Code prerequisites (browser grounding)

Before Planner/Generator/Healer work that needs live UI:

1. **Playwright MCP** — project `.mcp.json` ships `@playwright/mcp`. Confirm with `/mcp`.
2. **Chrome MCP (Claude in Chrome)** — start with `claude --chrome` (or `/chrome` → enable). Install the Chrome extension if prompted.
3. Credentials live in `.env.local` (user-edited from `.env.example`). Do not print secrets.

Use Playwright MCP for accessibility snapshots and locator discovery. Use Claude in Chrome when you need the user’s real Chrome session, console, or network (auth-heavy apps).

Details: [references/mcp-claude-code.md](references/mcp-claude-code.md).

## Core Workflow

1. Read architecture constraints from `references/rules.md`.
2. Ask Planner to output scenarios, tags, and impacted files only (input: `requirements/{module}.md` when present).
3. Ask Generator to write code only in approved folders. Prefer MCP-grounded locators over guessed selectors.
4. Run `npm run rules:check` and relevant tests.
5. If failing, ask Healer to patch minimal code using logs/traces **and** MCP/Chrome evidence.
6. Re-run rule engine and tests.
7. On a successful run, publish `playwright-report/index.html` with the Artifact tool and share the resulting link with the user.

## Required Constraints

- Keep `Pages -> Modules -> Tests` layering.
- Place page objects in `src/pages`.
- Place module/modal workflow code in `src/modules`.
- Place utility code in `src/utils`.
- Keep direct locators out of modules.

## Use Prompt Templates

Load `references/prompts.md` and reuse prompts with repository-specific inputs.

## Teaching Sequence

1. Explain the three-agent model.
2. Demonstrate MCP browser grounding (Playwright MCP + Chrome on Claude Code).
3. Run a live generate -> validate -> heal loop.
4. Make students pass `rules:check` before grading.
