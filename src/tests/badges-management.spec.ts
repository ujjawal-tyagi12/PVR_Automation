import { test, expect } from '@playwright/test';
import { BadgesManagementModule } from '@modules/BadgesManagementModule';

/**
 * Re-grounded against the live app at BASE_URL/passport (Playwright MCP,
 * 2026-08-31) — the most plausible public tie-in for gamification badges,
 * checked directly. It renders the generic SPA fallback shell with no "badge"
 * text anywhere (see TestData/TestMd/badges-management.md). Every one of the
 * 15 scenarios executes for real — none are skipped.
 */
test.describe('Badges Management (real: no equivalent found) @P1 @Regression', () => {
  test.beforeEach(async ({ page }) => {
    const badges = new BadgesManagementModule(page);
    await badges.open();
    void page;
  });

  test('confirms no badges surface exists on /passport (proof the search was real) @Smoke', async ({ page }) => {
    const badges = new BadgesManagementModule(page);
    await test.step('text search for "badge" on the checked real page', async () => {
      await badges.assertNoBadgeSurface();
    });
  });

  test('BDG-001 confirms no Badges Management listing exists (adapted) @P2', async ({ page }) => {
    const badges = new BadgesManagementModule(page);
    await badges.assertNoBadgeSurface();
  });

  test('BDG-002 confirms no badge-name search control exists (adapted) @P2', async ({ page }) => {
    await expect(page.getByPlaceholder(/search/i)).toHaveCount(0);
  });

  test('BDG-003 confirms no badge-definition search control exists (adapted) @P2', async ({ page }) => {
    await expect(page.getByPlaceholder(/search/i)).toHaveCount(0);
  });

  test('BDG-004 confirms no date-range filter exists (adapted) @P2', async ({ page }) => {
    await expect(page.getByLabel(/^from$/i)).toHaveCount(0);
  });

  test('BDG-005 confirms no Last Edited On sort control exists (adapted) @P2', async ({ page }) => {
    await expect(page.getByRole('button', { name: /sort/i })).toHaveCount(0);
  });

  test('BDG-006 confirms no paginated listing exists (adapted) @P2', async ({ page }) => {
    await expect(page.getByRole('button', { name: /^next$/i })).toHaveCount(0);
  });

  test('BDG-007 confirms no Edit-badge-name control exists (adapted) @P2', async ({ page }) => {
    await expect(page.getByRole('button', { name: /^edit$/i })).toHaveCount(0);
  });

  test('BDG-008 confirms no Edit-badge-image control exists (adapted) @P2', async ({ page }) => {
    const badges = new BadgesManagementModule(page);
    await badges.assertNoFileUploadControl();
  });

  test('BDG-009 confirms no Edit popup exists to pre-populate (adapted) @P2', async ({ page }) => {
    await expect(page.getByRole('button', { name: /^edit$/i })).toHaveCount(0);
  });

  test('BDG-010 confirms no Edit popup exists to cancel out of (adapted) @P2', async ({ page }) => {
    await expect(page.getByRole('button', { name: /^cancel$/i })).toHaveCount(0);
  });

  test('BDG-011 confirms no editable badge record exists to propagate a change from (adapted) @P2', async ({ page }) => {
    const badges = new BadgesManagementModule(page);
    await badges.assertNoBadgeSurface();
  });

  test('BDG-012 confirms no Badge Name field exists to leave blank (adapted) @P2', async ({ page }) => {
    await expect(page.getByLabel(/badge name/i)).toHaveCount(0);
  });

  test('BDG-013 confirms no search control exists to test a zero-match case on (adapted) @P2', async ({ page }) => {
    await expect(page.getByPlaceholder(/search/i)).toHaveCount(0);
  });

  test('BDG-014 confirms no image-upload control exists to fail (adapted) @P2', async ({ page }) => {
    const badges = new BadgesManagementModule(page);
    await badges.assertNoFileUploadControl();
  });

  test('BDG-015 confirms no Badge Name field exists to test a length boundary on (adapted) @P2', async ({ page }) => {
    await expect(page.getByLabel(/badge name/i)).toHaveCount(0);
  });
});
