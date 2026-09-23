import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { FaqsPage } from '@pages/FaqsPage';
import { RegisterLoginPage } from '@pages/RegisterLoginPage';
import { dismissPromoPopup, grantMumbaiGeolocation, UAT_BASE_URL } from '@utils/LocationHelper';
import { Logger } from '@utils/Logger';
import { FAQS_ANSWERS, FAQS_QUESTIONS } from '@testdata/faqsData';

export class FaqsModule {
  private readonly faqsPage: FaqsPage;
  private readonly registerLoginPage: RegisterLoginPage;

  constructor(private page: Page) {
    this.faqsPage = new FaqsPage(page);
    this.registerLoginPage = new RegisterLoginPage(page);
  }

  /** Direct-URL navigation to `/faq`, matching this repo's established pattern. The Settings-panel
   * menu path is exercised separately by `gotoFaqsViaSettingsPanel`/`expectFaqsRowVisibleInSettings`
   * for FAQ-001/002. */
  async gotoFaqs(): Promise<void> {
    Logger.info('Opening /faq on UAT with Mumbai geolocation granted');
    await grantMumbaiGeolocation(this.page);
    await this.faqsPage.goto(UAT_BASE_URL);
    await dismissPromoPopup(this.page);
    await expect(this.faqsPage.pageHeading()).toBeVisible({ timeout: 20_000 });
  }

  async expectPageLoaded(): Promise<void> {
    await expect(this.faqsPage.pageHeading()).toBeVisible({ timeout: 20_000 });
  }

  /**
   * FAQ-001: confirmed live, guest session, no login needed — the header "User Icon" opens a
   * real Account dialog; clicking "Settings" transitions it in-place to reveal the FAQs row.
   * See `FaqsPage.ts` doc comment / `settings-panel-content-nav` project memory.
   */
  async openSettingsAndExpectFaqsRowVisible(): Promise<void> {
    await grantMumbaiGeolocation(this.page);
    await this.page.goto(UAT_BASE_URL);
    await dismissPromoPopup(this.page);
    await this.registerLoginPage.userIconButton().click({ timeout: 10_000 });
    await this.faqsPage.settingsButtonInAccountDialog().click({ timeout: 10_000 });
    await expect(this.faqsPage.faqsRowInSettingsDialog()).toBeVisible({ timeout: 10_000 });
  }

  /** FAQ-002: clicking the FAQs row closes the dialog and navigates to `/faq`. */
  async clickFaqsRowInSettingsAndExpectNavigation(): Promise<void> {
    await this.faqsPage.faqsRowInSettingsDialog().click();
    await this.page.waitForURL(/\/faq$/, { timeout: 15_000 });
  }

  async expectFaqListVisible(): Promise<void> {
    await expect(this.faqsPage.questionButton(FAQS_QUESTIONS.cancellation)).toBeVisible();
    await expect(this.faqsPage.questionButton(FAQS_QUESTIONS.refund)).toBeVisible();
    await expect(this.faqsPage.questionButton(FAQS_QUESTIONS.howToBuy)).toBeVisible();
  }

  /** ABT/LGL-style adapted check: no `aria-expanded` exists, so "collapsed" is asserted via the
   * absence of every real answer's text (see FaqsPage.ts doc comment). */
  async expectAllCollapsed(): Promise<void> {
    await expect(this.page.getByText(FAQS_ANSWERS.cancellation)).toHaveCount(0);
    await expect(this.page.getByText(FAQS_ANSWERS.refund)).toHaveCount(0);
    await expect(this.page.getByText(FAQS_ANSWERS.howToBuySnippet)).toHaveCount(0);
  }

  async expandQuestion(question: string): Promise<void> {
    await this.faqsPage.questionButton(question).click();
  }

  async expectAnswerVisible(answerSnippet: string): Promise<void> {
    await expect(this.page.getByText(answerSnippet).first()).toBeVisible({ timeout: 5_000 });
  }

  async expectAnswerHidden(answerSnippet: string): Promise<void> {
    await expect(this.page.getByText(answerSnippet)).toHaveCount(0);
  }

  /** FAQ-010/011/012: confirmed live — expanding a different question auto-collapses the
   * previous one; this asserts both halves of that in one call. */
  async expandAndExpectOthersCollapsed(question: string, answerSnippet: string, otherAnswerSnippets: string[]): Promise<void> {
    await this.expandQuestion(question);
    await this.expectAnswerVisible(answerSnippet);
    for (const other of otherAnswerSnippets) {
      await this.expectAnswerHidden(other);
    }
  }

  /** FAQ-013/019 style: DOM order is the closest real proxy for Admin-configured sequence,
   * matching AboutUsModule/LegalContentModule/CuratedShowsModule elsewhere in this suite. */
  async expectQuestionsInOrder(questionsInOrder: string[]): Promise<void> {
    const allButtons = await this.page.getByRole('button').allTextContents();
    const actualOrder = allButtons.filter((text) => questionsInOrder.includes(text));
    expect(actualOrder).toEqual(questionsInOrder);
  }

  /** FAQ-026: confirmed live — focusing a question button and pressing Enter expands it, the
   * same result as a real click. */
  async focusQuestionAndPressEnter(question: string): Promise<void> {
    await this.faqsPage.questionButton(question).focus();
    await this.page.keyboard.press('Enter');
  }

  /** FAQ-027: confirmed live — clicking an already-open question toggles it closed, with no
   * crash, across repeated taps. */
  async repeatedlyTapQuestion(question: string, times: number): Promise<void> {
    for (let i = 0; i < times; i++) {
      await this.faqsPage.questionButton(question).click();
    }
  }

  async resizeViewportAndExpectPageStillUsable(width: number, height: number): Promise<void> {
    await this.page.setViewportSize({ width, height });
    await expect(this.faqsPage.pageHeading()).toBeVisible({ timeout: 10_000 });
  }

  async goBackAndExpectUrl(urlPart: RegExp): Promise<void> {
    await this.page.goBack();
    await this.page.waitForURL(urlPart, { timeout: 15_000 });
  }

  async reloadAndExpectDefaultCollapsedState(): Promise<void> {
    await this.page.reload();
    await expect(this.faqsPage.pageHeading()).toBeVisible({ timeout: 15_000 });
    await this.expectAllCollapsed();
  }

  /** Adapted like AboutUsModule.ts's ABT-050 / LegalContentModule.ts's LGL-041 — no distinct
   * content API exists (server-rendered), so a full `context.setOffline(true)` fails
   * `page.goto()` outright with a real `net::ERR_INTERNET_DISCONNECTED`. */
  async attemptGotoOfflineAndReturnError(): Promise<Error | undefined> {
    await this.page.context().setOffline(true);
    try {
      await this.faqsPage.goto(UAT_BASE_URL);
      return undefined;
    } catch (error) {
      return error as Error;
    } finally {
      await this.page.context().setOffline(false);
    }
  }

  async expectFaqsLoadWithinTimeout(maxMs: number): Promise<void> {
    const start = Date.now();
    await this.gotoFaqs();
    const elapsed = Date.now() - start;
    expect(elapsed, `FAQs load took ${elapsed}ms, expected under ${maxMs}ms`).toBeLessThan(maxMs);
  }
}
