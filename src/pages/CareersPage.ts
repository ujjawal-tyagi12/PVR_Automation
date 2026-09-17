import { Page } from '@playwright/test';

/**
 * Grounded against the live app at BASE_URL/career (Playwright MCP,
 * 2026-09-01) — the real "Career" menu item under header > More. It is a
 * public content page (Why PVR INOX? / Explore Departments / an "Apply for the
 * role" form / Connect With Us), not the Static Management → Careers admin CRUD
 * screen described in the sheet (Image/Title/Address/Latitude/Longitude/
 * Description/Brand/Country/Last Edited On/Status/Action per entry). No such
 * admin listing or editor is reachable anywhere on this app — checked directly
 * against this page and the account sidebar. See
 * TestData/TestMd/careers-page.md.
 */
export class CareersPage {
  constructor(private page: Page) {}

  whyPvrHeading = () => this.page.getByRole('heading', { name: 'Why PVR INOX?' });
  departmentsHeading = () => this.page.getByRole('heading', { name: 'Explore Departments' });
  applyDialogHeading = () => this.page.getByRole('heading', { name: 'Apply for the role' });
  imageUploadInput = () => this.page.locator('input[type="file"]');
  latitudeField = () => this.page.getByLabel(/latitude/i);
  longitudeField = () => this.page.getByLabel(/longitude/i);

  async goto(): Promise<void> {
    await this.page.goto('/career');
  }
}
