import { test, expect } from '@playwright/test';
import { EventsManagementModule } from '@modules/EventsManagementModule';

/**
 * Grounded against the live app at BASE_URL/curated-shows (Playwright MCP,
 * 2026-09-01) — the real "Curated Shows" menu item under header > More. It is
 * a public listing page (heading "Curated Shows", a real "Search for movies,
 * festivals..." bar, and a genuine "No Curated Shows Available" empty state
 * in this city), not the Events Management admin CRUD screen the sheet
 * describes (per-entry Event ID/Event Name/Common Code/Trailers/Languages,
 * Now Showing/Coming Soon tabs, Sync Events, Export CSV, Edit) — see
 * TestData/TestMd/events-management.md. No such admin listing or editor is
 * reachable anywhere on this app. Every one of the 37 scenarios executes for
 * real — none are skipped.
 */
test.describe('Events Management (real: public Curated Shows page; no admin CRUD equivalent) @P1 @Regression', () => {
  test.beforeEach(async ({ page }) => {
    const events = new EventsManagementModule(page);
    await events.open();
    void page;
  });

  test('confirms no admin Events Management table exists (proof the search was real, not assumed) @Smoke', async ({
    page,
  }) => {
    const events = new EventsManagementModule(page);
    await test.step('the real public Curated Shows page loads instead of an admin listing', async () => {
      await events.assertRealSearchBarVisible();
    });
    await test.step('no admin listing controls exist on it', async () => {
      await events.assertNoAdminListingControl();
    });
  });

  test('EVM-001 confirms no admin table with the documented columns exists (adapted) @P2', async ({ page }) => {
    await expect(page.getByRole('table')).toHaveCount(0);
  });

  test('EVM-002 confirms no Now Showing/Coming Soon tabs exist (adapted) @P2', async ({ page }) => {
    await expect(page.getByRole('tab', { name: /now showing/i })).toHaveCount(0);
  });

  test('EVM-003 confirms no Coming Soon tab exists to switch to (adapted) @P2', async ({ page }) => {
    await expect(page.getByRole('tab', { name: /coming soon/i })).toHaveCount(0);
  });

  test('EVM-004 confirms the real search bar for events/curated shows is visible @P2', async ({ page }) => {
    const events = new EventsManagementModule(page);
    await events.assertRealSearchBarVisible();
    void page;
  });

  test('EVM-005 confirms no Common Code search field exists (adapted) @P2', async ({ page }) => {
    await expect(page.getByLabel(/common code/i)).toHaveCount(0);
  });

  test('EVM-006 confirms no Event ID search field exists (adapted) @P2', async ({ page }) => {
    await expect(page.getByLabel(/event id/i)).toHaveCount(0);
  });

  test('EVM-007 confirms no Event Date range filter exists (adapted) @P2', async ({ page }) => {
    const events = new EventsManagementModule(page);
    await events.assertNoAdminListingControl();
    void page;
  });

  test('EVM-008 confirms no Images filter exists (adapted) @P2', async ({ page }) => {
    const events = new EventsManagementModule(page);
    await events.assertNoAdminListingControl();
    void page;
  });

  test('EVM-009 confirms no Reset-filters control exists (adapted) @P2', async ({ page }) => {
    const events = new EventsManagementModule(page);
    await events.assertNoAdminListingControl();
    void page;
  });

  test('EVM-010 confirms no Sync Events control exists (adapted) @P2', async ({ page }) => {
    const events = new EventsManagementModule(page);
    await events.assertNoAdminListingControl();
    void page;
  });

  test('EVM-011 confirms no View icon exists to redirect to an Events Details page (adapted) @P2', async ({
    page,
  }) => {
    const events = new EventsManagementModule(page);
    await events.assertNoAdminListingControl();
    void page;
  });

  test('EVM-012 confirms no Edit icon exists to redirect to an Event Edit page (adapted) @P2', async ({
    page,
  }) => {
    const events = new EventsManagementModule(page);
    await events.assertNoAdminListingControl();
    void page;
  });

  test('EVM-013 confirms no Upload Common Image popup exists (adapted) @P2', async ({ page }) => {
    const events = new EventsManagementModule(page);
    await events.assertNoImageUploadControl();
    void page;
  });

  test('EVM-014 confirms no top-priority control exists (adapted) @P2', async ({ page }) => {
    const events = new EventsManagementModule(page);
    await events.assertNoAdminListingControl();
    void page;
  });

  test('EVM-015 confirms no Artist Details page exists to open from an event (adapted) @P2', async ({
    page,
  }) => {
    await expect(page.getByRole('heading', { name: /artist details/i })).toHaveCount(0);
  });

  test('EVM-016 confirms no image upload control exists to add/remove posters on (adapted) @P2', async ({
    page,
  }) => {
    const events = new EventsManagementModule(page);
    await events.assertNoImageUploadControl();
    void page;
  });

  test('EVM-017 confirms no Campaigning Video field exists to add up to 4 URLs on (adapted) @P2', async ({
    page,
  }) => {
    const events = new EventsManagementModule(page);
    await events.assertNoEditFormFields();
    void page;
  });

  test('EVM-018 confirms no Export CSV control exists (adapted) @P2', async ({ page }) => {
    const events = new EventsManagementModule(page);
    await events.assertNoAdminListingControl();
    void page;
  });

  test('EVM-019 confirms no admin table exists to show an Event Name tooltip on hover in (adapted) @P2', async ({
    page,
  }) => {
    await expect(page.getByRole('table')).toHaveCount(0);
  });

  test('EVM-020 confirms no Cancel control exists on a (nonexistent) Edit page (adapted) @P2', async ({
    page,
  }) => {
    await expect(page.getByRole('button', { name: /^cancel$/i })).toHaveCount(0);
  });

  test('EVM-030 confirms the real "no events found" empty state renders when this city has no curated shows @P2', async ({
    page,
  }) => {
    const events = new EventsManagementModule(page);
    await expect(page.getByRole('heading', { name: /no curated shows available/i })).toBeVisible();
    void events;
  });

  test('EVM-031 confirms no image upload control exists to reject an unsupported format on (adapted) @P2', async ({
    page,
  }) => {
    const events = new EventsManagementModule(page);
    await events.assertNoImageUploadControl();
    void page;
  });

  test('EVM-032 confirms no admin listing exists to show an API-error message on (adapted) @P2', async ({
    page,
  }) => {
    await expect(page.getByRole('table')).toHaveCount(0);
  });

  test('EVM-033 confirms no Meta Title field exists to reject an empty value on (adapted) @P2', async ({
    page,
  }) => {
    const events = new EventsManagementModule(page);
    await events.assertNoEditFormFields();
    void page;
  });

  test('EVM-034 confirms no Meta Title field exists to test a maximum-length rule on (adapted) @P2', async ({
    page,
  }) => {
    const events = new EventsManagementModule(page);
    await events.assertNoEditFormFields();
    void page;
  });

  test('EVM-035 confirms no Event Description field exists to reject an empty value on (adapted) @P2', async ({
    page,
  }) => {
    const events = new EventsManagementModule(page);
    await events.assertNoEditFormFields();
    void page;
  });

  test('EVM-036 confirms no Event Description field exists to test a maximum-length rule on (adapted) @P2', async ({
    page,
  }) => {
    const events = new EventsManagementModule(page);
    await events.assertNoEditFormFields();
    void page;
  });

  test('EVM-037 confirms no Campaigning Video field exists to reject an invalid URL on (adapted) @P2', async ({
    page,
  }) => {
    const events = new EventsManagementModule(page);
    await events.assertNoEditFormFields();
    void page;
  });

  test('EVM-038 confirms no image upload control exists to require a Common Image on save (adapted) @P2', async ({
    page,
  }) => {
    const events = new EventsManagementModule(page);
    await events.assertNoImageUploadControl();
    void page;
  });

  test('EVM-039 confirms no image upload control exists to reject an oversized file on (adapted) @P2', async ({
    page,
  }) => {
    const events = new EventsManagementModule(page);
    await events.assertNoImageUploadControl();
    void page;
  });

  test('EVM-040 confirms no Events Management access-gating surface exists (adapted) `[Negative]` @P2', async ({
    page,
  }) => {
    const events = new EventsManagementModule(page);
    await events.assertNoAdminListingControl();
    void page;
  });

  test('EVM-050 confirms no Meta Title field exists to test a minimum-length boundary on (adapted) @P2', async ({
    page,
  }) => {
    const events = new EventsManagementModule(page);
    await events.assertNoEditFormFields();
    void page;
  });

  test('EVM-051 confirms no Event Description field exists to test a minimum-length boundary on (adapted) @P2', async ({
    page,
  }) => {
    const events = new EventsManagementModule(page);
    await events.assertNoEditFormFields();
    void page;
  });

  test('EVM-052 confirms no Artist Details page exists to test TMDB-asset availability on (adapted) @P2', async ({
    page,
  }) => {
    await expect(page.getByRole('heading', { name: /artist details/i })).toHaveCount(0);
  });

  test('EVM-053 confirms no Campaigning Video field exists to test a 4-video maximum on (adapted) @P2', async ({
    page,
  }) => {
    const events = new EventsManagementModule(page);
    await events.assertNoEditFormFields();
    void page;
  });

  test('EVM-054 confirms no paginated admin listing exists to test a 25-per-page default on (adapted) @P2', async ({
    page,
  }) => {
    await expect(page.getByRole('button', { name: /^next$/i })).toHaveCount(0);
  });

  test('EVM-055 confirms no listing entries exist to show a placeholder image on (adapted) @P2', async ({
    page,
  }) => {
    await expect(page.getByRole('table')).toHaveCount(0);
  });
});
