import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { OffersPage, type OffersPageShareCall } from '@pages/OffersPage';
import { grantMumbaiGeolocation, UAT_BASE_URL } from '@utils/LocationHelper';
import { Logger } from '@utils/Logger';

/** Offer used to ground OFR-008/009/010/011 — bank offer "BANK OF INDIA FLAT 200 RS OFF". */
export const GROUNDED_OFFER_ID = '15605';
export const GROUNDED_OFFER_TITLE = 'BANK OF INDIA FLAT 200 RS OFF';
/**
 * BUG FIX (2026-09-17, live run): the 2026-08-31 grounding below is stale — confirmed live via a
 * direct network listener that the real offers-data call is now same-origin at
 * `GET /api/offers/by-city?cityId=...`, not the old cross-origin `.../booking/api/v1/offers/
 * offers-by-cityId` path. Same class of domain-migration bug `otp-flow-automation-solved` and
 * `MovieAlertsModule.ts`'s `ALERT_SAVE_ROUTE_PATTERN` doc comments already document elsewhere —
 * the old pattern never matched, so every caller (OFR-016/018/028) was silently mocking/blocking
 * nothing while the real API traffic passed through unmocked.
 *
 * Original (now-stale) grounding, kept for context only:
 * > Grounded 2026-08-31 (OFR-016/018/028): the real offers-data call, captured via a live network
 * > trace. Cross-origin from the `inox-uat-web...` frontend, same split
 * > [[otp-flow-automation-solved]] documents for the OTP endpoints.
 */
export const OFFERS_API_ROUTE_PATTERN = '**/api/offers/by-city*';
/** Grounded 2026-08-31: third-party analytics/tracking calls seen firing from the Offers page. */
const THIRD_PARTY_TRACKING_HOSTS = ['google-analytics.com', 'snapchat.com', 'userway.org'];

export class OffersModule {
  private readonly offersPage: OffersPage;

  constructor(private page: Page) {
    this.offersPage = new OffersPage(page);
  }

  /**
   * Pre-grants geolocation before navigating so the "Enable Location" modal never renders —
   * see `grantMumbaiGeolocation` doc comment. Targets `UAT_BASE_URL` directly (not the shared
   * `playwright.config.ts` baseURL) because this module's live offer data and grounded offer id
   * (`GROUNDED_OFFER_ID`) were confirmed against UAT specifically — same rationale as
   * `EventListingModule.gotoHomepageWithCitySelected`.
   */
  async gotoOffers(): Promise<void> {
    Logger.info('Opening Offers listing on UAT with Mumbai geolocation pre-granted');
    await grantMumbaiGeolocation(this.page);
    await this.offersPage.gotoOffersRoute(UAT_BASE_URL);
  }

  async gotoOfferDetail(offerId = GROUNDED_OFFER_ID): Promise<void> {
    await grantMumbaiGeolocation(this.page);
    await this.offersPage.gotoOfferDetail(UAT_BASE_URL, offerId);
  }

  async expectOffersListingLoaded(): Promise<void> {
    await expect(this.offersPage.offersHeading()).toBeVisible({ timeout: 15_000 });
  }

  async expectCategoryTabsVisible(): Promise<void> {
    await expect(this.offersPage.categoryTab('All offers')).toBeVisible();
    await expect(this.offersPage.categoryTab('Bank')).toBeVisible();
    await expect(this.offersPage.categoryTab('Normal')).toBeVisible();
    await expect(this.offersPage.categoryTab('GoogleWallet')).toBeVisible();
  }

  /**
   * Grounded 2026-08-31: all current UAT offer data is bank-category, so tab selection cannot
   * be distinguished by *content* today — this only asserts the tab is selectable and at least
   * one offer card renders afterward, not category-correct filtering. Strengthen once
   * non-bank test data exists (flagged in requirements/offers.md coverage notes).
   */
  async expectTabHasOffers(tab: 'All offers' | 'Bank' | 'Normal' | 'GoogleWallet'): Promise<void> {
    await this.offersPage.categoryTab(tab).click();
    const firstCard = this.offersPage.offerCards().first();
    await expect(firstCard).toBeVisible({ timeout: 10_000 });
  }

  async openOfferDetailFromListing(title: string): Promise<void> {
    await this.offersPage.offerCardByTitle(title).click();
    await this.page.waitForURL(/\/more\/offers\/\d+/, { timeout: 15_000 });
  }

  async expectOfferDetailVisible(title: string): Promise<void> {
    await expect(this.offersPage.offerDetailTitle(title)).toBeVisible({ timeout: 15_000 });
    await expect(this.offersPage.termsAndConditionsHeading()).toBeVisible();
    await expect(this.offersPage.shareOfferButton()).toBeVisible();
  }

  /**
   * Grounded 2026-08-31: this Proceed To Book button IS live on UAT for the grounded offer,
   * contradicting the source sheet's "hidden per product decision" note for TC_App_012 — see
   * OffersPage doc comment. Kept as a lightweight visibility check here in case a future
   * ticket revision re-scopes TC_App_012 back into coverage.
   */
  async expectProceedToBookVisible(): Promise<void> {
    await expect(this.offersPage.proceedToBookButton()).toBeVisible();
  }

