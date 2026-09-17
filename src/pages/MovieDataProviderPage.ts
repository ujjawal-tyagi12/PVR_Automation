import { Page } from '@playwright/test';

/**
 * Grounded against the live app at BASE_URL (direct Playwright probe, 2026-09-16). No admin
 * TMDB/Moviesbuff movie-data-import UI or public equivalent exists anywhere on this
 * unauthenticated app — this is an internal admin tooling concept with no customer-facing
 * surface to ground against. Grounded against the home page as the anchor.
 */
export class MovieDataProviderPage {
  constructor(private page: Page) {}

  searchMovieField = () => this.page.getByLabel(/search movie/i);
  sourceRadioTmdb = () => this.page.getByRole('radio', { name: /tmdb/i });
  sourceRadioMoviesbuff = () => this.page.getByRole('radio', { name: /moviesbuff/i });
  castSelectAllCheckbox = () => this.page.getByRole('checkbox', { name: /select all.*cast/i });
  submitButton = () => this.page.getByRole('button', { name: /^submit$/i });
  synopsisField = () => this.page.getByLabel(/synopsis/i);
  cancelButton = () => this.page.getByRole('button', { name: /^cancel$/i });

  async goto(): Promise<void> {
    await this.page.goto('/');
  }
}
