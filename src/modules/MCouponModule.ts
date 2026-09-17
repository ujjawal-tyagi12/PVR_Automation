import { Page, expect } from '@playwright/test';
import { MCouponPage } from '@pages/MCouponPage';
import { Logger } from '@utils/Logger';

/**
 * Orchestrates the home page as the common anchor for M-Coupon scenarios — see MCouponPage for
 * what was checked and ruled out. No admin M-Coupon surface exists anywhere on this app.
 */
export class MCouponModule {
  private mCouponPage: MCouponPage;

  constructor(private page: Page) {
    this.mCouponPage = new MCouponPage(page);
  }

  async open(): Promise<void> {
    Logger.info('Opening the home page (no admin M-Coupon screen exists)');
    await this.mCouponPage.goto();
  }

  async assertNoImageUpload(): Promise<void> {
    await expect(this.mCouponPage.webImageUpload()).toHaveCount(0);
  }

  async assertNoBenefitsForm(): Promise<void> {
    await expect(this.mCouponPage.benefitTitleField()).toHaveCount(0);
    await expect(this.mCouponPage.addBenefitButton()).toHaveCount(0);
    await expect(this.mCouponPage.deleteBenefitButton()).toHaveCount(0);
  }

  async assertNoContentForm(): Promise<void> {
    await expect(this.mCouponPage.howToClaimField()).toHaveCount(0);
    await expect(this.mCouponPage.titleField()).toHaveCount(0);
    await expect(this.mCouponPage.subTitleField()).toHaveCount(0);
    await expect(this.mCouponPage.saveButton()).toHaveCount(0);
  }
}
