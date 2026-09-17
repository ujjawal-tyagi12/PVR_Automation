import { Page } from '@playwright/test';

/**
 * Grounded against the live app at BASE_URL/about-us (Playwright MCP, 2026-08-31).
 * This is the real, public, read-only rendering of the content the sheet's ABU-*
 * scenarios describe (see TestData/TestMd/about-us.md) — tab names match exactly
 * (Company / Our Journey / Team / Awards / Brands). There is no Country/Brand
 * filter and no Add/Edit/Delete/Toggle affordance anywhere on this page — it is
 * not the CMS editor, just its published output.
 */
export class AboutUsPage {
  constructor(private page: Page) {}

  companyTab = () => this.page.getByRole('button', { name: 'Company', exact: true });
  ourJourneyTab = () => this.page.getByRole('button', { name: 'Our Journey' });
  teamTab = () => this.page.getByRole('button', { name: 'Team', exact: true });
  awardsTab = () => this.page.getByRole('button', { name: 'Awards', exact: true });
  brandsTab = () => this.page.getByRole('button', { name: 'Brands', exact: true });

  companyHeading = () => this.page.getByRole('heading', { name: 'The Company' }).first();
  companyStrengthHeading = () => this.page.getByRole('heading', { name: 'Company Strength' });
  ourJourneyHeading = () => this.page.getByRole('heading', { name: 'Our Journey' });
  teamHeading = () => this.page.getByRole('heading', { name: 'TEAM' });
  managementHeading = () => this.page.getByRole('heading', { name: 'Management' });
  boardOfDirectorsHeading = () => this.page.getByRole('heading', { name: 'Board of Directors' });
  awardsHeading = () => this.page.getByRole('heading', { name: 'Awards & Recognition' });
  awardsYearFilter = (year: 'All' | '2024' | '2025') => this.page.getByRole('button', { name: year, exact: true });
  brandsHeading = () => this.page.getByRole('heading', { name: 'Brands', exact: true });
  // Grounded via direct probe (2026-08-31): two "Download" buttons render on the Brands
  // section (multiple brand guideline assets) — .first() avoids a strict-mode violation.
  brandGuidelinesDownloadButton = () => this.page.getByRole('button', { name: 'Download' }).first();
  fileUploadInput = () => this.page.locator('input[type="file"]');

  async goto(): Promise<void> {
    await this.page.goto('/about-us');
  }
}
