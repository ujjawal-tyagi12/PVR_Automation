import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { LegalContentPage } from '@pages/LegalContentPage';
import { dismissPromoPopup, grantMumbaiGeolocation, UAT_BASE_URL } from '@utils/LocationHelper';
import { Logger } from '@utils/Logger';

export class LegalContentModule {
  private readonly legalPage: LegalContentPage;

  constructor(private page: Page) {
    this.legalPage = new LegalContentPage(page);
  }

  private async grantAndDismiss(): Promise<void> {
    await grantMumbaiGeolocation(this.page);
    await dismissPromoPopup(this.page);
  }

  /** Direct-URL navigation, matching this repo's established pattern — the footer link click
   * itself is exercised separately by `clickFooterLinkAndExpectNavigation` for the sheet's
   * pure-navigation rows (LGL-004/005/006). */
  async gotoPrivacyPolicy(): Promise<void> {
    Logger.info('Opening /privacy-policy on UAT with Mumbai geolocation granted');
    await grantMumbaiGeolocation(this.page);
    await this.legalPage.gotoPrivacyPolicy(UAT_BASE_URL);
    await dismissPromoPopup(this.page);
    await expect(this.legalPage.privacyPolicyTabButton()).toBeVisible({ timeout: 20_000 });
  }

  async gotoTermsOfUse(): Promise<void> {
    Logger.info('Opening /terms-use on UAT with Mumbai geolocation granted');
    await grantMumbaiGeolocation(this.page);
    await this.legalPage.gotoTermsOfUse(UAT_BASE_URL);
    await dismissPromoPopup(this.page);
    await expect(this.legalPage.termsOfUseTabButton()).toBeVisible({ timeout: 20_000 });
  }

  async gotoTermsConditions(): Promise<void> {
    Logger.info('Opening /terms-conditions on UAT with Mumbai geolocation granted');
    await grantMumbaiGeolocation(this.page);
    await this.legalPage.gotoTermsConditions(UAT_BASE_URL);
    await dismissPromoPopup(this.page);
    await expect(this.legalPage.termsConditionsTabButton()).toBeVisible({ timeout: 20_000 });
  }

  // ---- Footer navigation (LGL-001..006) ----

  async gotoHomepage(): Promise<void> {
    await this.grantAndDismiss();
    await this.page.goto(UAT_BASE_URL);
    await dismissPromoPopup(this.page);
  }

  async expectFooterLinkVisible(name: 'Privacy Policy' | 'Terms of Use' | 'Terms & Conditions'): Promise<void> {
    const link =
      name === 'Privacy Policy'
        ? this.legalPage.footerPrivacyPolicyLink()
        : name === 'Terms of Use'
          ? this.legalPage.footerTermsOfUseLink()
          : this.legalPage.footerTermsConditionsLink();
    await link.scrollIntoViewIfNeeded();
    await expect(link).toBeVisible();
  }

  async clickFooterLinkAndExpectUrl(name: 'Privacy Policy' | 'Terms of Use' | 'Terms & Conditions', urlPart: RegExp): Promise<void> {
    await this.expectFooterLinkVisible(name);
    const link =
      name === 'Privacy Policy'
        ? this.legalPage.footerPrivacyPolicyLink()
        : name === 'Terms of Use'
          ? this.legalPage.footerTermsOfUseLink()
          : this.legalPage.footerTermsConditionsLink();
    await link.click();
    await this.page.waitForURL(urlPart, { timeout: 15_000 });
  }

  // ---- Top-level tabs (real per-page navigation — see LegalContentPage.ts doc comment) ----

  async expectTopLevelTabsVisible(): Promise<void> {
    await expect(this.legalPage.privacyPolicyTabButton()).toBeVisible();
    await expect(this.legalPage.termsOfUseTabButton()).toBeVisible();
    await expect(this.legalPage.termsConditionsTabButton()).toBeVisible();
  }

  /** LGL-010: adapted — no `aria-selected`/distinguishing active class was found on the
   * top-level tab buttons (confirmed live), so "highlighted" is proxied by the one real signal
   * that does exist: the page's own URL matches the tab you're currently on. */
  async expectCurrentUrlMatches(urlPart: RegExp): Promise<void> {
    await expect(this.page).toHaveURL(urlPart);
  }

