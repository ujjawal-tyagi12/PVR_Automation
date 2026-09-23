# MCP for Claude Code (this repo)

## Playwright MCP

Committed at repo root as `.mcp.json`:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"]
    }
  }
}
```

- Shared with the team via git.
- Inside Claude Code: `/mcp` → confirm `playwright` is connected.
- Use for navigation, snapshots, and selector discovery while generating Page objects.

Optional hardening flags (add to `args` when needed): `--browser=chrome`, `--storage-state=.auth/session.json`, `--headed`.

## Chrome MCP (Claude in Chrome)

Not configured in `.mcp.json`. It is Claude Code’s built-in **claude-in-chrome** integration:

```bash
claude --chrome
```

Or inside a session: `/chrome` → Enabled / reconnect extension.

Requires:

- Chromium browser (Chrome/Edge/etc.)
- [Claude in Chrome](https://chromewebstore.google.com/detail/claude/fcoeoabgfenejglbffodgkkbkcdhcgfn) extension
- Claude Pro/Max/Team/Enterprise login (not API-key-only sessions)

Use when:

- App needs a real logged-in Chrome profile
- Debugging console errors / network that caused flaky E2E
- Verifying Healer fixes against the live UI

## Agent usage rules

| Phase | Prefer |
|-------|--------|
| Planner | Ticket + optional MCP explore of routes |
| Generator | Playwright MCP snapshots → Page locators |
| Healer | Failure logs/trace first; then Playwright MCP or Chrome to confirm |

Never invent `data-testid` / roles when MCP can read the page.
