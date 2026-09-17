import { Page } from '@playwright/test';

/**
 * Grounded against the live app at BASE_URL/offers (Playwright MCP, 2026-08-31).
 * This is the only publicly reachable page whose content concept (vouchers/
 * offers) matches the sheet's ADV-* scenarios (see TestData/TestMd/adhoc-vouchers.md).
 * It has no cinema selector, no search, no type filter, no Sync button, and no
 * voucher Details/Edit screen — it is a simple, mostly-empty offers list with a
 * single "All offers" control. There is no CMS editor reachable from here.
 */
export class AdhocVouchersPage {
  constructor(private page: Page) {}

  offersHeading = () => this.page.getByRole('heading', { name: 'Offers', exact: true });
  allOffersButton = () => this.page.getByRole('button', { name: 'All offers' });
  noOffersAvailableText = () => this.page.getByText('No Offers Available');
  fileUploadInput = () => this.page.locator('input[type="file"]');

  async goto(): Promise<void> {
    await this.page.goto('/offers');
  }
}