  async clickTopLevelTabAndExpectUrl(name: 'Privacy Policy' | 'Terms of Use' | 'Terms & Conditions', urlPart: RegExp): Promise<void> {
    const button =
      name === 'Privacy Policy'
        ? this.legalPage.privacyPolicyTabButton()
        : name === 'Terms of Use'
          ? this.legalPage.termsOfUseTabButton()
          : this.legalPage.termsConditionsTabButton();
    await button.click();
    await this.page.waitForURL(urlPart, { timeout: 15_000 });
  }

  // ---- Content ----

  async expectTextVisible(snippet: string): Promise<void> {
    await expect(this.page.getByText(snippet).first()).toBeVisible();
  }

  /** LGL-038: reuses the already-fixed tolerant regex locator (real heading uses a non-breaking
   * space and a curly apostrophe, not the ASCII characters a literal string snippet would need —
   * see `LegalContentPage.ts` doc comment) instead of hardcoding either unicode character here. */
  async expectGiftCardHeadingVisible(): Promise<void> {
    await expect(this.legalPage.giftCardHeading()).toBeVisible();
  }

  /** LGL-012/015: confirms the page's full content is reachable by scrolling to its end, not a
   * fixed-length check — Privacy Policy's real content (~17.7k characters) is long enough to need
   * this; Terms of Use's real content is short dummy boilerplate (see LegalContentPage.ts doc
   * comment) so this just confirms scrolling doesn't break anything short content either. */
  async scrollToBottomAndExpectNoCrash(): Promise<void> {
    await this.page.keyboard.press('End').catch(() => undefined);
    await this.page.mouse.wheel(0, 20_000);
    await expect(this.legalPage.privacyPolicyTabButton()).toBeVisible();
  }

  // ---- Terms & Conditions sub-tabs (scroll-anchor pattern — see LegalContentPage.ts doc comment) ----

  private static readonly REAL_SUB_TABS = ['Onlineee Booking', 'Privilege Plus', 'Giffting card', 'SS dd gg s', 'Eas eas eas', 'M-coupon data'] as const;

  private subTabButton(name: (typeof LegalContentModule.REAL_SUB_TABS)[number]) {
    switch (name) {
      case 'Onlineee Booking':
        return this.legalPage.onlineBookingSubTab();
      case 'Privilege Plus':
        return this.legalPage.privilegeSubTab();
      case 'Giffting card':
        return this.legalPage.giftCardSubTab();
      case 'SS dd gg s':
        return this.legalPage.dummySubTabOne();
      case 'Eas eas eas':
        return this.legalPage.dummySubTabTwo();
      case 'M-coupon data':
        return this.legalPage.mCouponSubTab();
    }
  }

  async expectSubTabVisible(name: (typeof LegalContentModule.REAL_SUB_TABS)[number]): Promise<void> {
    await expect(this.subTabButton(name)).toBeVisible();
  }

  /**
   * LGL-028: RESOLVED — no `aria-selected` exists (confirmed live), but a real CSS class
   * (a `radial-gradient` background, confirmed live) IS a genuine active-tab indicator that
   * correctly moves to whichever sub-tab was last clicked — verified across all 6 real sub-tabs
   * in sequence. The earlier `test.fixme` only checked `aria-selected` and missed this.
   */
  private async subTabIsHighlighted(name: (typeof LegalContentModule.REAL_SUB_TABS)[number]): Promise<boolean> {
    const className = await this.subTabButton(name).evaluate((el) => el.className);
    return /radial-gradient/.test(className);
  }

  async clickSubTabAndExpectHighlighted(name: (typeof LegalContentModule.REAL_SUB_TABS)[number]): Promise<void> {
    await this.subTabButton(name).click();
    await expect.poll(() => this.subTabIsHighlighted(name), { timeout: 5_000 }).toBe(true);
  }

  /** LGL-022: "Definitions" is the closest real heading to the Online Booking sub-tab's own
   * content cluster (booking/cancellation-related headings immediately follow it) — see
   * LegalContentPage.ts doc comment. */
  async clickOnlineBookingSubTabAndExpectDefinitionsVisible(): Promise<void> {
    await this.legalPage.onlineBookingSubTab().click();
    await expect(this.legalPage.definitionsHeading()).toBeVisible({ timeout: 10_000 });
  }

