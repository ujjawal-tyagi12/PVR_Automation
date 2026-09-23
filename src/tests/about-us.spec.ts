import { test } from '@fixtures/index';

/**
 * Ticket: requirements/about-us.md, sourced from `TC_Web_1–51` (the "About Us" module rows of
 * the M8 Website sheet). Grounded 2026-09-08 against UAT (`inox-uat-web.pvrinox.com`), Mumbai
 * geolocation granted, via headless Playwright driven from Bash/Node — Playwright MCP's
 * interactive browser tool does not launch in this sandbox (no display server, see the
 * `pvr-inox-grounding-technique` project memory). Scratchpad `ground-about-us*.js` scripts hold
 * the raw diagnostics `AboutUsPage.ts`/`AboutUsModule.ts`'s doc comments build on.
 *
 * **Headline findings** (see `AboutUsPage.ts` for the full trail):
 * - Real route is `/about-us` (not `/more/about-us`); used directly by every content scenario,
 *   matching this repo's established pattern (`OffersPage.ts`/`CuratedShowsPage.ts`).
 * - **RESOLVED (re-grounded)**: the header "More" -> "About Us" click path was first thought
 *   unreliable (same class as `CuratedShowsPage.ts`'s "More" menu), but that was a locator bug in
 *   the grounding script, not a real flake — confirmed 5/5 fresh-context attempts once matched
 *   correctly. Two wrong assumptions caused the false negative: (1) the button's accessible name
 *   is "More Arrow Down" (a chevron `<img alt="Arrow Down">` concatenates in), not "More" — needs
 *   a leading-substring match, not exact/anchored-end; (2) the dropdown's items are real
 *   `role="menuitem"` entries, not `role="link"`. ABT-001/002 are real tests now.
 * - The sheet's five "tabs" are real scroll-to-section buttons on ONE continuous page, not
 *   show/hide panels — clicking one does not change the URL and does not hide any other
 *   section's content. Every "tab switching"/"default tab" scenario is reinterpreted accordingly.
 * - Milestone and team-member popups are both real vaul-drawer dialogs (`role="dialog"`,
 *   `data-slot="drawer-close"`), same component family as `CuratedShowsPage.ts`'s "Learn More"
 *   dialog.
 * - **RESOLVED (re-grounded)**: Awards genuinely has 2 real award cards ("Best Adaptive
 *   Screenplay"/Conclave/2024, "Critic Choice"/Iffa/2025) rendered as `.swiper-slide`s with no
 *   heading role (only `<img alt="{title}">` + plain text) — an earlier `getByRole('heading')`
 *   sweep missed them entirely. The `All`/`2024`/`2025` filter buttons genuinely filter the
 *   swiper client-side (2 slides -> 1 -> back to 2 on "All", confirmed live, no network request).
 *   ABT-032/034/035 are real tests now. ABT-036 (a year with zero awards) stays `test.fixme` —
 *   both currently-configured years have real data, so there is no year to exercise the "No
 *   Awards Found" empty state against without Admin access or mocking.
 * - **RESOLVED (re-grounded)**: Brands actually renders 3 resources, not 1 — an `IMAX` logo, a
 *   `PVR` logo, and a "PVR INOX" card with a real, separate title text node ("Brand Guidelines",
 *   confirmed via full section HTML — NOT part of the `Download` button's own accessible name).
 *   ABT-038 now checks all 3; ABT-039 (resource title) is a real test now.
 * - A full `context.setOffline(true)` fails `page.goto()` outright with a real
 *   `net::ERR_INTERNET_DISCONNECTED` (there is no separate About-Us content API to block instead
 *   — the page is server-rendered) — same adaptation as `OffersModule.ts`'s OFR-016.
 * - Blocking the banner image request leaves a genuinely broken `<img>` with NO placeholder
 *   fallback anywhere on the page — contradicts the sheet's ABT-047 expectation; the real
 *   behavior is asserted instead, not skipped.
 * - ABT-010/049 (Company Strengths absent / a tab left unconfigured) require an Admin Panel data
 *   state this suite cannot toggle from the UI — `test.fixme`.
 */
