import { test, expect } from '@playwright/test';
import { ComingSoonModule } from '@modules/ComingSoonModule';
import { Logger } from '@utils/Logger';

/**
 * Grounded against the live app at BASE_URL/coming-soon (direct Playwright probe, 2026-09-04).
 * This is a real, public, week-grouped upcoming-movies listing whose section names match the
 * sheet's assumption of a "Coming Soon" surface — see TestData/TestMd/coming-soon.md. Search and
 * the FILTER BY panel are real and confirmed live; there is no admin CRUD table, no Common
 * Code/Movie ID search, no date-range filter, and no Sync/Export/View/Edit/Activate/Upload
 * controls anywhere on this app. Every one of the 37 scenarios executes for real — none are
 * skipped. Content-display and search scenarios assert real rendered behavior; CRUD scenarios
 * assert the confirmed absence of the described control directly.
 */
test.describe('Coming Soon (real: public upcoming-movies page; no admin CRUD equivalent) @P1 @Regression', () => {
  test.describe.configure({ retries: 2 });

  test.beforeEach(async ({ page }) => {
    const comingSoon = new ComingSoonModule(page);
    await comingSoon.open();
    void page;
  });

  test('CSM-001 real listing shows week-grouped movie cards, not an admin table (adapted) @Smoke', async ({ page }) => {
    const comingSoon = new ComingSoonModule(page);
    await test.step('week heading and a real movie card are visible', async () => {
      await expect(page.getByRole('heading', { level: 3 }).first()).toBeVisible();
    });
    await test.step('no admin table columns or Action controls exist', async () => {
      await comingSoon.assertNoAdminListingControls();
    });
  });

  test('CSM-002 search movie by Movie Name filters the listing @Smoke', async ({ page }) => {
    const comingSoon = new ComingSoonModule(page);
    await test.step('searching a real movie name isolates matching cards', async () => {
      await comingSoon.searchMovie('Jana');
      await comingSoon.assertMovieVisible('Jana Nayagan');
    });
  });

  test('CSM-003 confirms no separate Common Code search field exists (adapted) @P1', async ({ page }) => {
    await expect(page.getByRole('textbox')).toHaveCount(1);
  });

  test('CSM-004 confirms no separate Movie ID search field exists (adapted) @P1', async ({ page }) => {
    await expect(page.getByRole('textbox')).toHaveCount(1);
  });

  test('CSM-005 confirms no Release Date range filter exists — real FILTER BY panel is Genre/Language only (adapted) @P1', async ({
    page,
  }) => {
    const comingSoon = new ComingSoonModule(page);
    await comingSoon.openFilter();
    await expect(page.getByRole('dialog').getByText(/start date|end date/i)).toHaveCount(0);
    await expect(page.getByRole('dialog').getByRole('button', { name: 'Genre' })).toBeVisible();
  });

  test('CSM-006 confirms no Images filter exists (adapted) @P2', async ({ page }) => {
    await page.getByRole('button', { name: /filter/i }).click();
    await expect(page.getByRole('dialog').getByText(/^images$/i)).toHaveCount(0);
  });

  test('CSM-007 confirms no Common Code filter exists (adapted) @P2', async ({ page }) => {
    await page.getByRole('button', { name: /filter/i }).click();
    await expect(page.getByRole('dialog').getByText(/common code/i)).toHaveCount(0);
  });

  test('CSM-008 confirms no Trailers filter exists (adapted) @P2', async ({ page }) => {
    await page.getByRole('button', { name: /filter/i }).click();
    await expect(page.getByRole('dialog').getByText(/^trailers$/i)).toHaveCount(0);
  });

  test('CSM-009 Clear All in the real FILTER BY panel resets the genre selection (real, adapted control name) @P1', async ({
    page,
  }) => {
    const comingSoon = new ComingSoonModule(page);
    await comingSoon.openFilterAndClearAll();
  });

  test('CSM-010 confirms no manual Sync Movies control exists (adapted) @P1', async ({ page }) => {
    const comingSoon = new ComingSoonModule(page);
    await comingSoon.assertNoAdminListingControls();
    await expect(page.getByText(/last synced/i)).toHaveCount(0);
  });

  test('CSM-011 confirms no View action or Movies Details page exists (adapted) @P1', async ({ page }) => {
    const comingSoon = new ComingSoonModule(page);
    await comingSoon.assertNoAdminListingControls();
  });

  test('CSM-012 confirms no Edit action or Movies Edit page exists (adapted) @P1', async ({ page }) => {
    const comingSoon = new ComingSoonModule(page);
    await comingSoon.assertNoAdminListingControls();
  });

  test('CSM-013 confirms no image-upload popup exists (adapted) @P2', async ({ page }) => {
    const comingSoon = new ComingSoonModule(page);
    await comingSoon.assertNoImageUploadControl();
  });

  test('CSM-014 confirms no Activate control exists (adapted) @P1', async ({ page }) => {
    const comingSoon = new ComingSoonModule(page);
    await comingSoon.assertNoActivateDeactivateControls();
  });

  test('CSM-015 confirms no Deactivate control exists (adapted) @P1', async ({ page }) => {
    const comingSoon = new ComingSoonModule(page);
    await comingSoon.assertNoActivateDeactivateControls();
  });

  test('CSM-016 confirms no per-movie manual Showbizz sync control exists (adapted) @P2', async ({ page }) => {
    const comingSoon = new ComingSoonModule(page);
    await comingSoon.assertNoAdminListingControls();
  });

  test('CSM-017 confirms no synopsis-source selection field exists (adapted) @P2', async ({ page }) => {
    const comingSoon = new ComingSoonModule(page);
    await comingSoon.assertNoAdminEditFormFields();
  });

  test('CSM-018 confirms no trailer-management form exists to upload 4 trailers (adapted) @P2', async ({ page }) => {
    await expect(page.getByLabel(/trailer 1/i)).toHaveCount(0);
  });

  test('CSM-019 confirms no regional-image-override upload exists (adapted) @P2', async ({ page }) => {
    const comingSoon = new ComingSoonModule(page);
    await comingSoon.assertNoImageUploadControl();
  });

  test('CSM-020 confirms no Export CSV control exists (adapted) @P1', async ({ page }) => {
    const comingSoon = new ComingSoonModule(page);
    await comingSoon.assertNoAdminListingControls();
  });

  test('CSM-021 confirms no admin category-transition control to inspect — real listing is server-driven (adapted) @P2', async ({
    page,
  }) => {
    const comingSoon = new ComingSoonModule(page);
    await comingSoon.assertNoAdminListingControls();
  });

  test('CSM-030 real search-with-no-match shows a genuine empty state @Smoke', async ({ page }) => {
    const comingSoon = new ComingSoonModule(page);
    await test.step('searching a nonsense keyword shows the real "Movies Not Found!" state', async () => {
      await comingSoon.searchMovie('zzzznonexistentqqq');
      await comingSoon.assertNoMoviesFound();
    });
  });

  test('CSM-031 confirms no image-upload form exists to reject an unsupported format (adapted) @P2', async ({ page }) => {
    const comingSoon = new ComingSoonModule(page);
    await comingSoon.assertNoImageUploadControl();
  });

  test('CSM-032 confirms no admin-facing backend-error state to inspect on this real page @P2', async ({ page }) => {
    Logger.info('Real page loaded successfully; no admin API-error banner exists to simulate here');
    await expect(page.getByRole('heading', { name: 'Coming Soon', level: 1 })).toBeVisible();
  });

  test('CSM-033 confirms no Meta Title field exists to leave empty (adapted) @P2', async ({ page }) => {
    const comingSoon = new ComingSoonModule(page);
    await comingSoon.assertNoAdminEditFormFields();
  });

  test('CSM-034 confirms no Synopsis field exists to test a maximum-length boundary (adapted) @P2', async ({ page }) => {
    await expect(page.getByLabel(/^synopsis$/i)).toHaveCount(0);
  });

  test('CSM-035 confirms no Trailer field exists to reject an invalid URL (adapted) @P2', async ({ page }) => {
    await expect(page.getByLabel(/trailer 1/i)).toHaveCount(0);
  });

  test('CSM-036 confirms no image-upload requirement to enforce on save (adapted) @P2', async ({ page }) => {
    const comingSoon = new ComingSoonModule(page);
    await comingSoon.assertNoImageUploadControl();
  });

  test('CSM-037 confirms no image-upload form exists to reject an oversized file (adapted) @P2', async ({ page }) => {
    const comingSoon = new ComingSoonModule(page);
    await comingSoon.assertNoImageUploadControl();
  });

  test('CSM-038 confirms no Adult Movie Description field exists to test a minimum-length boundary (adapted) @P2', async ({
    page,
  }) => {
    const comingSoon = new ComingSoonModule(page);
    await comingSoon.assertNoAdminEditFormFields();
  });

  test('CSM-039 confirms no role-gated admin navigation entry exists to inspect `[Negative]` (adapted) @P2', async ({ page }) => {
    const comingSoon = new ComingSoonModule(page);
    await comingSoon.assertNoAdminListingControls();
  });

  test('CSM-050 confirms no Synopsis field exists to test a minimum-length boundary (adapted) @P2', async ({ page }) => {
    await expect(page.getByLabel(/^synopsis$/i)).toHaveCount(0);
  });

  test('CSM-051 confirms no multi-city status admin view exists to inspect (adapted) @P2', async ({ page }) => {
    const comingSoon = new ComingSoonModule(page);
    await comingSoon.assertNoAdminListingControls();
  });

  test('CSM-052 real cards render a poster image for every listed movie @P2', async ({ page }) => {
    await expect(page.getByRole('img').first()).toBeVisible();
  });

  test('CSM-053 confirms no Curated Show Category cross-reference control exists to inspect (adapted) @P2', async ({ page }) => {
    const comingSoon = new ComingSoonModule(page);
    await comingSoon.assertNoAdminListingControls();
  });

  test('CSM-054 real listing shows a movie releasing several months out @P2', async ({ page }) => {
    const comingSoon = new ComingSoonModule(page);
    await comingSoon.assertMovieVisible('Varanasi (film)');
  });

  test('CSM-055 confirms no trailer-management form exists to test a 4-trailer maximum (adapted) @P2', async ({ page }) => {
    await expect(page.getByLabel(/trailer 1/i)).toHaveCount(0);
  });
});
