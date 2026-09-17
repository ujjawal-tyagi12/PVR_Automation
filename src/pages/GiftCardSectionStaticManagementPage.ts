import { Page } from '@playwright/test';

/**
 * Grounded against the live app at BASE_URL/gift-cards (direct Playwright probe, 2026-09-10).
 * The real, public gift-card page renders genuine static marketing copy — a banner heading
 * "Gift Cards", the sub-title "Pay less using PVR INOX Gift Cards!", body copy "Use PVR gift
 * cards at checkout to get better prices on your tickets.", and a "How It Works" control —
 * which is this app's public rendering of the sheet's Static Management content fields. No
 * admin edit form (Title/Sub-Title/Why buy Gift Card/How it Works Description/Important
 * Information/Image, with validation) exists anywhere on this app.
 */
export class GiftCardSectionStaticManagementPage {
  constructor(private page: Page) {}

  pageHeading = () => this.page.getByRole('heading', { name: 'Gift Cards', level: 1 });
  subTitleText = () => this.page.getByText('Pay less using PVR INOX Gift Cards!');
  bodyCopyText = () => this.page.getByText(/use pvr gift cards at checkout/i);
  howItWorksButton = () => this.page.getByRole('button', { name: 'How It Works' });

  // Admin-only controls asserted absent — no edit form exists on this public page.
  titleField = () => this.page.getByLabel(/^title$/i);
  subTitleField = () => this.page.getByLabel(/^sub-title$/i);
  whyBuyField = () => this.page.getByLabel(/why buy gift card/i);
  howItWorksDescField = () => this.page.getByLabel(/how it works description/i);
  importantInfoField = () => this.page.getByLabel(/important information/i);
  imageUploadInput = () => this.page.locator('input[type="file"]');
  saveButton = () => this.page.getByRole('button', { name: /^save$/i });

  async goto(): Promise<void> {
    await this.page.goto('/gift-cards');
  }
}