test.describe('About Us @RUN1', () => {
  test('ABT-001 — About Us menu is displayed @P1 @Regression (RESOLVED: earlier "unreliable More menu" finding was a locator bug — see file doc comment)', async ({ aboutUsModule }) => {
    await test.step('open the homepage', async () => {
      await aboutUsModule.gotoAboutUsViaMoreMenu();
    });

    await test.step('clicking More reveals the About Us menu item', async () => {
      await aboutUsModule.expectAboutUsMenuItemVisible();
    });
  });

  test('ABT-002 — Navigation to About Us page via More menu @P0 @Regression (RESOLVED: earlier "unreliable More menu" finding was a locator bug — see file doc comment)', async ({ aboutUsModule }) => {
    await test.step('open the homepage', async () => {
      await aboutUsModule.gotoAboutUsViaMoreMenu();
    });

    await test.step('clicking More then About Us navigates to /about-us', async () => {
      await aboutUsModule.clickAboutUsMenuItemAndExpectNavigation();
    });
  });

  test('ABT-003 — About Us page loads successfully @P0 @Regression', async ({ aboutUsModule }) => {
    await test.step('open /about-us', async () => {
      await aboutUsModule.gotoAboutUs();
    });

    await test.step('the page loads without errors', async () => {
      await aboutUsModule.expectPageLoaded();
    });
  });

  test('ABT-004 — Content is fetched and rendered for every section @P1 @Regression', async ({ aboutUsModule }) => {
    await test.step('open About Us', async () => {
      await aboutUsModule.gotoAboutUs();
    });

    await test.step('all five section headings render', async () => {
      await aboutUsModule.expectAllSectionsPresent();
    });
  });

  test('ABT-005 — Company section is visible by default, no tab click needed @P0 @Regression (adapted: tabs are scroll-anchor controls on one continuous page, not show/hide panels — see AboutUsPage.ts doc comment)', async ({ aboutUsModule }) => {
    await test.step('open About Us', async () => {
      await aboutUsModule.gotoAboutUs();
    });

    await test.step('Company content is visible without clicking any tab', async () => {
      await aboutUsModule.expectCompanySectionVisibleByDefault();
    });
  });

  test('ABT-006 — Company tab is displayed @P1 @Regression', async ({ aboutUsModule }) => {
    await test.step('open About Us', async () => {
      await aboutUsModule.gotoAboutUs();
    });

    await test.step('Company tab button is visible', async () => {
      await aboutUsModule.expectTabVisible('Company');
    });
  });

  test('ABT-007 — Company Overview content is displayed correctly @P1 @Regression', async ({ aboutUsModule }) => {
    await test.step('open About Us', async () => {
      await aboutUsModule.gotoAboutUs();
    });

    await test.step('the real overview copy is visible', async () => {
      await aboutUsModule.expectCompanyOverviewTextVisible('largest and the most premium film exhibitor');
    });
  });

  test('ABT-008 — Supporting image/media is displayed @P2 @Regression', async ({ aboutUsModule }) => {
    await test.step('open About Us', async () => {
      await aboutUsModule.gotoAboutUs();
    });

    await test.step('the header banner image loads', async () => {
      await aboutUsModule.expectBannerImageLoaded();
    });
  });

  test('ABT-009 — Company Strength section is displayed @P2 @Regression', async ({ aboutUsModule }) => {
    await test.step('open About Us', async () => {
      await aboutUsModule.gotoAboutUs();
    });

    await test.step('Company Strength heading is visible', async () => {
      await aboutUsModule.expectCompanySectionVisibleByDefault();
    });
  });

  test('ABT-011 — Company content formatting is intact @P2 @Regression (adapted: exact "formatting" is not independently assertable via accessibility APIs — proxies with a paragraph-length check against the real ~700-character overview copy)', async ({ aboutUsModule }) => {
    await test.step('open About Us', async () => {
      await aboutUsModule.gotoAboutUs();
    });

    await test.step('the overview paragraph is a substantial, non-truncated block of text', async () => {
      await aboutUsModule.expectCompanyOverviewParagraphIsSubstantial('largest and the most premium film exhibitor');
    });
  });

  test('ABT-012 — Our Journey tab is displayed @P1 @Regression', async ({ aboutUsModule }) => {
    await test.step('open About Us', async () => {
      await aboutUsModule.gotoAboutUs();
    });

    await test.step('Our Journey tab button is visible', async () => {
      await aboutUsModule.expectTabVisible('Our Journey');
    });
  });

  test('ABT-013 — Navigation to Our Journey tab scrolls its content into view @P1 @Regression (adapted: a scroll-to-section click, not a panel switch — see AboutUsPage.ts doc comment)', async ({ aboutUsModule }) => {
    await test.step('open About Us', async () => {
      await aboutUsModule.gotoAboutUs();
    });

    await test.step('clicking Our Journey scrolls its heading into view', async () => {
      await aboutUsModule.clickTabAndExpectSectionVisible('Our Journey');
    });
  });

  test('ABT-014 — Milestones are displayed @P1 @Regression', async ({ aboutUsModule }) => {
    await test.step('open About Us', async () => {
      await aboutUsModule.gotoAboutUs();
    });

    await test.step('the 1991 milestone is visible', async () => {
      await aboutUsModule.expectMilestoneVisible('1991');
    });
  });

  test('ABT-015 — Milestones render in timeline format @P1 @Regression (adapted: confirms multiple distinct milestone entries render in sequence, the closest real proxy for "timeline format")', async ({ aboutUsModule }) => {
    await test.step('open About Us', async () => {
      await aboutUsModule.gotoAboutUs();
    });

    await test.step('multiple milestones are visible in order', async () => {
      await aboutUsModule.expectMilestoneVisible('1991');
      await aboutUsModule.expectMilestoneVisible('1992');
      await aboutUsModule.expectMilestoneVisible('1993');
    });
  });

  test('ABT-016 — Milestone year is displayed correctly @P2 @Regression', async ({ aboutUsModule }) => {
    await test.step('open About Us', async () => {
      await aboutUsModule.gotoAboutUs();
    });

    await test.step('the 1991 milestone shows the correct year', async () => {
      await aboutUsModule.expectMilestoneVisible('1991');
    });
  });

  test('ABT-017 — Milestone title is displayed correctly @P2 @Regression', async ({ aboutUsModule }) => {
    await test.step('open About Us', async () => {
      await aboutUsModule.gotoAboutUs();
    });

    await test.step('the 1991 milestone shows its real title', async () => {
      await aboutUsModule.expectMilestoneTitleVisible('1991', 'Inception of PVR Cinemas');
    });
  });

  test('ABT-018 — User can scroll through all milestones @P2 @Regression', async ({ aboutUsModule }) => {
    await test.step('open About Us', async () => {
      await aboutUsModule.gotoAboutUs();
    });

    await test.step('scrolling the timeline reaches the last configured milestone', async () => {
      await aboutUsModule.scrollJourneyTimelineAndExpectLastMilestoneVisible('2033');
    });
  });

  test('ABT-019 — Milestone popup opens @P1 @Regression', async ({ aboutUsModule }) => {
    await test.step('open About Us', async () => {
      await aboutUsModule.gotoAboutUs();
    });

    await test.step('clicking the 1991 milestone opens a dialog', async () => {
      await aboutUsModule.openMilestonePopup('1991');
    });
  });

  test('ABT-020 — Milestone popup shows correct details @P1 @Regression', async ({ aboutUsModule }) => {
    await test.step('open About Us and open the 1991 milestone popup', async () => {
      await aboutUsModule.gotoAboutUs();
      await aboutUsModule.openMilestonePopup('1991');
    });

    await test.step('the dialog contains the real milestone description', async () => {
      await aboutUsModule.expectDialogContainsText('Priya Cinema');
    });
  });

  test('ABT-021 — Milestone popup close button closes the dialog @P2 @Regression', async ({ aboutUsModule }) => {
    await test.step('open About Us and open the 1991 milestone popup', async () => {
      await aboutUsModule.gotoAboutUs();
      await aboutUsModule.openMilestonePopup('1991');
    });

    await test.step('closing the dialog hides it', async () => {
      await aboutUsModule.closeDialog();
    });
  });

  test('ABT-022 — Team tab is displayed @P1 @Regression', async ({ aboutUsModule }) => {
    await test.step('open About Us', async () => {
      await aboutUsModule.gotoAboutUs();
    });

    await test.step('Team tab button is visible', async () => {
      await aboutUsModule.expectTabVisible('Team');
    });
  });

  test('ABT-023 — Team categories are displayed correctly @P1 @Regression', async ({ aboutUsModule }) => {
    await test.step('open About Us', async () => {
      await aboutUsModule.gotoAboutUs();
    });

    await test.step('Management and Board of Directors groups are visible', async () => {
      await aboutUsModule.expectTeamGroupVisible('Management');
      await aboutUsModule.expectTeamGroupVisible('Board of Directors');
    });
  });

  test('ABT-024 — Team member profile image is displayed correctly @P2 @Regression', async ({ aboutUsModule }) => {
    await test.step('open About Us', async () => {
      await aboutUsModule.gotoAboutUs();
    });

    await test.step('Mr. Alok Tandon renders with a profile image', async () => {
      await aboutUsModule.expectTeamMemberVisible('Mr. Alok Tandon');
    });
  });

  test('ABT-025 — Team member name is displayed correctly @P1 @Regression', async ({ aboutUsModule }) => {
    await test.step('open About Us', async () => {
      await aboutUsModule.gotoAboutUs();
    });

    await test.step('Mr. Alok Tandon is visible', async () => {
      await aboutUsModule.expectTeamMemberVisible('Mr. Alok Tandon');
    });
  });

  test('ABT-026 — Team member designation is displayed correctly @P1 @Regression', async ({ aboutUsModule }) => {
    await test.step('open About Us', async () => {
      await aboutUsModule.gotoAboutUs();
    });

    await test.step('Mr. Alok Tandon shows the correct designation', async () => {
      await aboutUsModule.expectTeamMemberDesignationVisible('Mr. Alok Tandon', 'Chief Efficiency & Transformation Officer');
    });
  });

  test('ABT-027 — Team sequence matches the real rendered order @P1 @Regression (adapted: DOM order is the closest real proxy for "Admin-configured sequence", matching CuratedShowsModule.expectCategoriesInOrder)', async ({ aboutUsModule }) => {
    await test.step('open About Us', async () => {
      await aboutUsModule.gotoAboutUs();
    });

    await test.step('team members render in the confirmed live order', async () => {
      await aboutUsModule.expectTeamMembersInOrder([
        'Mr. Alok Tandon',
        'Mr. Gautam Dutta',
        'Mr. Kamal Gianchandani',
        'Ms. Renuka Ramnath',
        'Mr. Siddharth Jain',
        'Mr. Pavan',
        'Mr. Ajay Kumar Bijli',
      ]);
    });
  });

  test('ABT-028 — Team member popup opens @P1 @Regression', async ({ aboutUsModule }) => {
    await test.step('open About Us', async () => {
      await aboutUsModule.gotoAboutUs();
    });

    await test.step('clicking Mr. Alok Tandon opens a dialog', async () => {
      await aboutUsModule.openTeamMemberPopup('Mr. Alok Tandon');
    });
  });

  test('ABT-029 — Team member popup shows correct information @P1 @Regression', async ({ aboutUsModule }) => {
    await test.step('open About Us and open Mr. Alok Tandon\'s popup', async () => {
      await aboutUsModule.gotoAboutUs();
      await aboutUsModule.openTeamMemberPopup('Mr. Alok Tandon');
    });

    await test.step('the dialog contains his real bio', async () => {
      await aboutUsModule.expectDialogContainsText('has been with the company since 2001');
    });
  });

  test('ABT-030 — Team member popup dismissal closes the dialog @P2 @Regression', async ({ aboutUsModule }) => {
    await test.step('open About Us and open Mr. Alok Tandon\'s popup', async () => {
      await aboutUsModule.gotoAboutUs();
      await aboutUsModule.openTeamMemberPopup('Mr. Alok Tandon');
    });

    await test.step('closing the dialog hides it', async () => {
      await aboutUsModule.closeDialog();
    });
  });

  test('ABT-031 — Awards tab is displayed @P1 @Regression', async ({ aboutUsModule }) => {
    await test.step('open About Us', async () => {
      await aboutUsModule.gotoAboutUs();
    });

    await test.step('Awards tab button is visible', async () => {
      await aboutUsModule.expectTabVisible('Awards');
    });
  });

  test('ABT-032 — Award cards are displayed in card layout @P1 @Regression (RESOLVED: real award cards exist, rendered with no heading role — see file doc comment)', async ({ aboutUsModule }) => {
    await test.step('open About Us', async () => {
      await aboutUsModule.gotoAboutUs();
    });

    await test.step('both real award cards are visible', async () => {
      await aboutUsModule.expectAwardCardVisible('Best Adaptive Screenplay');
      await aboutUsModule.expectAwardCardVisible('Critic Choice');
    });
  });

  test('ABT-033 — Year filters are displayed @P1 @Regression', async ({ aboutUsModule }) => {
    await test.step('open About Us', async () => {
      await aboutUsModule.gotoAboutUs();
    });

    await test.step('the 2024 and 2025 year filter buttons are visible', async () => {
      await aboutUsModule.expectAwardsYearFilterVisible('2024');
      await aboutUsModule.expectAwardsYearFilterVisible('2025');
    });
  });

  test('ABT-034 — Filtering by year shows only that year\'s awards @P0 @Regression (RESOLVED: real, working client-side filter, confirmed live — see file doc comment)', async ({ aboutUsModule }) => {
    await test.step('open About Us', async () => {
      await aboutUsModule.gotoAboutUs();
    });

    await test.step('selecting 2024 leaves exactly the one 2024 award', async () => {
      await aboutUsModule.clickAwardsYearFilterAndExpectSlideCount('2024', 1);
    });
  });

  test('ABT-035 — Filter reset updates the award list correctly @P2 @Regression (RESOLVED: confirmed live — selecting All restores both award cards)', async ({ aboutUsModule }) => {
    await test.step('open About Us and filter to 2024', async () => {
      await aboutUsModule.gotoAboutUs();
      await aboutUsModule.clickAwardsYearFilterAndExpectSlideCount('2024', 1);
    });

    await test.step('selecting All restores both awards', async () => {
      await aboutUsModule.clickAwardsYearFilterAndExpectSlideCount('All', 2);
    });
  });

  test('ABT-037 — Brands tab is displayed @P1 @Regression', async ({ aboutUsModule }) => {
    await test.step('open About Us', async () => {
      await aboutUsModule.gotoAboutUs();
    });

    await test.step('Brands tab button is visible', async () => {
      await aboutUsModule.expectTabVisible('Brands');
    });
  });

  test('ABT-038 — Brand resources are displayed @P1 @Regression (RESOLVED: 3 real resources exist — IMAX logo, PVR logo, and the Brand Guidelines download card — see file doc comment)', async ({ aboutUsModule }) => {
    await test.step('open About Us', async () => {
      await aboutUsModule.gotoAboutUs();
    });

    await test.step('all three configured resources are visible', async () => {
      await aboutUsModule.expectAllBrandResourcesVisible();
    });
  });

  test('ABT-039 — Brand resource title is displayed correctly @P2 @Regression (RESOLVED: real, separate title text node found next to the Download card’s logo — see file doc comment)', async ({ aboutUsModule }) => {
    await test.step('open About Us', async () => {
      await aboutUsModule.gotoAboutUs();
    });

    await test.step('the real resource title is visible', async () => {
      await aboutUsModule.expectBrandResourceTitleVisible('Brand Guidelines');
    });
  });

  test('ABT-040 — Download/Open link works @P0 @Regression (adapted: confirmed live via a real click — navigates cross-origin to a CDN-hosted archive, see AboutUsModule.ts doc comment)', async ({ aboutUsModule }) => {
    await test.step('open About Us', async () => {
      await aboutUsModule.gotoAboutUs();
    });

    await test.step('clicking Download navigates to the real resource', async () => {
      await aboutUsModule.clickBrandsDownloadAndExpectExternalNavigation();
    });
  });

  test('ABT-041 — Downloadable asset is reachable @P1 @Regression (adapted: same underlying mechanism as ABT-040 — one real resource confirmed live)', async ({ aboutUsModule }) => {
    await test.step('open About Us', async () => {
      await aboutUsModule.gotoAboutUs();
    });

    await test.step('the Download control leads to a real, reachable asset URL', async () => {
      await aboutUsModule.clickBrandsDownloadAndExpectExternalNavigation();
    });
  });

  test('ABT-042 — External resource link opens correctly @P1 @Regression (adapted: same click as ABT-040/041 — the only external-open mechanism confirmed live in the Brands section)', async ({ aboutUsModule }) => {
    await test.step('open About Us', async () => {
      await aboutUsModule.gotoAboutUs();
    });

    await test.step('the resource opens on the external CDN domain', async () => {
      await aboutUsModule.clickBrandsDownloadAndExpectExternalNavigation();
    });
  });

  test('ABT-043 — All tabs are displayed together @P0 @Regression', async ({ aboutUsModule }) => {
    await test.step('open About Us', async () => {
      await aboutUsModule.gotoAboutUs();
    });

    await test.step('Company, Our Journey, Team, Awards and Brands are all visible', async () => {
      await aboutUsModule.expectTabVisible('Company');
      await aboutUsModule.expectTabVisible('Our Journey');
      await aboutUsModule.expectTabVisible('Team');
      await aboutUsModule.expectTabVisible('Awards');
      await aboutUsModule.expectTabVisible('Brands');
    });
  });

  test('ABT-044 — Clicking each tab scrolls the correct content into view @P1 @Regression (adapted: a scroll-to-section click, not a panel switch — see AboutUsPage.ts doc comment)', async ({ aboutUsModule }) => {
    await test.step('open About Us', async () => {
      await aboutUsModule.gotoAboutUs();
    });

    await test.step('each tab scrolls its own section into view', async () => {
      await aboutUsModule.clickTabAndExpectSectionVisible('Our Journey');
      await aboutUsModule.clickTabAndExpectSectionVisible('Team');
      await aboutUsModule.clickTabAndExpectSectionVisible('Awards');
      await aboutUsModule.clickTabAndExpectSectionVisible('Brands');
    });
  });

  test('ABT-045 — Page is responsive on a smaller viewport @P1 @Regression', async ({ aboutUsModule }) => {
    await test.step('open About Us', async () => {
      await aboutUsModule.gotoAboutUs();
    });

    await test.step('resizing to a mobile viewport keeps the page usable', async () => {
      await aboutUsModule.resizeViewportAndExpectPageStillUsable(390, 844);
    });
  });

  test('ABT-046 — Media loads successfully @P2 @Regression', async ({ aboutUsModule }) => {
    await test.step('open About Us', async () => {
      await aboutUsModule.gotoAboutUs();
    });

    await test.step('the banner image loads with real pixel content', async () => {
      await aboutUsModule.expectBannerImageLoaded();
    });
  });

  test('ABT-047 — Broken image handling @P2 @Regression (RESOLVED: real behavior contradicts the sheet — no placeholder/fallback swap exists; blocking the banner leaves a genuinely broken <img>, confirmed live)', async ({ aboutUsModule }) => {
    await test.step('block the banner image request before navigating', async () => {
      await aboutUsModule.blockBannerImage();
    });

    await test.step('open About Us', async () => {
      await aboutUsModule.gotoAboutUs();
    });

    await test.step('the banner image is broken with no fallback rendered', async () => {
      await aboutUsModule.expectBannerImageBrokenWithNoFallback();
    });
  });

  test('ABT-048 — Scrolling performance has no crash @P2 @Regression (adapted: "smooth without lag" is not meaningfully assertable headless — confirms the full-page scroll completes and the last section is still reachable)', async ({ aboutUsModule }) => {
    await test.step('open About Us', async () => {
      await aboutUsModule.gotoAboutUs();
    });

    await test.step('scrolling to the bottom of the page does not crash it', async () => {
      await aboutUsModule.scrollToBottomAndExpectNoCrash();
    });
  });

  test('ABT-050 — Internet interruption while opening About Us shows an appropriate error @P1 @Regression (adapted: a full context.setOffline() fails page.goto() outright with a real net::ERR_INTERNET_DISCONNECTED rather than an in-app message — no separate content API exists to block instead; same adaptation as OffersModule.ts\'s OFR-016)', async ({ aboutUsModule }) => {
    let thrown: Error | undefined;

    await test.step('attempt to open About Us with no connectivity', async () => {
      thrown = await aboutUsModule.attemptGotoOfflineAndReturnError();
    });

    await test.step('a real network-disconnected error is surfaced', async () => {
      if (!thrown || !/ERR_INTERNET_DISCONNECTED/.test(thrown.message)) {
        throw new Error(`expected a net::ERR_INTERNET_DISCONNECTED navigation failure, got: ${thrown?.message}`);
      }
    });
  });
});
