import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { AboutUsPage } from '@pages/AboutUsPage';
import { dismissPromoPopup, grantMumbaiGeolocation, UAT_BASE_URL } from '@utils/LocationHelper';
import { Logger } from '@utils/Logger';

export class AboutUsModule {
  private readonly aboutUsPage: AboutUsPage;

  constructor(private page: Page) {
    this.aboutUsPage = new AboutUsPage(page);
  }

  /**
   * Direct-URL navigation to `/about-us`, matching this repo's established pattern
   * (`OffersPage.gotoOffersRoute`, `CuratedShowsPage.goto`) — used by every content scenario so
   * they don't depend on header interaction. The "More" menu path is real and reliable too (see
   * `gotoAboutUsViaMoreMenu`), just not needed for scenarios that only care about page content.
   */
  async gotoAboutUs(): Promise<void> {
    Logger.info('Opening /about-us on UAT with Mumbai geolocation granted');
    await grantMumbaiGeolocation(this.page);
    await this.aboutUsPage.goto(UAT_BASE_URL);
    await dismissPromoPopup(this.page);
    await expect(this.aboutUsPage.pageHeading()).toBeVisible({ timeout: 20_000 });
  }

  /**
   * ABT-001/002: the real navigation path — click header "More", then the "About Us" menuitem.
   * Confirmed live, 5/5 fresh-context attempts, once matched against the real accessible tree
   * (see `AboutUsPage.ts` doc comment for the two locator bugs this corrects).
   */
  async gotoAboutUsViaMoreMenu(): Promise<void> {
    Logger.info('Opening About Us via header More menu on UAT with Mumbai geolocation granted');
    await grantMumbaiGeolocation(this.page);
    await this.page.goto(UAT_BASE_URL);
    await dismissPromoPopup(this.page);
    await expect(this.aboutUsPage.moreMenuButton()).toBeVisible({ timeout: 20_000 });
  }

  async expectAboutUsMenuItemVisible(): Promise<void> {
    await this.aboutUsPage.moreMenuButton().click();
    await expect(this.aboutUsPage.aboutUsMenuItem()).toBeVisible({ timeout: 10_000 });
  }

  async clickAboutUsMenuItemAndExpectNavigation(): Promise<void> {
    await this.aboutUsPage.moreMenuButton().click();
    await this.aboutUsPage.aboutUsMenuItem().click();
    await this.page.waitForURL(/\/about-us/, { timeout: 15_000 });
  }

  // ---- Page load / overall structure ----

  async expectPageLoaded(): Promise<void> {
    await expect(this.aboutUsPage.pageHeading()).toBeVisible({ timeout: 20_000 });
  }

  /**
   * ABT-004/043: all five section headings render together on a single continuous page —
   * confirmed live, NOT gated behind clicking each tab first (see `AboutUsPage.ts` doc comment).
   */
  async expectAllSectionsPresent(): Promise<void> {
    await expect(this.aboutUsPage.pageHeading()).toBeVisible();
    await expect(this.aboutUsPage.ourJourneyHeading()).toBeVisible();
    await expect(this.aboutUsPage.teamHeading()).toBeVisible();
    await expect(this.aboutUsPage.awardsRecognitionHeading()).toBeVisible();
    await expect(this.aboutUsPage.brandsHeading()).toBeVisible();
  }

  private static readonly SECTIONS = ['Company', 'Our Journey', 'Team', 'Awards', 'Brands'] as const;

  private tabButton(section: (typeof AboutUsModule.SECTIONS)[number]) {
    switch (section) {
      case 'Company':
        return this.aboutUsPage.companyTabButton();
      case 'Our Journey':
        return this.aboutUsPage.ourJourneyTabButton();
      case 'Team':
        return this.aboutUsPage.teamTabButton();
      case 'Awards':
        return this.aboutUsPage.awardsTabButton();
      case 'Brands':
        return this.aboutUsPage.brandsTabButton();
    }
  }

