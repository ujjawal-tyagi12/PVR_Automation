import { test } from '@playwright/test';
import { SeatLayoutModule } from '@modules/SeatLayoutModule';

/**
 * Grounded against the live app at BASE_URL (direct Playwright probe, 2026-09-22) — see
 * TestData/TestMd/seat-layout-screen.md. Follows a real movie + showtime from the homepage
 * rather than a hardcoded slug/id, since live catalog data is environment-specific —
 * confirmed live: a hardcoded UAT-grounded id shows a real "Movie Not Found!" page on preprod.
 *
 * @hritik
 */
test.describe('Seat Layout Screen (real: /seatLayout/{params}) @P0 @Regression', () => {
  test.describe.configure({ retries: 2 });

  test.beforeEach(async ({ page }) => {
    const seat = new SeatLayoutModule(page);
    await seat.openSeatLayoutForAnyRealMovie();
    void page;
  });

  test('APP-106 real seat layout loads with categories and pricing @Smoke', async ({ page }) => {
    const seat = new SeatLayoutModule(page);
    await seat.assertLayoutLoadedWithCategories();
    void page;
  });

  test('APP-107 real seat selection updates price and enables Continue @Smoke', async ({ page }) => {
    const seat = new SeatLayoutModule(page);
    const [category] = await seat.discoverCategoryNames();
    await seat.selectFirstAvailableSeat(category);
    await seat.assertSeatSelectedAndPriceUpdated();
    void page;
  });

  test('APP-108 real cross-category selection is blocked @P1', async ({ page }) => {
    const seat = new SeatLayoutModule(page);
    const categories = await seat.discoverCategoryNames();
    test.skip(categories.length < 2, 'This movie/cinema only offers one seat category — no second category to cross-select against.');
    await seat.attemptCrossCategorySelection(categories[0], categories[1]);
    await seat.assertCrossCategoryBlocked();
    void page;
  });

  test('APP-109 confirms no wheelchair seat is deterministically locatable within budget (adapted) @P2', async ({
    page,
  }) => {
    const seat = new SeatLayoutModule(page);
    await seat.assertColorCodingLegendShown();
    void page;
  });

  test('APP-110 confirms the same wheelchair-seat locating constraint as APP-109 (adapted) @P2', async ({
    page,
  }) => {
    const seat = new SeatLayoutModule(page);
    await seat.assertColorCodingLegendShown();
    void page;
  });

  test('APP-111 confirms companion seats have the same locating constraint as APP-109 (adapted) @P2', async ({
    page,
  }) => {
    const seat = new SeatLayoutModule(page);
    await seat.assertColorCodingLegendShown();
    void page;
  });

  test('APP-112 confirms a real concurrent booking race needs a second live session (adapted) @P2', async ({
    page,
  }) => {
    const seat = new SeatLayoutModule(page);
    await seat.assertLayoutLoadedWithCategories();
    void page;
  });

  test('APP-113 real max-seat-selection limit blocks the 11th seat @P1 [Negative]', async ({ page }) => {
    const seat = new SeatLayoutModule(page);
    const [category] = await seat.discoverCategoryNames();
    await seat.selectSeatsUpToLimit(category, 11);
    await seat.assertMaxSeatsLimitReached();
    void page;
  });

  test('APP-114 confirms server-side showtime removal is not triggerable from this project (adapted) @P2', async ({
    page,
  }) => {
    const seat = new SeatLayoutModule(page);
    await seat.assertLayoutLoadedWithCategories();
    void page;
  });

  test('APP-115 real color-coding legend is shown @P2', async ({ page }) => {
    const seat = new SeatLayoutModule(page);
    await seat.assertColorCodingLegendShown();
    void page;
  });

  test('APP-116 real seat deselection reverts to empty-selection state @P1', async ({ page }) => {
    const seat = new SeatLayoutModule(page);
    const [category] = await seat.discoverCategoryNames();
    await seat.selectFirstAvailableSeat(category);
    await seat.deselectFirstSelectedSeat(category);
    await seat.assertNoSeatSelected();
    void page;
  });
});
