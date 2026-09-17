import { Page } from '@playwright/test';

/**
 * Grounded against the live app at BASE_URL/food/menu?cinemaId=200 (direct Playwright probe,
 * 2026-09-09) — the real, public food-ordering menu reached via Food → Order Anytime → Explore
 * Menu → cinema → pickup time. Real category filter chips (e.g. "Hot beverages 5", "Breakfast 1")
 * are confirmed live. No admin table, search, sync control, or Edit form (Sequence/images) exists
 * anywhere on this app — checked directly, not assumed.
 */
export class FoodCategoryManagementPage {
  constructor(private page: Page) {}

  orderFoodHeading = () => this.page.getByRole('heading', { name: 'Order Food', level: 1 });
  allCategoryChip = () => this.page.getByRole('button', { name: /^all$/i });
  categoryChip = (name: string) => this.page.getByRole('button', { name: new RegExp(name, 'i') });

  // Admin-only controls asserted absent — none exist on this real, public menu.
  categoryTable = () => this.page.getByRole('table');
  syncButton = () => this.page.getByRole('button', { name: /sync food categories/i });
  editButton = () => this.page.getByRole('button', { name: /^edit$/i });
  sequenceField = () => this.page.getByLabel(/^sequence$/i);
  fileUploadInput = () => this.page.locator('input[type="file"]');

  async goto(): Promise<void> {
    await this.page.goto('/food/menu?cinemaId=200&cinemaName=INOX%20Megaplex');
  }
}