  private sectionHeading(section: (typeof AboutUsModule.SECTIONS)[number]) {
    switch (section) {
      case 'Company':
        return this.aboutUsPage.pageHeading();
      case 'Our Journey':
        return this.aboutUsPage.ourJourneyHeading();
      case 'Team':
        return this.aboutUsPage.teamHeading();
      case 'Awards':
        return this.aboutUsPage.awardsRecognitionHeading();
      case 'Brands':
        return this.aboutUsPage.brandsHeading();
    }
  }

  async expectTabVisible(section: (typeof AboutUsModule.SECTIONS)[number]): Promise<void> {
    await expect(this.tabButton(section)).toBeVisible();
  }

  /**
   * ABT-013/044: reinterpreted from the sheet's show/hide "tab switching" — confirmed live this
   * is a scroll-to-section control on one continuous page (clicking "Team" does not hide
   * "Company Strength" or change the URL). Asserts the click scrolls the section into view.
   */
  async clickTabAndExpectSectionVisible(section: (typeof AboutUsModule.SECTIONS)[number]): Promise<void> {
    await this.tabButton(section).click();
    await expect(this.sectionHeading(section)).toBeVisible({ timeout: 10_000 });
  }

  // ---- Company ----

  /** ABT-005/006/007/009: all confirmed visible immediately on load, with no tab click needed. */
  async expectCompanySectionVisibleByDefault(): Promise<void> {
    await expect(this.aboutUsPage.pageHeading()).toBeVisible();
    await expect(this.aboutUsPage.companyStrengthHeading()).toBeVisible();
  }

  async expectCompanyOverviewTextVisible(expectedSnippet: string): Promise<void> {
    await expect(this.page.getByText(expectedSnippet)).toBeVisible();
  }

  /** ABT-011: light formatting proxy — the real overview is one long paragraph (confirmed live,
   * 700+ characters); a near-empty/truncated string would indicate a formatting regression. */
  async expectCompanyOverviewParagraphIsSubstantial(expectedSnippet: string, minLength = 200): Promise<void> {
    const text = await this.page.getByText(expectedSnippet).textContent();
    expect((text ?? '').length).toBeGreaterThan(minLength);
  }

  // ---- Our Journey (milestones) ----

  async expectMilestoneVisible(year: string): Promise<void> {
    await this.aboutUsPage.scrollUntilVisible(() => this.aboutUsPage.milestoneButton(year));
    await expect(this.aboutUsPage.milestoneButton(year)).toBeVisible();
  }

  /** ABT-017: title renders concatenated onto the same button's accessible name as the year. */
  async expectMilestoneTitleVisible(year: string, titleSnippet: string): Promise<void> {
    await this.aboutUsPage.scrollUntilVisible(() => this.aboutUsPage.milestoneButton(year));
    const name = await this.aboutUsPage.milestoneButton(year).first().evaluate((el) => el.textContent ?? '');
    expect(name).toContain(titleSnippet);
  }

  async openMilestonePopup(year: string): Promise<void> {
    await this.aboutUsPage.scrollUntilVisible(() => this.aboutUsPage.milestoneButton(year));
    await this.aboutUsPage.milestoneButton(year).click();
    await expect(this.aboutUsPage.dialog()).toBeVisible({ timeout: 10_000 });
  }

  async expectDialogContainsText(expectedSnippet: string): Promise<void> {
    await expect(this.aboutUsPage.dialog()).toContainText(expectedSnippet);
  }

  /**
   * ABT-021/030: the drawer's close control is icon-only (no accessible name) — confirmed live
   * via the real `data-slot="drawer-close"` attribute, same family as `CuratedShowsPage.ts`'s
   * "Learn More" dialog.
   */
  async closeDialog(): Promise<void> {
    await this.aboutUsPage.dialogCloseButton().click();
    await expect(this.aboutUsPage.dialog()).toBeHidden({ timeout: 10_000 });
  }

  /** ABT-018: confirms scrolling the Our Journey timeline reaches the last configured milestone. */
  async scrollJourneyTimelineAndExpectLastMilestoneVisible(lastYear: string): Promise<void> {
    await this.aboutUsPage.scrollUntilVisible(() => this.aboutUsPage.milestoneButton(lastYear));
    await expect(this.aboutUsPage.milestoneButton(lastYear)).toBeVisible();
  }

  // ---- Team ----

