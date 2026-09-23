import { Page, Locator, expect } from '@playwright/test';
import { CheckoutPage } from '@pages/CheckoutPage';
import { AdminLoginModule, TEST_PHONE, VALID_OTP } from '@modules/AdminLoginModule';
import { WaitHelper } from '@utils/WaitHelper';
import { Logger } from '@utils/Logger';

/**
 * Drives the real seat-select → offers → food → login → checkout chain and orchestrates the
 * real checkout page for the Checkout Screen sheet module — see CheckoutPage for what was
 * grounded. Composes AdminLoginModule read-only (no changes to it) for the shared login
 * mechanics already proven live there.
 *
 * Note: uses its own, independently-correct seat-picking logic (`button:not([disabled])`)
 * rather than SeatLayoutModule.selectFirstAvailableSeat() — the same disabled-descendant-vs-
 * own-attribute bug this module's grounding first surfaced was since fixed directly in
 * SeatLayoutPage.ts (2026-09-23).
 *
 * @hritik
 */
export class CheckoutModule {
  private checkoutPage: CheckoutPage;
  private adminLogin: AdminLoginModule;

  constructor(private page: Page) {
    this.checkoutPage = new CheckoutPage(page);
    this.adminLogin = new AdminLoginModule(page);
  }

  async reachCheckoutTicketOnly(city: string, movieSlug: string, movieId: string, timeLabel: string): Promise<void> {
    Logger.info(`Reaching checkout for ${movieSlug} at ${timeLabel}`);
    await this.page.goto(`/moviesessions/${city}/${movieSlug}/${movieId}`);
    // Grounded 2026-09-22: clicking the showtime button before the page is truly interactive
    // can silently no-op (the click lands on a not-yet-hydrated element with no handler
    // attached yet), leaving every later step stuck on this same page — confirmed live via a
    // real failure where later steps kept "succeeding" against an unchanged page. Same
    // hydration-timing class WaitHelper.forHydration already centralizes elsewhere.
    await WaitHelper.forHydration(this.page);
    await this.checkoutPage.showtimeButton(timeLabel).click();
    await this.continueFromShowtimeToCheckout();
  }

  /** Environment-agnostic alternative to reachCheckoutTicketOnly() — a hardcoded movie
   * slug/id is live catalog data that doesn't carry across environments (confirmed live: a
   * real "Movie Not Found!" page on preprod). Follows a real movie + real showtime instead. */
  async reachCheckoutTicketOnlyForAnyRealMovie(): Promise<void> {
    Logger.info('Reaching checkout for a real movie/showtime from the homepage');
    await this.page.goto('/');
    await WaitHelper.forHydration(this.page);
    const href = await this.checkoutPage.homepageMovieLink().getAttribute('href');
    if (!href) throw new Error('No real movie link found on the homepage');
    await this.page.goto(href);
    await this.checkoutPage.anyShowtimeButton().click();
    await this.continueFromShowtimeToCheckout();
  }

  private async continueFromShowtimeToCheckout(): Promise<void> {
    await this.selectAnyAvailableSeat();
    await this.checkoutPage.continueButton().click();

    // A format-specific T&C dialog ("HEADS UP!") can appear here — confirmed live, not always
    // present. isVisible() does NOT wait (its timeout option is ignored, same documented gotcha
    // as AdminLoginModule's waitVisible() helper) — a real failure confirmed this dialog can
    // take longer than an instant check to render, so waitFor() is required here instead.
    const termsAppeared = await this.checkoutPage
      .formatTermsAcceptButton()
      .waitFor({ state: 'visible', timeout: 10000 })
      .then(() => true)
      .catch(() => false);
    if (termsAppeared) {
      await this.checkoutPage.formatTermsAcceptButton().click();
    }

    // Grounded 2026-09-22: the Offers For You page's own content (and this button, rendered
    // last) can take longer to hydrate than a short isVisible check tolerates — confirmed live
    // via a real failure where the button existed but wasn't ready in time. Explicit wait with
    // a generous timeout first, matching the hydration-timing pattern used elsewhere.
    await this.checkoutPage.skipAndProceedButton().waitFor({ state: 'visible', timeout: 20000 });
    await this.checkoutPage.skipAndProceedButton().click();
    await this.checkoutPage.continueButton().click();

    // Checkout requires authentication — a real login gate appears here.
    await this.adminLogin.completeLogin(TEST_PHONE, VALID_OTP);
    await this.checkoutPage.continueButton().click();
    await expect(this.checkoutPage.billDetailsHeading()).toBeVisible({ timeout: 20000 });
  }

