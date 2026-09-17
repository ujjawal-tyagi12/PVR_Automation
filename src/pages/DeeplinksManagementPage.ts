import { Page } from '@playwright/test';

/**
 * Grounded against the live app at BASE_URL (direct Playwright probe, 2026-09-08). No admin
 * deep-link-management UI exists anywhere on this app — checked the header nav, footer, every
 * "More" dropdown item, and /sitemap.xml directly (same method used for cities.spec.ts). Deep
 * links are consumed by the mobile apps' own OS-level link-handling config, not a web page.
 * Grounded against the home page as the anchor.
 */
export class DeeplinksManagementPage {
  constructor(private page: Page) {}

  addLinkButton = () => this.page.getByRole('button', { name: /add link/i });
  linkTable = () => this.page.getByRole('table');
  screenNameInput = () => this.page.getByLabel(/screen name/i);
  universalTab = () => this.page.getByRole('tab', { name: /universal/i });
  deferredTab = () => this.page.getByRole('tab', { name: /deferred/i });

  async goto(): Promise<void> {
    await this.page.goto('/');
  }
}
