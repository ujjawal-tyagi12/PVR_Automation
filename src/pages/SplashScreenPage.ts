import { Page } from '@playwright/test';

/**
 * Grounded against the live app at BASE_URL (direct Playwright probe, 2026-09-21). This sheet's
 * "Splash Screen" concept — a native app-store version gate (force/soft update prompts) shown
 * before the app UI renders — has no web equivalent by design: a website always serves its
 * latest deployed version directly, with no store-mediated update step. Checked the homepage
 * directly for any "update required"/"update available" prompt or splash-style loading screen;
 * neither exists — confirmed live, not assumed.
 *
 * @hritik
 */
export class SplashScreenPage {
  constructor(private page: Page) {}

  updateRequiredPrompt = () => this.page.getByText(/update required|update available/i);
  splashLogo = () => this.page.getByRole('img', { name: /splash/i });

  async goto(): Promise<void> {
    await this.page.goto('/');
  }
}
