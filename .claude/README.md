# Claude Code setup (this repo)

This framework targets **Claude Code**. Skills are real files (no symlinks, no `.cursor/` dependency):

```text
.claude/
├── README.md
├── settings.json
└── skills/
    ├── setup-framework/
    ├── generate-test-cases/
    ├── playwright-mcp/
    ├── create-md-ticket/
    └── e2e-review/
```

Supporting folders live at the repo root: `rules/`, `scripts/`, `docs/`.

## Colleague flow

```bash
# 1. Install Claude Code (once per machine)
curl -fsSL https://claude.ai/install.sh | bash
# ensure ~/.local/bin is on PATH, then:
claude --chrome
```

Inside the session:

1. `/setup-framework` — scaffold / verify layout (or skip if already in a cloned project)
2. Put credentials in `.env.local` (from `.env.example`) — do not paste secrets into chat
3. Seed requirements:
   - `/generate-test-cases` — from module + navigation + stories (positive / negative / API parity)
   - `/create-md-ticket` — from Excel/CSV → `requirements/{module}.md`
4. `/playwright-mcp` — Planner → Generator → Healer (uses **Playwright MCP** + **Chrome**)
5. `/e2e-review`

## MCP

| Server | How | Role |
|--------|-----|------|
| **Playwright MCP** | Project `.mcp.json` (`@playwright/mcp`) | Accessibility snapshots, deterministic browser tools for generate/heal |
| **Chrome (claude-in-chrome)** | `claude --chrome` or `/chrome` | Live Chrome tab, console/network, authenticated sessions |

Verify: `/mcp` inside Claude Code. Install the [Claude in Chrome](https://chromewebstore.google.com/detail/claude/fcoeoabgfenejglbffodgkkbkcdhcgfn) extension if prompted.

## Quality gate

```bash
npm run rules:check    # scripts/rule-engine.js + rules/framework-rule-engine.json
npm run build
```
