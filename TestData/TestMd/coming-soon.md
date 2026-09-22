# Playwright: Coming Soon (Web)

## Source

PVR INOX Regression Pack (App/Website/Msite), module "Coming Soon", the 5 rows tagged
`App/Web/Msite` (`APP-084`–`APP-088`).

## Acceptance criteria

Coming Soon movies list with poster/title/release date; detail page shows synopsis/cast/
trailer/Notify Me; notifications trigger on release; movies transition to Now Showing per admin
config; an advance-booking flash message displays.

## Navigation

Real control: the homepage movie-listing tab row's "Coming Soon" button (alongside Now Showing,
Experiences, Trailers, Offers, Food, Curated Shows). Grounded via direct probe (2026-09-22):
clicking it across several attempts never produced an observably different movie list from "Now
Showing" — Mumbai has no Coming Soon titles configured at grounding time (a real data state).

## Test coverage

- **Scope:** Partial — the tab control itself is confirmed real and reachable; content-
  dependent cases have no reachable live target and are adapted honestly rather than built
  against unverified/guessed behavior.
- **Sheet rows included:** 5 (`APP-084`–`APP-088`).

## Scenarios

- **Suggested journey:** `src/tests/coming-soon.spec.ts`
- **Source:** PVR INOX Regression Pack (App/Website/Msite)

- [ ] **APP-084** — Real Coming Soon tab control exists (adapted: no Coming Soon titles are
  currently live to list, per the data state confirmed above)
- [ ] **APP-085** — Adapted: no live Coming Soon movie exists to open a detail page for
- [ ] **APP-086** — Adapted: no live Coming Soon movie exists to test Notify Me against, and
  notification-log validation needs admin access this project doesn't have
- [ ] **APP-087** — Adapted: the Now Showing transition threshold (Admin > Global
  Configuration) isn't reachable without admin access
- [ ] **APP-088** — Adapted: the configured flash-message text/duration (Global Configuration)
  isn't reachable without admin access, and no live Coming Soon movie exists to view it on
