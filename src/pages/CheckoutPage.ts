import { Page } from '@playwright/test';

/**
 * Grounded against the live app at BASE_URL (direct Playwright probe, 2026-09-22). Real route:
 * `/select-food?checkoutType=movie&cinemaId={id}` — reached from seat selection via Continue →
 * accept a format T&C dialog (if shown) → Skip & Proceed past Offers → Continue past Food →
 * login (checkout requires authentication) → Continue again. This page composes
 * SeatLayoutModule and AdminLoginModule read-only (no changes to either) for that chain.
 *
 * Confirmed live: no distinct Superticket "Add to Cart" card exists on this booking's checkout
 * (Paymodes section only); no non-cancellable booking type or documented payment deep-link
 * format was reachable within budget. Per explicit user agreement, no test in this module ever
 * proceeds past "Select Payment Method" into a real payment gateway.
 *
 * @hritik
 */
export class CheckoutPage {
  constructor(private page: Page) {}

  addFoodButton = () => this.page.getByRole('button', { name: 'Add Food' });
  promoCodeInput = () => this.page.getByRole('textbox', { name: 'Enter Promo Code' });
  promoApplyButton = () => this.page.getByRole('button', { name: 'Apply', exact: true }).first();
  listedOfferApplyButton = () => this.page.getByRole('button', { name: 'Apply', exact: true }).last();
  paymodesRegionHeading = () => this.page.getByRole('heading', { name: /PVR Exclusive Paymodes/i });
  cancellationPolicyToggle = () => this.page.getByRole('button', { name: /View Cancellation Policy/i });
  refund75Heading = () => this.page.getByRole('heading', { name: '75% Refund' });
  noRefundHeading = () => this.page.getByRole('heading', { name: 'No Refund' });
  billDetailsHeading = () => this.page.getByRole('heading', { name: 'Bill Details' });
  timerIcon = () => this.page.getByRole('img', { name: 'Timer' });
  ticketTotalHeading = () => this.page.getByRole('heading', { name: /^Ticket Total/ });
  taxesHeading = () => this.page.getByRole('heading', { name: /^Taxes and Fees/ });
  totalAmountText = () => this.page.getByText('Total Amount').locator('..').getByText(/^₹\d/);
  donationRemoveButton = () => this.page.getByRole('button', { name: 'Remove' });
  selectPaymentMethodButton = () => this.page.getByRole('button', { name: 'Select Payment Method' });

  // Seat-layout locators reused for the reach-checkout chain — independently correct here
  // (button:not([disabled]) checks the seat's own disabled attribute), unlike
  // SeatLayoutModule.selectFirstAvailableSeat()'s hasNot-descendant filter.
  executiveCategoryRow = () =>
    this.page.locator('table').getByRole('row').filter({ has: this.page.getByRole('heading', { name: /^Executive:/i }) });
  // Grounded 2026-09-23: "Executive" is a specific cinema's category naming — confirmed not
  // every real cinema/screen uses that category (a real "Movie Not Found!"-adjacent failure:
  // no matching row for a different, randomly-reached real cinema on preprod). The first
  // category row in the table, whichever it's named, is the environment-agnostic real target.
  firstCategoryRow = () => this.page.locator('table').getByRole('row').first();
  allCategoryRows = () => this.page.locator('table').getByRole('row');
  showtimeButton = (timeLabel: string) => this.page.getByRole('button', { name: new RegExp(`^${timeLabel}`, 'i') }).first();
  // Grounded 2026-09-23: a hardcoded movie slug/id is live catalog data — confirmed to not
  // exist on preprod (real "Movie Not Found!" page). Following a real homepage movie link,
  // then any real showtime button, is the environment-agnostic path here.
  homepageMovieLink = () => this.page.locator('a[href*="/moviesessions/"]').first();
  anyShowtimeButton = () => this.page.getByRole('button', { name: /^\d{2}:\d{2} (AM|PM)/ }).first();
  formatTermsAcceptButton = () => this.page.getByRole('button', { name: 'Accept & Continue' });
  skipAndProceedButton = () => this.page.getByRole('button', { name: 'Skip & Proceed' });
  continueButton = () => this.page.getByRole('button', { name: 'Continue', exact: true });

  /** Reads the current displayed amount (₹X.XX) for a given bill-line heading's own text. */
  amountFromHeading = (heading: string) => this.page.getByRole('heading', { name: new RegExp(`^${heading}`) });
}
