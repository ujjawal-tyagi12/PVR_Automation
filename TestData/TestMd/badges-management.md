# Playwright: Badges Management — listing, edit name/image, cross-platform propagation

## Acceptance criteria

- Listing shows badges with Name, Definition, Last Edited On; supports search by Name/Definition, date-range filter, sort by Last Edited On, and pagination.
- Edit updates Name and/or Image via a pre-populated popup; changes propagate across platforms; Cancel discards changes; empty Name is blocked; Name is bounded at 150 characters.

## Navigation

1. Log in to the Admin Panel (see `admin-login.md`).
2. Navigate to **Badges Management**.

## Test coverage

- **Scope:** Complete — all rows in this batch.
- **Sheet rows included:** 15 of 15 (`BDG-001`–`BDG-015`).
- **Out of scope:** None within this batch.

## Scenarios

- **Suggested journey:** `src/tests/badges-management.spec.ts`
- **Sheet:** rows 244–258

- [ ] **BDG-001** — View Badges Management listing
- [ ] **BDG-002** — Search badge by Name
- [ ] **BDG-003** — Search badge by Definition
- [ ] **BDG-004** — Filter by date range
- [ ] **BDG-005** — Sort by Last Edited On
- [ ] **BDG-006** — Paginate listing
- [ ] **BDG-007** — Edit badge name
- [ ] **BDG-008** — Edit badge image
- [ ] **BDG-009** — Edit popup pre-populates existing values
- [ ] **BDG-010** — Cancel Edit discards changes
- [ ] **BDG-011** — Changes reflected across all platforms
- [ ] **BDG-012** — Empty Badge Name blocked
- [ ] **BDG-013** — No badges match search
- [ ] **BDG-014** — Image upload failure
- [ ] **BDG-015** — Badge Name at maximum length boundary

## E2E implementation notes

- **Layering:** `src/tests/badges-management.spec.ts` → `src/modules/BadgesManagementModule.ts` → `src/pages/BadgesManagementPage.ts`.
- **Frontend context:** Checked `/passport` (the loyalty program page, the most plausible public tie-in for gamification badges) directly — it renders the generic SPA fallback shell in this UAT environment, with no "badge" text anywhere on the live site. No public badges surface exists; every scenario asserts confirmed absence.
- **Tags:** `@Regression @P2`.
- **Run:** `npx playwright test src/tests/badges-management.spec.ts --project=chromium`

## Source

- **Seed method:** Google Sheet (CSV export)
- **Row range:** `BDG-001`–`BDG-015` (rows 244–258 of the second 150-row batch)
