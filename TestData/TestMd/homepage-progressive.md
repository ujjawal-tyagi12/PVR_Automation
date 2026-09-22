# Playwright: Homepage (Progressive) (Web)

## Source

PVR INOX Regression Pack (App/Website/Msite), module "Homepage (Progressive)", the 7 rows
tagged `App/Web/Msite` (`APP-089`–`APP-095`).

## Acceptance criteria

Homepage loads progressively without blocking; banners/trending rotate; content is
personalized and city-specific; admin can reorder modules; guests see public content with
login-gated prompts.

## Navigation

The real homepage. Grounded via direct probe (2026-09-22): no `<h1>` banner heading exists, so
rotation-timing checks aren't stably groundable within a reasonable time budget. Guest access to
the account menu shows a real "Login or signup to continue" prompt.

## Test coverage

- **Scope:** Partial — structural/reachable pieces are covered; rotation-timing and admin-
  config-dependent cases are adapted.
- **Sheet rows included:** 7 (`APP-089`–`APP-095`).

## Scenarios

- **Suggested journey:** `src/tests/homepage-progressive.spec.ts`
- **Source:** PVR INOX Regression Pack (App/Website/Msite)

- [ ] **APP-089** — Real progressive load: multiple homepage sections (banner, nav) render
- [ ] **APP-090** — Adapted: the configured auto-rotation interval (Global Configuration) isn't
  reachable, and no stable banner-heading element exists to observe rotation against within
  budget
- [ ] **APP-091** — Adapted: same constraint as APP-090, applied to the Trending Movies section
- [ ] **APP-092** — Adapted: no confirmed booking history exists on TEST_PHONE to verify
  personalization against, and no admin access to configure/verify the recommendation logic
- [ ] **APP-093** — Real city-specific content update (composes the already-proven
  `CitySelectionModule`)
- [ ] **APP-094** — Adapted: no admin access exists to reorder/toggle a homepage module first
- [ ] **APP-095** — Real guest view shows a login-gated prompt ("Login or signup to continue")
  on the account menu
