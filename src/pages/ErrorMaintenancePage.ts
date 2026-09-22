import { Page } from '@playwright/test';

/**
 * Grounded against the live app at BASE_URL (direct Playwright probe, 2026-09-22). An invalid
 * route renders a real, styled empty-state page (illustration + "Back To Home" link, href="/")
 * — no raw server error is exposed, status 200 (client-side SPA routing, not a server error).
 *
 * @hritik
 */
export class ErrorMaintenancePage {
  constructor(private page: Page) {}

  backToHomeLink = () => this.page.getByRole('link', { name: 'Back To Home' });

  async gotoInvalidRoute(): Promise<void> {
    await this.page.goto('/this-page-does-not-exist-zzz');
  }
}
