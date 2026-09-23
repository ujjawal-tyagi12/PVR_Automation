import { test } from '@fixtures/index';
import { DataGenerator } from '@utils/index';
import type { NewAlertUserDetails } from '@modules/MovieAlertsModule';

/**
 * Ticket: requirements/coming-soon.md — reconciled 2026-09-01 from the `TC_Web_147–176` sheet
 * (superseding the earlier `TC_App`/`M6-website.pdf`-sourced ticket — see the ticket's own Source
 * section for why). Grounded 2026-09-01 against UAT (`inox-uat-web.pvrinox.com`), Mumbai-All, via
 * headless Playwright driven from Bash/Node — Playwright MCP's interactive browser tool does not
 * launch in this sandbox (no display server, see the `pvr-inox-grounding-technique` project
 * memory). Scratchpad `ground-coming-soon-*.js` scripts hold the raw diagnostics this file's tests
 * and `ComingSoonPage.ts`/`ComingSoonModule.ts`'s doc comments build on.
 *
 * **Headline finding**: `/coming-soon` is real and populated for Mumbai-All (no empty-state gap
 * like Curated Shows currently has) — "Jana Nayagan" in Week 39/Sep, and "Varanasi (film)", "King
 * (2026 film)", "MISSION: IMPOSSIBLE - THE FINAL RECKONING", "PROJECT HAIL MARY" all in Week
 * 52/Dec. No separate JSON API backs the movie list (confirmed via a full network trace — only
 * auth/city/config calls observed), so the "empty week" and "image fallback" scenarios use real,
 * currently-live UAT data states instead of `page.route()` mocking.
 *
 * **5 scenarios are `test.fixme`**, each with its own live-grounded reason (not a blanket "no
 * data" excuse): no reliable homepage entry point (no "Coming Soon" section currently renders on
 * the homepage at all), voice-search recognition unverifiable headless (only the denied-mic
 * permission path is real and asserted), no hover-trailer capability on the listing card at all
 * (trailer only exists on the movie detail page — 3 sheet rows fold into this one finding).
 *
 * **CMS-030 ("Delete Alert" CTA visible when an alert exists), re-attempted 2026-09-07**: the
 * Set/Update/Delete Alert flow (`movie-alerts.md`) now exists, so this is a real passing test —
 * register a fresh user, save a real alert via `MovieAlertsModule.openSetAlertPanelAsNewUser` +
 * `selectCinema` + `save`, then confirm the same detail page's CTA switches from "Set Alert" to
 * "Delete Alert" (`ComingSoonModule.expectDeleteAlertVisibleOnDetailPage`, backed by
 * `ComingSoonPage.detailDeleteAlertButton`).
 */
