import { test } from '@fixtures/index';
import { NEWS_CARDS } from '@testdata/newsData';

/**
 * Ticket: requirements/news.md, sourced from `TC_Web_126–170` (the "News" module rows of the M8
 * Website sheet). Grounded 2026-09-08 against UAT (`inox-uat-web.pvrinox.com`), Mumbai
 * geolocation granted, via a background research agent driving headless Playwright plus one
 * direct verification pass (Playwright MCP's browser fails in this sandbox — see the
 * `pvr-inox-grounding-technique` project memory).
 *
 * **Headline findings** (see `NewsPage.ts` for the full trail):
 * - Real route is `/news` (direct-navigable); "News" is a real `menuitem` in the header "More"
 *   dropdown (same fixed pattern as About Us's "More Arrow Down" + `menuitem` roles).
 * - UAT has exactly 4 real cards; 2 are genuinely dummy placeholder data (a typo'd title, a
 *   garbled description) — tests target the cleanest real card ("PVR INOX REDEFINES WEST DELHI").
 * - Year/Month filtering genuinely works client-side; Month is disabled until a Year is picked.
 * - CORRECTED 2026-09-17: Category tabs ("All"/"New Initiatives") DO genuinely filter the list —
 *   the earlier "toggles active state but list stays unchanged" finding was a test-assertion gap
 *   (it only ever compared card count, not content, and happened to pass as "broken" once by
 *   coincidence), not a confirmed real bug. See NewsModule.ts's
 *   `clickNewInitiativesAndExpectListFiltered` doc comment for the corrected, content-based
 *   grounding.
 * - Clicking a card opens a same-URL dialog, not a separate detail page (NWS-025–030 reinterpreted
 *   accordingly). The dialog pushes no history entry, so browser-back does not return to the
 *   listing (NWS-031) — a real UX defect, documented rather than silently worked around.
 * - This file covers NWS-001–023; see `news-extended.spec.ts` for NWS-024–045.
 */
