import { Page } from '@playwright/test';

/**
 * Grounded against the live app at BASE_URL (direct Playwright probe, 2026-09-22). Search is
 * reached via an unlabeled header icon button (between the nav and the account icon) that opens
 * a real "Search" dialog: a textbox, and 3 category tabs (Movies/Events, Cinemas, Experiences —
 * covering the sheet's Movies/Events/Cinemas categories). No "Recent Searches" section appears
 * on reopen — confirmed absent, not assumed. Special characters like `'` and `=` are silently
 * stripped from the input by the app itself — confirmed live, a real client-side sanitization.
 *
 * @hritik
 */
export class GlobalSearchPage {
  constructor(private page: Page) {}

  searchTriggerButton = () => this.page.getByRole('banner').getByRole('button').filter({ hasNotText: /.+/ }).first();
  searchDialog = () => this.page.getByRole('dialog', { name: 'Search' });
  searchInput = () => this.page.getByRole('textbox', { name: 'Search movies/events/cinemas' });
  moviesEventsTab = () => this.page.getByRole('tab', { name: 'Movies/Events' });
  cinemasTab = () => this.page.getByRole('tab', { name: 'Cinemas', exact: true });
  experiencesTab = () => this.page.getByRole('tab', { name: 'Experiences', exact: true });
  // Grounded 2026-09-22: all 3 category tabpanels render their own "No Result Found!" heading
  // simultaneously (even for the inactive tabs) — a real strict-mode violation confirmed live,
  // not just a locator guess. .first() targets the active tab's.
  noResultsHeading = () => this.page.getByRole('heading', { name: 'No Result Found!' }).first();
  movieResultHeading = (name: string) => this.page.getByRole('heading', { name, exact: true });
  recentSearchesText = () => this.page.getByText(/recent search/i);

  async goto(): Promise<void> {
    await this.page.goto('/');
  }
}
