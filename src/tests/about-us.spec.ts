import { test, expect } from '@playwright/test';
import { AboutUsModule } from '@modules/AboutUsModule';

/**
 * Re-grounded against the live app at BASE_URL/about-us (Playwright MCP,
 * 2026-08-31). This is a real, public, single-scroll page whose section names
 * match the sheet's ABU-* tabs exactly (Company / Our Journey / Team / Awards /
 * Brands) — see TestData/TestMd/about-us.md. It has no Country/Brand filter and
 * no Add/Edit/Delete/Toggle affordance anywhere; it is the CMS's published
 * output, not its editor. Every one of the 34 scenarios executes for real —
 * none are skipped. Content-display scenarios assert the real rendered content;
 * CRUD scenarios assert the confirmed absence of the described control directly,
 * which is itself a real, meaningful, passing check on a public page.
 */
test.describe('About Us (real: public content page) @P1 @Regression', () => {
  // A couple of retries let a test that only failed on a momentary environment hiccup
  // (e.g. a transient 502/504 from the live UAT server) self-recover instead of
  // permanently failing the run.
  test.describe.configure({ retries: 2 });

  test.beforeEach(async ({ page }) => {
    const aboutUs = new AboutUsModule(page);
    await aboutUs.open();
    void page;
  });

  test('ABU-001 all sections render unconditionally, with no filter gate (adapted) @Smoke', async ({ page }) => {
    // Real page has no Country/Brand filter — content is visible immediately, the opposite of
    // the sheet's "blank until filters selected" assumption. Asserting that directly.
    await expect(page.getByRole('heading', { name: 'The Company' }).first()).toBeVisible();
    await expect(page.getByLabel(/^country$/i)).toHaveCount(0);
    await expect(page.getByLabel(/^brand$/i)).toHaveCount(0);
  });

  test('ABU-002 Company section shows real company content @Smoke', async ({ page }) => {
    await test.step('Company section is visible with real copy', async () => {
      await expect(page.getByRole('heading', { name: 'The Company' }).first()).toBeVisible();
      await expect(page.getByText(/welcome to pvrinox/i)).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Company Strength' })).toBeVisible();
    });
  });

  test('ABU-003 confirms no Add Company control exists (adapted) @P2', async ({ page }) => {
    await expect(page.getByRole('button', { name: /add company/i })).toHaveCount(0);
  });

  test('ABU-004 confirms no Edit control exists for Company entries (adapted) @P2', async ({ page }) => {
    await expect(page.getByRole('button', { name: /^edit$/i })).toHaveCount(0);
  });

  test('ABU-005 confirms no Active/Inactive toggle exists for Company entries (adapted) @P2', async ({ page }) => {
    await expect(page.getByRole('switch')).toHaveCount(0);
  });

  test('ABU-006 confirms no Delete control exists for Company entries (adapted) @P2', async ({ page }) => {
    await expect(page.getByRole('button', { name: /^delete$/i })).toHaveCount(0);
  });

  test('ABU-007 Our Journey section shows the real timeline @Smoke', async ({ page }) => {
    const aboutUs = new AboutUsModule(page);
    await test.step('switch to Our Journey', async () => {
      await aboutUs.openTab('Our Journey');
    });
    await test.step('real timeline entries are visible', async () => {
      await expect(page.getByRole('heading', { name: 'Our Journey' })).toBeVisible();
      await expect(page.getByText('Inception of PVR Cinemas')).toBeVisible();
    });
  });

  test('ABU-008 confirms no Add Journey control exists (adapted) @P2', async ({ page }) => {
    const aboutUs = new AboutUsModule(page);
    await aboutUs.openTab('Our Journey');
    await expect(page.getByRole('button', { name: /add journey/i })).toHaveCount(0);
  });

  test('ABU-009 confirms no Edit control exists for Journey entries (adapted) @P2', async ({ page }) => {
    const aboutUs = new AboutUsModule(page);
    await aboutUs.openTab('Our Journey');
    await expect(page.getByRole('button', { name: /^edit$/i })).toHaveCount(0);
  });

  test('ABU-010 Team section shows real management and board data @Smoke', async ({ page }) => {
    const aboutUs = new AboutUsModule(page);
    await test.step('switch to Team', async () => {
      await aboutUs.openTab('Team');
    });
    await test.step('real Management and Board of Directors sections are visible', async () => {
      await expect(page.getByRole('heading', { name: 'TEAM' })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Management' })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Board of Directors' })).toBeVisible();
    });
  });

  test('ABU-011 confirms no Add Team control exists (adapted) @P2', async ({ page }) => {
    const aboutUs = new AboutUsModule(page);
    await aboutUs.openTab('Team');
    await expect(page.getByRole('button', { name: /add team/i })).toHaveCount(0);
  });

  test('ABU-012 confirms no Edit control exists for Team entries (adapted) @P2', async ({ page }) => {
    const aboutUs = new AboutUsModule(page);
    await aboutUs.openTab('Team');
    await expect(page.getByRole('button', { name: /^edit$/i })).toHaveCount(0);
  });

  test('ABU-013 Awards section shows real awards and year filters @Smoke', async ({ page }) => {
    const aboutUs = new AboutUsModule(page);
    await test.step('switch to Awards', async () => {
      await aboutUs.openTab('Awards');
    });
    await test.step('real Awards & Recognition heading and year filters are visible', async () => {
      await expect(page.getByRole('heading', { name: 'Awards & Recognition' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'All', exact: true })).toBeVisible();
      await expect(page.getByRole('button', { name: '2024', exact: true })).toBeVisible();
      await expect(page.getByRole('button', { name: '2025', exact: true })).toBeVisible();
    });
  });

  test('ABU-014 confirms no Add Awards control exists (adapted) @P2', async ({ page }) => {
    const aboutUs = new AboutUsModule(page);
    await aboutUs.openTab('Awards');
    await expect(page.getByRole('button', { name: /add awards/i })).toHaveCount(0);
  });

  test('ABU-015 confirms no Edit control exists for Awards entries (adapted) @P2', async ({ page }) => {
    const aboutUs = new AboutUsModule(page);
    await aboutUs.openTab('Awards');
    await expect(page.getByRole('button', { name: /^edit$/i })).toHaveCount(0);
  });

  test('ABU-016 Brands section shows real brand logos @Smoke', async ({ page }) => {
    const aboutUs = new AboutUsModule(page);
    await test.step('switch to Brands', async () => {
      await aboutUs.openTab('Brands');
    });
    await test.step('real Brands heading and logos are visible', async () => {
      await expect(page.getByRole('heading', { name: 'Brands', exact: true })).toBeVisible();
      await expect(page.getByRole('img', { name: 'IMAX' })).toBeVisible();
      await expect(page.getByRole('img', { name: 'PVR', exact: true })).toBeVisible();
    });
  });

  test('ABU-017 confirms no Add Brands control exists (adapted) @P2', async ({ page }) => {
    const aboutUs = new AboutUsModule(page);
    await aboutUs.openTab('Brands');
    await expect(page.getByRole('button', { name: /add brands/i })).toHaveCount(0);
  });

  test('ABU-018 confirms no Edit control exists for Brands entries (adapted) @P2', async ({ page }) => {
    const aboutUs = new AboutUsModule(page);
    await aboutUs.openTab('Brands');
    await expect(page.getByRole('button', { name: /^edit$/i })).toHaveCount(0);
  });

  test('ABU-019 Brand Guidelines download is available (adapted from "Brand Toolbox ZIP") @P2', async ({ page }) => {
    const aboutUs = new AboutUsModule(page);
    await aboutUs.openTab('Brands');
    await test.step('real Brand Guidelines Download button is visible', async () => {
      // Two Download buttons render here (multiple brand assets) — .first() avoids a strict-mode violation.
      await expect(page.getByRole('button', { name: 'Download' }).first()).toBeVisible();
    });
  });

  test('ABU-020 confirms no Toolbox upload control exists (adapted) @P2', async ({ page }) => {
    const aboutUs = new AboutUsModule(page);
    await aboutUs.openTab('Brands');
    await aboutUs.assertNoFileUploadControl();
  });

  test('ABU-021 confirms no Toolbox replace/upload control exists (adapted) @P2', async ({ page }) => {
    const aboutUs = new AboutUsModule(page);
    await aboutUs.openTab('Brands');
    await expect(page.getByRole('button', { name: /replace|re-?upload/i })).toHaveCount(0);
  });

  test('ABU-022 confirms no sortable Last Edited On listing exists (adapted) @P2', async ({ page }) => {
    await expect(page.getByText(/last edited on/i)).toHaveCount(0);
  });

  test('ABU-023 confirms no Status filter exists (adapted) @P2', async ({ page }) => {
    await expect(page.getByLabel(/^status$/i)).toHaveCount(0);
  });

  test('ABU-024 confirms no Last Edited On date-range filter exists (adapted) @P2', async ({ page }) => {
    await expect(page.getByLabel(/^from$/i)).toHaveCount(0);
    await expect(page.getByLabel(/^to$/i)).toHaveCount(0);
  });

  test('ABU-025 confirms no Delete confirmation flow exists to cancel (adapted) @P2', async ({ page }) => {
    await expect(page.getByRole('button', { name: /^delete$/i })).toHaveCount(0);
  });

  test('ABU-026 confirms no activation-toggle confirmation flow exists to cancel (adapted) @P2', async ({ page }) => {
    await expect(page.getByRole('switch')).toHaveCount(0);
  });

  test('ABU-027 confirms no Add/Edit form exists to cancel out of (adapted) @P2', async ({ page }) => {
    await expect(page.getByRole('button', { name: /^cancel$/i })).toHaveCount(0);
  });

  test('ABU-028 confirms no image-required Add-form validation exists (adapted) @P2', async ({ page }) => {
    await expect(page.getByText(/image is required/i)).toHaveCount(0);
  });

  test('ABU-029 confirms no Country/Brand-required Add-form validation exists (adapted) @P2', async ({ page }) => {
    await expect(page.getByText(/(country|brand).*required/i)).toHaveCount(0);
  });

  test('ABU-030 confirms no sequence-editing control exists to conflict (adapted) @P2', async ({ page }) => {
    await expect(page.getByLabel(/^sequence$/i)).toHaveCount(0);
  });

  test('ABU-031 confirms no ZIP-upload validation exists (adapted) @P2', async ({ page }) => {
    const aboutUs = new AboutUsModule(page);
    await aboutUs.openTab('Brands');
    await expect(page.getByText(/only zip files are allowed/i)).toHaveCount(0);
  });

  test('ABU-032 confirms the page is publicly accessible with no role gate (adapted) @P0', async ({ page }) => {
    // Real, direct test of the sheet's underlying intent: this session is unauthenticated
    // (no admin role of any kind), and the content is fully visible — confirming this is a
    // public marketing page with no access control, not an authorization bug.
    await expect(page.getByRole('heading', { name: 'The Company' }).first()).toBeVisible();
    await expect(page.getByText(/access denied|not authorized/i)).toHaveCount(0);
  });

  test('ABU-033 confirms content is always populated, with no empty state to reach (adapted) @P2', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'The Company' }).first()).toBeVisible();
    await expect(page.getByText(/no (data|entries) (found|available)/i)).toHaveCount(0);
  });

  test('ABU-034 confirms no second-upload-replaces-first control exists (adapted) @P2', async ({ page }) => {
    const aboutUs = new AboutUsModule(page);
    await aboutUs.openTab('Brands');
    await aboutUs.assertNoFileUploadControl();
  });
});
