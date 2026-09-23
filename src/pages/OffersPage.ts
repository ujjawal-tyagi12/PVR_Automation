import type { Page } from '@playwright/test';

/** Minimal shape of `navigator.share()`'s argument — avoids depending on lib `"dom"`'s `ShareData`. */
export interface OffersPageShareCall {
  title?: string;
  text?: string;
  url?: string;
}

/**
 * Grounded 2026-08-31 against UAT (inox-uat-web.pvrinox.com, Mumbai geolocation pre-granted via
 * `grantMumbaiGeolocation`) via a read-only headless-Playwright pass — see
 * requirements/offers.md and [[pvr-inox-grounding-technique]] memory for the technique.
 *
 * Real category tabs are **All offers / Bank / Normal / GoogleWallet** — NOT the source sheet's
 * expected "All Offers / Bank Offers / Payment Wallet-UPI Offers / Others". There is no "Others"
 * tab at all; "GoogleWallet" is the closest live equivalent to the sheet's "Payment Wallet/UPI"
 * tab. All current offer data returned to this UAT city is bank-category, so "Bank" vs "All
 * offers" cannot be distinguished by content today — see `OffersModule.expectTabHasOffers`.
 *
 * Offer cards are `div[role="button"][tabindex="0"]` (a Swiper carousel slide), not `<a>` tags —
 * `getByRole('button', { name: /title/i })` resolves them because the whole card (banner +
 * "Movies + Food"/"Food" applicable-on tag + title + validity) is the button's accessible name.
 * Clicking one navigates to `/more/offers/{id}?filter=all`.
 *
 * BUG FIX (2026-08-31, live run): the `.desktop-offer-card` CSS class assumed for `offerCards()`
 * during the initial grounding pass returned zero matches on a real run — `getByRole('button')`
 * filtered by the `Valid till` text every card carries is what actually resolves reliably, so
 * `offerCards()` uses that instead. Also, `offerCardByTitle()`'s unanchored substring regex
 * matched two real cards at once ("BANK OF INDIA FLAT 200 RS OFF" is itself a substring of the
 * real second offer "COPY BANK OF INDIA FLAT 200 RS OFF") — anchored to require the applicable-on
 * prefix immediately before the title and "Valid till" immediately after, confirmed unique live.
 *
 * The Offer Detail page renders title, validity, applicable-on tag, "Terms & Conditions", a
 * "Share offer" icon button (real `aria-label`), and a "Proceed To Book" button — the last one
 * contradicts the source sheet's TC_App_012 note that this CTA is currently hidden "per
 * discussion with Nitin sir"; it IS visible live on UAT as of this grounding pass. No separate
 * "description" text block was found on the offer used for grounding (offer id 15605) — matches
 * the sheet's own TC_App_008 defect note ("applicable on, validity date is missing and we have
 * hide the proceed to book CTA" — validity/applicable-on and Proceed To Book are actually
 * present; description is the part genuinely missing).
 */
export class OffersPage {
  constructor(private page: Page) {}

  readonly offersHeading = () => this.page.getByRole('heading', { name: 'Offers', exact: true });
  readonly categoryTab = (name: 'All offers' | 'Bank' | 'Normal' | 'GoogleWallet') =>
    this.page.getByRole('button', { name, exact: true });
  readonly offerCards = () => this.page.getByRole('button').filter({ hasText: 'Valid till' });
  readonly offerCardByTitle = (title: string) => {
    const escaped = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return this.page.getByRole('button', { name: new RegExp(`(Movies \\+ Food|Food) ${escaped} Valid till`, 'i') });
  };

