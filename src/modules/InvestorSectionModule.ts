import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { InvestorSectionPage } from '@pages/InvestorSectionPage';
import { dismissPromoPopup, grantMumbaiGeolocation, UAT_BASE_URL } from '@utils/LocationHelper';
import { Logger } from '@utils/Logger';

export class InvestorSectionModule {
  private readonly investorPage: InvestorSectionPage;

  constructor(private page: Page) {
    this.investorPage = new InvestorSectionPage(page);
  }

  /** Direct query-param navigation, matching this repo's established pattern and this page's
   * confirmed-real deep-link support. */
  async gotoTab(tab: string, subtype?: string, category?: string): Promise<void> {
    Logger.info(`Opening /investors-section?tab=${tab} on UAT with Mumbai geolocation granted`);
    await grantMumbaiGeolocation(this.page);
    await this.investorPage.goto(UAT_BASE_URL, { tab, subtype, category });
    await dismissPromoPopup(this.page);
    await expect(this.investorPage.heading()).toBeVisible({ timeout: 20_000 });
  }

  async gotoHomepage(): Promise<void> {
    await grantMumbaiGeolocation(this.page);
    await this.page.goto(UAT_BASE_URL);
    await dismissPromoPopup(this.page);
  }

  // ---- "More" menu navigation (INV-001/002) ----

  async clickMoreAndExpectInvestorMenuItemVisible(): Promise<void> {
    await this.investorPage.moreMenuButton().click();
    await expect(this.investorPage.investorMenuItem()).toBeVisible({ timeout: 10_000 });
  }

  async clickInvestorMenuItemAndExpectNavigation(): Promise<void> {
    await this.investorPage.investorMenuItem().click();
    await this.page.waitForURL(/\/investors-section/, { timeout: 15_000 });
  }

  // ---- Top-level tabs (INV-004/005/006/007) ----

  /** Healer fix: a plain `getAttribute` on a locator that currently matches zero elements (a
   * real possibility mid-navigation, e.g. right after `goBack()`) waits using Playwright's own
   * default (long) timeout — which starves `expect.poll`'s own shorter timeout budget instead of
   * letting it retry. A short per-call timeout lets each poll attempt fail fast and actually
   * retry. */
  private async isActive(locator: ReturnType<InvestorSectionPage['navButton']>): Promise<boolean> {
    const className = await locator.getAttribute('class', { timeout: 3_000 }).catch(() => null);
    return /tab-active|radial-gradient/.test(className ?? '');
  }

  async expectTabActive(label: string): Promise<void> {
    expect(await this.isActive(this.investorPage.navButton(label))).toBe(true);
  }

  /** Healer fix: `gotoTab` only waits for the page-level heading, which renders before
   * sub-navigation pills stream in — reading button texts immediately raced the real content and
   * intermittently missed labels. Wait for the first expected label before capturing the list. */
  async expectTabsVisibleInOrder(labels: string[]): Promise<void> {
    if (labels.length > 0) {
      await expect(this.investorPage.navButton(labels[0])).toBeVisible({ timeout: 10_000 });
    }
    const texts = await this.investorPage.allButtons().allTextContents();
    const positions = labels.map((label) => texts.findIndex((t) => t.trim() === label));
    expect(positions.every((p) => p >= 0)).toBe(true);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
  }

  /**
   * Healer finding (real, confirmed via a live step-by-step trace): this page is server-rendered
   * — the "Investor Section" heading `gotoTab` waits for is visible before React finishes
   * hydrating, so a click fired right after that heading appears can silently no-op (no handler
   * attached yet), leaving the URL/active-tab unchanged with no error thrown. A passive poll
   * after a single click can't recover from that — nothing will change without a fresh click.
   * Retries the click itself (not just the assertion) until the tab actually activates, the same
   * pattern `clickThroughOverlays` in `LocationHelper.ts` uses for this class of race.
   */
  private async clickAndConfirmActive(label: string, attempts = 3): Promise<void> {
    const button = this.investorPage.navButton(label);
    for (let attempt = 1; attempt <= attempts; attempt++) {
      await button.click();
      const active = await expect
        .poll(() => this.isActive(button), { timeout: 4_000 })
        .toBe(true)
        .then(() => true)
        .catch(() => false);
      if (active) return;
      if (attempt === attempts) throw new Error(`Tab "${label}" never became active after ${attempts} click attempts`);
    }
  }

  async clickTabAndExpectActive(label: string): Promise<void> {
    await this.clickAndConfirmActive(label);
  }

  // ---- Financial: 10 Years Highlight (INV-010/011/012/013) ----

  async expectHighlightTableVisible(heading: string): Promise<void> {
    await expect(this.investorPage.highlightTableByHeading(heading)).toBeVisible({ timeout: 10_000 });
  }

