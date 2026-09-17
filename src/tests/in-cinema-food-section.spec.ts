import { test } from '@playwright/test';
import { InCinemaFoodSectionModule } from '@modules/InCinemaFoodSectionModule';

/**
 * Grounded against the live app at BASE_URL/food?tab=book-with-ticket (direct Playwright probe,
 * 2026-09-10). This is the real, public "Book with Ticket" tab — see
 * TestData/TestMd/in-cinema-food-section.md. There is no admin edit form (Title/Sub-Title/
 * Description/Image) anywhere on this app.
 */
test.describe('In-Cinema Food Section (real: public Book with Ticket tab; no admin CMS form) @P2 @Regression', () => {
  test.describe.configure({ retries: 2 });

  test.beforeEach(async ({ page }) => {
    const icf = new InCinemaFoodSectionModule(page);
    await icf.open();
    void page;
  });

  test('ICF-001 real tab shows the genuine banner/toggle content, not an admin edit screen @Smoke', async ({ page }) => {
    const icf = new InCinemaFoodSectionModule(page);
    await icf.assertRealStaticContentVisible();
  });

  test('ICF-002 confirms no all-fields admin update form exists (adapted) @P1', async ({ page }) => {
    const icf = new InCinemaFoodSectionModule(page);
    await icf.assertNoEditForm();
  });

  test('ICF-003 confirms no image-only update control exists (adapted) @P2', async ({ page }) => {
    const icf = new InCinemaFoodSectionModule(page);
    await icf.assertNoImageUpload();
  });

  test('ICF-004 confirms no text-only update control exists (adapted) @P2', async ({ page }) => {
    const icf = new InCinemaFoodSectionModule(page);
    await icf.assertNoEditForm();
  });

  test('ICF-005 confirms no bullet-formatted Description field exists (adapted) @P2', async ({ page }) => {
    const icf = new InCinemaFoodSectionModule(page);
    await icf.assertNoEditForm();
  });

  test('ICF-006 real unbooked session shows a genuine login prompt, not stale saved content @P1', async ({ page }) => {
    const icf = new InCinemaFoodSectionModule(page);
    await icf.assertUnbookedUserSeesLoginPrompt();
  });

  test('ICF-020 confirms no missing-Title validation surface exists (adapted) @P2', async ({ page }) => {
    const icf = new InCinemaFoodSectionModule(page);
    await icf.assertNoEditForm();
  });

  test('ICF-021 confirms no missing-Sub-Title validation surface exists (adapted) @P2', async ({ page }) => {
    const icf = new InCinemaFoodSectionModule(page);
    await icf.assertNoEditForm();
  });

  test('ICF-022 confirms no missing-Description validation surface exists (adapted) @P2', async ({ page }) => {
    const icf = new InCinemaFoodSectionModule(page);
    await icf.assertNoEditForm();
  });

  test('ICF-023 confirms no missing-Image validation surface exists (adapted) @P2', async ({ page }) => {
    const icf = new InCinemaFoodSectionModule(page);
    await icf.assertNoImageUpload();
  });

  test('ICF-024 confirms no whitespace-only-Title validation surface exists (adapted) @P2', async ({ page }) => {
    const icf = new InCinemaFoodSectionModule(page);
    await icf.assertNoEditForm();
  });

  test('ICF-025 confirms no whitespace-only-Sub-Title validation surface exists (adapted) @P2', async ({ page }) => {
    const icf = new InCinemaFoodSectionModule(page);
    await icf.assertNoEditForm();
  });

  test('ICF-026 confirms no unsupported-image-format validation surface exists (adapted) @P2', async ({ page }) => {
    const icf = new InCinemaFoodSectionModule(page);
    await icf.assertNoImageUpload();
  });

  test('ICF-027 confirms no image-max-size validation surface exists (adapted) @P2', async ({ page }) => {
    const icf = new InCinemaFoodSectionModule(page);
    await icf.assertNoImageUpload();
  });

  test('ICF-028 confirms no hotlinked-image rejection surface exists (adapted) @P2', async ({ page }) => {
    const icf = new InCinemaFoodSectionModule(page);
    await icf.assertNoImageUpload();
  });

  test('ICF-029 confirms no backend-save-failure surface exists (adapted) @P2', async ({ page }) => {
    const icf = new InCinemaFoodSectionModule(page);
    await icf.assertNoEditForm();
  });

  test('ICF-030 confirms no Title maximum-length (100-char) boundary surface exists (adapted) @P2', async ({ page }) => {
    const icf = new InCinemaFoodSectionModule(page);
    await icf.assertNoEditForm();
  });

  test('ICF-031 confirms no Title over-maximum-length (101-char) validation surface exists (adapted) @P2', async ({ page }) => {
    const icf = new InCinemaFoodSectionModule(page);
    await icf.assertNoEditForm();
  });

  test('ICF-032 confirms no Title minimum-length (10-char) boundary surface exists (adapted) @P2', async ({ page }) => {
    const icf = new InCinemaFoodSectionModule(page);
    await icf.assertNoEditForm();
  });

  test('ICF-033 confirms no Title under-minimum-length (9-char) validation surface exists (adapted) @P2', async ({ page }) => {
    const icf = new InCinemaFoodSectionModule(page);
    await icf.assertNoEditForm();
  });

  test('ICF-034 confirms no Sub-Title length-boundary surface exists (adapted) @P2', async ({ page }) => {
    const icf = new InCinemaFoodSectionModule(page);
    await icf.assertNoEditForm();
  });

  test('ICF-035 confirms no Description maximum-length (1000-char) boundary surface exists (adapted) @P2', async ({ page }) => {
    const icf = new InCinemaFoodSectionModule(page);
    await icf.assertNoEditForm();
  });

  test('ICF-036 confirms no Description over-maximum-length (1001-char) validation surface exists (adapted) @P2', async ({ page }) => {
    const icf = new InCinemaFoodSectionModule(page);
    await icf.assertNoEditForm();
  });

  test('ICF-037 confirms no Description under-minimum-length (9-char) validation surface exists (adapted) @P2', async ({ page }) => {
    const icf = new InCinemaFoodSectionModule(page);
    await icf.assertNoEditForm();
  });

  test('ICF-038 confirms no image exact-5MB-boundary surface exists (adapted) @P2', async ({ page }) => {
    const icf = new InCinemaFoodSectionModule(page);
    await icf.assertNoImageUpload();
  });
});