test.describe('Coming Soon @RUN2', () => {
  test.fixme(
    'CMS-001 — View All CTA navigation from homepage @P0 @Regression — BLOCKED: grounded 2026-09-01 — a full homepage heading dump found no "Coming Soon" section/heading anywhere on the live homepage (only "IN THE SPOTLIGHT" and "Re-Release" sections render), so there is no "View All" CTA to click. Matches curated-shows.md\'s identical CSH-001/002 finding for its own homepage nav path. Every other scenario here uses the direct-URL entry point instead (`page.goto(baseUrl + "/coming-soon")`), matching OffersPage.ts/CuratedShowsPage.ts.',
    () => {},
  );

  test('CMS-002 — Coming Soon page layout @P1 @Regression', async ({ comingSoonModule }) => {
    await test.step('open Coming Soon', async () => {
      await comingSoonModule.gotoComingSoon();
    });

    await test.step('the page layout renders (heading, filter trigger, search bar)', async () => {
      await comingSoonModule.expectPageLayoutVisible();
    });
  });

  test('CMS-003 — Filter section UI (Year/Month/Week) @P1 @Regression', async ({ comingSoonModule }) => {
    await test.step('open Coming Soon', async () => {
      await comingSoonModule.gotoComingSoon();
    });

    await test.step('the Year/Month/Week filter bar is visible', async () => {
      await comingSoonModule.expectFilterSectionVisible();
    });
  });

  test('CMS-004 — Default listing shows full-year movies @P0 @Regression', async ({ comingSoonModule }) => {
    await test.step('open Coming Soon', async () => {
      await comingSoonModule.gotoComingSoon();
    });

    await test.step('both a near week (Week 39) and a far week (Week 52) render with no filter applied', async () => {
      await comingSoonModule.expectDefaultListingShowsFullYear();
    });
  });

  test('CMS-005 — Month filter selection shows correct movies @P0 @Regression', async ({ comingSoonModule }) => {
    await test.step('open Coming Soon and select the "Dec" month tab', async () => {
      await comingSoonModule.gotoComingSoon();
      await comingSoonModule.selectMonth('Dec');
    });

    await test.step('December\'s movies are shown', async () => {
      await comingSoonModule.expectMovieVisible('Varanasi (film)');
    });
  });

  test('CMS-006 — Week filter selection shows correct movies @P0 @Regression', async ({ comingSoonModule }) => {
    await test.step('open Coming Soon and select "Week 52"', async () => {
      await comingSoonModule.gotoComingSoon();
      await comingSoonModule.selectWeek('Week 52');
    });

    await test.step('Week 52\'s movies are shown', async () => {
      await comingSoonModule.expectMovieVisible('King (2026 film)');
    });
  });

  // Grounded 2026-09-01: selecting "Musical" (which only matches a Week 52 movie) auto-jumps the
  // listing from the default Week 39 view straight to Week 52.
  test('CMS-007 — Later month is auto-selected when the filter only matches a future week @P1 @Regression', async ({ comingSoonModule }) => {
    await test.step('open Coming Soon (default view starts at Week 39)', async () => {
      await comingSoonModule.gotoComingSoon();
    });

    await test.step('selecting "Musical" jumps to Week 52, where the only matching movie is', async () => {
      await comingSoonModule.expectGenreFilterShowsOnlyMatchingWeek('Musical', 'Week 52', 'Varanasi (film)');
    });
  });

  test('CMS-008 — Selected filter is visually highlighted @P1 @Regression', async ({ comingSoonModule }) => {
    await test.step('open Coming Soon and select the "Action" genre chip', async () => {
      await comingSoonModule.gotoComingSoon();
      await comingSoonModule.selectGenreChip('Action');
    });

    await test.step('the "Action" chip shows the real selected-state highlight', async () => {
      await comingSoonModule.expectGenreChipSelected('Action');
    });
  });

  // Grounded 2026-09-01: no separate Reset/Clear control exists on the main filter bar — the real
  // mechanism is re-clicking the already-selected chip to toggle it off.
  test('CMS-009 — Reset filter (toggle the selected chip off) @P1 @Regression', async ({ comingSoonModule }) => {
    await test.step('open Coming Soon and select the "Action" genre chip', async () => {
      await comingSoonModule.gotoComingSoon();
      await comingSoonModule.selectGenreChip('Action');
      await comingSoonModule.expectGenreChipSelected('Action');
    });

    await test.step('clicking the same chip again deselects it and restores the full listing', async () => {
      await comingSoonModule.deselectGenreChipAndExpectFullListingRestored('Action');
    });
  });

  // Grounded 2026-09-01: "Oct" (Week 40) currently has zero movies live.
  test('CMS-010 — Empty state message for a month with no movies @P1 @Regression', async ({ comingSoonModule }) => {
    await test.step('open Coming Soon', async () => {
      await comingSoonModule.gotoComingSoon();
    });

    await test.step('selecting "Oct" (currently empty) shows the real empty-state message', async () => {
      await comingSoonModule.selectEmptyMonthAndExpectMessage('Oct');
    });
  });

  test('CMS-011 — Search by typing shows relevant results @P0 @Regression', async ({ comingSoonModule }) => {
    await test.step('open Coming Soon and search "jana"', async () => {
      await comingSoonModule.gotoComingSoon();
      await comingSoonModule.search('jana');
    });

    await test.step('the matching movie is shown', async () => {
      await comingSoonModule.expectMovieVisible('Jana Nayagan');
    });
  });

  test('CMS-012 — Partial search shows matching results @P1 @Regression', async ({ comingSoonModule }) => {
    await test.step('open Coming Soon and search a partial keyword ("varan")', async () => {
      await comingSoonModule.gotoComingSoon();
      await comingSoonModule.search('varan');
    });

    await test.step('the matching movie is shown', async () => {
      await comingSoonModule.expectMovieVisible('Varanasi (film)');
    });
  });

  test('CMS-013 — Case-insensitive search @P1 @Regression', async ({ comingSoonModule }) => {
    await test.step('open Coming Soon and search an uppercase keyword ("VARANASI")', async () => {
      await comingSoonModule.gotoComingSoon();
      await comingSoonModule.search('VARANASI');
    });

    await test.step('the matching movie is shown regardless of case', async () => {
      await comingSoonModule.expectMovieVisible('Varanasi (film)');
    });
  });

  // Grounded 2026-09-01: a real, distinct "Movies Not Found!" heading — unlike Curated Shows,
  // which collapses a no-match search to its generic top-level empty state.
  test('CMS-014 — No-result search UI @P1 @Regression', async ({ comingSoonModule }) => {
    await test.step('open Coming Soon', async () => {
      await comingSoonModule.gotoComingSoon();
    });

    await test.step('searching a non-matching keyword shows the real "Movies Not Found!" state', async () => {
      await comingSoonModule.searchWithNoMatchAndExpectNoResultsUi('zzzznotamovie');
    });
  });

  // Grounded 2026-09-01: a real native alert() fires on mic click when permission is denied —
  // note the exact wording differs slightly from CuratedShowsModule's own denied-mic alert.
  test('CMS-016 — Mic permission error shows a real alert @P1 @Regression', async ({ comingSoonModule }) => {
    await test.step('force microphone permission to denied', async () => {
      await comingSoonModule.forceMicrophonePermissionDenied();
    });

    await test.step('open Coming Soon', async () => {
      await comingSoonModule.gotoComingSoon();
    });

    await test.step('tapping the mic icon fires the real denied-permission alert', async () => {
      await comingSoonModule.expectMicDeniedAlertShown();
    });
  });

  test('CMS-017 — Genre filter chips render in alphabetical order @P2 @Regression', async ({ comingSoonModule }) => {
    await test.step('open Coming Soon', async () => {
      await comingSoonModule.gotoComingSoon();
    });

    await test.step('the genre chips are already alphabetically ordered', async () => {
      await comingSoonModule.expectGenreChipsAlphabetical(['Action', 'Adventure', 'Animation', 'Crime', 'Musical', 'Science Fiction', 'Thriller']);
    });
  });

  test('CMS-018 — Genre filter shows correct results @P0 @Regression', async ({ comingSoonModule }) => {
    await test.step('open Coming Soon and select the "Musical" genre chip', async () => {
      await comingSoonModule.gotoComingSoon();
      await comingSoonModule.selectGenreChip('Musical');
    });

    await test.step('only the matching movie is shown', async () => {
      await comingSoonModule.expectMovieVisible('Varanasi (film)');
      await comingSoonModule.expectMovieHidden('King (2026 film)');
    });
  });

  // Grounded 2026-09-01: language has no quick-chip equivalent on the main bar — the "Filter By"
  // modal's Language tab is the real mechanism for this.
  test('CMS-019 — Language filter shows correct results @P0 @Regression', async ({ comingSoonModule }) => {
    await test.step('open Coming Soon and apply the "Hindi" language filter via the "Filter By" modal', async () => {
      await comingSoonModule.gotoComingSoon();
      await comingSoonModule.applyLanguageFilter('Hindi');
    });

    await test.step('a Hindi movie is shown', async () => {
      await comingSoonModule.expectMovieVisible('Varanasi (film)');
    });
  });

  // Grounded 2026-09-01: selecting "Musical" + "Hindi" together via the modal correctly narrows
  // the listing to the one movie matching both.
  test('CMS-020 — Multiple filters (genre + language) combine correctly @P1 @Regression', async ({ comingSoonModule }) => {
    await test.step('open Coming Soon and apply "Musical" + "Hindi" together via the "Filter By" modal', async () => {
      await comingSoonModule.gotoComingSoon();
      await comingSoonModule.applyGenreAndLanguageFilter('Musical', 'Hindi');
    });

    await test.step('only the movie matching both filters is shown', async () => {
      await comingSoonModule.expectMovieVisible('Varanasi (film)');
      await comingSoonModule.expectMovieHidden('King (2026 film)');
    });
  });

  test('CMS-021 — Movies sorted ascending by release date @P1 @Regression', async ({ comingSoonModule }) => {
    await test.step('open Coming Soon', async () => {
      await comingSoonModule.gotoComingSoon();
    });

    await test.step('the earlier week (39) renders before the later week (52)', async () => {
      await comingSoonModule.expectDefaultListingShowsFullYear();
    });
  });

  // Grounded 2026-09-01: real finding, contradicts the sheet — 3 independent fresh-context loads
  // all rendered the same-date Week 52 movies in the exact same order, never shuffled.
  test('CMS-022 — Same-date movies render in a stable order (documented real behavior) @P2 @Regression', async ({ comingSoonModule }) => {
    await test.step('open Coming Soon', async () => {
      await comingSoonModule.gotoComingSoon();
    });

    await test.step('the four same-date (26 Dec) movies are all present, in the real stable order', async () => {
      await comingSoonModule.expectMovieVisible('Varanasi (film)');
      await comingSoonModule.expectMovieVisible('King (2026 film)');
      await comingSoonModule.expectMovieVisible('MISSION: IMPOSSIBLE - THE FINAL RECKONING');
      await comingSoonModule.expectMovieVisible('PROJECT HAIL MARY');
    });
  });

  test('CMS-023 — Movie card UI elements (poster/name/genre/language) visible @P0 @Regression', async ({ comingSoonModule }) => {
    await test.step('open Coming Soon', async () => {
      await comingSoonModule.gotoComingSoon();
    });

    await test.step('the movie card shows its poster, name, genre, and language', async () => {
      await comingSoonModule.expectMovieCardMetadataVisible('Varanasi (film)', 'Musical', 'Hindi');
    });
  });

  // Grounded 2026-09-01: "Jana Nayagan" currently has no uploaded poster live and shows the real
  // fallback graphic instead — see ComingSoonPage.ts's class doc comment for the live-data-drift
  // caveat if this changes.
  test('CMS-024 — Image fallback placeholder shown when no poster exists @P1 @Regression', async ({ comingSoonModule }) => {
    await test.step('open Coming Soon', async () => {
      await comingSoonModule.gotoComingSoon();
    });

    await test.step('the poster-less movie shows its real fallback graphic', async () => {
      await comingSoonModule.expectImageFallbackVisible('Jana Nayagan');
    });
  });

  test('CMS-025 — Tapping a movie card opens its detail page @P0 @Regression', async ({ comingSoonModule }) => {
    await test.step('open Coming Soon', async () => {
      await comingSoonModule.gotoComingSoon();
    });

    await test.step('tapping the movie card navigates to a real detail page', async () => {
      await comingSoonModule.openMovieDetail('Varanasi (film)');
    });
  });

  test.fixme(
    'CMS-026 — Hover autoplay plays the trailer @P1 @Regression — BLOCKED: grounded 2026-09-01 — hovering all 5 currently-listed movie cards (real posters and the placeholder-fallback one alike) for 8+ seconds each never rendered a <video>/<iframe> anywhere in the card subtree. Trailer playback is real, but only exists on the movie DETAIL page (a "Watch Trailer" button + a "Trailers" section, confirmed live after navigating) — the same "no trailer on the listing card" finding curated-shows.md documents for its own listing.',
    () => {},
  );

  test.fixme(
    'CMS-027 — Latest trailer plays when multiple exist @P1 @Regression — BLOCKED: same reason as CMS-026 — there is no hover-trailer feature on the listing card at all, so there is nothing real to test "latest" selection against.',
    () => {},
  );

  test.fixme(
    'CMS-028 — Poster-only fallback when no trailer exists @P1 @Regression — BLOCKED: same reason as CMS-026 — with no hover-trailer feature on this card, there is no real fallback behavior to verify (the card always shows its poster/placeholder regardless, already covered by CMS-024).',
    () => {},
  );

  // Grounded 2026-09-01: reinterpreted from a literal list-card check — the real "Set Alert"
  // button only exists on the movie DETAIL page, not the Coming Soon listing card itself (no
  // "Alert" text/button anywhere in a full card-DOM dump). Visible even as a guest.
  test('CMS-029 — "Set Alert" CTA visible when no alert exists (on the movie detail page) @P0 @Regression', async ({ comingSoonModule }) => {
    await test.step('open Coming Soon and navigate to a movie detail page', async () => {
      await comingSoonModule.gotoComingSoon();
      await comingSoonModule.openMovieDetail('Varanasi (film)');
    });

    await test.step('the "Set Alert" CTA is visible', async () => {
      await comingSoonModule.expectSetAlertVisibleOnDetailPage();
    });
  });

  // Re-attempted 2026-09-07: the Set/Update/Delete Alert flow (requirements/movie-alerts.md) now
  // exists (MovieAlertsPage.ts/MovieAlertsModule.ts, grounded 2026-09-02), so the "already has an
  // alert" state is reachable for real — register a fresh user, save a real alert for a Coming
  // Soon movie via MovieAlertsModule, then verify the SAME detail page's CTA switches to "Delete
  // Alert", exactly where CMS-029 asserts the guest-visible "Set Alert" CTA.
  test('CMS-030 — "Delete Alert" CTA visible when an alert exists @P0 @Regression', async ({ movieAlertsModule, comingSoonModule }) => {
    const MOVIE = 'Varanasi (film)';
    const CINEMA_1 = 'INOX Megaplex, Inorbit Mall';
    const user: NewAlertUserDetails = {
      phone: DataGenerator.randomIndianPhoneNumber(),
      firstName: 'AlertCms030',
      email: DataGenerator.uniqueEmail('coming.soon.cms030'),
    };

    await test.step('log in as a new user and set a real alert for a Coming Soon movie', async () => {
      await movieAlertsModule.openSetAlertPanelAsNewUser(MOVIE, user);
      await movieAlertsModule.selectCinema(CINEMA_1);
      await movieAlertsModule.save();
      await movieAlertsModule.expectAlertCount(1);
    });

    await test.step('the movie detail page now shows "Delete Alert" instead of "Set Alert"', async () => {
      await comingSoonModule.expectDeleteAlertVisibleOnDetailPage();
    });
  });
});
