import { Page } from '@playwright/test';

/**
 * Grounded against the live app at BASE_URL/food/menu?cinemaId=200 (direct Playwright probe,
 * 2026-09-09) — the real, public food-ordering menu. Real items with name/price/veg icon/
 * allergen-info button, and a real working search are confirmed live. The search input is
 * `readonly` and only accepts input after click() focuses it (fill() alone times out — use
 * click() then keyboard.type()). No admin table, per-item info pop-ups, Sync/Export controls, or
 * add/edit/delete actions exist anywhere on this app — checked directly, not assumed.
 */
export class FoodItemsManagementPage {
  constructor(private page: Page) {}

  orderFoodHeading = () => this.page.getByRole('heading', { name: 'Order Food', level: 1 });
  searchInput = () => this.page.getByRole('textbox', { name: 'Search for Item' });
  // This app renders several cards twice in the DOM (a recurring pattern seen elsewhere on this
  // site) — .first() avoids a strict-mode violation (confirmed live, 2026-09-09).
  itemHeading = (name: string) => this.page.getByRole('heading', { name, exact: true }).first();
  noResultHeading = () => this.page.getByRole('heading', { name: 'No Result Found!' });
  allergenInfoButton = () => this.page.getByRole('button', { name: 'Allergen information' }).first();

  // Admin-only controls asserted absent — none exist on this real, public menu.
  itemTable = () => this.page.getByRole('table');
  syncButton = () => this.page.getByRole('button', { name: /sync food items/i });
  exportCsvButton = () => this.page.getByRole('button', { name: /export csv/i });
  addButton = () => this.page.getByRole('button', { name: /^add$/i });
  editButton = () => this.page.getByRole('button', { name: /^edit$/i });
  deleteButton = () => this.page.getByRole('button', { name: /^delete$/i });
  priceInfoButton = () => this.page.getByRole('button', { name: /price info/i });
  addOnsInfoButton = () => this.page.getByRole('button', { name: /add ons info/i });

  async goto(): Promise<void> {
    await this.page.goto('/food/menu?cinemaId=200&cinemaName=INOX%20Megaplex');
  }

  async search(query: string): Promise<void> {
    await this.searchInput().click();
    await this.page.keyboard.type(query);
  }
}
