# Playwright: Dashboard — Grid vs list view toggle + localStorage persistence

## Acceptance criteria

- The dashboard exposes a **grid / list view toggle** on the main dashboard surface after authentication.
- Selecting **Grid view** shows team content in **card/grid** layout (team cards; no list table as the primary team layout).
- Selecting **List view** shows team content with the **list table** (`dashboard-list-view-table`).
- The chosen view mode is written to **localStorage** under key `xdd-dashboard-view` and restored on **page reload**.
- Invalid or missing stored values **default to grid**.
- Navigating away from the dashboard and returning via **browser back** preserves the last selected view mode.

## Navigation

1. Sign in with E2E credentials (email/password).
2. Complete MFA (OTP).
3. Land on the dashboard (`/`).
4. Interact with the view toggle (`data-testid="dashboard-view-toggle"`) using **Grid view / List view** (`aria-label`).

## Test coverage

- **Scope:** Regression — positive, negative, and edge cases
- **Out of scope:** Search bar behavior, team filter dropdown, team card navigation to team detail, create-team dialog, and role/permission matrix beyond the default E2E user.

## Scenarios

- **Suggested journey:** `src/tests/dashboard-view-toggle.spec.ts`

- [ ] **DVT-001** — Dashboard shows view toggle after login/MFA
- [ ] **DVT-002** — Dashboard defaults to grid view with fresh storage
- [ ] **DVT-003** — List view shows list table and hides grid cards
- [ ] **DVT-004** — Grid view shows cards and hides list table
- [ ] **DVT-005** — Toggle updates UI without page reload
- [ ] **DVT-006** — Reload preserves list view
- [ ] **DVT-007** — Reload preserves grid view
- [ ] **DVT-008** — Invalid localStorage value falls back to grid
- [ ] **DVT-009** — Browser back to dashboard preserves last view mode
- [ ] **DVT-010** — Mocked teams/assets still render in both views

## E2E implementation notes

- **Layering:** `src/tests/dashboard-view-toggle.spec.ts` → `src/modules/DashboardViewToggleModule.ts` → `src/pages/DashboardPage.ts`; constants/selectors in page object arrow functions.
- **Reuse:** Reuse dashboard page object locators; grid assertions via dynamic id pattern `team-card-{teamId}` from `DashboardTeamCard`.
- **Locators:** Toggle container `dashboard-view-toggle`; use `getByRole('button', { name: 'Grid view' })` / `List view` — no new production `data-testid` required for v1.
- **Persistence:** Assert `localStorage` key `xdd-dashboard-view`; **DVT-008** via `page.addInitScript` or `evaluate` before navigation.
- **Fixtures / mocks:** **DVT-010** — extend fixtures in `src/fixtures/` and API mocks in `src/api/` following existing dashboard E2E patterns.
- **Tags:** `@Regression`, `@P1`; use project `chromium` per repo conventions.
- **Run:** `npx playwright test src/tests/dashboard-view-toggle.spec.ts --project=chromium`

## Source

- **Seed method:** Screenshots
- **Reference:** `references/screenshots/Screenshot_2026-06-02_at_10.36.42_PM-d6cf9800-8d4c-41aa-a632-cc978619c85c.png`, `Screenshot_2026-06-02_at_10.36.59_PM-b1495e8a-0d4d-4027-8e19-9b15e651ceb7.png`, `Screenshot_2026-06-02_at_10.37.19_PM-0dc39336-3c6e-443d-a5c5-83defc3d1fe7.png`