  // Offer Detail page (`/more/offers/{id}?filter=all`).
  readonly offerDetailTitle = (title: string) => this.page.getByRole('heading', { name: title, exact: true });
  readonly termsAndConditionsHeading = () => this.page.getByRole('heading', { name: 'Terms & Conditions' });
  readonly shareOfferButton = () => this.page.getByRole('button', { name: 'Share offer' });
  readonly proceedToBookButton = () => this.page.getByRole('button', { name: 'Proceed To Book' });
  readonly goBackButton = () => this.page.getByRole('button', { name: 'Go back' });
  // Grounded + confirmed by user 2026-09-01: no back button exists on the /offers listing page
  // itself (only the Offer Detail page has "Go back"). The real way off this page is the header
  // "Home" nav link, a real `<a>` (role=link, not button), which navigates to `/`.
  readonly homeNavLink = () => this.page.getByRole('link', { name: 'Home', exact: true });
  // Grounded 2026-08-31: an invalid/manipulated offer id (e.g. `9999999999`) does not error —
  // it renders a generic "Special Offer" fallback card with "Valid till ..." and Proceed To
  // Book still present, no crash. Closest live match to TC_App_018's "error page ... does not
  // crash" (it's a graceful fallback, not a literal error page).
  readonly fallbackOfferHeading = () => this.page.getByRole('heading', { name: 'Special Offer', exact: true });

  // Food screen (`/food`) — "Order Anytime" tab shows the same offers promo section as
  // `/offers`; the default "Book with Ticket" tab shows none (confirmed live 2026-08-31).
  readonly orderAnytimeTab = () => this.page.getByRole('button', { name: 'Order Anytime', exact: true });

  // Grounded 2026-08-31 (OFR-016/028): the real offers data call is a separate-origin API
  // (`uat-api.pvrinox.com/booking/api/v1/offers/offers-by-cityId`, not the `inox-uat-web...`
  // frontend origin — same cross-origin split the OTP flow uses, see
  // [[otp-flow-automation-solved]]). Blocking that route (rather than `context.setOffline()`,
  // which fails `page.goto()` outright before the SPA can render anything) reproduces a real
  // backend-unreachable state: the app renders this exact "No Offers Available" message.
  readonly noOffersAvailableText = () => this.page.getByText('No Offers Available', { exact: true });

  async gotoOffersRoute(baseUrl: string): Promise<void> {
    await this.page.goto(`${baseUrl}/offers`);
  }

  async gotoOfferDetail(baseUrl: string, offerId: string): Promise<void> {
    await this.page.goto(`${baseUrl}/more/offers/${offerId}?filter=all`);
  }

  async gotoFoodRoute(baseUrl: string): Promise<void> {
    await this.page.goto(`${baseUrl}/food`);
  }

  /**
   * Grounded 2026-08-31 (consistent with EventDetailsModule's 2026-08-25 finding): headless
   * Chromium has no native Web Share API — `navigator.share` is `undefined` there — so
   * defining it here isn't overriding a real implementation, it's satisfying the app's own
   * `if (navigator.share)` feature-detection so it calls this stub instead of falling back to
   * an in-page share popover. Lets the click be asserted against real call args instead of a
   * native OS share sheet, which Playwright cannot drive. Must be called before
   * `shareOfferButton().click()`. Uses `globalThis as unknown as {...}` (no `ShareData`/`Window`
   * type references) because this project's `tsconfig.json` `lib` is `["ES2020"]` only, no
   * `"dom"` — same pattern as `EventDetailsModule.expectDateFilterDefaultsToToday`.
   */
  async stubNativeShare(): Promise<void> {
    await this.page.evaluate(() => {
      const win = globalThis as unknown as { __shareCalls: OffersPageShareCall[]; navigator: { share: (data?: OffersPageShareCall) => Promise<void> } };
      win.__shareCalls = [];
      win.navigator.share = (data?: OffersPageShareCall) => {
        win.__shareCalls.push(data ?? {});
        return Promise.resolve();
      };
    });
  }

  async getStubbedShareCalls(): Promise<OffersPageShareCall[]> {
    return this.page.evaluate(() => (globalThis as unknown as { __shareCalls: OffersPageShareCall[] }).__shareCalls ?? []);
  }
}
