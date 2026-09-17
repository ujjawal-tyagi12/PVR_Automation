import { Page } from '@playwright/test';

/**
 * Grounded against the live app at BASE_URL/passport (Playwright MCP,
 * 2026-08-31) — the most plausible public tie-in for gamification badges. It
 * renders the generic SPA fallback shell in this UAT environment, with no
 * "badge" text anywhere. No public badges surface exists. See
 * TestData/TestMd/badges-management.md.
 */
export class BadgesManagementPage {
  constructor(private page: Page) {}

  badgeAnyMention = () => this.page.getByText(/badge/i);
  fileUploadInput = () => this.page.locator('input[type="file"]');

  async goto(): Promise<void> {
    await this.page.goto('/passport');
  }
}
