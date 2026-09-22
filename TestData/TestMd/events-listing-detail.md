# Playwright: Events Listing & Detail Page (Web)

## Source

PVR INOX Regression Pack (App/Website/Msite), module "Events Listing & Detail Page", the 5 rows
tagged `App/Web/Msite` (`APP-101`–`APP-105`).

## Acceptance criteria

Active events list with poster/name/date/venue; detail page shows pricing and Book Now; booking
mirrors the movie flow; empty and sold-out/expired states are handled cleanly.

## Navigation

No dedicated `/events` route exists (confirmed: both `/events` and `/experiences/events`
dead-end at the real 404 page). Events are reachable only via the header Search dialog's
"Movies/Events" tab. Grounded via direct probe (2026-09-22): confirmed real and reachable, but
no live event was consistently listed across probes at grounding time (a real, live-data state).

## Test coverage

- **Scope:** Partial — the reachable control is confirmed real; content-dependent cases have no
  reachable live target within budget and are adapted honestly.
- **Sheet rows included:** 5 (`APP-101`–`APP-105`).

## Scenarios

- **Suggested journey:** `src/tests/events-listing-detail.spec.ts`
- **Source:** PVR INOX Regression Pack (App/Website/Msite)

- [ ] **APP-101** — Real Events tab (Search dialog's Movies/Events tab) is reachable (adapted:
  no live event is currently listed)
- [ ] **APP-102** — Adapted: no live event exists to open a detail page for
- [ ] **APP-103** — Adapted: no live event exists to test the booking flow against
- [ ] **APP-104** — Real empty-state: confirms the current no-events state is exactly what this
  case describes, since no city currently shows a live event
- [ ] **APP-105** — Adapted: no live sold-out/expired event exists to test against
