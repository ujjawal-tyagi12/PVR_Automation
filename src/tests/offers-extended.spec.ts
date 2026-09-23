import { test, expect } from '@fixtures/index';
import { GROUNDED_OFFER_TITLE } from '@modules/OffersModule';

/**
 * Ticket: requirements/offers.md — P1/P2 subset (OFR-012..088 range, excluding the P0s already
 * covered in offers.spec.ts). Split into a second file to keep offers.spec.ts within this
 * repo's file-length guidance rather than growing a single 76-scenario spec.
 *
 * Grounded 2026-08-31 against UAT (inox-uat-web.pvrinox.com) — see OffersPage.ts/OffersModule.ts
 * and HomeScreenPage.ts/HomeScreenModule.ts doc comments for individual findings. No "Others"
 * tab exists in the real UI. The entire Retail Offers voucher flow (OFR-045..076) was removed
 * from scope 2026-09-01 — confirmed via two real paths (Food → Order Anytime, and the
 * booking-flow "Offers For You" upsell) that no voucher-activation/QR feature exists on UAT;
 * see requirements/offers.md Out of scope and offers.spec.ts OFR-043 for the full finding.
 *
 * Re-grounded 2026-09-07 (OFR-034/035/036 un-fixme pass): OFR-034 and OFR-036 are now real,
 * using a movie/candidate-hopping approach — see MovieDetailsModule.openMovieWithAlsoPlayingOfferChip
 * / EventDetailsModule.openEventWithAlsoPlayingOfferChip doc comments — because the Also Playing
 * offer chip is confirmed genuinely data-driven and volatile (which movie/candidate, and which
 * load of it). OFR-035 stays `test.fixme`: re-confirmed live that the Events screen itself
 * (homepage carousel and the `/events` route) is genuinely absent right now — the same
 * regression already tracked by event-listing.spec.ts/home-screen.spec.ts — so there is no
 * Events screen left to place a chip on at all (OFR-036 reaches Event Details a different way,
 * via the still-working id-driven catalog route, not through the missing listing).
 */
