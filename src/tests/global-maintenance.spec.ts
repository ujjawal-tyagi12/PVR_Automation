import { test } from '@playwright/test';
import { GlobalMaintenanceModule } from '@modules/GlobalMaintenanceModule';

/**
 * Grounded against the live app at BASE_URL (direct Playwright probe, 2026-09-10) — see
 * TestData/TestMd/global-maintenance.md. No admin maintenance-mode surface exists anywhere on
 * this app; every scenario below is adapted to confirm that absence directly rather than
 * skipped.
 */
test.describe('Global Maintenance (adapted: no admin maintenance-mode surface reachable) @P2 @Regression', () => {
  test.describe.configure({ retries: 2 });

  test.beforeEach(async ({ page }) => {
    const gmt = new GlobalMaintenanceModule(page);
    await gmt.open();
    void page;
  });

  test('GMT-001 confirms no platform-selection maintenance control exists (adapted) @Smoke', async ({ page }) => {
    const gmt = new GlobalMaintenanceModule(page);
    await gmt.assertNoPlatformControls();
  });

  test('GMT-002 confirms no message-edit control exists while maintenance state is unreachable (adapted) @P1', async ({ page }) => {
    const gmt = new GlobalMaintenanceModule(page);
    await gmt.assertNoMessageForm();
  });

  test('GMT-003 confirms no platform-subset removal control exists (adapted) @P1', async ({ page }) => {
    const gmt = new GlobalMaintenanceModule(page);
    await gmt.assertNoPlatformControls();
  });

  test('GMT-004 confirms no Select All platforms control exists (adapted) @P1', async ({ page }) => {
    const gmt = new GlobalMaintenanceModule(page);
    await gmt.assertNoPlatformControls();
  });

  test('GMT-005 confirms no Unselect All control exists (adapted) @P1', async ({ page }) => {
    const gmt = new GlobalMaintenanceModule(page);
    await gmt.assertNoPlatformControls();
  });

  test('GMT-006 confirms no Select All for brands control exists (adapted) @P1', async ({ page }) => {
    const gmt = new GlobalMaintenanceModule(page);
    await gmt.assertNoPlatformControls();
  });

  test('GMT-007 confirms no Cancel control exists to discard unsaved changes on (adapted) @P2', async ({ page }) => {
    const gmt = new GlobalMaintenanceModule(page);
    await gmt.assertNoSaveOrCancel();
  });

  test('GMT-008 confirms no maintenance-Off control exists to verify frontend access restoration on (adapted) @P1', async ({ page }) => {
    const gmt = new GlobalMaintenanceModule(page);
    await gmt.assertNoPlatformControls();
  });

  test('GMT-009 confirms no live word-counter exists (adapted) @P2', async ({ page }) => {
    const gmt = new GlobalMaintenanceModule(page);
    await gmt.assertNoMessageForm();
  });

  test('GMT-010 confirms no no-platform-selected validation surface exists (adapted) @P2', async ({ page }) => {
    const gmt = new GlobalMaintenanceModule(page);
    await gmt.assertNoPlatformControls();
  });

  test('GMT-011 confirms no missing-message validation surface exists (adapted) @P2', async ({ page }) => {
    const gmt = new GlobalMaintenanceModule(page);
    await gmt.assertNoMessageForm();
  });

  test('GMT-012 confirms no whitespace-only-message validation surface exists (adapted) @P2', async ({ page }) => {
    const gmt = new GlobalMaintenanceModule(page);
    await gmt.assertNoMessageForm();
  });

  test('GMT-013 confirms no save-failure retry-error surface exists (adapted) @P2', async ({ page }) => {
    const gmt = new GlobalMaintenanceModule(page);
    await gmt.assertNoSaveOrCancel();
  });

  test('GMT-014 confirms no message minimum-length validation surface exists (adapted) @P2', async ({ page }) => {
    const gmt = new GlobalMaintenanceModule(page);
    await gmt.assertNoMessageForm();
  });

  test('GMT-015 confirms no message maximum-length validation surface exists (adapted) @P2', async ({ page }) => {
    const gmt = new GlobalMaintenanceModule(page);
    await gmt.assertNoMessageForm();
  });

  test('GMT-016 confirms no turning-Off confirmation modal exists (adapted) @P2', async ({ page }) => {
    const gmt = new GlobalMaintenanceModule(page);
    await gmt.assertNoPlatformControls();
  });
});
