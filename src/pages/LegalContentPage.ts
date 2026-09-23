import type { Page } from '@playwright/test';

/**
 * Grounded 2026-09-08 against UAT (inox-uat-web.pvrinox.com, Mumbai geolocation granted) via
 * headless Playwright (Playwright MCP's browser fails in this sandbox — see the
 * `pvr-inox-grounding-technique` project memory). Real routes: `/privacy-policy`, `/terms-use`,
 * `/terms-conditions` — confirmed via the footer's real `href`s (NOT the sheet's guessed
 * `/terms-of-use`/`/terms-and-conditions`, which both load a blank generic shell).
 *
 * **Two-tier navigation, confirmed live — do not treat both tiers the same way:**
 * 1. The three TOP-LEVEL tabs (Privacy Policy / Terms of Use / Terms & Conditions) are REAL
 *    per-page navigation — clicking "Terms of Use" while on `/privacy-policy` changes the URL to
 *    `/terms-use` and the document title. Unlike About Us, this is a genuine route change.
 * 2. The Terms & Conditions page's SIX sub-tabs are the opposite — same scroll-anchor pattern as
 *    `AboutUsPage.ts`'s five tabs. Clicking one does not change the URL and every sub-tab's
 *    heading content is already present in the DOM on load (confirmed: `getByRole('heading')`
 *    enumeration returns all of Definitions/Purchasing tickets online/Booking of
 *    Tickets/Cancellation/General Conditions/Gift Card T&Cs/No Pets Allowed/Bundle Offer/Food
 *    Deal Voucher/Film Certification simultaneously, without clicking anything). Clicking a
 *    sub-tab DOES append a `?type={name}` query param to the URL (confirmed live, e.g.
 *    `/terms-conditions?type=Privilege%20Plus`) — this tracks which sub-tab was last clicked
 *    without a real navigation/reload, so URL-based assertions must tolerate the query string
 *    rather than requiring an exact `/terms-conditions` match.
 *
 * **Real sub-tab labels are dummy/typo'd UAT content, not the sheet's clean names** — confirmed
 * live via `getByRole('button')` enumeration on `/terms-conditions`: `"Onlineee Booking"` (typo,
 * extra "e"), `"Privilege Plus"`, `"Giffting card"` (typo), `"SS dd gg s"`, `"Eas eas eas"`,
 * `"M-coupon data"`. The sheet's "Contest & Promotion" sub-tab (TC_Web_74/LGL-023) has no
 * matching real label — `"SS dd gg s"`/`"Eas eas eas"` are unrelated placeholder garbage, not a
 * disguised Contest & Promotion tab (their own heading content, e.g. "No Pets Allowed Policy" /
 * "For Bundle Offer:", doesn't relate to contests either).
 *
 * No `data-testid` or `aria-selected` found on either tier's buttons (confirmed:
 * `aria-selected` is `null` on every sub-tab button) — there is no accessible "currently active"
 * signal for either tier; "default tab/sub-tab selected" scenarios are reinterpreted as "its
 * content is visible without clicking anything" (same adaptation `AboutUsPage.ts` uses).
 *
 * No distinct content-fetching API exists (only generic site-wide calls: `/api/auth/session`,
 * `/api/get-city-list`, `/api/detect-city`, `/api/experience-listing-image`) — these pages are
 * server-rendered like About Us, so "network interruption" must be adapted the same way
 * (`context.setOffline(true)` fails `page.goto()` outright with `net::ERR_INTERNET_DISCONNECTED`,
 * not a mockable API — see `AboutUsModule.ts`'s `attemptGotoOfflineAndReturnError`).
 *
 * Real external links confirmed in content: `www.pvrcinemas.com`, `www.inoxmovies.com`, a "PVR
 * Cinemas" link to `https://web.pvrcinemas.com/privacy-policy` (cross-domain), and a
 * `mailto:feedback@pvrinox.com` link. 11 real `<img>` elements render on `/terms-conditions`.
 */
export class LegalContentPage {
  constructor(private page: Page) {}

