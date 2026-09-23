import { test } from '@fixtures/index';
import { DataGenerator } from '@utils/index';
import { registerLoginData } from '@testdata/registerLoginData';
import { buildCuratedCategory, buildCuratedMovie, MUMBAI_CITY_ID, BANGALORE_CITY_ID } from '@testdata/curatedShowsData';

/**
 * Ticket: requirements/curated-shows.md — reconciled 2026-09-01 from the `TC_Web_076–146` sheet
 * (superseding the earlier `TC_App`/`M6-website.pdf`-sourced ticket — see the ticket's own Source
 * section for why). Grounded 2026-09-01 against UAT (`inox-uat-web.pvrinox.com`), Mumbai-All, via
 * headless Playwright driven from Bash/Node — Playwright MCP's interactive browser tool does not
 * launch in this sandbox (no display server, see the `pvr-inox-grounding-technique` project
 * memory). Scratchpad `ground-curated-*.js` scripts hold the raw diagnostics this file's tests
 * and `CuratedShowsPage.ts`/`CuratedShowsModule.ts`'s doc comments build on.
 *
 * **Headline finding, re-confirmed today**: `/curated-shows` for Mumbai-All still returns the
 * empty state ("No Curated Shows Available") — checked directly against every UAT city that has
 * a cinema (11 distinct `cityId`s), all empty. This is why the largest single real, no-mocking-
 * needed cluster here is the empty-state suite (CSH-053–071, mirroring TC_Web_128–146) — matching
 * this sheet's own largest cluster. Content-present scenarios are driven via `page.route()`
 * mocking of the real `/api/curated-shows` response, using field names extracted directly from
 * the shipped Next.js bundle (not guessed) — see `curatedShowsData.ts` for the full derivation.
 *
 * **13 scenarios are `test.fixme`**, each with its own live-grounded reason (not a blanket "no
 * data" excuse) — real gaps confirmed by reading the actual shipped source and/or live click
 * probes: no "See All" control (movies render in a Swiper carousel instead), no admin
 * enable/disable flag or category-sequence field, no personalization/"Recommended" logic, no
 * Upcoming/Re-release date-filtering logic, no trailer on this listing card, no "headsup" message
 * on the special-show session page (CSH-036), and an unreliable "More" menu path for the two
 * pure-navigation scenarios (CSH-001/002).
 *
 * **RESOLVED 2026-09-07**: CSH-019/034/035/044 were previously `test.fixme` on a theory that the
 * movie-card click was a dead handler needing unavailable live session/cinema context. Re-grounded
 * from scratch by reading the actual shipped `onClick` handler source (not guessing): it reads a
 * `movie.filmId` field the original mock never set (only `filmCommonCode`, a different field), so
 * the guard silently failed on every click. Adding `filmId` (and, for Special Shows, a second real
 * `categoryName` field) to `curatedShowsData.ts`'s mock builders makes the click genuinely
 * navigate — confirmed live including with a real currently-showing UAT film id, which rendered a
 * fully working session page. See `CuratedShowsPage.ts`/`curatedShowsData.ts` doc comments for the
 * full grounding trail. CSH-036 alone stays `test.fixme` — its "headsup message" doesn't exist
 * anywhere on the real `/moviesessions` page, independent of the click fix.
 */
