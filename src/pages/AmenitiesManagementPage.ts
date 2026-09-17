import { Page } from '@playwright/test';

/**
 * Grounded against the live app at BASE_URL/cinemas/Mumbai (Playwright MCP,
 * 2026-08-31). No itemized amenities list (Serial No./Name/Created On/Status, as
 * described in TestData/TestMd/amenities-management.md) exists anywhere on this
 * app. Each cinema in the listing shows at most a single "wheelchair accessible"
 * icon — checked directly, not assumed — with no expandable list and no admin
 * CRUD surface reachable from it.
 */
export class AmenitiesManagementPage {
  constructor(private page: Page) {}

  // Grounded via direct probe (2026-08-31): multiple cinemas render in the Mumbai listing,
  // each with its own icon — .first() avoids a strict-mode violation.
  wheelchairAccessibleIcon = () => this.page.getByRole('img', { name: 'wheelchair accessible' }).first();
  fileUploadInput = () => this.page.locator('input[type="file"]');

  async goto(): Promise<void> {
    await this.page.goto('/cinemas/Mumbai');
  }
}
