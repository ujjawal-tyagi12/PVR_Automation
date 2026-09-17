import { Page, expect } from '@playwright/test';
import { MovieDataProviderPage } from '@pages/MovieDataProviderPage';
import { Logger } from '@utils/Logger';

/**
 * Orchestrates the home page as the common anchor for Movie Data Provider scenarios — see
 * MovieDataProviderPage for what was checked and ruled out. No admin movie-import surface
 * exists anywhere on this app.
 */
export class MovieDataProviderModule {
  private movieDataProviderPage: MovieDataProviderPage;

  constructor(private page: Page) {
    this.movieDataProviderPage = new MovieDataProviderPage(page);
  }

  async open(): Promise<void> {
    Logger.info('Opening the home page (no admin Movie Data Provider screen exists)');
    await this.movieDataProviderPage.goto();
  }

  async assertNoSearchOrSourceControls(): Promise<void> {
    await expect(this.movieDataProviderPage.searchMovieField()).toHaveCount(0);
    await expect(this.movieDataProviderPage.sourceRadioTmdb()).toHaveCount(0);
    await expect(this.movieDataProviderPage.sourceRadioMoviesbuff()).toHaveCount(0);
  }

  async assertNoImportForm(): Promise<void> {
    await expect(this.movieDataProviderPage.castSelectAllCheckbox()).toHaveCount(0);
    await expect(this.movieDataProviderPage.submitButton()).toHaveCount(0);
    await expect(this.movieDataProviderPage.synopsisField()).toHaveCount(0);
    await expect(this.movieDataProviderPage.cancelButton()).toHaveCount(0);
  }
}
