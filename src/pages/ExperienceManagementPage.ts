import { Page } from '@playwright/test';

/**
 * Grounded against the live app at BASE_URL/experiences (Playwright MCP,
 * 2026-09-01) — the real "Experiences" nav link. It is a public content page
 * with real, distinct experience entries (Insignia, MX4D, ScreenX, Kiddles,
 * ONYX DINER), each showing a real "Format features" list, a real
 * "TERMS & CONDITIONS" section, a real trailer video, and a real
 * "Movies Showing in <Experience>" search — the CMS's published output, not
 * its editor. It is NOT the Experience Management admin CRUD screen the sheet
 * describes (Sync Experiences, Global/Default Logic toggle, Experience Key/
 * Sequence/Nudge Sequence fields, Edit/Details pages) — no such admin surface
 * is reachable anywhere on this app, checked directly against this page and
 * the account sidebar. See TestData/TestMd/experience-management.md.
 */
export class ExperienceManagementPage {
  constructor(private page: Page) {}

  formatFeaturesHeading = () => this.page.getByRole('heading', { name: 'Format features' });
  termsHeading = () => this.page.getByRole('heading', { name: 'TERMS & CONDITIONS' });
  moviesShowingHeading = () => this.page.getByRole('heading', { name: /movies showing in/i });
  movieSearchInput = () => this.page.getByRole('textbox', { name: /movie showing in/i });

  syncExperiencesButton = () => this.page.getByRole('button', { name: /sync experiences/i });
  globalLogicControl = () => this.page.getByText(/global.*logic|default logic/i);
  filterButton = () => this.page.getByRole('button', { name: /^filter$/i });
  editButton = () => this.page.getByRole('button', { name: /^edit$/i });
  viewButton = () => this.page.getByRole('button', { name: /^view$/i });
  fileUploadInput = () => this.page.locator('input[type="file"]');
  experienceKeyField = () => this.page.getByLabel(/experience key/i);
  sequenceField = () => this.page.getByLabel(/^sequence$/i);
  nudgeSequenceField = () => this.page.getByLabel(/nudge experience sequence/i);
  trailerUrlField = () => this.page.getByLabel(/trailer url/i);
  featuresField = () => this.page.getByLabel(/^features$/i);

  async goto(): Promise<void> {
    await this.page.goto('/experiences');
  }
}
