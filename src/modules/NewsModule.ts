import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { NewsPage } from '@pages/NewsPage';
import { dismissPromoPopup, grantMumbaiGeolocation, UAT_BASE_URL } from '@utils/LocationHelper';
import { Logger } from '@utils/Logger';
import { NEWS_TOTAL_CARD_COUNT } from '@testdata/newsData';

export class NewsModule {
  private readonly newsPage: NewsPage;

  constructor(private page: Page) {
    this.newsPage = new NewsPage(page);
  }

  /** Direct-URL navigation to `/news`, matching this repo's established pattern. The "More" menu
   * path is exercised separately by `clickMoreAndExpectNewsMenuItemVisible`/
   * `clickNewsMenuItemAndExpectNavigation` for NWS-001/002. */
  async gotoNews(): Promise<void> {
    Logger.info('Opening /news on UAT with Mumbai geolocation granted');
    await grantMumbaiGeolocation(this.page);
    await this.newsPage.goto(UAT_BASE_URL);
    await dismissPromoPopup(this.page);
    await expect(this.newsPage.newsCards().first()).toBeVisible({ timeout: 20_000 });
  }

  async expectPageLoaded(): Promise<void> {
    await expect(this.newsPage.newsCards().first()).toBeVisible({ timeout: 20_000 });
  }

  // ---- "More" menu navigation (NWS-001/002) ----

  async gotoHomepage(): Promise<void> {
    await grantMumbaiGeolocation(this.page);
    await this.page.goto(UAT_BASE_URL);
    await dismissPromoPopup(this.page);
  }

  async clickMoreAndExpectNewsMenuItemVisible(): Promise<void> {
    await this.newsPage.moreMenuButton().click();
    await expect(this.newsPage.newsMenuItem()).toBeVisible({ timeout: 10_000 });
  }

  async clickNewsMenuItemAndExpectNavigation(): Promise<void> {
    await this.newsPage.newsMenuItem().click();
    await this.page.waitForURL(/\/news$/, { timeout: 15_000 });
  }

  // ---- Filters ----

  async expectYearFilterVisible(): Promise<void> {
    await expect(this.newsPage.yearFilterButton()).toBeVisible();
  }

  async expectMonthFilterVisible(): Promise<void> {
    await expect(this.newsPage.monthFilterButton()).toBeVisible();
  }

  async expectMonthFilterDisabled(): Promise<void> {
    await expect(this.newsPage.monthFilterButton()).toBeDisabled();
  }

  async selectYear(yearOptionLabel: string): Promise<void> {
    await this.newsPage.yearFilterButton().click();
    await this.newsPage.filterOption(yearOptionLabel).click();
  }

  async expectYearOptionVisible(yearOptionLabel: string): Promise<void> {
    await this.newsPage.yearFilterButton().click();
    await expect(this.newsPage.filterOption(yearOptionLabel)).toBeVisible();
    await this.page.keyboard.press('Escape').catch(() => undefined);
  }

  async selectMonth(monthOptionLabel: string): Promise<void> {
    await this.newsPage.monthFilterButton().click();
    await this.newsPage.filterOption(monthOptionLabel).click();
  }

  async expectMonthOptionVisible(monthOptionLabel: string): Promise<void> {
    await this.newsPage.monthFilterButton().click();
    await expect(this.newsPage.filterOption(monthOptionLabel)).toBeVisible();
    await this.page.keyboard.press('Escape').catch(() => undefined);
  }

  async expectVisibleCardCount(count: number): Promise<void> {
    await expect(this.newsPage.newsCards()).toHaveCount(count);
  }

  async resetFilters(): Promise<void> {
    await this.selectYear('All');
  }

  // ---- Category tabs (real, but confirmed non-functional as a filter — see NewsPage.ts) ----

  async expectDefaultCategoryIsAll(): Promise<void> {
    const className = await this.newsPage.allCategoryTab().getAttribute('class');
    expect(className ?? '').toContain('tab-active');
  }

  async expectCategoryTabsVisible(): Promise<void> {
    await expect(this.newsPage.allCategoryTab()).toBeVisible();
    await expect(this.newsPage.newInitiativesCategoryTab()).toBeVisible();
  }

  /**
   * NWS-019/020: CORRECTED 2026-09-17 — the earlier "list stays unchanged" finding was wrong.
   * That assertion only ever compared card *count* before/after, which happened to pass as
   * "broken" in the run that produced it purely because the counts coincided that time — it
   * never actually verified the list's content. A live re-check (the user's own manual codegen
   * recording, corroborated by a follow-up live diagnostic here) confirms the category filter
   * genuinely works: switching to "New Initiatives" removes non-matching cards — count AND
   * content both changed in the reproduction (4 cards -> 3, one card's full text dropped out).
   * Asserts the real, content-based behavior instead of a count-only proxy, and is deliberately
   * resilient to the live, actively-edited News content (compares text-content identity between
   * the two tab states rather than hardcoding specific titles, which would be fragile against
   * ongoing CMS edits — see the `shared-environment-read-only` project memory).
   */
  async clickNewInitiativesAndExpectListFiltered(): Promise<void> {
    const beforeTexts = await this.newsPage.newsCards().allTextContents();
    await this.newsPage.newInitiativesCategoryTab().click();
    const activeClass = await this.newsPage.newInitiativesCategoryTab().getAttribute('class');
    expect(activeClass ?? '').toContain('tab-active');
    await expect
      .poll(() => this.newsPage.newsCards().allTextContents(), { timeout: 10_000 })
      .not.toEqual(beforeTexts);
  }

