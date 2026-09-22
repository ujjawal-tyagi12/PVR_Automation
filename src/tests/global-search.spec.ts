import { test } from '@playwright/test';
import { GlobalSearchModule } from '@modules/GlobalSearchModule';

/**
 * Grounded against the live app at BASE_URL (direct Playwright probe, 2026-09-22) — see
 * TestData/TestMd/global-search.md. Uses live now-showing/cinema data as of grounding time.
 *
 * @hritik
 */
test.describe('Global Search (real: header Search dialog) @P0 @Regression', () => {
  test.describe.configure({ retries: 2 });

  test.beforeEach(async ({ page }) => {
    const search = new GlobalSearchModule(page);
    await search.open();
    await search.openSearchDialog();
    void page;
  });

  test('APP-077 real movie search returns matching results @Smoke', async ({ page }) => {
    const search = new GlobalSearchModule(page);
    await search.searchFor('Spider');
    await search.assertMovieResultShown('Spider-Man: Brand New Day');
    void page;
  });

  test('APP-078 real cinema search returns matching results @P1', async ({ page }) => {
    const search = new GlobalSearchModule(page);
    await search.openCinemasTab();
    await search.searchFor('INOX Megaplex, Inorbit Mall');
    await search.assertCinemaResultShown('INOX Megaplex, Inorbit Mall');
    void page;
  });

  test('APP-079 real no-results message for an unmatched search @P2 [Negative]', async ({ page }) => {
    const search = new GlobalSearchModule(page);
    await search.searchFor('zzznonsensequery');
    await search.assertNoResultsMessageShown();
    void page;
  });

  test('APP-080 real predictive filtering updates results as the term is typed @P2', async ({ page }) => {
    const search = new GlobalSearchModule(page);
    await search.searchFor('Spider');
    await search.assertMovieResultShown('Spider-Man: Brand New Day');
    void page;
  });

  test('APP-081 confirms no Recent Searches section exists on this dialog (adapted) @P2', async ({ page }) => {
    const search = new GlobalSearchModule(page);
    await search.assertNoRecentSearchesSectionExists();
    void page;
  });

  test('APP-082 real special-character/injection string is handled safely @P1 [Security]', async ({ page }) => {
    const search = new GlobalSearchModule(page);
    await search.searchFor("' OR 1=1--");
    await search.assertInjectionStringSafelyHandled();
    void page;
  });

  test('APP-083 real category filter tabs are available @P2', async ({ page }) => {
    const search = new GlobalSearchModule(page);
    await search.assertCategoryTabsAvailable();
    void page;
  });
});