  async gotoPrivacyPolicy(baseUrl: string): Promise<void> {
    await this.page.goto(`${baseUrl}/privacy-policy`);
  }

  async gotoTermsOfUse(baseUrl: string): Promise<void> {
    await this.page.goto(`${baseUrl}/terms-use`);
  }

  async gotoTermsConditions(baseUrl: string): Promise<void> {
    await this.page.goto(`${baseUrl}/terms-conditions`);
  }

  readonly footerPrivacyPolicyLink = () => this.page.locator('footer').getByRole('link', { name: 'Privacy Policy', exact: true });
  readonly footerTermsOfUseLink = () => this.page.locator('footer').getByRole('link', { name: 'Terms of Use', exact: true });
  readonly footerTermsConditionsLink = () => this.page.locator('footer').getByRole('link', { name: 'Terms & Conditions', exact: true });

  // Top-level tabs — real per-page navigation (see class doc comment), present on all 3 pages.
  readonly privacyPolicyTabButton = () => this.page.getByRole('button', { name: 'Privacy Policy', exact: true });
  readonly termsOfUseTabButton = () => this.page.getByRole('button', { name: 'Terms of Use', exact: true });
  readonly termsConditionsTabButton = () => this.page.getByRole('button', { name: 'Terms & Conditions', exact: true });

  // Real sub-tab labels on /terms-conditions — scroll-anchor pattern, not show/hide (see class doc comment).
  readonly onlineBookingSubTab = () => this.page.getByRole('button', { name: 'Onlineee Booking', exact: true });
  readonly privilegeSubTab = () => this.page.getByRole('button', { name: 'Privilege Plus', exact: true });
  readonly giftCardSubTab = () => this.page.getByRole('button', { name: 'Giffting card', exact: true });
  /** Real labels are dummy UAT placeholder text (see class doc comment) — kept as named locators
   * (not a raw `getByRole` in the module) so this Page object stays the single place to update if
   * the real DOM changes. */
  readonly dummySubTabOne = () => this.page.getByRole('button', { name: 'SS dd gg s', exact: true });
  readonly dummySubTabTwo = () => this.page.getByRole('button', { name: 'Eas eas eas', exact: true });
  readonly mCouponSubTab = () => this.page.getByRole('button', { name: 'M-coupon data', exact: true });

  readonly definitionsHeading = () => this.page.getByRole('heading', { name: 'Definitions', exact: true }).first();
  /**
   * Grounded 2026-09-08 (Healer pass, real test failure): the literal string `"PVRINOX E-Gift
   * Card T&C's"` never matches — the real heading uses a non-breaking space (U+00A0) between
   * "PVRINOX" and "E-Gift", and a curly right single quote (U+2019, `’`) instead of an ASCII
   * apostrophe. Matched here via a whitespace-and-quote-tolerant regex instead of hardcoding
   * either unicode character.
   */
  readonly giftCardHeading = () => this.page.getByRole('heading', { name: /PVRINOX\s+E-Gift Card T&C.s/i });

  /**
   * Grounded 2026-09-08 (Healer pass, real test failure): this is a genuinely BROKEN external
   * link, not a test bug — `target="_blank"`, `href="https://web.pvrcinemas.com/privacy-policy"`,
   * but `web.pvrcinemas.com` returns NXDOMAIN (confirmed independently via `curl`/`nslookup`, not
   * just a sandbox network quirk). Clicking it opens a new tab that lands on
   * `chrome-error://chromewebdata/` — confirmed live. See `LegalContentModule.ts`'s doc comment
   * for how LGL-036 asserts this real (broken) behavior instead of the sheet's "opens
   * successfully" assumption.
   */
  readonly pvrCinemasExternalLink = () => this.page.getByRole('link', { name: 'PVR Cinemas', exact: true });
  /** The link's own accessible name is the email address itself (confirmed live) — a real
   * `getByRole` match, not a lower-priority CSS attribute selector. */
  readonly feedbackMailtoLink = () => this.page.getByRole('link', { name: 'feedback@pvrinox.com', exact: true });
}
