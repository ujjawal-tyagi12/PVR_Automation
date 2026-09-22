import { Page } from '@playwright/test';

/**
 * Grounded against the live app at BASE_URL (direct Playwright probe, 2026-09-22). The homepage
 * has no `<h1>` banner heading — banner/carousel content isn't a simple, stably-locatable
 * element for rotation-timing checks within a reasonable time budget. Guest (unauthenticated)
 * access to the account menu shows a real "Login or signup to continue" prompt with a Login
 * button — the real, groundable login-gate signal.
 *
 * @hritik
 */
export class HomepageProgressivePage {
  constructor(private page: Page) {}

  accountMenuButton = () => this.page.getByRole('button', { name: 'User Icon' });
  loginPromptText = () => this.page.getByText('Login or signup to continue');
  loginButton = () => this.page.getByRole('button', { name: 'Login', exact: true });
  bannerRegion = () => this.page.getByRole('link', { name: 'Book Now' }).first();
  cinemasNavLink = () => this.page.getByRole('link', { name: 'Cinemas', exact: true });

  async goto(): Promise<void> {
    await this.page.goto('/');
  }
}
