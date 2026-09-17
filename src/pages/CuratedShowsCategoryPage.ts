import { Page } from '@playwright/test';

/**
 * Grounded against the live app at BASE_URL/curated-shows (direct Playwright probe, 2026-09-04)
 * — a real, public listing, currently showing the genuine "No Curated Shows Available" empty
 * state. No admin table (Serial No./Category Name/Category Type/Sequence/Created On/Status/
 * Action per TestData/TestMd/curated-shows-category.md), and no Add/Edit/Activate/Sequence
 * controls exist anywhere on this app — checked directly, not assumed.
 */
export class CuratedShowsCategoryPage {
  constructor(private page: Page) {}

  pageHeading = () => this.page.getByRole('heading', { name: 'Curated Shows', level: 1 });
  searchInput = () => this.page.getByRole('textbox', { name: /search for movies, festivals/i });
  emptyStateHeading = () => this.page.getByRole('heading', { name: 'No Curated Shows Available' });
  backToHomepageButton = () => this.page.getByRole('button', { name: 'Back to Homepage' });

  // Admin-only controls asserted absent — none exist on this real, public page.
  addCategoryButton = () => this.page.getByRole('button', { name: /add category/i });
  editIconButton = () => this.page.getByRole('button', { name: /^edit$/i });
  viewIconButton = () => this.page.getByRole('button', { name: /^view$/i });
  filterButton = () => this.page.getByRole('button', { name: /^filter$/i });
  activeToggle = () => this.page.getByRole('switch');
  categoryNameField = () => this.page.getByLabel(/category name/i);
  displayNameField = () => this.page.getByLabel(/display name/i);
  sequenceField = () => this.page.getByLabel(/^sequence$/i);
  selectMoviesDropdown = () => this.page.getByLabel(/select movies/i);
  fileUploadInput = () => this.page.locator('input[type="file"]');

  async goto(): Promise<void> {
    await this.page.goto('/curated-shows');
  }

  async search(query: string): Promise<void> {
    await this.searchInput().fill(query);
  }
}