test.describe('Offers — extended (P1/P2) @RUN6', () => {

  // Re-grounded 2026-09-07: reachable via a real, successful API response mocked to an empty
  // `data` array (see OffersModule.ts) rather than needing a genuine no-offers city — the same
  // "No Offers Available" UI renders for this real-empty case as for OFR-016's network-failure
  // case.
  test('OFR-013 — Verify Offers section hidden when no offers available @P1 @Regression', async ({ offersModule }) => {
    await test.step('a real, successful response with zero offers renders the "No Offers Available" message', async () => {
      await offersModule.gotoOffersWithEmptyDataAndExpectNoOffersMessage();
    });
  });

  test('OFR-017 — Verify incorrect/manipulated Offer URL handling @P1 @Regression (adapted: real behavior is a generic fallback card, not an "error page")', async ({ offersModule }) => {
    await test.step('an invalid offer id renders a graceful fallback, not a crash', async () => {
      await offersModule.gotoOfferDetailAndExpectFallbackNoCrash('9999999999');
    });
  });

  test('OFR-018 — Verify tapping Share without internet @P1 @Regression (adapted: real backend/analytics-unreachable state via route blocking — a full `context.setOffline()` left the Share button unresolvable, see OffersModule doc comment)', async ({ offersModule }) => {
    await offersModule.gotoOfferDetail();

    await test.step('Share still works and produces a valid message with an intact offer URL', async () => {
      const call = await offersModule.shareOfferWithBackendUnreachableAndCaptureCall();
      expect(call?.text?.length ?? 0).toBeGreaterThan(0);
      expect(call?.text).toContain('/more/offers/');
    });
  });




  test('OFR-026 — Verify behavior with very long offer title @P1 @Regression (adapted: asserted via the real CSS truncation class rather than an admin-configured long title)', async ({ offersModule }) => {
    await offersModule.gotoOffers();

    await test.step('grounded offer title carries the site\'s line-clamp truncation styling', async () => {
      await offersModule.expectOfferTitleHasTruncationStyling(GROUNDED_OFFER_TITLE);
    });
  });

  test('OFR-027 — Verify switching tabs quickly @P1 @Regression', async ({ offersModule }) => {
    await offersModule.gotoOffers();

    await test.step('four rapid tab switches leave the listing stable with offers still showing', async () => {
      await offersModule.rapidlySwitchTabsAndExpectStableListing();
    });
  });

  test('OFR-025 — Verify UI when offer banner image fails to load @P1 @Regression (grounded: real fallback image asset, `fallback-offer-card.png`)', async ({ offersModule }) => {
    await offersModule.gotoOffers();

    await test.step('blocked banner requests still resolve to a valid image, no broken layout', async () => {
      await offersModule.blockOfferBannerImagesAndExpectFallbackRendered();
    });
  });


  test('OFR-033 — Verify offer chip below "Now Showing" movies on home @P1 @Regression (adapted: real behavior navigates to the movie\'s detail page, not a bottom sheet — see HomeScreenPage doc comment)', async ({ homeScreenModule }) => {
    await homeScreenModule.gotoHomepage();

    await test.step('tapping the discount chip navigates straight to the movie detail/booking page', async () => {
      await homeScreenModule.clickMovieCardDiscountChipAndExpectMovieDetailNavigation();
    });
  });

  test('OFR-034 — Verify Offers chip on Movie Details "Also playing" section @P1 @Regression (adapted: this offer badge is data-driven per movie/session, not guaranteed present — hops through several Now Showing movies/reloads until one carries it, see MovieDetailsModule doc comment)', async ({ movieDetailsModule }) => {
    let found = false;

    await test.step('hop through Now Showing movies until one\'s Also Playing section carries an offer chip', async () => {
      found = await movieDetailsModule.openMovieWithAlsoPlayingOfferChip();
    });
    test.skip(!found, 'no currently-live movie\'s Also Playing section carried an offer chip within this run\'s hop/reload budget — confirmed data-driven volatility, see MovieDetailsModule doc comment');

    await test.step('the offer chip is visible in Also Playing', async () => {
      await movieDetailsModule.expectAlsoPlayingOfferChipVisible();
    });
  });

  test.fixme('OFR-035 — Verify Offers chip on Events screen @P1 @Regression — BLOCKED: re-confirmed live 2026-09-07 — the Events screen itself (homepage carousel AND the /events route) is genuinely absent right now, the same regression already tracked by event-listing.spec.ts (EL-001/008/013) and home-screen.spec.ts (HOME-019/035/036/054) — there is no Events screen anywhere in the live UI to place or verify an offers chip on. Re-derive once Events ships again (see EventDetailsModule.ts doc comment for the still-working id-driven Event Details workaround, which OFR-036 below uses instead).', () => {});

  test('OFR-036 — Verify Offers chip on Event Details "Also playing" section @P1 @Regression (adapted: Events listing is confirmed absent, so this reaches Event Details via the id-driven catalog-probing route EventDetailsModule already established; offer badge is data-driven per candidate/session — see EventDetailsModule doc comment)', async ({ eventDetailsModule }) => {
    // Grounded 2026-09-07: candidate probing (API probe + up to 2 navigation attempts per live
    // id, each waiting up to 15s for showtimes) is the same inherently slow shape
    // event-details.spec.ts already flags with its own describe-level `test.slow()` — an
    // isolated run hit the default 60s test timeout mid-probe. `test.slow()` here (3x budget)
    // covers it without slowing down this file's other, cheaper tests.
    test.slow();
    let found = false;

    await test.step('probe live catalog ids via the Event Details route until one\'s Also Playing section carries an offer chip', async () => {
      found = await eventDetailsModule.openEventWithAlsoPlayingOfferChip();
    });
    test.skip(!found, 'no currently-live candidate\'s Also Playing section carried an offer chip within this run\'s probe budget — confirmed data-driven volatility, see EventDetailsModule doc comment');

    await test.step('the offer chip is visible in Also Playing', async () => {
      await eventDetailsModule.expectAlsoPlayingOfferChipVisible();
    });
  });

  test.fixme('OFR-037 — Verify Offers chip on Curated Shows screen @P1 @Regression — BLOCKED: Curated Shows is empty on UAT for Mumbai-All (see requirements/curated-shows.md), so no category/movie content exists to carry a chip.', () => {});

  test('OFR-039 — Verify offer tabs shown only when category data exists from showbizz @P1 @Regression', async ({ offersModule }) => {
    await offersModule.gotoOffers();

    await test.step('exactly the four live categories render, no extra/placeholder tabs', async () => {
      await offersModule.expectCategoryTabsVisible();
    });
  });

  test('OFR-040 — Verify navigating away from Offers screen @P1 @Regression (adapted: no back button exists on this page — confirmed with the user 2026-09-01 — the real way off it is the header "Home" nav link)', async ({ offersModule }) => {
    await offersModule.gotoOffers();

    await test.step('clicking Home navigates back to the homepage', async () => {
      await offersModule.clickHomeNavAndExpectHomepageNavigation();
    });
  });

  test('OFR-041 — Verify promoted offers visible on Food screen @P1 @Regression (adapted: requires the "Order Anytime" tab — the default "Book with Ticket" tab shows none)', async ({ offersModule }) => {
    await offersModule.gotoFoodOrderAnytime();

    await test.step('promoted offers render under Order Anytime', async () => {
      await offersModule.expectPromotedOffersVisibleOnFood();
    });
  });

  test('OFR-042 — Verify tapping an offer from Food screen @P1 @Regression', async ({ offersModule }) => {
    await offersModule.gotoFoodOrderAnytime();

    await test.step('tapping the first offer opens its detail page', async () => {
      await offersModule.openFirstFoodOfferAndExpectDetail();
    });
  });
});
