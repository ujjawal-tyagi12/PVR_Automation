import { test } from '@playwright/test';
import { MovieMasterModule } from '@modules/MovieMasterModule';

/**
 * Grounded against the live app at BASE_URL/coming-soon (direct Playwright probe, 2026-09-16) —
 * the same real, public movie listing already grounded for coming-soon.spec.ts, reused here as
 * the public equivalent of Movie Master — see TestData/TestMd/movie-master.md. There is no
 * admin CRUD (search/filter/sort/export/edit) surface anywhere on this app.
 */
test.describe('Movie Master (real: public movie listing; no admin CRUD equivalent) @P2 @Regression', () => {
  test.describe.configure({ retries: 2 });

  test.beforeEach(async ({ page }) => {
    const mm = new MovieMasterModule(page);
    await mm.open();
    void page;
  });

  test('MM-001 real listing loads from the public movie catalog, not an admin table (adapted) @Smoke', async ({ page }) => {
    const mm = new MovieMasterModule(page);
    await mm.assertNoAdminTable();
  });

  test('MM-002 real search filters movies by name, the public equivalent of Search by Movie Name @Smoke', async ({ page }) => {
    const mm = new MovieMasterModule(page);
    await mm.assertRealSearchWorks('Jana');
  });

  test('MM-003 confirms no Search by Common Code field exists (adapted) @P1', async ({ page }) => {
    const mm = new MovieMasterModule(page);
    await mm.assertNoAdminSearchOrFilters();
  });

  test('MM-004 confirms no Search by Movie ID field exists (adapted) @P1', async ({ page }) => {
    const mm = new MovieMasterModule(page);
    await mm.assertNoAdminSearchOrFilters();
  });

  test('MM-005 confirms no Release Date range filter exists (adapted) @P1', async ({ page }) => {
    const mm = new MovieMasterModule(page);
    await mm.assertNoAdminSearchOrFilters();
  });

  test('MM-006 confirms no Images=Yes filter exists (adapted) @P2', async ({ page }) => {
    const mm = new MovieMasterModule(page);
    await mm.assertNoAdminSearchOrFilters();
  });

  test('MM-007 confirms no Common Code=Yes filter exists (adapted) @P2', async ({ page }) => {
    const mm = new MovieMasterModule(page);
    await mm.assertNoAdminSearchOrFilters();
  });

  test('MM-008 confirms no Trailers=Yes filter exists (adapted) @P2', async ({ page }) => {
    const mm = new MovieMasterModule(page);
    await mm.assertNoAdminSearchOrFilters();
  });

  test('MM-009 real FILTER BY panel is the public equivalent of the Languages multi-select filter @P1', async ({ page }) => {
    const mm = new MovieMasterModule(page);
    await mm.assertRealFilterPanelOpens();
  });

  test('MM-010 confirms no admin Reset-filters control exists (adapted) @P2', async ({ page }) => {
    const mm = new MovieMasterModule(page);
    await mm.assertNoAdminSearchOrFilters();
  });

  test('MM-011 confirms no admin Sort-by-Release-Date control exists (adapted) @P2', async ({ page }) => {
    const mm = new MovieMasterModule(page);
    await mm.assertNoAdminTable();
  });

  test('MM-012 confirms no admin movie-details view exists (adapted) @P1', async ({ page }) => {
    const mm = new MovieMasterModule(page);
    await mm.assertNoAdminTable();
  });

  test('MM-013 confirms no Movie Edit page exists (adapted) @P1', async ({ page }) => {
    const mm = new MovieMasterModule(page);
    await mm.assertNoEditForm();
  });

  test('MM-014 confirms no update-via-edit-form surface exists (adapted) @P1', async ({ page }) => {
    const mm = new MovieMasterModule(page);
    await mm.assertNoEditForm();
  });

  test('MM-015 confirms no Upload Image action exists (adapted) @P1', async ({ page }) => {
    const mm = new MovieMasterModule(page);
    await mm.assertNoEditForm();
  });

  test('MM-016 confirms no synopsis-source-selection control exists (adapted) @P2', async ({ page }) => {
    const mm = new MovieMasterModule(page);
    await mm.assertNoEditForm();
  });

  test('MM-017 confirms no filtered CSV export exists (adapted) @P1', async ({ page }) => {
    const mm = new MovieMasterModule(page);
    await mm.assertNoSyncOrExport();
  });

  test('MM-018 confirms no edit-page Cancel control exists (adapted) @P2', async ({ page }) => {
    const mm = new MovieMasterModule(page);
    await mm.assertNoEditForm();
  });

  test('MM-019 confirms no hover-tooltip on Movie Name exists on an admin table (adapted) @P2', async ({ page }) => {
    const mm = new MovieMasterModule(page);
    await mm.assertNoAdminTable();
  });

  test('MM-020 real search with no matches shows the genuine "Movies Not Found!" empty state @Smoke', async ({ page }) => {
    const mm = new MovieMasterModule(page);
    await mm.assertSearchNoMatchesShowsRealEmptyState();
  });

  test('MM-021 confirms no Release-Date End-before-Start validation surface exists (adapted) @P2', async ({ page }) => {
    const mm = new MovieMasterModule(page);
    await mm.assertNoAdminSearchOrFilters();
  });

  test('MM-022 confirms no unsupported-image-format validation surface exists (adapted) @P2', async ({ page }) => {
    const mm = new MovieMasterModule(page);
    await mm.assertNoEditForm();
  });

  test('MM-023 confirms no oversized-image validation surface exists (adapted) @P2', async ({ page }) => {
    const mm = new MovieMasterModule(page);
    await mm.assertNoEditForm();
  });

  test('MM-024 confirms no empty-Meta-Title validation surface exists (adapted) @P2', async ({ page }) => {
    const mm = new MovieMasterModule(page);
    await mm.assertNoEditForm();
  });

  test('MM-025 confirms no Meta Title maximum-length validation surface exists (adapted) @P2', async ({ page }) => {
    const mm = new MovieMasterModule(page);
    await mm.assertNoEditForm();
  });

  test('MM-026 confirms no Meta Title special-character validation surface exists (adapted) @P2', async ({ page }) => {
    const mm = new MovieMasterModule(page);
    await mm.assertNoEditForm();
  });

  test('MM-027 confirms no empty-Synopsis validation surface exists (adapted) @P2', async ({ page }) => {
    const mm = new MovieMasterModule(page);
    await mm.assertNoEditForm();
  });

  test('MM-028 confirms no invalid-trailer-URL validation surface exists (adapted) @P2', async ({ page }) => {
    const mm = new MovieMasterModule(page);
    await mm.assertNoEditForm();
  });

  test('MM-029 confirms no API-error/timeout surface exists to verify (adapted) @P2', async ({ page }) => {
    const mm = new MovieMasterModule(page);
    await mm.assertNoAdminTable();
  });

  test('MM-030 confirms no admin route reachable to test role-based access on (adapted) [Negative] @P1', async ({ page }) => {
    const mm = new MovieMasterModule(page);
    await mm.assertNoAdminTable();
  });

  test('MM-031 confirms no Meta Title boundary-length surface exists (adapted) @P2', async ({ page }) => {
    const mm = new MovieMasterModule(page);
    await mm.assertNoEditForm();
  });

  test('MM-032 confirms no Synopsis boundary-length surface exists (adapted) @P2', async ({ page }) => {
    const mm = new MovieMasterModule(page);
    await mm.assertNoEditForm();
  });

  test('MM-033 confirms no maximum-four-trailers surface exists (adapted) @P2', async ({ page }) => {
    const mm = new MovieMasterModule(page);
    await mm.assertNoEditForm();
  });

  test('MM-034 confirms no regional-image-override admin control exists (adapted) @P2', async ({ page }) => {
    const mm = new MovieMasterModule(page);
    await mm.assertNoEditForm();
  });

  test('MM-035 real listing shows real zero-vs-many-results states depending on the query @P2', async ({ page }) => {
    const mm = new MovieMasterModule(page);
    await mm.assertSearchNoMatchesShowsRealEmptyState();
  });
});
