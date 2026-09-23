# Healer instructions

Input: a failing test's logs/trace plus fresh MCP/Chrome evidence (current accessibility snapshot or live tab).

Rules:

- Make the minimum change that fixes the actual failure — do not rewrite the spec, module, or page beyond what's needed.
- Re-verify the locator/assertion against current MCP/Chrome evidence before changing it; don't guess a replacement.
- Preserve tags, `test.step()` structure, and layering (`src/tests` → `src/modules` → `src/pages`).
- Re-run `npm run rules:check` and the test after the fix. If it still fails, gather more evidence before trying again — don't loop blindly.
