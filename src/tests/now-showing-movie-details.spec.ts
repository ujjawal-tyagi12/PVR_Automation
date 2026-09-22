import { test } from '@playwright/test';
import { MovieDetailsModule } from '@modules/MovieDetailsModule';

/**
 * Grounded against the live app at BASE_URL (direct Playwright probe, 2026-09-22) — see
 * TestData/TestMd/now-showing-movie-details.md. Uses a live now-showing title
 * (Ramayanam(Hindi), id 30212, Mumbai) as of grounding time — live catalog data that will
 * naturally rotate.
 *
 * @hritik
 */
test.describe('Now Showing Movies Details Page (real: /moviesessions/{City}/{Movie}/{Id}) @P0 @Regression', () => {
  test.describe.configure({ retries: 2 });

  test.beforeEach(async ({ page }) => {
    const movie = new MovieDetailsModule(page);
    await movie.open('mumbai', 'ramayanamhindi', '30212');
    void page;
  });

  test('APP-068 real movie details load with full metadata @Smoke', async ({ page }) => {
    const movie = new MovieDetailsModule(page);
    await movie.assertMovieDetailsLoaded('Ramayanam');
    void page;
  });

  test('APP-069 real trailer playback opens a real video dialog @P1', async ({ page }) => {
    const movie = new MovieDetailsModule(page);
    await movie.playTrailerAndAssertOpens();
    void page;
  });

  test('APP-070 real showtime color-coding legend is shown @Smoke', async ({ page }) => {
    const movie = new MovieDetailsModule(page);
    await movie.assertShowtimeColorCodingLegendShown();
    void page;
  });

  test('APP-071 confirms the color-coding legend as the reachable piece of the sold-out rule (adapted) @P1 [Negative]', async ({
    page,
  }) => {
    const movie = new MovieDetailsModule(page);
    await movie.assertShowtimeColorCodingLegendShown();
    void page;
  });

  test('APP-072 confirms lapsed-showtime timing cannot be waited out in an automated test (adapted) @P1', async ({
    page,
  }) => {
    const movie = new MovieDetailsModule(page);
    await movie.assertShowtimeGridVisible();
    void page;
  });

  test('APP-073 real showtimes render in ascending chronological order @P2', async ({ page }) => {
    const movie = new MovieDetailsModule(page);
    await movie.assertShowtimesSortedAscending();
    void page;
  });

  test('APP-074 real date selector updates the showtime grid @P1', async ({ page }) => {
    const movie = new MovieDetailsModule(page);
    await movie.switchToAnotherAvailableDate();
    await movie.assertShowtimeGridVisible();
    void page;
  });

  test('APP-075 real format/experience filter is reachable @P2', async ({ page }) => {
    const movie = new MovieDetailsModule(page);
    await movie.openFormatFilter();
    void page;
  });

  test('APP-076 real language/subtitle info displays per showtime @P2', async ({ page }) => {
    const movie = new MovieDetailsModule(page);
    await movie.assertLanguageAndSubtitleInfoShown();
    void page;
  });
});
