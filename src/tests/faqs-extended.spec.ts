import { test } from '@fixtures/index';
import { FAQS_ANSWERS, FAQS_QUESTIONS } from '@testdata/faqsData';

/**
 * Continuation of `faqs.spec.ts` (FAQ-017–029) — same grounding pass, see that file's doc
 * comment for the full trail. Split into a second file to keep both under this repo's
 * spec-file-length guideline, matching the `offers.spec.ts`/`offers-extended.spec.ts` and
 * `legal-content.spec.ts`/`legal-content-extended.spec.ts` precedent.
 */
test.describe('FAQs (extended) @RUN3', () => {
  test.fixme(
    'FAQ-017 — Hyperlinks in FAQ answer @P2 @Regression — BLOCKED: grounded 2026-09-08 — checked all 3 real answers individually; zero real hyperlinks exist in any of them.',
    () => {},
  );

  test('FAQ-020 — Page responsiveness @P1 @Regression', async ({ faqsModule }) => {
    await test.step('open FAQs page', async () => {
      await faqsModule.gotoFaqs();
    });

    await test.step('resizing to a mobile viewport keeps the page usable', async () => {
      await faqsModule.resizeViewportAndExpectPageStillUsable(390, 844);
    });
  });

  test('FAQ-021 — Page refresh behavior @P2 @Regression', async ({ faqsModule }) => {
    await test.step('open FAQs page and expand a question', async () => {
      await faqsModule.gotoFaqs();
      await faqsModule.expandQuestion(FAQS_QUESTIONS.cancellation);
      await faqsModule.expectAnswerVisible(FAQS_ANSWERS.cancellation);
    });

    await test.step('refreshing reloads the page with the default collapsed state', async () => {
      await faqsModule.reloadAndExpectDefaultCollapsedState();
    });
  });

  test('FAQ-022 — Browser back navigation @P2 @Regression', async ({ faqsModule, homeScreenModule }) => {
    await test.step('open the homepage, then navigate to FAQs', async () => {
      await homeScreenModule.gotoHomepage();
      await faqsModule.gotoFaqs();
    });

    await test.step('browser Back returns to the previous page', async () => {
      await faqsModule.goBackAndExpectUrl(/pvrinox\.com\/?$/);
    });
  });

  test('FAQ-023 — Internet interruption @P1 @Regression (adapted: a full context.setOffline() fails page.goto() outright with a real net::ERR_INTERNET_DISCONNECTED rather than an in-app message — no separate content API exists to block instead; same adaptation as AboutUsModule.ts\'s ABT-050 / LegalContentModule.ts\'s LGL-041)', async ({ faqsModule }) => {
    let thrown: Error | undefined;

    await test.step('attempt to open FAQs with no connectivity', async () => {
      thrown = await faqsModule.attemptGotoOfflineAndReturnError();
    });

    await test.step('a real network-disconnected error is surfaced', async () => {
      if (!thrown || !/ERR_INTERNET_DISCONNECTED/.test(thrown.message)) {
        throw new Error(`expected a net::ERR_INTERNET_DISCONNECTED navigation failure, got: ${thrown?.message}`);
      }
    });
  });

  test.fixme(
    'FAQ-024 — FAQ answer with image/media @P2 @Regression — BLOCKED: grounded 2026-09-08 — checked all 3 real answers individually; only generic header/widget chrome images render regardless of which FAQ is open, no answer-specific media exists.',
    () => {},
  );

  test('FAQ-025 — FAQ answer with rich text @P2 @Regression (adapted: none of the 3 real answers contain rich HTML formatting beyond plain text — confirms the real, plain-text answer renders correctly rather than asserting unconfigured rich-text markup)', async ({ faqsModule }) => {
    await test.step('open FAQs page and expand the long-answer question', async () => {
      await faqsModule.gotoFaqs();
      await faqsModule.expandQuestion(FAQS_QUESTIONS.howToBuy);
    });

    await test.step('the real answer text renders correctly', async () => {
      await faqsModule.expectAnswerVisible(FAQS_ANSWERS.howToBuySnippet);
    });
  });

  test('FAQ-026 — Accessibility using keyboard @P2 @Regression', async ({ faqsModule }) => {
    await test.step('open FAQs page', async () => {
      await faqsModule.gotoFaqs();
    });

    await test.step('focusing a question and pressing Enter expands it', async () => {
      await faqsModule.focusQuestionAndPressEnter(FAQS_QUESTIONS.cancellation);
      await faqsModule.expectAnswerVisible(FAQS_ANSWERS.cancellation);
    });
  });

  test('FAQ-027 — Repeated tapping on same FAQ @P2 @Regression', async ({ faqsModule }) => {
    await test.step('open FAQs page', async () => {
      await faqsModule.gotoFaqs();
    });

    await test.step('tapping the same question 4 times toggles it with no crash', async () => {
      await faqsModule.repeatedlyTapQuestion(FAQS_QUESTIONS.cancellation, 4);
      await faqsModule.expectPageLoaded();
    });
  });

  test('FAQ-028 — Large number of FAQs @P2 @Regression (adapted: only 3 real FAQs exist on UAT, not >50 — confirms the real dataset loads without performance issues rather than a volume this environment doesn\'t have)', async ({ faqsModule }) => {
    await test.step('open FAQs page within a generous timeout budget', async () => {
      await faqsModule.expectFaqsLoadWithinTimeout(30_000);
    });

    await test.step('all 3 real FAQs load correctly', async () => {
      await faqsModule.expectFaqListVisible();
    });
  });

  test('FAQ-029 — UI consistency @P2 @Regression', async ({ faqsModule }) => {
    await test.step('open FAQs page', async () => {
      await faqsModule.gotoFaqs();
    });

    await test.step('layout stays consistent on a resized viewport', async () => {
      await faqsModule.resizeViewportAndExpectPageStillUsable(1280, 800);
    });
  });
});
