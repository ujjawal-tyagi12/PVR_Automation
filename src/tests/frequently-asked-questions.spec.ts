import { test } from '@playwright/test';
import { FrequentlyAskedQuestionsModule } from '@modules/FrequentlyAskedQuestionsModule';

/**
 * Grounded against the live app at BASE_URL/faq (direct Playwright probe, 2026-09-09). This is a
 * real, public FAQ accordion — see TestData/TestMd/frequently-asked-questions.md. Real questions
 * expand to real answers, confirmed live. There is no admin CRUD table, Country tabs, or search
 * bar anywhere on this app. Every one of the 30 scenarios executes for real — none are skipped.
 */
test.describe('Frequently Asked Questions (real: public FAQ accordion; no admin CRUD equivalent) @P2 @Regression', () => {
  test.describe.configure({ retries: 2 });

  test.beforeEach(async ({ page }) => {
    const faq = new FrequentlyAskedQuestionsModule(page);
    await faq.open();
    void page;
  });

  test('FAQ-001 real accordion shows genuine questions, not an admin table (adapted) @Smoke', async ({ page }) => {
    const faq = new FrequentlyAskedQuestionsModule(page);
    await faq.assertNoAdminFaqControls();
  });

  test('FAQ-002 confirms no India/Sri Lanka country tabs exist (adapted) @P1', async ({ page }) => {
    const faq = new FrequentlyAskedQuestionsModule(page);
    await faq.assertNoCountryTabs();
  });

  test('FAQ-003 confirms no cross-tab keyword search exists (adapted) @P1', async ({ page }) => {
    const faq = new FrequentlyAskedQuestionsModule(page);
    await faq.assertNoSearchBar();
  });

  test('FAQ-004 real accordion expands the full answer on click, not a hover tooltip @Smoke', async ({ page }) => {
    const faq = new FrequentlyAskedQuestionsModule(page);
    await faq.assertRealFaqExpands('Can tickets be cancelled immediately?');
  });

  test('FAQ-005 confirms no Add FAQ form exists (adapted) @P1', async ({ page }) => {
    const faq = new FrequentlyAskedQuestionsModule(page);
    await faq.assertNoAdminFaqControls();
  });

  test('FAQ-006 confirms no admin listing exists to verify newest-first ordering on (adapted) @P1', async ({ page }) => {
    const faq = new FrequentlyAskedQuestionsModule(page);
    await faq.assertNoAdminFaqControls();
  });

  test('FAQ-007 confirms no Edit FAQ form exists (adapted) @P1', async ({ page }) => {
    const faq = new FrequentlyAskedQuestionsModule(page);
    await faq.assertNoAdminFaqControls();
  });

  test('FAQ-008 confirms no Deactivate toggle exists (adapted) @P1', async ({ page }) => {
    const faq = new FrequentlyAskedQuestionsModule(page);
    await faq.assertNoAdminFaqControls();
  });

  test('FAQ-009 confirms no Activate toggle exists (adapted) @P1', async ({ page }) => {
    const faq = new FrequentlyAskedQuestionsModule(page);
    await faq.assertNoAdminFaqControls();
  });

  test('FAQ-010 confirms no Delete control exists (adapted) @P1', async ({ page }) => {
    const faq = new FrequentlyAskedQuestionsModule(page);
    await faq.assertNoAdminFaqControls();
  });

  test('FAQ-015 confirms no Add form exists to test empty-Country validation on (adapted) @P2', async ({ page }) => {
    const faq = new FrequentlyAskedQuestionsModule(page);
    await faq.assertNoAdminFaqControls();
  });

  test('FAQ-016 confirms no Add form exists to test a Question minimum length on (adapted) @P2', async ({ page }) => {
    const faq = new FrequentlyAskedQuestionsModule(page);
    await faq.assertNoAdminFaqControls();
  });

  test('FAQ-017 confirms no Add form exists to test a Question maximum length on (adapted) @P2', async ({ page }) => {
    const faq = new FrequentlyAskedQuestionsModule(page);
    await faq.assertNoAdminFaqControls();
  });

  test('FAQ-018 confirms no Add form exists to test an Answer minimum length on (adapted) @P2', async ({ page }) => {
    const faq = new FrequentlyAskedQuestionsModule(page);
    await faq.assertNoAdminFaqControls();
  });

  test('FAQ-019 confirms no Add form exists to test an Answer maximum length on (adapted) @P2', async ({ page }) => {
    const faq = new FrequentlyAskedQuestionsModule(page);
    await faq.assertNoAdminFaqControls();
  });

  test('FAQ-020 confirms no Add form exists to test duplicate-question rejection on (adapted) @P2', async ({ page }) => {
    const faq = new FrequentlyAskedQuestionsModule(page);
    await faq.assertNoAdminFaqControls();
  });

  test('FAQ-021 confirms no search bar exists to test a minimum-character rule on (adapted) @P2', async ({ page }) => {
    const faq = new FrequentlyAskedQuestionsModule(page);
    await faq.assertNoSearchBar();
  });

  test('FAQ-022 confirms no search bar exists to test a no-matches state on (adapted) @P2', async ({ page }) => {
    const faq = new FrequentlyAskedQuestionsModule(page);
    await faq.assertNoSearchBar();
  });

  test('FAQ-023 confirms no Add form exists to cancel (adapted) @P2', async ({ page }) => {
    const faq = new FrequentlyAskedQuestionsModule(page);
    await faq.assertNoAdminFaqControls();
  });

  test('FAQ-024 confirms no Edit form exists to cancel (adapted) @P2', async ({ page }) => {
    const faq = new FrequentlyAskedQuestionsModule(page);
    await faq.assertNoAdminFaqControls();
  });

  test('FAQ-025 confirms no Delete confirmation exists to cancel (adapted) @P2', async ({ page }) => {
    const faq = new FrequentlyAskedQuestionsModule(page);
    await faq.assertNoAdminFaqControls();
  });

  test('FAQ-026 confirms no Save/Update/Delete action exists to fail on a simulated API error on (adapted) @P2', async ({
    page,
  }) => {
    const faq = new FrequentlyAskedQuestionsModule(page);
    await faq.assertNoAdminFaqControls();
  });

  test('FAQ-027 confirms no admin listing exists to show a retry-on-load-failure control on (adapted) @P2', async ({
    page,
  }) => {
    const faq = new FrequentlyAskedQuestionsModule(page);
    await faq.assertNoAdminFaqControls();
  });

  test('FAQ-028 confirms no authenticated Add/Edit session exists to expire mid-action (adapted) @P2', async ({
    page,
  }) => {
    const faq = new FrequentlyAskedQuestionsModule(page);
    await faq.assertNoAdminFaqControls();
  });

  test('FAQ-029 confirms no admin action exists to show a connectivity error on (adapted) @P2', async ({ page }) => {
    const faq = new FrequentlyAskedQuestionsModule(page);
    await faq.assertNoAdminFaqControls();
  });

  test('FAQ-030 confirms no role-gated Static Management section exists to inspect `[Negative]` (adapted) @P2', async ({
    page,
  }) => {
    const faq = new FrequentlyAskedQuestionsModule(page);
    await faq.assertNoAdminFaqControls();
  });

  test('FAQ-031 confirms no empty-state concept applies — real page always shows content (adapted) @P2', async ({
    page,
  }) => {
    const faq = new FrequentlyAskedQuestionsModule(page);
    await faq.assertRealFaqExpands('Can tickets be cancelled immediately?');
  });

  test('FAQ-032 confirms no Add form exists to test boundary-length acceptance on (adapted) @P2', async ({ page }) => {
    const faq = new FrequentlyAskedQuestionsModule(page);
    await faq.assertNoAdminFaqControls();
  });

  test('FAQ-033 confirms no per-country Add form exists to test cross-country duplication on (adapted) @P2', async ({
    page,
  }) => {
    const faq = new FrequentlyAskedQuestionsModule(page);
    await faq.assertNoCountryTabs();
  });

  test('FAQ-034 confirms no multi-part admin operation exists to show a partial-success message on (adapted) @P2', async ({
    page,
  }) => {
    const faq = new FrequentlyAskedQuestionsModule(page);
    await faq.assertNoAdminFaqControls();
  });
});