test.describe('Curated Shows @RUN2', () => {
  test.fixme(
    'CSH-001 — Curated Shows menu is visible on homepage @P0 @Regression — BLOCKED: grounded 2026-09-01 — a "Curated Shows" quick-nav button was seen once during exploratory grounding, but 3 repeated live attempts (grant Mumbai geolocation, dismiss overlays, click "More", scroll) never reproduced it. It appears to be part of a lazily-rendered, scroll-position-dependent homepage strip unrelated to a stable "More" dropdown, not a dependable navigation entry point. Every other scenario in this file uses the established direct-URL pattern (`page.goto(baseUrl + "/curated-shows")`) instead, matching OffersPage.ts/EventListingPage.ts.',
    () => {},
  );

  test.fixme(
    'CSH-002 — User can access Curated Shows from the More menu @P0 @Regression — BLOCKED: same live-grounded instability as CSH-001 — clicking header "More" did not reliably reveal a "Curated Shows" entry across 3 repeated attempts.',
    () => {},
  );

  test('CSH-003 — Curated Shows page loads successfully with banners and categories @P0 @Regression', async ({ curatedShowsModule }) => {
    await test.step('mock a populated category with a banner', async () => {
      await curatedShowsModule.mockCuratedShows([buildCuratedCategory({ categoryDisplayName: 'Now Showing' })]);
    });

    await test.step('open Curated Shows', async () => {
      await curatedShowsModule.gotoCuratedShows();
    });

    await test.step('the category and its banner render', async () => {
      await curatedShowsModule.expectCategoryVisible('Now Showing');
      await curatedShowsModule.expectCategoryBannerVisible();
    });
  });

  test('CSH-004 — Promotional banners are displayed @P1 @Regression', async ({ curatedShowsModule }) => {
    await test.step('mock a category with a banner image', async () => {
      await curatedShowsModule.mockCuratedShows([buildCuratedCategory()]);
    });

    await test.step('open Curated Shows', async () => {
      await curatedShowsModule.gotoCuratedShows();
    });

    await test.step('the category banner image is visible', async () => {
      await curatedShowsModule.expectCategoryBannerVisible();
    });
  });

  test('CSH-005 — Multiple banners display correctly while scrolling @P1 @Regression', async ({ curatedShowsModule }) => {
    await test.step('mock two categories, each with its own banner', async () => {
      await curatedShowsModule.mockCuratedShows([
        buildCuratedCategory({ categoryDisplayName: 'Category A' }),
        buildCuratedCategory({ categoryDisplayName: 'Category B' }),
      ]);
    });

    await test.step('open Curated Shows and scroll the banner section', async () => {
      await curatedShowsModule.gotoCuratedShows();
      await curatedShowsModule.scrollToBottomAndExpectNoCrash();
    });

    await test.step('both category banners are visible', async () => {
      await curatedShowsModule.expectCategoryBannerCountAtLeast(2);
    });
  });

  test('CSH-006 — Search bar is visible @P1 @Regression', async ({ curatedShowsModule }) => {
    await test.step('open Curated Shows', async () => {
      await curatedShowsModule.gotoCuratedShows();
    });

    await test.step('the search bar is visible', async () => {
      await curatedShowsModule.expectSearchBarVisible();
    });
  });

  test('CSH-007 — Movie search by keyword returns matching curated movies @P0 @Regression', async ({ curatedShowsModule }) => {
    await test.step('mock two categories with distinctly-named movies', async () => {
      await curatedShowsModule.mockCuratedShows([
        buildCuratedCategory({ categoryDisplayName: 'Category A', movies: [buildCuratedMovie({ filmCommonName: 'Zenith Rising' })] }),
        buildCuratedCategory({ categoryDisplayName: 'Category B', movies: [buildCuratedMovie({ filmCommonName: 'Ocean Drift' })] }),
      ]);
    });

    await test.step('open Curated Shows and search for "Zenith"', async () => {
      await curatedShowsModule.gotoCuratedShows();
      await curatedShowsModule.search('Zenith');
    });

    await test.step('the matching movie shows; the non-matching one does not', async () => {
      await curatedShowsModule.expectMovieVisible('Zenith Rising');
      await curatedShowsModule.expectMovieHidden('Ocean Drift');
    });
  });

  // Grounded 2026-09-01: a non-matching keyword collapses to the exact same top-level
  // "No Curated Shows Available" state as true no-content — not a distinct search-empty state.
  test('CSH-008 — Movie search with no result shows the no-content state @P1 @Regression', async ({ curatedShowsModule }) => {
    await test.step('mock a category with a movie', async () => {
      await curatedShowsModule.mockCuratedShows([buildCuratedCategory({ movies: [buildCuratedMovie({ filmCommonName: 'Zenith Rising' })] })]);
    });

    await test.step('open Curated Shows', async () => {
      await curatedShowsModule.gotoCuratedShows();
    });

    await test.step('searching a non-matching keyword shows the no-content state', async () => {
      await curatedShowsModule.searchWithNoMatchAndExpectEmptyState('zzzznotamovie');
    });
  });

  // Grounded 2026-09-01: unlike CitySelectionPage's earlier "no reaction at all" finding, Curated
  // Shows' mic button DOES react to a denied microphone permission with a real native `alert()`.
  // The deeper "recognized keyword returns matching movies" behavior remains unverifiable
  // headless (no real speech input) — same posture as the original ticket's TC_App_085 exclusion.
  test('CSH-009 — Voice search: denied microphone permission shows a real browser alert @P1 @Regression', async ({ curatedShowsModule }) => {
    await test.step('force microphone permission to denied', async () => {
      await curatedShowsModule.forceMicrophonePermissionDenied();
    });

    await test.step('open Curated Shows', async () => {
      await curatedShowsModule.gotoCuratedShows();
    });

    await test.step('tapping the mic icon fires the real denied-permission alert', async () => {
      await curatedShowsModule.expectMicDeniedAlertShown();
    });
  });

  test('CSH-010 — Category name is displayed @P1 @Regression', async ({ curatedShowsModule }) => {
    await test.step('mock a named category', async () => {
      await curatedShowsModule.mockCuratedShows([buildCuratedCategory({ categoryDisplayName: 'Now Showing' })]);
    });

    await test.step('open Curated Shows', async () => {
      await curatedShowsModule.gotoCuratedShows();
    });

    await test.step('the category name is visible', async () => {
      await curatedShowsModule.expectCategoryVisible('Now Showing');
    });
  });

  // Grounded 2026-09-01: this build implements the sheet's "info icon" as a "Learn More"
  // text-link trigger, not a separate icon element — functionally equivalent.
  test('CSH-011 — Info trigger ("Learn More") is visible beside the category @P2 @Regression', async ({ curatedShowsModule }) => {
    await test.step('mock a category', async () => {
      await curatedShowsModule.mockCuratedShows([buildCuratedCategory()]);
    });

    await test.step('open Curated Shows', async () => {
      await curatedShowsModule.gotoCuratedShows();
    });

    await test.step('the "Learn More" info trigger is visible', async () => {
      await curatedShowsModule.expectCategoryCount(1);
    });
  });

  test('CSH-012 — Tapping the info trigger displays the category banner, description, and a Close CTA @P1 @Regression', async ({ curatedShowsModule }) => {
    await test.step('mock a category with a distinct sub-heading', async () => {
      await curatedShowsModule.mockCuratedShows([buildCuratedCategory({ subHeading: 'Curated for you this week' })]);
    });

    await test.step('open Curated Shows and tap the info trigger', async () => {
      await curatedShowsModule.gotoCuratedShows();
      await curatedShowsModule.openCategoryInfo();
    });

    await test.step('the popup shows the category description', async () => {
      await curatedShowsModule.expectCategoryInfoContent('Curated for you this week');
    });
  });

  test('CSH-013 — Close CTA closes the category info popup @P2 @Regression', async ({ curatedShowsModule }) => {
    await test.step('mock a category and open its info popup', async () => {
      await curatedShowsModule.mockCuratedShows([buildCuratedCategory()]);
      await curatedShowsModule.gotoCuratedShows();
      await curatedShowsModule.openCategoryInfo();
    });

    await test.step('tap Close', async () => {
      await curatedShowsModule.closeCategoryInfoAndExpectClosed();
    });
  });

  test.fixme(
    'CSH-014 — Only enabled categories are displayed @P1 @Regression — BLOCKED: grounded 2026-09-01 — no admin enable/disable flag was found anywhere in the real category schema (extracted directly from the shipped Next.js bundle) or the live API response. There is nothing to toggle to test this against.',
    () => {},
  );

  test.fixme(
    'CSH-015 — Disabled category does not appear @P0 @Regression — BLOCKED: same reason as CSH-014 — no enable/disable flag exists in the real, source-grounded category schema.',
    () => {},
  );

  test('CSH-016 — Movie list is displayed under a category @P0 @Regression', async ({ curatedShowsModule }) => {
    await test.step('mock a category with three movies', async () => {
      await curatedShowsModule.mockCuratedShows([
        buildCuratedCategory({ movies: [buildCuratedMovie({ filmCommonName: 'Movie One' }), buildCuratedMovie({ filmCommonName: 'Movie Two' }), buildCuratedMovie({ filmCommonName: 'Movie Three' })] }),
      ]);
    });

    await test.step('open Curated Shows', async () => {
      await curatedShowsModule.gotoCuratedShows();
    });

    await test.step('all three movies appear in list form', async () => {
      await curatedShowsModule.expectMovieVisible('Movie One');
      await curatedShowsModule.expectMovieVisible('Movie Two');
      await curatedShowsModule.expectMovieVisible('Movie Three');
    });
  });

  test.fixme(
    'CSH-017 — "See All" appears when more than ten movies are mapped @P1 @Regression — BLOCKED: grounded 2026-09-01 — no "See All"/"View All" control exists anywhere in the real shipped source for this page. Movies render inside a Swiper.js horizontal carousel (`curated-movie-swiper`, confirmed via the real class name) with prev/next arrows instead of a link to a full listing.',
    () => {},
  );

  test.fixme(
    'CSH-018 — "See All" navigates to the category full-listing page @P0 @Regression — BLOCKED: same reason as CSH-017 — the feature does not exist in the real build.',
    () => {},
  );

  // RESOLVED 2026-09-07 (was test.fixme): the earlier "dead click" theory was wrong — the real
  // onClick handler (read directly out of the shipped bundle) no-ops when `movie.filmId` is falsy,
  // and the original mock never set that field. See CuratedShowsPage.ts's class doc comment.
  test('CSH-019 — Tapping a movie card navigates to the standard Book Movie flow @P0 @Regression', async ({ curatedShowsModule }) => {
    await test.step('mock a category with a bookable movie', async () => {
      await curatedShowsModule.mockCuratedShows([buildCuratedCategory({ movies: [buildCuratedMovie({ filmCommonName: 'Bookable Curated Movie' })] })]);
    });

    await test.step('open Curated Shows', async () => {
      await curatedShowsModule.gotoCuratedShows();
    });

    await test.step('tapping the movie card navigates to the real movie-sessions (Book Movie) flow', async () => {
      await curatedShowsModule.clickMovieCardAndExpectSessionNavigation('Bookable Curated Movie');
    });
  });

  test('CSH-020 — Movie details such as poster and genre are visible @P1 @Regression', async ({ curatedShowsModule }) => {
    await test.step('mock a movie with a specific genre', async () => {
      await curatedShowsModule.mockCuratedShows([buildCuratedCategory({ movies: [buildCuratedMovie({ filmCommonName: 'Genre Check Movie', genres: ['Sci-Fi'] })] })]);
    });

    await test.step('open Curated Shows', async () => {
      await curatedShowsModule.gotoCuratedShows();
    });

    await test.step('the movie card shows its poster and genre', async () => {
      await curatedShowsModule.expectMovieMetadataVisible('Genre Check Movie', 'Sci-Fi');
    });
  });

  test.fixme(
    'CSH-021 — Trailer or throwback clip is accessible @P1 @Regression — BLOCKED: grounded 2026-09-01 — no trailer-related code (element, handler, or string) was found anywhere in the curated-shows listing component\'s real source. Trailer playback lives on the Movie Details page (see movie-details.md\'s own trailer coverage), not on this listing card.',
    () => {},
  );

  test('CSH-022 — Curated shows are city specific: content in one city does not show in another @P0 @Regression', async ({ curatedShowsModule, citySelectionModule }) => {
    await test.step('mock curated content for Mumbai only', async () => {
      await curatedShowsModule.mockCuratedShowsPerCity({
        [MUMBAI_CITY_ID]: [buildCuratedCategory({ categoryDisplayName: 'Mumbai Exclusive' })],
        [BANGALORE_CITY_ID]: [],
      });
    });

    await test.step('open Curated Shows for Mumbai — content is visible', async () => {
      await curatedShowsModule.gotoCuratedShows();
      await curatedShowsModule.expectCategoryVisible('Mumbai Exclusive');
    });

    await test.step('switch to Bangalore, which has no curated content mocked', async () => {
      await citySelectionModule.reopenCitySelectionViaHeader();
      await citySelectionModule.selectPopularCityWithNoSubCities('Bangalore');
    });

    await test.step('the Mumbai-only content is no longer shown', async () => {
      await curatedShowsModule.expectCategoryHidden('Mumbai Exclusive');
    });
  });

  test('CSH-023 — Validation message is shown when no curated shows are available for the city @P0 @Regression', async ({ curatedShowsModule }) => {
    await test.step('open Curated Shows (current UAT default: empty for every city)', async () => {
      await curatedShowsModule.gotoCuratedShows();
    });

    await test.step('the no-curated-shows message is shown', async () => {
      await curatedShowsModule.expectEmptyState();
    });
  });

  test.fixme(
    'CSH-024 — Personalization logic prioritizes recommended movies @P1 @Regression — BLOCKED: grounded 2026-09-01 — no personalization-related code path was found anywhere in the real curated-shows source searched.',
    () => {},
  );

  test.fixme(
    'CSH-025 — Recommended tag appears for personalized movies @P1 @Regression — BLOCKED: same reason as CSH-024 — no "Recommended" tag/string exists in the real source for this page.',
    () => {},
  );

  test.fixme(
    'CSH-026 — Default sorting (descending showtime count) applies without personalization @P1 @Regression — BLOCKED: grounded 2026-09-01 — no sort-related field or logic was found in the real source, and UAT curatedShows is always empty live, so no real ordering exists to verify against.',
    () => {},
  );

  // Grounded 2026-09-01: reinterpreted from a literal admin-toggle test (no such toggle exists —
  // see CSH-014) to "renders when present in the feed", the real mechanism this build has.
  test('CSH-027 — Auto category "Now Showing" renders when present in the feed @P1 @Regression', async ({ curatedShowsModule }) => {
    await test.step('mock a "Now Showing" category', async () => {
      await curatedShowsModule.mockCuratedShows([buildCuratedCategory({ categoryDisplayName: 'Now Showing', categoryType: 'Now Showing' })]);
    });

    await test.step('open Curated Shows', async () => {
      await curatedShowsModule.gotoCuratedShows();
    });

    await test.step('the "Now Showing" category is visible', async () => {
      await curatedShowsModule.expectCategoryVisible('Now Showing');
    });
  });

  // Folded into the real empty-state behavior: absence from the API feed (the closest real
  // equivalent to "disabled" — see CSH-014) means the category simply does not render.
  test('CSH-028 — Auto category is hidden when absent from the feed @P1 @Regression', async ({ curatedShowsModule }) => {
    await test.step('open Curated Shows with no categories in the feed', async () => {
      await curatedShowsModule.gotoCuratedShows();
    });

    await test.step('no category renders', async () => {
      await curatedShowsModule.expectNoCategoriesOrBanners();
    });
  });

  test.fixme(
    'CSH-029 — "Upcoming" category shows only unreleased movies @P1 @Regression — BLOCKED: grounded 2026-09-01 — no release-date-based filtering logic was found in the real source; "Upcoming" is just a display string, not a computed filter.',
    () => {},
  );

  test.fixme(
    'CSH-030 — "Re-release" category shows movies older than three months @P1 @Regression — BLOCKED: same reason as CSH-029 — only literal "Re-Release"/"New Release" badge-display strings exist in the source, no date-diff filtering logic.',
    () => {},
  );

  test('CSH-031 — Custom category displays manually mapped movies @P0 @Regression', async ({ curatedShowsModule }) => {
    await test.step('mock a custom category with mapped movies', async () => {
      await curatedShowsModule.mockCuratedShows([
        buildCuratedCategory({ categoryDisplayName: 'Custom Picks', categoryType: 'Custom', movies: [buildCuratedMovie({ filmCommonName: 'Mapped Movie' })] }),
      ]);
    });

    await test.step('open Curated Shows', async () => {
      await curatedShowsModule.gotoCuratedShows();
    });

    await test.step('the mapped movie is displayed under the custom category', async () => {
      await curatedShowsModule.expectCategoryVisible('Custom Picks');
      await curatedShowsModule.expectMovieVisible('Mapped Movie');
    });
  });

  test('CSH-032 — Custom category is hidden when absent from the feed @P2 @Regression', async ({ curatedShowsModule }) => {
    await test.step('open Curated Shows with no categories in the feed', async () => {
      await curatedShowsModule.gotoCuratedShows();
    });

    await test.step('no custom category renders', async () => {
      await curatedShowsModule.expectNoCategoriesOrBanners();
    });
  });

  test('CSH-033 — Special show category displays mapped movies @P0 @Regression', async ({ curatedShowsModule }) => {
    await test.step('mock a "Special Shows" category', async () => {
      await curatedShowsModule.mockCuratedShows([
        buildCuratedCategory({ categoryDisplayName: 'Special Shows', categoryType: 'Special Shows', movies: [buildCuratedMovie({ filmCommonName: 'Special Screening' })] }),
      ]);
    });

    await test.step('open Curated Shows', async () => {
      await curatedShowsModule.gotoCuratedShows();
    });

    await test.step('the mapped movie is displayed under the Special Shows category', async () => {
      await curatedShowsModule.expectCategoryVisible('Special Shows');
      await curatedShowsModule.expectMovieVisible('Special Screening');
    });
  });

  // RESOLVED 2026-09-07 (was test.fixme, chained off CSH-019's click finding): same real fix — a
  // "Special Shows" movie card needs `filmId` for the click to navigate at all.
  test('CSH-034 — Tapping a special show movie redirects to the session page @P0 @Regression', async ({ curatedShowsModule }) => {
    await test.step('mock a Special Shows category with a mapped movie', async () => {
      await curatedShowsModule.mockCuratedShows([
        buildCuratedCategory({ categoryDisplayName: 'Special Shows', categoryType: 'Special Shows', movies: [buildCuratedMovie({ filmCommonName: 'Special Session Movie' })] }),
      ]);
    });

    await test.step('open Curated Shows', async () => {
      await curatedShowsModule.gotoCuratedShows();
    });

    await test.step('tapping the special-show movie redirects to its session page', async () => {
      await curatedShowsModule.clickMovieCardAndExpectSessionNavigation('Special Session Movie');
    });
  });

  // RESOLVED 2026-09-07 (was test.fixme): reinterpreted per a further live finding — there is no
  // visible on-page filter badge/label the `curatedType` param drives, but the param itself
  // (sourced from the category's real `categoryName` field, confirmed distinct from
  // `categoryDisplayName`) does genuinely persist onto the session-page URL, which is the real,
  // observable "remains applied" mechanism — see CuratedShowsModule.expectSessionUrlCuratedType.
  test('CSH-035 — Special show filter remains applied on the session page @P1 @Regression', async ({ curatedShowsModule }) => {
    await test.step('mock a Special Shows category with a distinct categoryName', async () => {
      await curatedShowsModule.mockCuratedShows([
        buildCuratedCategory({ categoryType: 'Special Shows', categoryName: 'SPECIAL_SHOWS_FILTER', movies: [buildCuratedMovie({ filmCommonName: 'Filtered Special Movie' })] }),
      ]);
    });

    await test.step('open Curated Shows and tap the special-show movie', async () => {
      await curatedShowsModule.gotoCuratedShows();
      await curatedShowsModule.clickMovieCardAndExpectSessionNavigation('Filtered Special Movie');
    });

    await test.step('the curatedType filter param carries through onto the session-page URL', async () => {
      await curatedShowsModule.expectSessionUrlCuratedType('SPECIAL_SHOWS_FILTER');
    });
  });

  test.fixme(
    'CSH-036 — Headsup message displays after selecting a special show session @P1 @Regression — BLOCKED: re-grounded 2026-09-07 after fixing CSH-034/035\'s navigation — landed directly on a real `/moviesessions/...?curatedType=...` URL (both with and without a real showtime click) and found no "headsup"/"heads up" text, dialog, or any visible special-show indicator anywhere on the page (full body-text dump checked). The click-navigation chain is real now; this specific "headsup message" feature is confirmed absent from the live build, not blocked by the click.',
    () => {},
  );

  // Grounded 2026-09-01: matches OffersModule.ts's established `route.abort('internetdisconnected')`
  // pattern. Real behavior is a graceful fallback to the SAME empty-state UI, not a distinct error
  // message — the sheet's own expected result ("Error message displayed") doesn't hold live.
  test('CSH-037 — Internet disconnection is handled gracefully @P0 @Regression', async ({ curatedShowsModule }) => {
    await test.step('block the curated-shows API to simulate no internet', async () => {
      await curatedShowsModule.blockCuratedShowsApi();
    });

    await test.step('open Curated Shows', async () => {
      await curatedShowsModule.gotoCuratedShows();
    });

    await test.step('the page falls back gracefully to the no-content state (no crash, no raw error)', async () => {
      await curatedShowsModule.expectEmptyState();
    });
  });

  test('CSH-038 — Page reload restores Curated Shows @P1 @Regression', async ({ curatedShowsModule }) => {
    await test.step('open Curated Shows', async () => {
      await curatedShowsModule.gotoCuratedShows();
      await curatedShowsModule.expectEmptyState();
    });

    await test.step('reload the page', async () => {
      await curatedShowsModule.reopenCuratedShowsAndExpectEmptyState();
    });
  });

  // Grounded 2026-09-01: no separate admin "sequence" field exists in the real category schema —
  // DOM order mirroring the mocked array order IS the real ordering mechanism.
  test('CSH-039 — Category sequence follows the configured (feed) order @P1 @Regression', async ({ curatedShowsModule }) => {
    await test.step('mock three categories in a specific order', async () => {
      await curatedShowsModule.mockCuratedShows([
        buildCuratedCategory({ categoryDisplayName: 'First Category' }),
        buildCuratedCategory({ categoryDisplayName: 'Second Category' }),
        buildCuratedCategory({ categoryDisplayName: 'Third Category' }),
      ]);
    });

    await test.step('open Curated Shows', async () => {
      await curatedShowsModule.gotoCuratedShows();
    });

    await test.step('categories render in the same order as the feed', async () => {
      await curatedShowsModule.expectCategoriesInOrder(['First Category', 'Second Category', 'Third Category']);
    });
  });

  test('CSH-040 — A movie mapped to multiple categories appears in each @P1 @Regression', async ({ curatedShowsModule }) => {
    await test.step('mock the same movie under two categories', async () => {
      const sharedMovie = buildCuratedMovie({ filmCommonName: 'Shared Across Categories' });
      await curatedShowsModule.mockCuratedShows([
        buildCuratedCategory({ categoryDisplayName: 'Category A', movies: [sharedMovie] }),
        buildCuratedCategory({ categoryDisplayName: 'Category B', movies: [sharedMovie] }),
      ]);
    });

    await test.step('open Curated Shows', async () => {
      await curatedShowsModule.gotoCuratedShows();
    });

    await test.step('the movie appears once per category (twice total)', async () => {
      await curatedShowsModule.expectMovieHeadingCount('Shared Across Categories', 2);
    });
  });

  test('CSH-041 — A movie removed from a category no longer appears there @P1 @Regression', async ({ curatedShowsModule }) => {
    await test.step('mock a category without the previously-mapped movie', async () => {
      await curatedShowsModule.mockCuratedShows([buildCuratedCategory({ movies: [buildCuratedMovie({ filmCommonName: 'Still Mapped Movie' })] })]);
    });

    await test.step('open Curated Shows', async () => {
      await curatedShowsModule.gotoCuratedShows();
    });

    await test.step('the unmapped movie is absent; the still-mapped one is present', async () => {
      await curatedShowsModule.expectMovieHidden('Removed Movie');
      await curatedShowsModule.expectMovieVisible('Still Mapped Movie');
    });
  });

  test('CSH-042 — Banner header description matches the configured (feed) data @P1 @Regression', async ({ curatedShowsModule }) => {
    await test.step('mock a category with a specific sub-heading', async () => {
      await curatedShowsModule.mockCuratedShows([buildCuratedCategory({ subHeading: 'Exact Configured Sub-Heading Text' })]);
    });

    await test.step('open Curated Shows and tap the info trigger', async () => {
      await curatedShowsModule.gotoCuratedShows();
      await curatedShowsModule.openCategoryInfo();
    });

    await test.step('the popup text matches the configured sub-heading exactly', async () => {
      await curatedShowsModule.expectCategoryInfoContent('Exact Configured Sub-Heading Text');
    });
  });

  test('CSH-043 — Guest user can access Curated Shows @P0 @Regression', async ({ curatedShowsModule }) => {
    await test.step('open Curated Shows without logging in', async () => {
      await curatedShowsModule.gotoCuratedShows();
    });

    await test.step('the page is accessible', async () => {
      await curatedShowsModule.expectEmptyState();
    });
  });

  // RESOLVED 2026-09-07 (was test.fixme): same real fix as CSH-019 — this file never logs a user
  // in, so every scenario here already runs as a guest; the click now genuinely starts the booking
  // flow without any auth gate blocking it.
  test('CSH-044 — Booking flow works for guest users @P0 @Regression', async ({ curatedShowsModule }) => {
    await test.step('mock a category with a bookable movie', async () => {
      await curatedShowsModule.mockCuratedShows([buildCuratedCategory({ movies: [buildCuratedMovie({ filmCommonName: 'Guest Bookable Movie' })] })]);
    });

    await test.step('open Curated Shows as a guest', async () => {
      await curatedShowsModule.gotoCuratedShows();
    });

    await test.step('tapping the movie card starts the booking flow without requiring login', async () => {
      await curatedShowsModule.clickMovieCardAndExpectSessionNavigation('Guest Bookable Movie');
    });
  });

  // Grounded 2026-09-01: a fresh context with no geolocation permission granted blocks on the
  // real "Enable Location" modal before any curated-shows content loads.
  test('CSH-045 — Location permission is required before access @P1 @Regression', async ({ curatedShowsModule }) => {
    await test.step('open Curated Shows on a fresh context with no location permission', async () => {
      await curatedShowsModule.gotoCuratedShowsWithoutLocationPermission();
    });

    await test.step('the system prompts to enable location', async () => {
      await curatedShowsModule.expectLocationPromptShown();
    });
  });

  test('CSH-046 — Switching city updates curated content to match the newly selected city @P0 @Regression', async ({ curatedShowsModule, citySelectionModule }) => {
    await test.step('mock distinct curated content per city', async () => {
      await curatedShowsModule.mockCuratedShowsPerCity({
        [MUMBAI_CITY_ID]: [buildCuratedCategory({ categoryDisplayName: 'Mumbai Only Category' })],
        [BANGALORE_CITY_ID]: [buildCuratedCategory({ categoryDisplayName: 'Bangalore Only Category' })],
      });
    });

    await test.step('open Curated Shows for Mumbai', async () => {
      await curatedShowsModule.gotoCuratedShows();
      await curatedShowsModule.expectCategoryVisible('Mumbai Only Category');
    });

    await test.step('switch to Bangalore', async () => {
      await citySelectionModule.reopenCitySelectionViaHeader();
      await citySelectionModule.selectPopularCityWithNoSubCities('Bangalore');
    });

    await test.step("content updates to Bangalore's own category", async () => {
      await curatedShowsModule.expectCategoryVisible('Bangalore Only Category');
      await curatedShowsModule.expectCategoryHidden('Mumbai Only Category');
    });
  });

  // Grounded 2026-09-01: real finding that CONTRADICTS the sheet — a category configured with
  // zero mapped movies (`movies: []`) still renders its own heading + info trigger on initial
  // load; it does NOT disappear. (Only a search filtered down to zero matches hides a category
  // entirely — see CSH-008 — which is a different code path than an inherently-empty category.)
  test('CSH-047 — A category configured with no mapped movies still renders (documented real behavior) @P1 @Regression', async ({ curatedShowsModule }) => {
    await test.step('mock a category with an empty movie list', async () => {
      await curatedShowsModule.mockCuratedShows([buildCuratedCategory({ categoryDisplayName: 'Empty Mapped Category', movies: [] })]);
    });

    await test.step('open Curated Shows', async () => {
      await curatedShowsModule.gotoCuratedShows();
    });

    await test.step('the category heading still renders, just with no movies', async () => {
      await curatedShowsModule.expectCategoryVisibleWithNoMovies('Empty Mapped Category');
    });
  });

  test('CSH-048 — A large number of categories scroll properly without breaking the UI @P2 @Regression', async ({ curatedShowsModule }) => {
    await test.step('mock 15 categories', async () => {
      await curatedShowsModule.mockCuratedShows(Array.from({ length: 15 }, () => buildCuratedCategory()));
    });

    await test.step('open Curated Shows', async () => {
      await curatedShowsModule.gotoCuratedShows();
    });

    await test.step('all 15 categories render and the page scrolls without crashing', async () => {
      await curatedShowsModule.expectCategoryCount(15);
      await curatedShowsModule.scrollToBottomAndExpectNoCrash();
    });
  });

  // Reinterpreted per the real Swiper-carousel finding (see CSH-017) — this IS the real
  // horizontal-scroll mechanism for a category's movie list.
  test('CSH-049 — Movie list within a category scrolls horizontally (Swiper carousel) @P2 @Regression', async ({ curatedShowsModule }) => {
    await test.step('mock a category with several movies', async () => {
      await curatedShowsModule.mockCuratedShows([buildCuratedCategory({ movies: Array.from({ length: 5 }, () => buildCuratedMovie()) })]);
    });

    await test.step('open Curated Shows', async () => {
      await curatedShowsModule.gotoCuratedShows();
    });

    await test.step('the movie list renders inside the real horizontal Swiper carousel', async () => {
      await curatedShowsModule.expectMovieCarouselVisible();
    });
  });

  // Reinterpreted: no separate "vertical layout mode" exists — categories simply stack vertically
  // down the page, which this asserts via DOM order (same mechanism as CSH-039).
  test('CSH-050 — Multiple categories stack vertically down the page @P2 @Regression', async ({ curatedShowsModule }) => {
    await test.step('mock two categories', async () => {
      await curatedShowsModule.mockCuratedShows([buildCuratedCategory({ categoryDisplayName: 'Category A' }), buildCuratedCategory({ categoryDisplayName: 'Category B' })]);
    });

    await test.step('open Curated Shows', async () => {
      await curatedShowsModule.gotoCuratedShows();
    });

    await test.step('both categories render, vertically ordered top to bottom', async () => {
      await curatedShowsModule.expectCategoriesInOrder(['Category A', 'Category B']);
    });
  });

  test('CSH-051 — Page loads within an acceptable time with multiple categories configured @P2 @Regression', async ({ curatedShowsModule }) => {
    await test.step('mock several populated categories', async () => {
      await curatedShowsModule.mockCuratedShows(Array.from({ length: 5 }, () => buildCuratedCategory()));
    });

    await test.step('Curated Shows loads within a generous time budget', async () => {
      await curatedShowsModule.expectLoadsWithinTimeout(30_000);
    });
  });

  test('CSH-052 — Curated Shows behaves consistently on Web, with no unexpected console errors @P1 @Regression', async ({ curatedShowsModule }) => {
    await test.step('open Curated Shows and confirm no unexpected console errors', async () => {
      await curatedShowsModule.expectNoUnexpectedConsoleErrors();
    });
  });

  // --- Empty-state cluster (TC_Web_128–146) — real, grounded live, no mocking needed. ---

  test('CSH-053 — No curated shows message is displayed when no content is available for the selected city @P0 @Smoke', async ({ curatedShowsModule }) => {
    await test.step('open Curated Shows', async () => {
      await curatedShowsModule.gotoCuratedShows();
    });

    await test.step('the no-curated-shows message is displayed', async () => {
      await curatedShowsModule.expectEmptyState();
    });
  });

  test('CSH-054 — Message content matches the configured (real) copy @P1 @Regression', async ({ curatedShowsModule }) => {
    await test.step('open Curated Shows', async () => {
      await curatedShowsModule.gotoCuratedShows();
    });

    await test.step('the message text matches the real live copy exactly', async () => {
      await curatedShowsModule.expectExactEmptyStateMessageText();
    });
  });

  // Grounded 2026-09-01: the sheet's expected wording is "Let's Go" CTA — the real live button
  // text is "Back to Homepage". Same function (redirects to homepage), different copy.
  test("CSH-055 — A homepage-redirect CTA is visible when no curated shows are available @P0 @Regression", async ({ curatedShowsModule }) => {
    await test.step('open Curated Shows', async () => {
      await curatedShowsModule.gotoCuratedShows();
    });

    await test.step('the "Back to Homepage" CTA is displayed below the message', async () => {
      await curatedShowsModule.expectEmptyState();
    });
  });

  test('CSH-056 — Tapping the homepage-redirect CTA redirects to the homepage @P0 @Smoke', async ({ curatedShowsModule }) => {
    await test.step('open Curated Shows', async () => {
      await curatedShowsModule.gotoCuratedShows();
    });

    await test.step('tap "Back to Homepage"', async () => {
      await curatedShowsModule.clickBackToHomepageAndExpectHome();
    });
  });

  test('CSH-057 — Homepage loads successfully after tapping the CTA @P0 @Regression', async ({ curatedShowsModule }) => {
    await test.step('open Curated Shows and tap "Back to Homepage"', async () => {
      await curatedShowsModule.gotoCuratedShows();
      await curatedShowsModule.clickBackToHomepageAndExpectHome();
    });
  });

  test('CSH-058 — User can reaccess Curated Shows after redirection and sees the message again @P1 @Regression', async ({ curatedShowsModule }) => {
    await test.step('open Curated Shows, redirect home, then navigate back', async () => {
      await curatedShowsModule.gotoCuratedShows();
      await curatedShowsModule.clickBackToHomepageAndExpectHome();
    });

    await test.step('the no-curated-shows message is shown again', async () => {
      await curatedShowsModule.reopenCuratedShowsAndExpectEmptyState();
    });
  });

  test('CSH-059 — No category sections are displayed when no curated content exists @P1 @Regression', async ({ curatedShowsModule }) => {
    await test.step('open Curated Shows', async () => {
      await curatedShowsModule.gotoCuratedShows();
    });

    await test.step('no category sections render', async () => {
      await curatedShowsModule.expectNoCategoriesOrBanners();
    });
  });

  test('CSH-060 — No promotional banners are displayed when no curated content exists @P1 @Regression', async ({ curatedShowsModule }) => {
    await test.step('open Curated Shows', async () => {
      await curatedShowsModule.gotoCuratedShows();
    });

    await test.step('no banner section renders', async () => {
      await curatedShowsModule.expectNoCategoriesOrBanners();
    });
  });

  test('CSH-061 — Search bar behaves correctly when no curated content exists @P1 @Regression', async ({ curatedShowsModule }) => {
    await test.step('open Curated Shows', async () => {
      await curatedShowsModule.gotoCuratedShows();
    });

    await test.step('using the search bar produces no error and no crash', async () => {
      await curatedShowsModule.searchOnEmptyStateAndExpectNoCrash('any keyword');
    });
  });

  test('CSH-062 — Switching to a city with content displays that content @P1 @Regression', async ({ curatedShowsModule, citySelectionModule }) => {
    await test.step('mock Mumbai with no content, Bangalore with content', async () => {
      await curatedShowsModule.mockCuratedShowsPerCity({
        [MUMBAI_CITY_ID]: [],
        [BANGALORE_CITY_ID]: [buildCuratedCategory({ categoryDisplayName: 'Bangalore Exclusive' })],
      });
    });

    await test.step('open Curated Shows for Mumbai — empty state', async () => {
      await curatedShowsModule.gotoCuratedShows();
      await curatedShowsModule.expectEmptyState();
    });

    await test.step('switch to Bangalore', async () => {
      await citySelectionModule.reopenCitySelectionViaHeader();
      await citySelectionModule.selectPopularCityWithNoSubCities('Bangalore');
    });

    await test.step("Bangalore's curated content now displays", async () => {
      await curatedShowsModule.expectCategoryVisible('Bangalore Exclusive');
    });
  });

  test('CSH-063 — Switching back to a no-content city shows the empty message again @P1 @Regression', async ({ curatedShowsModule, citySelectionModule }) => {
    await test.step('mock Mumbai with no content, Bangalore with content, then switch to Bangalore', async () => {
      await curatedShowsModule.mockCuratedShowsPerCity({
        [MUMBAI_CITY_ID]: [],
        [BANGALORE_CITY_ID]: [buildCuratedCategory({ categoryDisplayName: 'Bangalore Exclusive' })],
      });
      await curatedShowsModule.gotoCuratedShows();
      await citySelectionModule.reopenCitySelectionViaHeader();
      await citySelectionModule.selectPopularCityWithNoSubCities('Bangalore');
      await curatedShowsModule.expectCategoryVisible('Bangalore Exclusive');
    });

    await test.step('switch back to Mumbai', async () => {
      await citySelectionModule.reopenCitySelectionViaHeader();
      await citySelectionModule.selectSubCity('Mumbai-All', 'Mumbai');
    });

    await test.step('the empty-state message shows again for Mumbai', async () => {
      await curatedShowsModule.expectEmptyState();
    });
  });

  test('CSH-064 — Guest user sees the no-curated-shows message when content is unavailable @P1 @Regression', async ({ curatedShowsModule }) => {
    await test.step('open Curated Shows as a guest', async () => {
      await curatedShowsModule.gotoCuratedShows();
    });

    await test.step('the no-curated-shows message is shown', async () => {
      await curatedShowsModule.expectEmptyState();
    });
  });

  test('CSH-065 — Logged-in user sees the no-curated-shows message when content is unavailable @P1 @Regression', async ({ curatedShowsModule, registerLoginModule }) => {
    await test.step('log in with a real UAT OTP round trip', async () => {
      await registerLoginModule.gotoLogin();
      await registerLoginModule.loginWithPhoneAndOtp(DataGenerator.randomIndianPhoneNumber(), registerLoginData.validOtp);
      await registerLoginModule.expectOnHome();
    });

    await test.step('open Curated Shows', async () => {
      await curatedShowsModule.gotoCuratedShows();
    });

    await test.step('the no-curated-shows message is shown for the logged-in user too', async () => {
      await curatedShowsModule.expectEmptyState();
    });
  });

  test('CSH-066 — No backend error is shown when the curated-shows API returns an empty response @P1 @Regression', async ({ curatedShowsModule }) => {
    await test.step('confirm the real API contract directly', async () => {
      await curatedShowsModule.expectApiEmptyResponseShape(MUMBAI_CITY_ID);
    });

    await test.step('the UI shows a friendly message, not a raw error', async () => {
      await curatedShowsModule.gotoCuratedShows();
      await curatedShowsModule.expectEmptyState();
    });
  });

  test('CSH-067 — Internet disconnecting after page load is handled gracefully @P1 @Regression', async ({ curatedShowsModule }) => {
    await test.step('open Curated Shows, then block the API and tap "Back to Homepage"', async () => {
      await curatedShowsModule.gotoCuratedShows();
    });

    await test.step('the homepage redirection still works gracefully with the API unreachable', async () => {
      await curatedShowsModule.blockApiAfterLoadAndClickBackHome();
    });
  });

  test('CSH-068 — UI layout does not break when no curated shows are available @P1 @Regression', async ({ curatedShowsModule }) => {
    await test.step('open Curated Shows', async () => {
      await curatedShowsModule.gotoCuratedShows();
    });

    await test.step('the layout renders only the expected empty-state elements, no orphan containers', async () => {
      await curatedShowsModule.expectEmptyState();
      await curatedShowsModule.expectNoCategoriesOrBanners();
    });
  });

  // Web-scoped per this repo's convention (App/M-Site parity is out of scope) — same underlying
  // CTA as CSH-056, re-verified after a fresh reload rather than a pure literal duplicate.
  test('CSH-069 — The homepage-redirect CTA is clickable on Web @P1 @Regression', async ({ curatedShowsModule }) => {
    await test.step('open Curated Shows and reload once', async () => {
      await curatedShowsModule.gotoCuratedShows();
      await curatedShowsModule.reopenCuratedShowsAndExpectEmptyState();
    });

    await test.step('the CTA still works after a reload', async () => {
      await curatedShowsModule.clickBackToHomepageAndExpectHome();
    });
  });

  test('CSH-070 — No stale curated data remains after switching to a no-content city @P1 @Regression', async ({ curatedShowsModule, citySelectionModule }) => {
    await test.step('mock Mumbai with no content, Bangalore with content, then switch to Bangalore', async () => {
      await curatedShowsModule.mockCuratedShowsPerCity({
        [MUMBAI_CITY_ID]: [],
        [BANGALORE_CITY_ID]: [buildCuratedCategory({ categoryDisplayName: 'Bangalore Exclusive' })],
      });
      await curatedShowsModule.gotoCuratedShows();
      await citySelectionModule.reopenCitySelectionViaHeader();
      await citySelectionModule.selectPopularCityWithNoSubCities('Bangalore');
      await curatedShowsModule.expectCategoryVisible('Bangalore Exclusive');
    });

    await test.step('switch back to Mumbai (no content)', async () => {
      await citySelectionModule.reopenCitySelectionViaHeader();
      await citySelectionModule.selectSubCity('Mumbai-All', 'Mumbai');
    });

    await test.step("no stale Bangalore content remains, and the empty message shows", async () => {
      await curatedShowsModule.expectCategoryHidden('Bangalore Exclusive');
      await curatedShowsModule.expectEmptyState();
    });
  });

  test('CSH-071 — Page loads within an acceptable time in the empty curated-shows state @P2 @Regression', async ({ curatedShowsModule }) => {
    await test.step('Curated Shows (empty state) loads within a generous time budget', async () => {
      await curatedShowsModule.expectLoadsWithinTimeout(20_000);
    });
  });
});
