import { Page } from '@playwright/test';

/**
 * Grounded against the live app at BASE_URL/gift-cards (direct Playwright probe, 2026-09-10).
 * This is a real, public gift-card scheme listing — real vouchers (e.g. "17059- Anniversary
 * E-GiftCard Voucher") grouped under real Occasion chips (All Occasions / Birth Day /
 * Anniversary), which is this app's public equivalent of the sheet's Type filter. Clicking a
 * scheme card, or "My Gift Cards", opens a phone/OTP "Welcome!" login dialog — confirmed live,
 * not assumed — so anything past that point (denomination selection, purchase) is login-gated.
 * The city-select and Enable Location dialogs that gate this page only clear when geolocation
 * permission is granted to the browser context before navigating (Escape/Cancel alone loops).
 * No admin table, search box, per-field filters (Scheme ID/Alias/Images/Status/Validity/Last
 * Edited On), image upload, sequence/drag-reorder, or Sync control exists anywhere on this app.
 */
export class GiftCardMasterPage {
  constructor(private page: Page) {}

  pageHeading = () => this.page.getByRole('heading', { name: 'Gift Cards', level: 1 });
  occasionChip = (name: string) => this.page.getByRole('button', { name: new RegExp(`^${name}$`, 'i') });

  // Admin-only controls asserted absent — no admin table/search/filter/upload surface exists.
  schemeTable = () => this.page.getByRole('table');
  searchInput = () => this.page.getByRole('textbox', { name: /search/i });
  imagesFilter = () => this.page.getByRole('combobox', { name: /images/i });
  statusFilter = () => this.page.getByRole('combobox', { name: /^status$/i });
  validityFromInput = () => this.page.getByLabel(/valid from/i);
  validityToInput = () => this.page.getByLabel(/valid to/i);
  lastEditedFilter = () => this.page.getByLabel(/last edited/i);
  imageUploadInput = () => this.page.locator('input[type="file"]');
  mainImageDropdown = () => this.page.getByRole('combobox', { name: /main image/i });
  sequenceField = () => this.page.getByLabel(/^sequence$/i);
  statusToggle = () => this.page.getByRole('switch');
  syncButton = () => this.page.getByRole('button', { name: /sync gift cards/i });
  createSchemeButton = () => this.page.getByRole('button', { name: /^(add|create) scheme$/i });
  editButton = () => this.page.getByRole('button', { name: /^edit$/i });

  async goto(): Promise<void> {
    await this.page.goto('/gift-cards');
  }
}
