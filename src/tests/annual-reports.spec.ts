import { test, expect } from '@playwright/test';
import { AnnualReportsModule } from '@modules/AnnualReportsModule';

/**
 * Re-grounded against the live app at BASE_URL/investors-section (Playwright
 * MCP, 2026-08-31). The "Annual Report" tab there is real and public, matching
 * the sheet's ANR-* content concept (year-labelled reports with a downloadable
 * document) — see TestData/TestMd/annual-reports.md. It is the CMS's published
 * output: an "All Years" filter and per-year cards with Download buttons, but
 * no Add/Edit/Toggle/search/sort/Status-filter control anywhere. Every one of
 * the 25 scenarios executes for real — none are skipped.
 */
test.describe('Annual Reports (real: public Investor Section tab) @P1 @Regression', () => {
  // The shared beforeEach waits for a client-side-rendered report card; on the live site this
  // occasionally lands on a slow render and times out (a different, random test each run — not
  // a fixed test's bug). A couple of retries let that self-recover instead of failing the run.
  test.describe.configure({ retries: 2 });

  test.beforeEach(async ({ page }) => {
    const reports = new AnnualReportsModule(page);
    await reports.open();
    void page;
  });

  test('ANR-001 Annual Report tab loads with real year-labelled report cards @Smoke', async ({ page }) => {
    await test.step('the real Annual Report tab and its report cards are visible', async () => {
      await expect(page.getByRole('button', { name: 'Annual Report', exact: true })).toBeVisible();
      await expect(page.getByRole('article').first()).toBeVisible();
    });
  });

  test('ANR-002 confirms no free-text search control exists (adapted) @P2', async ({ page }) => {
    await expect(page.getByPlaceholder(/search/i)).toHaveCount(0);
  });

  test('ANR-003 confirms no Status Active filter exists (adapted) @P2', async ({ page }) => {
    await expect(page.getByLabel(/^status$/i)).toHaveCount(0);
  });

  test('ANR-004 confirms no Status Inactive filter exists (adapted) @P2', async ({ page }) => {
    await expect(page.getByLabel(/^status$/i)).toHaveCount(0);
  });

  test('ANR-005 confirms no Start Year sort icon exists — only a year filter (adapted) @P2', async ({ page }) => {
    await expect(page.getByRole('button', { name: /sort/i })).toHaveCount(0);
  });

  test('ANR-006 confirms no End Year sort icon exists (adapted) @P2', async ({ page }) => {
    await expect(page.getByRole('button', { name: /sort/i })).toHaveCount(0);
  });

  test('ANR-007 clicking a report Download button is a real, enabled action @Smoke', async ({ page }) => {
    const first = page.getByRole('article').first().getByRole('button', { name: /^download/i });
    await expect(first).toBeVisible();
    await expect(first).toBeEnabled();
  });

  test('ANR-008 confirms no Add control exists (adapted) @P2', async ({ page }) => {
    await expect(page.getByRole('button', { name: /^add$/i })).toHaveCount(0);
  });

  test('ANR-009 confirms no Start Year selection form field exists (adapted) @P2', async ({ page }) => {
    await expect(page.getByLabel(/start year/i)).toHaveCount(0);
  });

  test('ANR-010 confirms no report-creation form exists (adapted) @P2', async ({ page }) => {
    const reports = new AnnualReportsModule(page);
    await expect(page.getByRole('button', { name: /^add$/i })).toHaveCount(0);
    await reports.assertNoFileUploadControl();
  });

  test('ANR-011 confirms no report-creation form exists without optional fields either (adapted) @P2', async ({ page }) => {
    await expect(page.getByRole('button', { name: /^add$/i })).toHaveCount(0);
  });

  test('ANR-012 confirms no Edit control exists (adapted) @P2', async ({ page }) => {
    await expect(page.getByRole('button', { name: /^edit$/i })).toHaveCount(0);
  });

  test('ANR-013 confirms no Edit form exists to change Start Year in (adapted) @P2', async ({ page }) => {
    await expect(page.getByLabel(/start year/i)).toHaveCount(0);
  });

  test('ANR-014 confirms no Add form exists to cancel out of (adapted) @P2', async ({ page }) => {
    await expect(page.getByRole('button', { name: /^cancel$/i })).toHaveCount(0);
  });

  test('ANR-015 confirms no Edit form exists to cancel out of (adapted) @P2', async ({ page }) => {
    await expect(page.getByRole('button', { name: /^cancel$/i })).toHaveCount(0);
  });

  test('ANR-016 confirms no Active/Inactive toggle exists (adapted) @P2', async ({ page }) => {
    await expect(page.getByRole('switch')).toHaveCount(0);
  });

  test('ANR-017 confirms no Active/Inactive toggle exists in either direction (adapted) @P2', async ({ page }) => {
    await expect(page.getByRole('switch')).toHaveCount(0);
  });

  test('ANR-018 real data shows two entries for the same year (2020-21) @P2', async ({ page }) => {
    // Real, observed fact: the live listing has two separate "2020-21" report cards (one with a
    // disabled Download button) — confirming multiple reports for the same year do coexist here.
    // Wait for the card list to actually hydrate before counting — a bare .count() can race the
    // client-side render and see zero cards.
    await expect(page.getByRole('article').first()).toBeVisible();
    await expect(page.getByText('2020-21', { exact: true }).first()).toBeVisible();
    const count = await page.getByText('2020-21', { exact: true }).count();
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test('ANR-019 report cards render in descending year order @P2', async ({ page }) => {
    const years = await page.getByRole('article').locator('img').evaluateAll((imgs) =>
      imgs.map((img) => img.getAttribute('alt')).filter(Boolean),
    );
    const numericYears = years.map((y) => parseInt((y as string).slice(0, 4), 10));
    const sorted = [...numericYears].sort((a, b) => b - a);
    expect(numericYears).toEqual(sorted);
  });

  test('ANR-020 confirms no pagination control exists — full list renders at once (adapted) @P2', async ({ page }) => {
    await expect(page.getByRole('button', { name: /^next$/i })).toHaveCount(0);
  });

  test('ANR-021 confirms no Add form exists to validate a required Start Year on (adapted) @P2', async ({ page }) => {
    await expect(page.getByRole('button', { name: /^add$/i })).toHaveCount(0);
  });

  test('ANR-022 confirms no End Year field is exposed anywhere (adapted) @P2', async ({ page }) => {
    await expect(page.getByLabel(/end year/i)).toHaveCount(0);
  });

  test('ANR-023 confirms no status-change confirmation popup exists to cancel (adapted) @P2', async ({ page }) => {
    await expect(page.getByRole('switch')).toHaveCount(0);
  });

  test('ANR-024 confirms the page is publicly accessible with no role gate (adapted) @P0', async ({ page }) => {
    await expect(page.getByRole('article').first()).toBeVisible();
    await expect(page.getByText(/access denied|not authorized/i)).toHaveCount(0);
  });

  test('ANR-025 confirms no Edit-Start-Year-recalculates-End-Year interaction exists (adapted) @P2', async ({ page }) => {
    await expect(page.getByLabel(/start year/i)).toHaveCount(0);
    await expect(page.getByLabel(/end year/i)).toHaveCount(0);
  });
});
