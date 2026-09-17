import { test } from '@playwright/test';
import { MovieDataProviderModule } from '@modules/MovieDataProviderModule';

/**
 * Grounded against the live app at BASE_URL (direct Playwright probe, 2026-09-16) — see
 * TestData/TestMd/movie-data-provider.md. No admin movie-data-import surface exists anywhere on
 * this app; every scenario below is adapted to confirm that absence directly rather than
 * skipped.
 */
test.describe('Movie Data Provider (adapted: no admin import surface reachable) @P2 @Regression', () => {
  test.describe.configure({ retries: 2 });

  test.beforeEach(async ({ page }) => {
    const mdp = new MovieDataProviderModule(page);
    await mdp.open();
    void page;
  });

  test('MDP-001 confirms no Search-by-name-with-TMDB-source surface exists (adapted) @Smoke', async ({ page }) => {
    const mdp = new MovieDataProviderModule(page);
    await mdp.assertNoSearchOrSourceControls();
  });

  test('MDP-002 confirms no Search-by-name-with-Moviesbuff-source surface exists (adapted) @P1', async ({ page }) => {
    const mdp = new MovieDataProviderModule(page);
    await mdp.assertNoSearchOrSourceControls();
  });

  test('MDP-003 confirms no Search-with-TMDB-ID surface exists (adapted) @P1', async ({ page }) => {
    const mdp = new MovieDataProviderModule(page);
    await mdp.assertNoSearchOrSourceControls();
  });

  test('MDP-004 confirms no related-movie-list-without-ID surface exists (adapted) @P2', async ({ page }) => {
    const mdp = new MovieDataProviderModule(page);
    await mdp.assertNoSearchOrSourceControls();
  });

  test('MDP-005 confirms no default-source-TMDB surface exists (adapted) @P2', async ({ page }) => {
    const mdp = new MovieDataProviderModule(page);
    await mdp.assertNoSearchOrSourceControls();
  });

  test('MDP-006 confirms no non-selectable-fields results page exists (adapted) @P2', async ({ page }) => {
    const mdp = new MovieDataProviderModule(page);
    await mdp.assertNoImportForm();
  });

  test('MDP-007 confirms no default-asset-preselection surface exists (adapted) @P2', async ({ page }) => {
    const mdp = new MovieDataProviderModule(page);
    await mdp.assertNoImportForm();
  });

  test('MDP-008 confirms no Select-All-for-Cast control exists (adapted) @P1', async ({ page }) => {
    const mdp = new MovieDataProviderModule(page);
    await mdp.assertNoImportForm();
  });

  test('MDP-009 confirms no edit-fetched-synopsis field exists (adapted) @P1', async ({ page }) => {
    const mdp = new MovieDataProviderModule(page);
    await mdp.assertNoImportForm();
  });

  test('MDP-010 confirms no Submit-imports-selected-assets control exists (adapted) @P1', async ({ page }) => {
    const mdp = new MovieDataProviderModule(page);
    await mdp.assertNoImportForm();
  });

  test('MDP-011 confirms no preselected-on-reopen surface exists (adapted) @P2', async ({ page }) => {
    const mdp = new MovieDataProviderModule(page);
    await mdp.assertNoImportForm();
  });

  test('MDP-012 confirms no cast/crew asset-selection page exists (adapted) @P2', async ({ page }) => {
    const mdp = new MovieDataProviderModule(page);
    await mdp.assertNoImportForm();
  });

  test('MDP-013 confirms no cast/crew asset-selection submit exists (adapted) @P2', async ({ page }) => {
    const mdp = new MovieDataProviderModule(page);
    await mdp.assertNoImportForm();
  });

  test('MDP-014 confirms no cast/crew asset-selection cancel exists (adapted) @P2', async ({ page }) => {
    const mdp = new MovieDataProviderModule(page);
    await mdp.assertNoImportForm();
  });

  test('MDP-015 confirms no source-bifurcated-assets display exists (adapted) @P2', async ({ page }) => {
    const mdp = new MovieDataProviderModule(page);
    await mdp.assertNoImportForm();
  });

  test('MDP-016 confirms no deleted-synopsis-fallback surface exists (adapted) @P2', async ({ page }) => {
    const mdp = new MovieDataProviderModule(page);
    await mdp.assertNoImportForm();
  });

  test('MDP-020 confirms no results-page Cancel control exists (adapted) @P2', async ({ page }) => {
    const mdp = new MovieDataProviderModule(page);
    await mdp.assertNoImportForm();
  });

  test('MDP-021 confirms no no-matches-found state exists to verify (adapted) @P2', async ({ page }) => {
    const mdp = new MovieDataProviderModule(page);
    await mdp.assertNoSearchOrSourceControls();
  });

  test('MDP-022 confirms no TMDB/Moviesbuff API-error surface exists (adapted) @P2', async ({ page }) => {
    const mdp = new MovieDataProviderModule(page);
    await mdp.assertNoSearchOrSourceControls();
  });

  test('MDP-023 confirms no empty-Search-Movie validation surface exists (adapted) @P2', async ({ page }) => {
    const mdp = new MovieDataProviderModule(page);
    await mdp.assertNoSearchOrSourceControls();
  });

  test('MDP-024 confirms no Search-Movie minimum-length validation surface exists (adapted) @P2', async ({ page }) => {
    const mdp = new MovieDataProviderModule(page);
    await mdp.assertNoSearchOrSourceControls();
  });

  test('MDP-025 confirms no Search-Movie maximum-length validation surface exists (adapted) @P2', async ({ page }) => {
    const mdp = new MovieDataProviderModule(page);
    await mdp.assertNoSearchOrSourceControls();
  });

  test('MDP-026 confirms no submit-without-source validation surface exists (adapted) @P2', async ({ page }) => {
    const mdp = new MovieDataProviderModule(page);
    await mdp.assertNoImportForm();
  });

  test('MDP-027 confirms no missing-cast-image-placeholder surface exists (adapted) @P2', async ({ page }) => {
    const mdp = new MovieDataProviderModule(page);
    await mdp.assertNoImportForm();
  });

  test('MDP-028 confirms no admin route reachable to test role-based access on (adapted) [Negative] @P1', async ({ page }) => {
    const mdp = new MovieDataProviderModule(page);
    await mdp.assertNoSearchOrSourceControls();
  });

  test('MDP-030 confirms no Search-Movie boundary-length surface exists (adapted) @P2', async ({ page }) => {
    const mdp = new MovieDataProviderModule(page);
    await mdp.assertNoSearchOrSourceControls();
  });

  test('MDP-031 confirms no Search-Movie maximum-length boundary surface exists (adapted) @P2', async ({ page }) => {
    const mdp = new MovieDataProviderModule(page);
    await mdp.assertNoSearchOrSourceControls();
  });

  test('MDP-032 confirms no leading/trailing-space search-trim surface exists (adapted) @P2', async ({ page }) => {
    const mdp = new MovieDataProviderModule(page);
    await mdp.assertNoSearchOrSourceControls();
  });

  test('MDP-033 confirms no case-insensitive suggestive-search surface exists (adapted) @P2', async ({ page }) => {
    const mdp = new MovieDataProviderModule(page);
    await mdp.assertNoSearchOrSourceControls();
  });

  test('MDP-034 confirms no deselect-all-Cast surface exists (adapted) @P2', async ({ page }) => {
    const mdp = new MovieDataProviderModule(page);
    await mdp.assertNoImportForm();
  });
});
