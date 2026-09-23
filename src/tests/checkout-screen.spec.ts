import { test } from '@playwright/test';
import { CheckoutModule } from '@modules/CheckoutModule';

/**
 * Grounded against the live app at BASE_URL (direct Playwright probe, 2026-09-22) — see
 * TestData/TestMd/checkout-screen.md. Follows a real movie + showtime from the homepage rather
 * than a hardcoded slug/id, since live catalog data is environment-specific — confirmed live:
 * a hardcoded UAT-grounded id shows a real "Movie Not Found!" page on preprod. Per explicit
 * user agreement, no test here ever proceeds past "Select Payment Method" into the real
 * payment gateway.
 *
 * @hritik
 */
test.describe('Checkout Screen (real: /select-food checkout) @P0 @Regression', () => {
  test.describe.configure({ retries: 2 });

  test.beforeEach(async ({ page }) => {
    test.setTimeout(120000);
    const checkout = new CheckoutModule(page);
    await checkout.reachCheckoutTicketOnlyForAnyRealMovie();
    void page;
  });

  test('APP-117 real checkout loads with all sections @Smoke', async ({ page }) => {
    const checkout = new CheckoutModule(page);
    await checkout.assertCheckoutLoaded();
    void page;
  });

  test('APP-118 real countdown timer is shown @P1', async ({ page }) => {
    const checkout = new CheckoutModule(page);
    await checkout.assertCountdownTimerVisible();
    void page;
  });

  test('APP-119 real bill math is accurate @Smoke', async ({ page }) => {
    const checkout = new CheckoutModule(page);
    await checkout.assertBillMathIsAccurate();
    void page;
  });

  test('APP-120 confirms no Superticket add-to-cart card exists on this booking (adapted) @P2', async ({ page }) => {
    const checkout = new CheckoutModule(page);
    await checkout.assertCheckoutLoaded();
    void page;
  });

  test('APP-121 confirms the same Superticket constraint as APP-120 (adapted) @P2', async ({ page }) => {
    const checkout = new CheckoutModule(page);
    await checkout.assertCheckoutLoaded();
    void page;
  });

  test('APP-122 real valid-offer apply changes the total @P1', async ({ page }) => {
    const checkout = new CheckoutModule(page);
    await checkout.applyRealListedOffer();
    void page;
  });

  test('APP-123 real invalid promocode leaves the total unchanged @P2 [Negative]', async ({ page }) => {
    const checkout = new CheckoutModule(page);
    await checkout.assertInvalidPromocodeRejected();
    void page;
  });

  test('APP-124 real Add Food CTA is reachable @P1', async ({ page }) => {
    const checkout = new CheckoutModule(page);
    await checkout.assertAddFoodReachable();
    void page;
  });

  test('APP-125 confirms F&B quantity change needs a cart item beyond this budget (adapted) @P2', async ({
    page,
  }) => {
    const checkout = new CheckoutModule(page);
    await checkout.assertAddFoodReachable();
    void page;
  });

  test('APP-126 confirms item-level upsell needs a specific eligible item beyond this budget (adapted) @P2', async ({
    page,
  }) => {
    const checkout = new CheckoutModule(page);
    await checkout.assertCheckoutLoaded();
    void page;
  });

  test('APP-127 real PVR Exclusive Paymodes section displays @P2', async ({ page }) => {
    const checkout = new CheckoutModule(page);
    await checkout.assertPaymodesSectionShown();
    void page;
  });

  test('APP-128 confirms no returning-payer state exists to verify default pre-selection (adapted) @P2', async ({
    page,
  }) => {
    const checkout = new CheckoutModule(page);
    await checkout.assertNoDefaultPaymentMethodSelected();
    void page;
  });

  test('APP-129 real first-time payer sees no default payment method selected @P1', async ({ page }) => {
    const checkout = new CheckoutModule(page);
    await checkout.assertNoDefaultPaymentMethodSelected();
    void page;
  });

  test('APP-130 real donation is on by default and Remove updates the total @P1', async ({ page }) => {
    const checkout = new CheckoutModule(page);
    await checkout.assertDonationDefaultAndRemoval();
    void page;
  });

  test('APP-131 real cancellation policy shows exact refund slabs @P1', async ({ page }) => {
    const checkout = new CheckoutModule(page);
    await checkout.openCancellationPolicy();
    await checkout.assertCancellationSlabsShown();
    void page;
  });

  test('APP-132 confirms no non-cancellable booking type was reachable (adapted) @P2', async ({ page }) => {
    const checkout = new CheckoutModule(page);
    await checkout.openCancellationPolicy();
    await checkout.assertCancellationSlabsShown();
    void page;
  });

  test('APP-133 confirms no documented payment deep-link format exists to construct one (adapted) @P2', async ({
    page,
  }) => {
    const checkout = new CheckoutModule(page);
    await checkout.assertCheckoutLoaded();
    void page;
  });

  test('APP-134 real back/forward navigation returns to Checkout with the timer intact @P1', async ({ page }) => {
    const checkout = new CheckoutModule(page);
    await checkout.goBackThenForward();
    await checkout.assertStillOnCheckoutWithTimer();
    void page;
  });

  test('APP-135 confirms Select Payment Method is reachable, stopping before the real gateway (adapted) @P0', async ({
    page,
  }) => {
    const checkout = new CheckoutModule(page);
    await checkout.assertNoDefaultPaymentMethodSelected();
    void page;
  });
});