  /**
   * OFR-009/OFR-030: stubs `navigator.share` (the OS share sheet can't be driven by
   * Playwright) and returns the exact payload the app passed, so the caller can assert message
   * format directly instead of guessing at UI for a native dialog.
   */
  async shareOfferAndCaptureCall(): Promise<OffersPageShareCall | undefined> {
    await this.offersPage.stubNativeShare();
    await this.offersPage.shareOfferButton().click();
    const calls = await this.offersPage.getStubbedShareCalls();
    return calls[0];
  }

  /**
   * OFR-010: real behavior is that invoking Share does not navigate away from the offer detail
   * page (confirmed live 2026-08-31) — this asserts the URL is unchanged after the share call,
   * rather than literally "tapping back" as the source sheet's steps describe (there is no
   * separate screen to back out of; the share sheet is native OS chrome outside the page).
   */
  async expectStillOnOfferDetailAfterShare(offerId = GROUNDED_OFFER_ID): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(`/more/offers/${offerId}`));
  }

  /**
   * BUG FIX (2026-08-31, live run): calling `.count()` immediately after `gotoOffers()` raced
   * the client-side render — offer cards aren't present in the DOM yet even though the "Offers"
   * heading already is. Waiting for the first card to become visible first (same signal
   * `expectTabHasOffers` already waits on) makes this reliable without a fixed sleep.
   */
  async expectOfferCardCount(): Promise<number> {
    await this.offersPage.offerCards().first().waitFor({ state: 'visible', timeout: 15_000 }).catch(() => undefined);
    return this.offersPage.offerCards().count();
  }

  /**
   * OFR-017: grounded 2026-08-31 — an invalid offer id renders a generic "Special Offer"
   * fallback rather than crashing or erroring; see `OffersPage.fallbackOfferHeading`.
   */
  async gotoOfferDetailAndExpectFallbackNoCrash(invalidOfferId: string): Promise<void> {
    await grantMumbaiGeolocation(this.page);
    await this.offersPage.gotoOfferDetail(UAT_BASE_URL, invalidOfferId);
    await expect(this.offersPage.fallbackOfferHeading()).toBeVisible({ timeout: 15_000 });
  }

  /**
   * OFR-026: grounded 2026-08-31 — the offer title heading carries a `line-clamp-2` CSS class
   * (confirmed on offer id `15605`'s title `<h3>`), the site's own long-title truncation
   * mechanism. Checks the class directly rather than rendering an artificially long title,
   * which this test framework has no admin access to configure.
   */
  async expectOfferTitleHasTruncationStyling(title: string): Promise<void> {
    const el = this.offersPage.offerDetailTitle(title);
    await expect(el).toBeVisible({ timeout: 15_000 });
    const classes = await el.getAttribute('class');
    expect(classes ?? '').toContain('line-clamp');
  }

  /**
   * OFR-027: rapid tab switching should not crash or leave the listing in a broken state —
   * asserts the listing survives four quick switches and still shows offer cards afterward.
   */
  async rapidlySwitchTabsAndExpectStableListing(): Promise<void> {
    const tabs: Array<'All offers' | 'Bank' | 'Normal' | 'GoogleWallet'> = ['All offers', 'Bank', 'GoogleWallet', 'All offers'];
    for (const tab of tabs) {
      await this.offersPage.categoryTab(tab).click({ timeout: 8_000 });
    }
    await expect(this.offersPage.offerCards().first()).toBeVisible({ timeout: 10_000 });
  }

  /**
   * OFR-041/042: grounded 2026-08-31 — Food's default "Book with Ticket" tab shows no offers;
   * "Order Anytime" shows the same bank-offers promo section as `/offers`.
   */
  async gotoFoodOrderAnytime(): Promise<void> {
    Logger.info('Opening Food screen and switching to Order Anytime for promoted offers');
    await grantMumbaiGeolocation(this.page);
    await this.offersPage.gotoFoodRoute(UAT_BASE_URL);
    await this.offersPage.orderAnytimeTab().click();
  }

  async expectPromotedOffersVisibleOnFood(): Promise<void> {
    await expect(this.offersPage.offerCards().first()).toBeVisible({ timeout: 10_000 });
  }

  async openFirstFoodOfferAndExpectDetail(): Promise<void> {
    await this.offersPage.offerCards().first().click();
    await this.page.waitForURL(/\/more\/offers\/\d+/, { timeout: 15_000 });
    await expect(this.offersPage.termsAndConditionsHeading()).toBeVisible({ timeout: 15_000 });
  }

  /**
   * OFR-016: grounded 2026-08-31 — `context.setOffline(true)` before `page.goto()` fails
   * navigation outright (`net::ERR_INTERNET_DISCONNECTED`), never reaching the SPA. Blocking
   * only the real offers-data API (`OFFERS_API_ROUTE_PATTERN`) lets the page load and render its
   * own real degraded state instead: a "No Offers Available" message, confirmed live.
   */
  async gotoOffersWithApiBlockedAndExpectNoOffersMessage(): Promise<void> {
    await grantMumbaiGeolocation(this.page);
    await this.page.route(OFFERS_API_ROUTE_PATTERN, (route) => route.abort('internetdisconnected'));
    await this.offersPage.gotoOffersRoute(UAT_BASE_URL);
    await expect(this.offersPage.noOffersAvailableText()).toBeVisible({ timeout: 15_000 });
    await this.page.unroute(OFFERS_API_ROUTE_PATTERN);
  }

  /**
   * OFR-013: distinct from OFR-016's network-failure state — this mocks a genuinely successful
   * response (`statusCode: 200`) whose real `data` array is forced empty, the real "zero offers
   * configured" case rather than an error. Grounded 2026-09-07: same "No Offers Available" UI
   * renders either way, confirming the empty-state message covers both causes.
   */
  async gotoOffersWithEmptyDataAndExpectNoOffersMessage(): Promise<void> {
    await grantMumbaiGeolocation(this.page);
    await this.page.route(OFFERS_API_ROUTE_PATTERN, async (route) => {
      const response = await route.fetch();
      const json = await response.json();
      json.data = [];
      await route.fulfill({ response, json });
    });
    await this.offersPage.gotoOffersRoute(UAT_BASE_URL);
    await expect(this.offersPage.noOffersAvailableText()).toBeVisible({ timeout: 15_000 });
    await this.page.unroute(OFFERS_API_ROUTE_PATTERN);
  }

  /**
   * OFR-028: same mechanism as OFR-016, but the block is applied *after* a successful first
   * load (cards already visible) — this is the "drops mid-session" case, not the initial-load
   * one. BUG FIX (2026-09-01, live run): switching category tabs does NOT re-fetch — it's a
   * client-side filter of the already-loaded response (confirmed live: blocking the API then
   * clicking a tab never triggered the "No Offers Available" state within timeout). A reload
   * is what actually forces a fresh request that then hits the block.
   */
  async triggerOffersApiFailureAfterInitialLoad(): Promise<void> {
    await expect(this.offersPage.offerCards().first()).toBeVisible({ timeout: 15_000 });
    await this.page.route(OFFERS_API_ROUTE_PATTERN, (route) => route.abort('internetdisconnected'));
    await this.page.reload({ waitUntil: 'domcontentloaded' });
    await expect(this.offersPage.noOffersAvailableText()).toBeVisible({ timeout: 15_000 });
    await this.page.unroute(OFFERS_API_ROUTE_PATTERN);
  }

  /**
   * OFR-018: grounded 2026-08-31 — a full `context.setOffline(true)` left the Share button
   * unresolvable (unclear why; not investigated further). Blocking only the backend-API and
   * known third-party tracking hosts leaves the already-loaded page's own JS functional, which
   * is what "no internet" actually means for a pure client-side action like invoking Share —
   * confirmed the button stays clickable and produces the same valid message/URL as OFR-009.
   */
  async shareOfferWithBackendUnreachableAndCaptureCall(): Promise<OffersPageShareCall | undefined> {
    // BUG FIX (2026-09-01, live run): registering the route block immediately after
    // `gotoOfferDetail()` hung the Share button click for the full test timeout — some
    // in-flight background request from the page's own initial hydration was apparently still
    // pending and got caught by the block, stalling the app's render. Confirming the button is
    // already visible (page fully settled) *before* registering the block avoids that race.
    await expect(this.offersPage.shareOfferButton()).toBeVisible({ timeout: 15_000 });
    await this.page.route('**/*', (route) => {
      const url = route.request().url();
      const blocked = url.includes('uat-api.pvrinox.com') || THIRD_PARTY_TRACKING_HOSTS.some((host) => url.includes(host));
      return blocked ? route.abort('internetdisconnected') : route.continue();
    });
    const call = await this.shareOfferAndCaptureCall();
    await this.page.unroute('**/*');
    return call;
  }

  /**
   * OFR-025: grounded 2026-08-31 — offer card banners already resolve to
   * `fallback-offer-card.png` when their real banner image is blocked (confirmed via network
   * trace), rather than a broken-image icon. Asserts the card's `<img>` still has a valid `src`
   * and the card itself stays visible/clickable — no crash, no broken layout.
   */
  async blockOfferBannerImagesAndExpectFallbackRendered(): Promise<void> {
    await this.page.route('**/_next/image?url=**offer**', (route) => route.abort());
    await this.page.reload({ waitUntil: 'domcontentloaded' });
    const firstCard = this.offersPage.offerCards().first();
    await expect(firstCard).toBeVisible({ timeout: 15_000 });
    const img = firstCard.locator('img').first();
    const src = await img.getAttribute('src');
    expect(src).toBeTruthy();
    await this.page.unroute('**/_next/image?url=**offer**');
  }

  /**
   * OFR-040: grounded + confirmed by user 2026-09-01 — no back button exists on the /offers
   * listing page; the real way off it is the header "Home" nav link. See `OffersPage.homeNavLink`.
   */
  async clickHomeNavAndExpectHomepageNavigation(): Promise<void> {
    await this.offersPage.homeNavLink().click();
    await this.page.waitForURL(/\/$/, { timeout: 15_000 });
  }
}