  // ---- Cards / content ----

  async expectCardVisible(title: string): Promise<void> {
    await expect(this.newsPage.newsCardByTitle(title)).toBeVisible();
  }

  async expectCardContainsText(title: string, snippet: string): Promise<void> {
    await expect(this.newsPage.newsCardByTitle(title)).toContainText(snippet);
  }

  /** NWS-014/033: confirms the real card thumbnail image has actually loaded pixel content. */
  async expectCardThumbnailLoaded(title: string): Promise<void> {
    await expect.poll(async () => NewsModule.naturalWidthOf(this.newsPage.cardThumbnailByTitle(title)), { timeout: 10_000 }).toBeGreaterThan(0);
  }

  /**
   * NWS-013/044: DOM order is the closest real proxy for Admin-configured sequence, matching
   * every prior module in this suite.
   *
   * Healer fix: the original version filtered `titlesInOrder` by "does some card match", which
   * always preserved the caller's own input order and could never actually detect a real
   * ordering mismatch. This version maps each real card (in DOM order) to its matching title —
   * preferring the LONGEST matching title first, since "PVR Inox" is a literal string prefix of
   * "PVR Inoxx" and a shortest-match-first check would misattribute one card to the other.
   */
  async expectCardsInOrder(titlesInOrder: string[]): Promise<void> {
    const byLengthDesc = [...titlesInOrder].sort((a, b) => b.length - a.length);
    const allCardTexts = await this.newsPage.newsCards().allTextContents();
    const actualOrder = allCardTexts
      .map((text) => byLengthDesc.find((title) => text.startsWith(title)))
      .filter((title): title is string => title !== undefined);
    expect(actualOrder).toEqual(titlesInOrder);
  }

  // ---- Detail dialog ----

  async clickCardAndExpectDialogOpen(title: string): Promise<void> {
    await this.newsPage.newsCardByTitle(title).click();
    await expect(this.newsPage.dialog()).toBeVisible({ timeout: 10_000 });
  }

  async expectDialogContainsText(snippet: string): Promise<void> {
    await expect(this.newsPage.dialog()).toContainText(snippet);
  }

  /** No DOM lib configured for this Node project (see HomeScreenPage.ts) — `naturalWidth` is read
   * via a structurally-typed parameter rather than the unavailable `HTMLImageElement` type. */
  private static async naturalWidthOf(locator: Locator): Promise<number> {
    return locator.evaluate((img: { naturalWidth: number }) => img.naturalWidth);
  }

  async expectDialogImageLoaded(): Promise<void> {
    await expect.poll(async () => NewsModule.naturalWidthOf(this.newsPage.dialogImage()), { timeout: 10_000 }).toBeGreaterThan(0);
  }

  /** Closes via the real, functional mechanism (icon-only drawer-close button) — see
   * NewsPage.ts doc comment for why literal browser-back does not work here. */
  async closeDialog(): Promise<void> {
    await this.newsPage.dialogCloseButton().click();
    await expect(this.newsPage.dialog()).toBeHidden({ timeout: 10_000 });
  }

  async expectListStillVisibleAfterClose(): Promise<void> {
    await expect(this.newsPage.newsCards()).toHaveCount(NEWS_TOTAL_CARD_COUNT);
  }

  /**
   * NWS-031: RESOLVED — real finding, not a test bug. The detail dialog pushes no history entry,
   * so `page.goBack()` while it's open navigates away from the site's history entirely rather
   * than returning to the listing (confirmed live: lands on `about:blank` in an isolated
   * context). Documents this real UX defect directly instead of asserting the sheet's false
   * "returns to listing" premise. Must be the last action in its test — nothing meaningful can
   * follow a navigation away from the app.
   */
  async openFirstCardAndGoBackExpectingAwayFromApp(): Promise<void> {
    await this.newsPage.newsCards().first().click();
    await expect(this.newsPage.dialog()).toBeVisible({ timeout: 10_000 });
    await this.page.goBack().catch(() => undefined);
    await expect(this.newsPage.newsCards().first()).toHaveCount(0);
  }

  // ---- Responsiveness / performance ----

  async resizeViewportAndExpectPageStillUsable(width: number, height: number): Promise<void> {
    await this.page.setViewportSize({ width, height });
    await expect(this.newsPage.newsCards().first()).toBeVisible({ timeout: 10_000 });
  }

  async expectNewsLoadsWithinTimeout(maxMs: number): Promise<void> {
    const start = Date.now();
    await this.gotoNews();
    const elapsed = Date.now() - start;
    expect(elapsed, `News load took ${elapsed}ms, expected under ${maxMs}ms`).toBeLessThan(maxMs);
  }

  // ---- Media ----

  async blockFirstCardThumbnailAndExpectBroken(): Promise<void> {
    const thumbnail = this.newsPage.firstCardThumbnail();
    const src = await thumbnail.getAttribute('src');
    if (src) {
      await this.page.route(src, (route) => route.abort('internetdisconnected'));
    }
    await this.page.reload();
    await expect.poll(async () => NewsModule.naturalWidthOf(thumbnail), { timeout: 10_000 }).toBe(0);
  }

  // ---- Network interruption (adapted like every prior module) ----

  async attemptGotoOfflineAndReturnError(): Promise<Error | undefined> {
    await this.page.context().setOffline(true);
    try {
      await this.newsPage.goto(UAT_BASE_URL);
      return undefined;
    } catch (error) {
      return error as Error;
    } finally {
      await this.page.context().setOffline(false);
    }
  }
}
