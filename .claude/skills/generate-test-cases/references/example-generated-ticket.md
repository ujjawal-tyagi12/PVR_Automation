# Playwright: Notifications — Mark as read (example)

> Illustrative only. Replace with real module inputs from intake.

## Acceptance criteria

- Authenticated user can open Notifications from the main nav.
- Unread items show an unread indicator.
- Marking one item as read clears its indicator and decrements the badge.
- Mark-all-as-read clears all indicators when the API succeeds.

## Navigation

1. Go to the app login page.
2. Sign in with a valid user.
3. Complete MFA if prompted.
4. Click **Notifications** in the main navigation.
5. Land on the Notifications list.

## Test coverage

- **Scope:** Standard — happy path, main negatives, list/mark API parity
- **Types included:** Positive, Negative, API parity
- **Scenarios included:** 7
- **Out of scope:** Push-notification device permissions (mobile OS); email digests

## Scenarios

- **Suggested journey:** `src/tests/notifications.spec.ts`
- **Seed:** Generated from user stories / scenarios

### Positive

- [ ] **NTF-001** — Open notifications list `[Positive]` | Steps: login → open Notifications | Expected: list visible; page title Notifications
- [ ] **NTF-002** — Mark single unread as read `[Positive]` | Steps: open list → choose one unread → Mark as read | Expected: indicator cleared; badge decremented by 1
- [ ] **NTF-003** — Mark all as read `[Positive]` | Steps: open list with ≥2 unread → Mark all as read | Expected: no unread indicators; badge 0 or hidden

### Negative

- [ ] **NTF-010** — Guest cannot open notifications `[Negative]` `[RBAC]` | Steps: open Notifications URL while logged out | Expected: redirect to login; no list rendered
- [ ] **NTF-011** — Mark as read on already-read item is idempotent `[Negative]` | Steps: mark a read item again | Expected: no error toast; counts unchanged

### API parity

- [ ] **NTF-020** — List UI matches GET notifications `[API parity]` | Steps: open list; compare visible items to GET `/notifications` | Expected: same ids/titles/read flags as response
- [ ] **NTF-021** — Mark read UI matches PATCH success `[API parity]` | Steps: mark one unread; observe UI and PATCH `/notifications/{id}` | Expected: `2xx`; UI read flag matches response body

## E2E implementation notes

- **Layering:** `src/tests/notifications.spec.ts` → `src/modules/NotificationsModule.ts` → `src/pages/NotificationsPage.ts`
- **Frontend context:** Not provided.
- **APIs:** `GET /notifications`, `PATCH /notifications/{id}`, `POST /notifications/mark-all-read` (example)
- **Tags:** `@P0` NTF-001/002/010; `@P1` NTF-003/020/021; `@P2` NTF-011; all `@Regression`
- **Run:** `npx playwright test src/tests/notifications.spec.ts --project=chromium`

## Source

- **Seed method:** Generated (stories/scenarios)
- **Module:** Notifications
- **Testing types:** Positive, Negative, API parity
- **Depth:** Standard
- **User stories / scenarios provided:** yes — summarized in Acceptance criteria
- **Frontend repo:** not provided
- **API contract:** example endpoints in notes
