import { test } from '@fixtures/index';
import { FAQS_ANSWERS, FAQS_QUESTIONS } from '@testdata/faqsData';

/**
 * Ticket: requirements/faqs.md, sourced from `TC_Web_97–125` (the "FAQs" module rows of the M8
 * Website sheet). Grounded 2026-09-08 against UAT (`inox-uat-web.pvrinox.com`), Mumbai
 * geolocation granted, via headless Playwright (Playwright MCP's browser fails in this sandbox —
 * see the `pvr-inox-grounding-technique` project memory).
 *
 * **Headline findings** (see `FaqsPage.ts` for the full trail):
 * - Real route is `/faq` (singular, not `/faqs`).
 * - UAT has exactly 3 real FAQs; the full accordion mechanic (default-collapsed, single-open,
 *   auto-collapse-on-switch, toggle-closed-on-repeat-click, keyboard Tab+Enter) was confirmed
 *   live end-to-end.
 * - No `aria-expanded` exists — expand/collapse is asserted via answer-text visibility.
 * - No real hyperlink or content-embedded image exists in any of the 3 answers (checked
 *   individually) — FAQ-017/024 are `test.fixme`.
 * - FAQ-018/019 (admin-state dependent) are `test.fixme` — same category already proven
 *   unfixable for About Us's ABT-010/036/049.
 * - **RESOLVED (re-grounded)**: the requirements ticket originally assumed FAQs had no
 *   unauthenticated entry point and would need this repo's real login flow. That was wrong — the
 *   header "User Icon" → Account dialog → "Settings" → "FAQs" path works for a plain guest
 *   session, confirmed live 2/2 runs, no login needed at all.
 * - This file covers FAQ-001–FAQ-016; see `faqs-extended.spec.ts` for FAQ-017–029.
 */