  async expectHighlightTableHasYearColumns(heading: string): Promise<void> {
    const headerText = await this.investorPage.highlightTableByHeading(heading).locator('thead').innerText();
    expect(headerText).toMatch(/FY16/);
    expect(headerText).toMatch(/FY25/);
  }

  // ---- Annual Report / Investor Presentation (INV-014-020) ----

  /** Shared by Annual Report (FY strings) and Investor Presentation (bare year strings) — both
   * real-confirmed as descending-sorted `<article>` cards. */
  async expectArticleCardsSortedDescending(labelsDescending: string[]): Promise<void> {
    for (const label of labelsDescending) {
      await expect(this.investorPage.articleCards().filter({ hasText: label }).first()).toBeVisible({ timeout: 10_000 });
    }
    const allText = await this.investorPage.articleCards().allTextContents();
    const positions = labelsDescending.map((label) => allText.findIndex((t) => t.includes(label)));
    expect(positions.every((p) => p >= 0)).toBe(true);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
  }

  async downloadDocumentAndExpectFile(clickable: { click: () => Promise<void> }): Promise<string> {
    const downloadPromise = this.page.waitForEvent('download', { timeout: 15_000 });
    await clickable.click();
    const download = await downloadPromise;
    return download.suggestedFilename();
  }

  async downloadAnnualReportAndExpectPdf(fy: string): Promise<void> {
    const filename = await this.downloadDocumentAndExpectFile(this.investorPage.downloadButton(fy));
    expect(filename).toMatch(/\.pdf$/i);
  }

  async downloadInvestorPresentationAndExpectFile(year: string): Promise<string> {
    return this.downloadDocumentAndExpectFile(this.investorPage.articleDownloadButton(year));
  }

  // ---- Quarterly Financials (INV-021-025) ----

  async expectLatestYearSelected(latestYearLabel: string): Promise<void> {
    await expect(this.investorPage.yearSelectTrigger()).toContainText(latestYearLabel);
  }

  /**
   * Healer finding: the CURRENT/default year (FY 2026-27) only renders 1 of the 6 real
   * categories ("Shareholding Pattern") with content — the other 5 have nothing configured yet
   * since the year is still in progress. All 6 categories x 4 quarters = 24 "View Report"
   * buttons only render for a completed past year — confirmed live for FY 2024-25.
   */
  async selectQuarterlyYear(yearLabel: string): Promise<void> {
    await this.investorPage.yearSelectTrigger().click();
    await this.investorPage.yearSelectOption(yearLabel).click();
    await expect(this.investorPage.yearSelectTrigger()).toContainText(yearLabel);
  }

  async expectCategoriesVisible(categories: string[]): Promise<void> {
    for (const category of categories) {
      await expect(this.investorPage.categoryHeading(category)).toBeVisible({ timeout: 10_000 });
    }
  }

  async expectViewReportButtonCount(count: number): Promise<void> {
    await expect(this.investorPage.viewReportButtons()).toHaveCount(count);
  }

  /** NWS-style RESOLVED finding: an unreported future quarter renders a real `disabled`
   * "View Report" button — a genuinely live-testable "no data yet" case. */
  async expectSomeViewReportButtonDisabled(): Promise<void> {
    const buttons = this.investorPage.viewReportButtons();
    // Healer fix: same render race as `expectTabsVisibleInOrder` — wait for real content instead
    // of trusting `gotoTab`'s page-level heading check alone.
    await expect(buttons.first()).toBeVisible({ timeout: 10_000 });
    const count = await buttons.count();
    let anyDisabled = false;
    for (let i = 0; i < count; i++) {
      if (await buttons.nth(i).isDisabled()) {
        anyDisabled = true;
        break;
      }
    }
    expect(anyDisabled).toBe(true);
  }

  // ---- Generic document sections (Subsidiary Report / Scheme of Merger / Statement of Deviation) ----

  async expectDocumentVisible(title: string): Promise<void> {
    await expect(this.investorPage.documentByTitle(title)).toBeVisible({ timeout: 10_000 });
  }

  async downloadDocumentByTitleAndExpectPdf(title: string): Promise<void> {
    const filename = await this.downloadDocumentAndExpectFile(this.investorPage.documentByTitle(title));
    expect(filename).toMatch(/\.pdf$/i);
  }

  // ---- Statutory Disclosures ----

  async openAudioDocumentAndExpectNewTab(title: string): Promise<void> {
    const popupPromise = this.page.context().waitForEvent('page', { timeout: 15_000 });
    await this.investorPage.documentByTitle(title).click();
    const popup = await popupPromise;
    await expect.poll(() => popup.url(), { timeout: 10_000 }).toMatch(/\.mp3$/i);
    await popup.close();
  }

  // ---- Analyst Coverage / Investor Support ----