  async expectTeamGroupVisible(group: 'Management' | 'Board of Directors'): Promise<void> {
    const heading =
      group === 'Management' ? () => this.aboutUsPage.managementGroupHeading() : () => this.aboutUsPage.boardOfDirectorsGroupHeading();
    await this.aboutUsPage.scrollUntilVisible(heading);
    await expect(heading()).toBeVisible();
  }

  async expectTeamMemberVisible(namePrefix: string): Promise<void> {
    await this.aboutUsPage.scrollUntilVisible(() => this.aboutUsPage.teamMemberButton(namePrefix));
    await expect(this.aboutUsPage.teamMemberButton(namePrefix)).toBeVisible();
  }

  /** ABT-026: designation renders concatenated onto the same button's accessible name. */
  async expectTeamMemberDesignationVisible(namePrefix: string, designationSnippet: string): Promise<void> {
    const name = await this.aboutUsPage.teamMemberButton(namePrefix).first().evaluate((el) => el.textContent ?? '');
    expect(name).toContain(designationSnippet);
  }

  async openTeamMemberPopup(namePrefix: string): Promise<void> {
    await this.aboutUsPage.scrollUntilVisible(() => this.aboutUsPage.teamMemberButton(namePrefix));
    await this.aboutUsPage.teamMemberButton(namePrefix).click();
    await expect(this.aboutUsPage.dialog()).toBeVisible({ timeout: 10_000 });
  }

  /** ABT-027: DOM order is the closest real proxy for "Admin-configured sequence" — same
   * approach `CuratedShowsModule.expectCategoriesInOrder` uses. */
  async expectTeamMembersInOrder(namePrefixesInOrder: string[]): Promise<void> {
    const allButtons = await this.page.getByRole('button').allTextContents();
    const actualOrder = namePrefixesInOrder.filter((name) => allButtons.some((text) => text.startsWith(name)));
    expect(actualOrder).toEqual(namePrefixesInOrder);
  }

  // ---- Awards ----

  async expectAwardsYearFilterVisible(year: string): Promise<void> {
    await this.aboutUsPage.scrollUntilVisible(() => this.aboutUsPage.awardsYearFilterButton(year));
    await expect(this.aboutUsPage.awardsYearFilterButton(year)).toBeVisible();
  }

  async clickAwardsYearFilter(year: string): Promise<void> {
    await this.aboutUsPage.scrollUntilVisible(() => this.aboutUsPage.awardsYearFilterButton(year));
    await this.aboutUsPage.awardsYearFilterButton(year).click();
  }

  /** ABT-032: confirmed live — award cards render with no heading role, only an `<img
   * alt="{title}">`; matched via that, not text. */
  async expectAwardCardVisible(title: string): Promise<void> {
    await this.aboutUsPage.scrollUntilVisible(() => this.aboutUsPage.awardCardImage(title));
    await expect(this.aboutUsPage.awardCardImage(title)).toBeVisible();
  }

  /** ABT-034/035: the year filter genuinely filters the swiper client-side (confirmed live, no
   * network request) — asserts the exact resulting slide count, not just "some change". */
  async clickAwardsYearFilterAndExpectSlideCount(year: string, expectedCount: number): Promise<void> {
    await this.clickAwardsYearFilter(year);
    await expect(this.aboutUsPage.awardSlides()).toHaveCount(expectedCount);
  }

  // ---- Brands ----

  async expectBrandsDownloadVisible(): Promise<void> {
    await this.aboutUsPage.scrollUntilVisible(() => this.aboutUsPage.brandsDownloadButton());
    await expect(this.aboutUsPage.brandsDownloadButton()).toBeVisible();
  }

  /** ABT-038: Brands actually renders 3 resources (IMAX logo, PVR logo, and a "Brand Guidelines"
   * download card) — confirmed live; the earlier single-Download-button check undercounted them. */
  async expectAllBrandResourcesVisible(): Promise<void> {
    await this.aboutUsPage.scrollUntilVisible(() => this.aboutUsPage.imaxLogo());
    await expect(this.aboutUsPage.imaxLogo()).toBeVisible();
    await expect(this.aboutUsPage.pvrLogo()).toBeVisible();
    await expect(this.aboutUsPage.brandsDownloadButton()).toBeVisible();
  }