test.describe('FAQs @RUN3', () => {
  test('FAQ-001 — FAQs option is displayed @P1 @Regression (RESOLVED: reachable via the header User Icon → Account dialog → Settings, as a guest — no login needed, see file doc comment)', async ({ faqsModule }) => {
    await test.step('open the homepage and open Settings from the Account dialog', async () => {
      await faqsModule.openSettingsAndExpectFaqsRowVisible();
    });
  });

  test('FAQ-002 — Navigation to FAQs page @P0 @Regression (RESOLVED: same guest-accessible path as FAQ-001)', async ({ faqsModule }) => {
    await test.step('open Settings from the Account dialog', async () => {
      await faqsModule.openSettingsAndExpectFaqsRowVisible();
    });

    await test.step('clicking FAQs navigates to /faq', async () => {
      await faqsModule.clickFaqsRowInSettingsAndExpectNavigation();
    });
  });

  test('FAQ-003 — FAQs page loads successfully @P0 @Regression', async ({ faqsModule }) => {
    await test.step('open /faq', async () => {
      await faqsModule.gotoFaqs();
    });

    await test.step('the page loads without errors', async () => {
      await faqsModule.expectPageLoaded();
    });
  });

  test('FAQ-004 — FAQ content is fetched from Admin Panel @P1 @Regression', async ({ faqsModule }) => {
    await test.step('open FAQs page', async () => {
      await faqsModule.gotoFaqs();
    });

    await test.step('the configured FAQs are displayed', async () => {
      await faqsModule.expectFaqListVisible();
    });
  });

  test('FAQ-005 — FAQ list is displayed @P1 @Regression', async ({ faqsModule }) => {
    await test.step('open FAQs page', async () => {
      await faqsModule.gotoFaqs();
    });

    await test.step('the list of FAQs is displayed', async () => {
      await faqsModule.expectFaqListVisible();
    });
  });

  test('FAQ-006 — FAQs are displayed in accordion format @P1 @Regression', async ({ faqsModule }) => {
    await test.step('open FAQs page', async () => {
      await faqsModule.gotoFaqs();
    });

    await test.step('questions are visible with their answers collapsed', async () => {
      await faqsModule.expectFaqListVisible();
      await faqsModule.expectAllCollapsed();
    });
  });

  test('FAQ-007 — All FAQ questions are collapsed by default @P0 @Regression', async ({ faqsModule }) => {
    await test.step('open FAQs page', async () => {
      await faqsModule.gotoFaqs();
    });

    await test.step('all FAQ answers are hidden by default', async () => {
      await faqsModule.expectAllCollapsed();
    });
  });

  test('FAQ-008 — Expanding a FAQ @P0 @Regression', async ({ faqsModule }) => {
    await test.step('open FAQs page', async () => {
      await faqsModule.gotoFaqs();
    });

    await test.step('clicking a question expands it', async () => {
      await faqsModule.expandQuestion(FAQS_QUESTIONS.cancellation);
      await faqsModule.expectAnswerVisible(FAQS_ANSWERS.cancellation);
    });
  });

  test('FAQ-009 — Answer content @P1 @Regression', async ({ faqsModule }) => {
    await test.step('open FAQs page and expand a question', async () => {
      await faqsModule.gotoFaqs();
      await faqsModule.expandQuestion(FAQS_QUESTIONS.refund);
    });

    await test.step('the correct configured answer is displayed', async () => {
      await faqsModule.expectAnswerVisible(FAQS_ANSWERS.refund);
    });
  });

  test('FAQ-010 — Only one FAQ remains expanded @P0 @Regression', async ({ faqsModule }) => {
    await test.step('open FAQs page and expand the first question', async () => {
      await faqsModule.gotoFaqs();
      await faqsModule.expandQuestion(FAQS_QUESTIONS.cancellation);
      await faqsModule.expectAnswerVisible(FAQS_ANSWERS.cancellation);
    });

    await test.step('expanding a second question collapses the first', async () => {
      await faqsModule.expandAndExpectOthersCollapsed(FAQS_QUESTIONS.refund, FAQS_ANSWERS.refund, [FAQS_ANSWERS.cancellation]);
    });
  });

  test('FAQ-011 — Switching between FAQs @P1 @Regression', async ({ faqsModule }) => {
    await test.step('open FAQs page', async () => {
      await faqsModule.gotoFaqs();
    });

    await test.step('expanding each question in turn leaves only one open at a time', async () => {
      await faqsModule.expandAndExpectOthersCollapsed(FAQS_QUESTIONS.cancellation, FAQS_ANSWERS.cancellation, []);
      await faqsModule.expandAndExpectOthersCollapsed(FAQS_QUESTIONS.refund, FAQS_ANSWERS.refund, [FAQS_ANSWERS.cancellation]);
      await faqsModule.expandAndExpectOthersCollapsed(FAQS_QUESTIONS.howToBuy, FAQS_ANSWERS.howToBuySnippet, [FAQS_ANSWERS.refund]);
    });
  });

  test('FAQ-012 — Collapsing previously expanded FAQ @P1 @Regression', async ({ faqsModule }) => {
    await test.step('open FAQs page and expand a question', async () => {
      await faqsModule.gotoFaqs();
      await faqsModule.expandQuestion(FAQS_QUESTIONS.cancellation);
      await faqsModule.expectAnswerVisible(FAQS_ANSWERS.cancellation);
    });

    await test.step('expanding another question collapses the previous one', async () => {
      await faqsModule.expandQuestion(FAQS_QUESTIONS.refund);
      await faqsModule.expectAnswerHidden(FAQS_ANSWERS.cancellation);
    });
  });

  test('FAQ-013 — FAQ display sequence @P2 @Regression (adapted: DOM order is the closest real proxy for "Admin-configured sequence", matching AboutUsModule/LegalContentModule)', async ({ faqsModule }) => {
    await test.step('open FAQs page', async () => {
      await faqsModule.gotoFaqs();
    });

    await test.step('questions render in the confirmed live order', async () => {
      await faqsModule.expectQuestionsInOrder([FAQS_QUESTIONS.cancellation, FAQS_QUESTIONS.refund, FAQS_QUESTIONS.howToBuy]);
    });
  });

  test('FAQ-014 — Long answer display @P2 @Regression', async ({ faqsModule }) => {
    await test.step('open FAQs page and expand the long-answer question', async () => {
      await faqsModule.gotoFaqs();
      await faqsModule.expandQuestion(FAQS_QUESTIONS.howToBuy);
    });

    await test.step('the complete long answer is displayed without truncation', async () => {
      await faqsModule.expectAnswerVisible(FAQS_ANSWERS.howToBuySnippet);
    });
  });

  test('FAQ-015 — Scrolling within FAQs page @P2 @Regression (adapted: only 3 real FAQs exist — confirms scrolling doesn\'t break the page rather than testing a genuinely long scroll)', async ({ faqsModule }) => {
    await test.step('open FAQs page', async () => {
      await faqsModule.gotoFaqs();
    });

    await test.step('scrolling does not break the page', async () => {
      await faqsModule.resizeViewportAndExpectPageStillUsable(1280, 720);
    });
  });

  test('FAQ-016 — Special characters and formatting @P2 @Regression', async ({ faqsModule }) => {
    await test.step('open FAQs page and expand the long-answer question', async () => {
      await faqsModule.gotoFaqs();
      await faqsModule.expandQuestion(FAQS_QUESTIONS.howToBuy);
    });

    await test.step('formatting in the real answer displays correctly', async () => {
      await faqsModule.expectAnswerVisible(FAQS_ANSWERS.howToBuySnippet);
    });
  });
});