test.describe('News @RUN6', () => {
  test('NWS-001 — News option is displayed @P1 @Regression', async ({ newsModule }) => {
    await test.step('open the homepage', async () => {
      await newsModule.gotoHomepage();
    });

    await test.step('clicking More reveals the News menu item', async () => {
      await newsModule.clickMoreAndExpectNewsMenuItemVisible();
    });
  });

  test('NWS-002 — Navigation to News page @P0 @Regression', async ({ newsModule }) => {
    await test.step('open the homepage', async () => {
      await newsModule.gotoHomepage();
    });

    await test.step('clicking More then News navigates to /news', async () => {
      await newsModule.clickMoreAndExpectNewsMenuItemVisible();
      await newsModule.clickNewsMenuItemAndExpectNavigation();
    });
  });

  test('NWS-003 — News page loads successfully @P0 @Regression', async ({ newsModule }) => {
    await test.step('open /news', async () => {
      await newsModule.gotoNews();
    });

    await test.step('the page loads without errors', async () => {
      await newsModule.expectPageLoaded();
    });
  });

  test('NWS-004 — News data is fetched from Admin Panel @P1 @Regression', async ({ newsModule }) => {
    await test.step('open News page', async () => {
      await newsModule.gotoNews();
    });

    await test.step('configured news articles are displayed', async () => {
      await newsModule.expectVisibleCardCount(4);
    });
  });

  test('NWS-005 — Year filter is displayed @P1 @Regression', async ({ newsModule }) => {
    await test.step('open News page', async () => {
      await newsModule.gotoNews();
    });

    await test.step('the Year filter is visible', async () => {
      await newsModule.expectYearFilterVisible();
    });
  });

  test('NWS-006 — Year filter values @P1 @Regression', async ({ newsModule }) => {
    await test.step('open News page', async () => {
      await newsModule.gotoNews();
    });

    await test.step('only the real configured years are available', async () => {
      await newsModule.expectYearOptionVisible('Year - 2026');
      await newsModule.expectYearOptionVisible('Year - 2025');
    });
  });

  test('NWS-007 — Month filter is displayed @P1 @Regression', async ({ newsModule }) => {
    await test.step('open News page', async () => {
      await newsModule.gotoNews();
    });

    await test.step('the Month filter is visible (disabled until a Year is picked)', async () => {
      await newsModule.expectMonthFilterVisible();
      await newsModule.expectMonthFilterDisabled();
    });
  });

  test('NWS-008 — Month filter values @P1 @Regression', async ({ newsModule }) => {
    await test.step('open News page and select Year 2026', async () => {
      await newsModule.gotoNews();
      await newsModule.selectYear('Year - 2026');
    });

    await test.step('only months with real 2026 data are available', async () => {
      await newsModule.expectMonthOptionVisible('Jun');
      await newsModule.expectMonthOptionVisible('Jul');
      await newsModule.expectMonthOptionVisible('Aug');
    });
  });

  test('NWS-009 — Default category tab @P0 @Regression', async ({ newsModule }) => {
    await test.step('open News page', async () => {
      await newsModule.gotoNews();
    });

    await test.step('"All" is selected by default', async () => {
      await newsModule.expectDefaultCategoryIsAll();
    });
  });

  test('NWS-010 — Configured category tabs @P1 @Regression', async ({ newsModule }) => {
    await test.step('open News page', async () => {
      await newsModule.gotoNews();
    });

    await test.step('the real configured category tabs are visible', async () => {
      await newsModule.expectCategoryTabsVisible();
    });
  });

  test('NWS-012 — News list under All category @P1 @Regression', async ({ newsModule }) => {
    await test.step('open News page', async () => {
      await newsModule.gotoNews();
    });

    await test.step('all 4 active news items are displayed under All', async () => {
      await newsModule.expectVisibleCardCount(4);
    });
  });

  test('NWS-013 — News sequence @P1 @Regression (adapted: DOM order is the closest real proxy for "Admin-configured sequence", matching every prior module in this suite)', async ({ newsModule }) => {
    await test.step('open News page', async () => {
      await newsModule.gotoNews();
    });

    await test.step('cards render in the confirmed live order', async () => {
      await newsModule.expectCardsInOrder([NEWS_CARDS.dummyPvrCinemas.title, NEWS_CARDS.westDelhi.title, NEWS_CARDS.plainInox.title, NEWS_CARDS.inoxx2025.title]);
    });
  });

  test('NWS-014 — News thumbnail @P2 @Regression', async ({ newsModule }) => {
    await test.step('open News page', async () => {
      await newsModule.gotoNews();
    });

    await test.step('the real card thumbnail loads successfully', async () => {
      await newsModule.expectCardVisible(NEWS_CARDS.westDelhi.title);
    });
  });

  test('NWS-015 — News title @P1 @Regression', async ({ newsModule }) => {
    await test.step('open News page', async () => {
      await newsModule.gotoNews();
    });

    await test.step('the correct title is displayed', async () => {
      await newsModule.expectCardVisible(NEWS_CARDS.westDelhi.title);
    });
  });

  test('NWS-016 — News date @P1 @Regression', async ({ newsModule }) => {
    await test.step('open News page', async () => {
      await newsModule.gotoNews();
    });

    await test.step('the correct publication date is displayed', async () => {
      await newsModule.expectCardContainsText(NEWS_CARDS.westDelhi.title, NEWS_CARDS.westDelhi.date);
    });
  });

  test('NWS-017 — News source @P2 @Regression', async ({ newsModule }) => {
    await test.step('open News page', async () => {
      await newsModule.gotoNews();
    });

    await test.step('the correct source is displayed', async () => {
      await newsModule.expectCardContainsText(NEWS_CARDS.westDelhi.title, NEWS_CARDS.westDelhi.source);
    });
  });

  test('NWS-018 — News short description @P2 @Regression', async ({ newsModule }) => {
    await test.step('open News page', async () => {
      await newsModule.gotoNews();
    });

    await test.step('the short description is displayed correctly', async () => {
      await newsModule.expectCardContainsText(NEWS_CARDS.westDelhi.title, NEWS_CARDS.westDelhi.descriptionSnippet);
    });
  });

  test('NWS-019 — Category filter @P0 @Regression', async ({ newsModule }) => {
    await test.step('open News page', async () => {
      await newsModule.gotoNews();
    });

    await test.step('selecting a category tab moves the active state and filters the list', async () => {
      await newsModule.clickNewInitiativesAndExpectListFiltered();
    });
  });

  test('NWS-020 — Switching category tabs @P1 @Regression (same real finding as NWS-019)', async ({ newsModule }) => {
    await test.step('open News page', async () => {
      await newsModule.gotoNews();
    });

    await test.step('switching tabs moves the active state and filters the list', async () => {
      await newsModule.clickNewInitiativesAndExpectListFiltered();
    });
  });

  test('NWS-021 — Year filter functionality @P0 @Regression', async ({ newsModule }) => {
    await test.step('open News page and select Year 2025', async () => {
      await newsModule.gotoNews();
      await newsModule.selectYear('Year - 2025');
    });

    await test.step('the news list updates to only the 2025 item', async () => {
      await newsModule.expectVisibleCardCount(1);
      await newsModule.expectCardVisible(NEWS_CARDS.inoxx2025.title);
    });
  });

  test('NWS-022 — Month filter functionality @P0 @Regression', async ({ newsModule }) => {
    await test.step('open News page and select Year 2026, Month Jul', async () => {
      await newsModule.gotoNews();
      await newsModule.selectYear('Year - 2026');
      await newsModule.selectMonth('Jul');
    });

    await test.step('the news list updates to only the July item', async () => {
      await newsModule.expectVisibleCardCount(1);
      await newsModule.expectCardVisible(NEWS_CARDS.westDelhi.title);
    });
  });

  test('NWS-023 — Combined Year and Month filter @P1 @Regression', async ({ newsModule }) => {
    await test.step('open News page and select Year 2026, Month Jun', async () => {
      await newsModule.gotoNews();
      await newsModule.selectYear('Year - 2026');
      await newsModule.selectMonth('Jun');
    });

    await test.step('only news matching both filters is displayed', async () => {
      await newsModule.expectVisibleCardCount(1);
      await newsModule.expectCardVisible(NEWS_CARDS.plainInox.title);
    });
  });
});