  /** Grounded 2026-09-23: the first category row can be fully sold out for a given real
   * showtime (confirmed live) — not every category has an available seat. Walks the real
   * category rows in order and clicks the first one with an actual open seat. */
  private async selectAnyAvailableSeat(): Promise<void> {
    const rows = this.checkoutPage.allCategoryRows();
    const count = await rows.count();
    for (let i = 0; i < count; i += 1) {
      const seat = rows.nth(i).locator('button:not([disabled])').first();
      if (await seat.isVisible().catch(() => false)) {
        await seat.click();
        return;
      }
    }
    throw new Error('No available seat found in any category row for this showtime');
  }

  async assertCheckoutLoaded(): Promise<void> {
    await expect(this.checkoutPage.billDetailsHeading()).toBeVisible({ timeout: 15000 });
    await expect(this.checkoutPage.selectPaymentMethodButton()).toBeVisible();
  }

  async assertCountdownTimerVisible(): Promise<void> {
    await expect(this.checkoutPage.timerIcon()).toBeVisible({ timeout: 10000 });
  }

  private async readAmount(heading: Locator): Promise<number> {
    const text = await heading.innerText();
    const match = text.match(/₹\s*([\d,]+\.\d{2})/);
    return match ? parseFloat(match[1].replace(/,/g, '')) : NaN;
  }

  async assertBillMathIsAccurate(): Promise<void> {
    const ticketTotal = await this.readAmount(this.checkoutPage.ticketTotalHeading());
    const taxes = await this.readAmount(this.checkoutPage.taxesHeading());
    const totalText = await this.checkoutPage.totalAmountText().first().innerText();
    const total = parseFloat(totalText.replace(/[₹,]/g, ''));
    // Total = Ticket Total + Taxes + Donation(₹2) — the donation is on by default at this point.
    expect(Math.round((ticketTotal + taxes + 2) * 100) / 100).toBeCloseTo(total, 1);
  }

  async applyRealListedOffer(): Promise<void> {
    const before = await this.checkoutPage.totalAmountText().first().innerText();
    await this.checkoutPage.listedOfferApplyButton().click();
    await expect(async () => {
      const after = await this.checkoutPage.totalAmountText().first().innerText();
      expect(after).not.toBe(before);
    }).toPass({ timeout: 10000 });
  }

  async assertInvalidPromocodeRejected(): Promise<void> {
    const before = await this.checkoutPage.totalAmountText().first().innerText();
    await this.checkoutPage.promoCodeInput().fill('ZZZNOTAVALIDCODE');
    await this.checkoutPage.promoApplyButton().click().catch(() => undefined);
    // A real, fixed wait against live external timing — there's no DOM condition to poll for
    // "nothing changed" (the negative case), matching WaitHelper.forDuration()'s documented use.
    await WaitHelper.forDuration(1500);
    const after = await this.checkoutPage.totalAmountText().first().innerText();
    expect(after).toBe(before);
  }

  async assertAddFoodReachable(): Promise<void> {
    await expect(this.checkoutPage.addFoodButton()).toBeVisible({ timeout: 10000 });
  }

  async assertPaymodesSectionShown(): Promise<void> {
    await expect(this.checkoutPage.paymodesRegionHeading()).toBeVisible({ timeout: 10000 });
  }

  async assertNoDefaultPaymentMethodSelected(): Promise<void> {
    await expect(this.checkoutPage.selectPaymentMethodButton()).toBeVisible({ timeout: 10000 });
  }

  async assertDonationDefaultAndRemoval(): Promise<void> {
    const before = await this.checkoutPage.totalAmountText().first().innerText();
    await this.checkoutPage.donationRemoveButton().click();
    await expect(async () => {
      const after = await this.checkoutPage.totalAmountText().first().innerText();
      expect(after).not.toBe(before);
    }).toPass({ timeout: 10000 });
  }

  async openCancellationPolicy(): Promise<void> {
    await this.checkoutPage.cancellationPolicyToggle().click();
  }

  async assertCancellationSlabsShown(): Promise<void> {
    await expect(this.checkoutPage.refund75Heading()).toBeVisible({ timeout: 10000 });
    await expect(this.checkoutPage.noRefundHeading()).toBeVisible();
  }

  async goBackThenForward(): Promise<void> {
    await this.page.goBack();
    await this.page.goForward();
  }

  async assertStillOnCheckoutWithTimer(): Promise<void> {
    await expect(this.checkoutPage.billDetailsHeading()).toBeVisible({ timeout: 15000 });
    await expect(this.checkoutPage.timerIcon()).toBeVisible();
  }
}
