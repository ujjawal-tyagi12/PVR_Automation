import { Page } from '@playwright/test';

/**
 * Grounded against the live app at BASE_URL (direct Playwright probe, 2026-09-16). No admin
 * M-Coupon static-management UI or public M-Coupon marketing page exists anywhere on this app —
 * checked common URL guesses (/m-coupon, /mcoupon), the header nav, and the footer. Grounded
 * against the home page as the anchor.
 */
export class MCouponPage {
  constructor(private page: Page) {}

  webImageUpload = () => this.page.locator('input[type="file"]');
  benefitTitleField = () => this.page.getByLabel(/benefit title/i);
  howToClaimField = () => this.page.getByLabel(/how to claim/i);
  saveButton = () => this.page.getByRole('button', { name: /^save$/i });
  addBenefitButton = () => this.page.getByRole('button', { name: /add benefit/i });
  deleteBenefitButton = () => this.page.getByRole('button', { name: /delete/i });
  titleField = () => this.page.getByLabel(/^title$/i);
  subTitleField = () => this.page.getByLabel(/^sub-title$/i);

  async goto(): Promise<void> {
    await this.page.goto('/');
  }
}