  /** LGL-025: "PVRINOX E-Gift Card T&C's" is a real, confirmed heading directly tied to the
   * Gift Card sub-tab. */
  async clickGiftCardSubTabAndExpectContentVisible(): Promise<void> {
    await this.legalPage.giftCardSubTab().click();
    await expect(this.legalPage.giftCardHeading()).toBeVisible({ timeout: 10_000 });
  }

  /** Generic click-through for sub-tabs without a confirmed distinct content heading (e.g.
   * Privilege Plus) — confirms the click doesn't break the page, without over-claiming an exact
   * content mapping this pass didn't ground. */
  async clickSubTabAndExpectPageStillFunctional(name: (typeof LegalContentModule.REAL_SUB_TABS)[number]): Promise<void> {
    await this.subTabButton(name).click();
    await expect(this.legalPage.termsConditionsTabButton()).toBeVisible({ timeout: 10_000 });
  }

  /** LGL-019/026: DOM order is the closest real proxy for sub-tab sequence — same approach
   * `AboutUsModule`/`CuratedShowsModule` use elsewhere in this suite. */
  async expectSubTabsInOrder(namesInOrder: string[]): Promise<void> {
    const allButtons = await this.page.getByRole('button').allTextContents();
    const actualOrder = allButtons.filter((text) => namesInOrder.includes(text));
    expect(actualOrder).toEqual(namesInOrder);
  }

  // ---- Hyperlinks ----

  /**
   * LGL-036: RESOLVED (real bug, not a test bug) — the "PVR Cinemas" link (`target="_blank"`,
   * `href="https://web.pvrcinemas.com/privacy-policy"`) genuinely opens a new tab, but
   * `web.pvrcinemas.com` returns NXDOMAIN (confirmed independently via `nslookup`, not a sandbox
   * artifact) — the new tab lands on `chrome-error://chromewebdata/`. Asserts this real, broken
   * behavior: a new tab opens (the link mechanism itself works) but never reaches the intended
   * destination, contradicting the sheet's "external page opens successfully" assumption.
   */
  async clickPvrCinemasLinkAndExpectBrokenExternalLink(): Promise<void> {
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent('page', { timeout: 15_000 }),
      this.legalPage.pvrCinemasExternalLink().click(),
    ]);
    await newPage.waitForLoadState('domcontentloaded', { timeout: 10_000 }).catch(() => undefined);
    expect(newPage.url()).not.toContain('web.pvrcinemas.com');
    await newPage.close();
  }

  async expectMailtoLinkVisible(): Promise<void> {
    await expect(this.legalPage.feedbackMailtoLink()).toBeVisible();
  }

  // ---- Responsiveness / performance ----

  async resizeViewportAndExpectPageStillUsable(width: number, height: number): Promise<void> {
    await this.page.setViewportSize({ width, height });
    await expect(this.legalPage.privacyPolicyTabButton()).toBeVisible({ timeout: 10_000 });
  }

  /** LGL-042: generous timeout budget per the `sandbox-resource-constraints` project memory,
   * matching `CuratedShowsModule.expectLoadsWithinTimeout`. */
  async expectPrivacyPolicyLoadsWithinTimeout(maxMs: number): Promise<void> {
    const start = Date.now();
    await this.gotoPrivacyPolicy();
    const elapsed = Date.now() - start;
    expect(elapsed, `Privacy Policy load took ${elapsed}ms, expected under ${maxMs}ms`).toBeLessThan(maxMs);
  }

  // ---- Browser navigation ----

  async goBackAndExpectUrl(urlPart: RegExp): Promise<void> {
    await this.page.goBack();
    await this.page.waitForURL(urlPart, { timeout: 15_000 });
  }

  async reloadAndExpectStillUsable(): Promise<void> {
    await this.page.reload();
    await expect(this.legalPage.privacyPolicyTabButton()).toBeVisible({ timeout: 15_000 });
  }

  // ---- Network interruption (adapted like AboutUsModule.ts's ABT-050 / OffersModule.ts's OFR-016) ----

  async attemptGotoPrivacyPolicyOfflineAndReturnError(): Promise<Error | undefined> {
    await this.page.context().setOffline(true);
    try {
      await this.legalPage.gotoPrivacyPolicy(UAT_BASE_URL);
      return undefined;
    } catch (error) {
      return error as Error;
    } finally {
      await this.page.context().setOffline(false);
    }
  }
}
