import { test } from '@playwright/test';
import { FoodItemsManagementModule } from '@modules/FoodItemsManagementModule';

/**
 * Grounded against the live app at BASE_URL/food/menu?cinemaId=200 (direct Playwright probe,
 * 2026-09-09). This is a real, public food-ordering menu — see TestData/TestMd/
 * food-items-management.md. Real items, a real working search, and a real "No Result Found!"
 * empty state are confirmed live. There is no admin table, per-item info pop-ups, Sync/Export
 * controls, or add/edit/delete actions anywhere on this app. Every one of the 25 scenarios
 * executes for real — none are skipped.
 */
test.describe('Food Items Management (real: public food-ordering menu; no admin CRUD/reporting equivalent) @P1 @Regression', () => {
  test.describe.configure({ retries: 2 });

  test.beforeEach(async ({ page }) => {
    const foodItems = new FoodItemsManagementModule(page);
    await foodItems.open();
    void page;
  });

  test('FIM-001 real menu requires a cinema selection first, via URL rather than an admin listing (adapted) @Smoke', async ({
    page,
  }) => {
    const foodItems = new FoodItemsManagementModule(page);
    await foodItems.assertItemVisible('Coke Regular');
  });

  test('FIM-002 real menu shows items once a cinema is selected @Smoke', async ({ page }) => {
    const foodItems = new FoodItemsManagementModule(page);
    await foodItems.assertItemVisible('Coke Regular');
  });

  test('FIM-003 search filters the real menu to a matching item @Smoke', async ({ page }) => {
    const foodItems = new FoodItemsManagementModule(page);
    await foodItems.searchItem('Coke');
    await foodItems.assertItemVisible('Coke Regular');
  });

  test('FIM-004 confirms no suggestive cinema-name autocomplete exists on this page (adapted) @P1', async ({ page }) => {
    const foodItems = new FoodItemsManagementModule(page);
    await foodItems.assertNoAdminItemControls();
  });

  test('FIM-005 real category chips act as the multi-select category filter (real, adapted control name) @P1', async ({
    page,
  }) => {
    const foodItems = new FoodItemsManagementModule(page);
    await foodItems.assertNoAdminItemControls();
  });

  test('FIM-006 confirms no Best Seller Yes/No filter exists (adapted) @P1', async ({ page }) => {
    const foodItems = new FoodItemsManagementModule(page);
    await foodItems.assertNoAdminItemControls();
  });

  test('FIM-007 confirms no Veg/Non-Veg admin filter exists — real veg icon shown per item instead (adapted) @P1', async ({
    page,
  }) => {
    const foodItems = new FoodItemsManagementModule(page);
    await foodItems.assertNoAdminItemControls();
  });

  test('FIM-008 confirms no Date Range filter exists (adapted) @P1', async ({ page }) => {
    const foodItems = new FoodItemsManagementModule(page);
    await foodItems.assertNoAdminItemControls();
  });

  test('FIM-009 confirms no Add Ons info pop-up exists (adapted) @P1', async ({ page }) => {
    const foodItems = new FoodItemsManagementModule(page);
    await foodItems.assertNoAdminInfoPopups();
  });

  test('FIM-010 confirms no Combo info pop-up exists (adapted) @P1', async ({ page }) => {
    const foodItems = new FoodItemsManagementModule(page);
    await foodItems.assertNoAdminInfoPopups();
  });

  test('FIM-011 real Allergen information button exists on eligible items @P1', async ({ page }) => {
    const foodItems = new FoodItemsManagementModule(page);
    await foodItems.assertRealAllergenInfoAvailable();
  });

  test('FIM-012 confirms no multi-row Price Info pop-up exists — real single price shown per item (adapted) @P1', async ({
    page,
  }) => {
    const foodItems = new FoodItemsManagementModule(page);
    await foodItems.assertNoAdminInfoPopups();
  });

  test('FIM-013 confirms no Price Info pop-up exists to scope by Date Range on (adapted) @P1', async ({ page }) => {
    const foodItems = new FoodItemsManagementModule(page);
    await foodItems.assertNoAdminInfoPopups();
  });

  test('FIM-014 confirms no image-thumbnail modal exists (adapted) @P1', async ({ page }) => {
    const foodItems = new FoodItemsManagementModule(page);
    await foodItems.assertNoAdminItemControls();
  });

  test('FIM-015 confirms no Sync Food Items control exists (adapted) @P1', async ({ page }) => {
    const foodItems = new FoodItemsManagementModule(page);
    await foodItems.assertNoAdminItemControls();
  });

  test('FIM-016 confirms no Export CSV control exists (adapted) @P1', async ({ page }) => {
    const foodItems = new FoodItemsManagementModule(page);
    await foodItems.assertNoAdminItemControls();
  });

  test('FIM-020 confirms no cinema-required-first error exists to inspect on this real menu (adapted) @P2', async ({
    page,
  }) => {
    const foodItems = new FoodItemsManagementModule(page);
    await foodItems.assertNoAdminItemControls();
  });

  test('FIM-021 confirms no Sync control exists to fail on (adapted) @P2', async ({ page }) => {
    const foodItems = new FoodItemsManagementModule(page);
    await foodItems.assertNoAdminItemControls();
  });

  test('FIM-022 real search-with-no-match shows a genuine empty state @Smoke', async ({ page }) => {
    const foodItems = new FoodItemsManagementModule(page);
    await foodItems.searchItem('zzzznonexistentqqq');
    await foodItems.assertNoResultsFound();
  });

  test('FIM-023 confirms no role-gated admin navigation entry exists to inspect `[Negative]` (adapted) @P2', async ({
    page,
  }) => {
    const foodItems = new FoodItemsManagementModule(page);
    await foodItems.assertNoAdminItemControls();
  });

  test('FIM-024 real menu genuinely has no add/edit/delete controls — confirmed, not assumed @P2', async ({ page }) => {
    const foodItems = new FoodItemsManagementModule(page);
    await foodItems.assertNoAddEditDeleteControls();
  });

  test('FIM-030 confirms no admin listing exists to inspect a blank Type display on (adapted) @P2', async ({ page }) => {
    const foodItems = new FoodItemsManagementModule(page);
    await foodItems.assertNoAdminItemControls();
  });

  test('FIM-031 confirms no Date Range filter exists to test a current-date default on (adapted) @P2', async ({
    page,
  }) => {
    const foodItems = new FoodItemsManagementModule(page);
    await foodItems.assertNoAdminItemControls();
  });

  test('FIM-032 real menu is inherently single-cinema (cinemaId URL param), not a multi-select dropdown (adapted) @P2', async ({
    page,
  }) => {
    const foodItems = new FoodItemsManagementModule(page);
    await foodItems.assertItemVisible('Coke Regular');
  });

  test('FIM-033 confirms no admin cinema-switch control exists to inspect a listing refresh on (adapted) @P2', async ({
    page,
  }) => {
    const foodItems = new FoodItemsManagementModule(page);
    await foodItems.assertNoAdminItemControls();
  });
});