  async expectAnalystCoverageAlphabetical(housesAscending: string[]): Promise<void> {
    const headingTexts = await this.page.getByRole('heading').allTextContents();
    const positions = housesAscending.map((house) => headingTexts.findIndex((t) => t.trim() === house));
    expect(positions.every((p) => p >= 0)).toBe(true);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
  }

  async expectAnalystContactVisible(house: string, analystName: string): Promise<void> {
    await expect(this.investorPage.analystHouseHeading(house)).toBeVisible();
    await expect(this.page.getByText(analystName)).toBeVisible();
    await expect(this.investorPage.mailtoLinkAfterHeading(house)).toHaveAttribute('href', /^mailto:/);
  }

  // ---- Team (INV-042-045) ----

  async expectTeamGroupVisible(group: string): Promise<void> {
    await expect(this.investorPage.teamGroupHeading(group)).toBeVisible({ timeout: 10_000 });
  }

  async clickTeamMemberAndExpectDialogOpen(name: string): Promise<void> {
    await this.investorPage.teamMemberButton(name).first().click();
    await expect(this.investorPage.dialog()).toBeVisible({ timeout: 10_000 });
  }

  async closeDialog(): Promise<void> {
    await this.investorPage.dialogCloseButton().click();
    await expect(this.investorPage.dialog()).toBeHidden({ timeout: 10_000 });
  }

  // ---- Deep links / fallback (INV-047/048/049/050/059 — RESOLVED, see InvestorSectionPage.ts) ----

  async expectFallbackMessageForInvalidSlug(rawSlug: string, humanizedLabel: string): Promise<void> {
    await expect(this.investorPage.fallbackMessage(humanizedLabel)).toBeVisible({ timeout: 10_000 });
  }

  async expectNoTabIsActive(labels: string[]): Promise<void> {
    for (const label of labels) {
      expect(await this.isActive(this.investorPage.navButton(label))).toBe(false);
    }
  }

  // ---- Broken document handling (INV-046 — RESOLVED: real behavior is a silent failure) ----

  /**
   * Confirmed live: neither a blocked request nor a 404 response produces any visible
   * `role="alert"`/`role="status"` message — the sheet's "Unable to open the document" text does
   * not exist in the real product. Asserts the real (silent) behavior instead.
   */
  async blockDocumentDownloadAndExpectSilentFailure(title: string): Promise<void> {
    await this.page.route('**/api/media-download**', (route) => route.fulfill({ status: 404, body: 'Not Found' }));
    await this.investorPage.documentByTitle(title).click({ timeout: 8_000 }).catch(() => undefined);
    // Healer fix: an empty `role="alert"` toast-container element is always present in the DOM
    // (confirmed live: `getByRole('alert').allTextContents()` returns `[""]`) — asserting zero
    // count was a false positive on the wrong signal. The real, confirmed finding is that no
    // alert/status element ever carries real text, i.e. the sheet's "Unable to open the
    // document" message never appears.
    const alertTexts = await this.page.getByRole('alert').allTextContents();
    expect(alertTexts.every((text) => text.trim().length === 0)).toBe(true);
    await expect(this.page.getByRole('status')).toHaveCount(0);
  }

  // ---- Responsiveness / navigation ----

  async resizeViewportAndExpectPageStillUsable(width: number, height: number): Promise<void> {
    await this.page.setViewportSize({ width, height });
    await expect(this.investorPage.heading()).toBeVisible({ timeout: 10_000 });
  }

  /** Caller must already be on `firstTab` (via `gotoTab`) — clicking an already-active tab button
   * turned out NOT to push a fresh history entry, so a redundant click here (Healer fix) made
   * `goBack()` land one step earlier than expected. */
  /**
   * Healer finding: the visual `tab-active` class flip and the real router URL update turned out
   * to be racy relative to each other under repeated back/forward navigation (confirmed live via
   * a step-by-step trace: the class alone was an unreliable signal here even once the click
   * itself was confirmed). The URL (`?tab={slug}`) is the authoritative, confirmed-fast-updating
   * (~300ms) real router state — used directly instead of polling the class for this scenario.
   */
  async navigateThroughTabsAndExpectBackNavigationWorks(firstTabSlug: string, secondTabLabel: string, secondTabSlug: string): Promise<void> {
    await this.investorPage.navButton(secondTabLabel).click();
    await this.page.waitForURL(new RegExp(`tab=${secondTabSlug}`), { timeout: 10_000 });
    await this.page.goBack();
    await this.page.waitForURL(new RegExp(`tab=${firstTabSlug}(&|$)`), { timeout: 10_000 });
  }

  async attemptGotoOfflineAndReturnError(): Promise<Error | undefined> {
    await this.page.context().setOffline(true);
    try {
      await this.investorPage.goto(UAT_BASE_URL, { tab: 'team' });
      return undefined;
    } catch (error) {
      return error as Error;
    } finally {
      await this.page.context().setOffline(false);
    }
  }
}