  /** ABT-039: real, separate title text next to the Download card's logo — confirmed live via
   * full section HTML, not part of the button's own accessible name. */
  async expectBrandResourceTitleVisible(title: string): Promise<void> {
    await this.aboutUsPage.scrollUntilVisible(() => this.aboutUsPage.brandGuidelinesTitle());
    await expect(this.aboutUsPage.brandGuidelinesTitle()).toHaveText(title);
  }

  /**
   * ABT-040/041/042: confirmed live — the single configured Brands resource is a real archive
   * hosted on the CDN domain (`uat-media.pvrinox.com`, a `.zip`), and clicking "Download"
   * navigates the same tab there (no `download`/`popup` event fired) rather than opening a new
   * tab. Asserted as a cross-origin navigation to that CDN, which is this build's real
   * implementation of both "Download/Open link" and "external resource link".
   */
  async clickBrandsDownloadAndExpectExternalNavigation(): Promise<void> {
    await this.aboutUsPage.scrollUntilVisible(() => this.aboutUsPage.brandsDownloadButton());
    await this.aboutUsPage.brandsDownloadButton().click();
    await this.page.waitForURL(/uat-media\.pvrinox\.com/, { timeout: 15_000 });
  }

  // ---- Responsiveness ----

  async resizeViewportAndExpectPageStillUsable(width: number, height: number): Promise<void> {
    await this.page.setViewportSize({ width, height });
    await expect(this.aboutUsPage.pageHeading()).toBeVisible({ timeout: 10_000 });
  }

  // ---- Media ----

  /** No DOM lib configured for this Node project (see HomeScreenPage.ts), so `document` is only
   * reachable via `globalThis as unknown as {...}` inside the browser-context callback. */
  private async bannerNaturalWidth(): Promise<number> {
    return this.page.evaluate(() => {
      type ImgEl = { naturalWidth: number } | null;
      const doc = (globalThis as unknown as { document: { querySelector: (selector: string) => ImgEl } }).document;
      const img = doc.querySelector('img[src*="aboutUsHeader"]');
      return img?.naturalWidth ?? -1;
    });
  }

  async expectBannerImageLoaded(): Promise<void> {
    await expect
      .poll(async () => this.bannerNaturalWidth(), { timeout: 15_000 })
      .toBeGreaterThan(0);
  }

  /**
   * ABT-047: real finding, contradicts the sheet — blocking the banner image request leaves a
   * genuinely broken `<img>` (`naturalWidth` 0) with no placeholder/fallback swap anywhere on the
   * page, confirmed live. Must be called BEFORE `gotoAboutUs`.
   */
  async blockBannerImage(): Promise<void> {
    await this.page.route('**/assets/pvr/aboutUsHeader.png', (route) => route.abort('internetdisconnected'));
  }

  async expectBannerImageBrokenWithNoFallback(): Promise<void> {
    await expect.poll(async () => this.bannerNaturalWidth(), { timeout: 10_000 }).toBe(0);
    await expect(this.aboutUsPage.placeholderImages()).toHaveCount(0);
  }

  // ---- Scrolling / performance ----

  async scrollToBottomAndExpectNoCrash(): Promise<void> {
    await this.page.keyboard.press('End').catch(() => undefined);
    await this.page.mouse.wheel(0, 20_000);
    await expect(this.aboutUsPage.brandsHeading()).toBeVisible();
  }

  // ---- Network interruption ----

  /**
   * ABT-050: adapted like `OffersModule`'s OFR-016 — a full `context.setOffline(true)` fails
   * `page.goto()` outright with a real `net::ERR_INTERNET_DISCONNECTED`, confirmed live (there is
   * no distinct About-Us content API to block instead; the page is server-rendered). Returns the
   * thrown error for the caller to assert against, and always restores connectivity afterward.
   */
  async attemptGotoOfflineAndReturnError(): Promise<Error | undefined> {
    await this.page.context().setOffline(true);
    try {
      await this.aboutUsPage.goto(UAT_BASE_URL);
      return undefined;
    } catch (error) {
      return error as Error;
    } finally {
      await this.page.context().setOffline(false);
    }
  }
}
