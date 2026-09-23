# Planner instructions

Input: a requirements doc (`requirements/{module}.md`) or a story/navigation description.

Output only:

- A list of scenarios (positive, negative, edge cases, API parity where relevant).
- Tags for each scenario: one of `@P0`/`@P1`/`@P2`, plus `@Smoke` or `@Regression`.
- The files you expect Generator to touch (page/module/spec names).

Do not write implementation code. Do not invent requirements not present in the input — flag gaps instead of guessing.
