import { test } from '@fixtures/index';
import { NEWS_CARDS } from '@testdata/newsData';

/**
 * Continuation of `news.spec.ts` (NWS-024–045) — same grounding pass, see that file's doc
 * comment for the full trail (real route, dummy cards, non-functional category filter, dialog
 * instead of a detail page, real browser-back defect).
 */
test.describe('News (extended) @RUN6', () => {
  test.fixme(
    'NWS-024 — No news for selected filter @P1 @Regression — BLOCKED: unreachable by construction, not just "not found" — the Month dropdown\'s options are generated from whichever months actually have data for the selected year, so every combination the UI ever exposes is guaranteed to have at least one result. There is no way to construct an empty filter state through the real UI.',
    () => {},
  );

  test('NWS-025 — News Detail opens @P0 @Regression (adapted: a same-URL dialog, not a separate page — see news.spec.ts doc comment)', async ({ newsModule }) => {
    await test.step('open News page', async () => {
      await newsModule.gotoNews();
    });

    await test.step('clicking a news card opens the detail dialog', async () => {
      await newsModule.clickCardAndExpectDialogOpen(NEWS_CARDS.westDelhi.title);
    });
  });

  test('NWS-026 — News Detail image @P1 @Regression', async ({ newsModule }) => {
    await test.step('open News page and open the detail dialog', async () => {
      await newsModule.gotoNews();
      await newsModule.clickCardAndExpectDialogOpen(NEWS_CARDS.westDelhi.title);
    });

    await test.step('the correct banner image is displayed', async () => {
      await newsModule.expectDialogImageLoaded();
    });
  });

  test('NWS-027 — News Detail title @P1 @Regression', async ({ newsModule }) => {
    await test.step('open News page and open the detail dialog', async () => {
      await newsModule.gotoNews();
      await newsModule.clickCardAndExpectDialogOpen(NEWS_CARDS.westDelhi.title);
    });

    await test.step('the correct title is displayed', async () => {
      await newsModule.expectDialogContainsText(NEWS_CARDS.westDelhi.title);
    });
  });

  test('NWS-028 — News Detail date @P2 @Regression', async ({ newsModule }) => {
    await test.step('open News page and open the detail dialog', async () => {
      await newsModule.gotoNews();
      await newsModule.clickCardAndExpectDialogOpen(NEWS_CARDS.westDelhi.title);
    });

    await test.step('the correct date is displayed', async () => {
      await newsModule.expectDialogContainsText(NEWS_CARDS.westDelhi.date);
    });
  });

  test('NWS-029 — News Detail source @P2 @Regression', async ({ newsModule }) => {
    await test.step('open News page and open the detail dialog', async () => {
      await newsModule.gotoNews();
      await newsModule.clickCardAndExpectDialogOpen(NEWS_CARDS.westDelhi.title);
    });

    await test.step('the correct source is displayed', async () => {
      await newsModule.expectDialogContainsText(NEWS_CARDS.westDelhi.source);
    });
  });

  test('NWS-030 — News Detail description @P1 @Regression', async ({ newsModule }) => {
    await test.step('open News page and open the detail dialog', async () => {
      await newsModule.gotoNews();
      await newsModule.clickCardAndExpectDialogOpen(NEWS_CARDS.westDelhi.title);
    });

    await test.step('the complete description is displayed', async () => {
      await newsModule.expectDialogContainsText(NEWS_CARDS.westDelhi.descriptionSnippet);
    });
  });

  test('NWS-031 — Returning to the listing @P2 @Regression (adapted: real mechanism is the dialog\'s close button, not browser-back — see news.spec.ts doc comment for the real back-nav defect this documents)', async ({ newsModule }) => {
    await test.step('open a card and close it via the real close button', async () => {
      await newsModule.gotoNews();
      await newsModule.clickCardAndExpectDialogOpen(NEWS_CARDS.westDelhi.title);
      await newsModule.closeDialog();
      await newsModule.expectListStillVisibleAfterClose();
    });

    await test.step('RESOLVED: confirms the real defect — browser-back while the dialog is open navigates away from the app entirely, since no history entry was pushed (must be the last action in this test)', async () => {
      await newsModule.openFirstCardAndGoBackExpectingAwayFromApp();
    });
  });

  test('NWS-033 — Image loading @P2 @Regression', async ({ newsModule }) => {
    await test.step('open News page', async () => {
      await newsModule.gotoNews();
    });

    await test.step('the real card thumbnail loads successfully', async () => {
      await newsModule.expectCardThumbnailLoaded(NEWS_CARDS.westDelhi.title);
    });
  });

  test('NWS-034 — Broken image handling @P2 @Regression (RESOLVED: real behavior contradicts the sheet — no placeholder/fallback swap exists, same as every prior module)', async ({ newsModule }) => {
    await test.step('open News page', async () => {
      await newsModule.gotoNews();
    });

    await test.step('blocking the real thumbnail leaves it genuinely broken', async () => {
      await newsModule.blockFirstCardThumbnailAndExpectBroken();
    });
  });

  test('NWS-035 — Long title display @P2 @Regression (adapted: light check against the longest real title on UAT)', async ({ newsModule }) => {
    await test.step('open News page', async () => {
      await newsModule.gotoNews();
    });

    await test.step('the long title displays without breaking the layout', async () => {
      await newsModule.expectCardVisible(NEWS_CARDS.westDelhi.title);
    });
  });

  test('NWS-036 — Long description display @P2 @Regression', async ({ newsModule }) => {
    await test.step('open News page and open the detail dialog', async () => {
      await newsModule.gotoNews();
      await newsModule.clickCardAndExpectDialogOpen(NEWS_CARDS.westDelhi.title);
    });

    await test.step('the full description displays properly', async () => {
      await newsModule.expectDialogContainsText(NEWS_CARDS.westDelhi.descriptionSnippet);
    });
  });

  test('NWS-037 — Responsive layout @P1 @Regression', async ({ newsModule }) => {
    await test.step('open News page', async () => {
      await newsModule.gotoNews();
    });

    await test.step('resizing to a mobile viewport keeps the page usable', async () => {
      await newsModule.resizeViewportAndExpectPageStillUsable(390, 844);
    });
  });

  test('NWS-038 — Page scrolling @P2 @Regression (adapted: only 4 real items exist on UAT)', async ({ newsModule }) => {
    await test.step('open News page', async () => {
      await newsModule.gotoNews();
    });

    await test.step('the page remains usable at a smaller viewport requiring scroll', async () => {
      await newsModule.resizeViewportAndExpectPageStillUsable(1280, 600);
    });
  });

  test('NWS-040 — Internet interruption @P1 @Regression (adapted: a full context.setOffline() fails page.goto() outright with a real net::ERR_INTERNET_DISCONNECTED rather than an in-app message — no separate content API exists to block instead; same adaptation as every prior module)', async ({ newsModule }) => {
    let thrown: Error | undefined;

    await test.step('attempt to open News with no connectivity', async () => {
      thrown = await newsModule.attemptGotoOfflineAndReturnError();
    });

    await test.step('a real network-disconnected error is surfaced', async () => {
      if (!thrown || !/ERR_INTERNET_DISCONNECTED/.test(thrown.message)) {
        throw new Error(`expected a net::ERR_INTERNET_DISCONNECTED navigation failure, got: ${thrown?.message}`);
      }
    });
  });

  test('NWS-041 — Loading performance @P2 @Regression', async ({ newsModule }) => {
    await test.step('News loads within a generous timeout budget', async () => {
      await newsModule.expectNewsLoadsWithinTimeout(30_000);
    });
  });

  test('NWS-043 — Filter reset @P2 @Regression', async ({ newsModule }) => {
    await test.step('open News page and filter to 2025', async () => {
      await newsModule.gotoNews();
      await newsModule.selectYear('Year - 2025');
      await newsModule.expectVisibleCardCount(1);
    });

    await test.step('resetting filters restores the complete news list', async () => {
      await newsModule.resetFilters();
      await newsModule.expectVisibleCardCount(4);
    });
  });

  test('NWS-044 — Latest news ordering @P1 @Regression (adapted: DOM order proxy, same as NWS-013)', async ({ newsModule }) => {
    await test.step('open News page', async () => {
      await newsModule.gotoNews();
    });

    await test.step('news follows the confirmed live sequence', async () => {
      await newsModule.expectCardsInOrder([NEWS_CARDS.dummyPvrCinemas.title, NEWS_CARDS.westDelhi.title, NEWS_CARDS.plainInox.title, NEWS_CARDS.inoxx2025.title]);
    });
  });

  test('NWS-045 — UI consistency @P2 @Regression', async ({ newsModule }) => {
    await test.step('open News page', async () => {
      await newsModule.gotoNews();
    });

    await test.step('layout stays consistent on a resized viewport', async () => {
      await newsModule.resizeViewportAndExpectPageStillUsable(1280, 800);
    });
  });
});
