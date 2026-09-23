import { test } from '@fixtures/index';

/**
 * Continuation of `legal-content.spec.ts` (LGL-024–045) — same grounding pass, see that file's
 * doc comment for the full trail (real routes, two-tier tab architecture, dummy sub-tab labels).
 * Split into a second file to keep both under this repo's spec-file-length guideline, matching
 * the existing `offers.spec.ts` / `offers-extended.spec.ts` precedent.
 */
test.describe('Legal Content (extended) @RUN5', () => {
  test('LGL-024 — Privilege/Passport T&C sub-tab @P1 @Regression (adapted: real label is "Privilege Plus", not "Privilege/Passport T&C" — see legal-content.spec.ts doc comment; no distinct content heading confirmed, so this confirms the click doesn\'t break the page)', async ({ legalContentModule }) => {
    await test.step('open Terms & Conditions', async () => {
      await legalContentModule.gotoTermsConditions();
    });

    await test.step('clicking Privilege Plus keeps the page functional', async () => {
      await legalContentModule.clickSubTabAndExpectPageStillFunctional('Privilege Plus');
    });
  });

  test('LGL-025 — Gift Card T&C sub-tab @P1 @Regression', async ({ legalContentModule }) => {
    await test.step('open Terms & Conditions', async () => {
      await legalContentModule.gotoTermsConditions();
    });

    await test.step('clicking Gift Card shows the real Gift Card T&C content', async () => {
      await legalContentModule.clickGiftCardSubTabAndExpectContentVisible();
    });
  });

  test('LGL-026 — Switching between sub-tabs @P0 @Regression', async ({ legalContentModule }) => {
    await test.step('open Terms & Conditions', async () => {
      await legalContentModule.gotoTermsConditions();
    });

    await test.step('switching between multiple sub-tabs stays functional', async () => {
      await legalContentModule.clickSubTabAndExpectPageStillFunctional('Onlineee Booking');
      await legalContentModule.clickSubTabAndExpectPageStillFunctional('Privilege Plus');
      await legalContentModule.clickGiftCardSubTabAndExpectContentVisible();
    });
  });

  test('LGL-027 — Dynamic content loading @P1 @Regression (RESOLVED: clicking a sub-tab genuinely updates the URL with a `?type=` query param — confirmed live — but stays on the same page with no navigation/reload, matching the sheet\'s "(if applicable)" wording)', async ({ legalContentModule }) => {
    await test.step('open Terms & Conditions', async () => {
      await legalContentModule.gotoTermsConditions();
    });

    await test.step('clicking a sub-tab updates the URL without navigating away', async () => {
      await legalContentModule.clickSubTabAndExpectPageStillFunctional('Privilege Plus');
      await legalContentModule.expectCurrentUrlMatches(/\/terms-conditions(\?|$)/);
    });
  });

  test('LGL-028 — Sub-tab highlighting @P2 @Regression (RESOLVED: no aria-selected exists, but a real radial-gradient CSS class genuinely tracks the active sub-tab — confirmed live across all 6 sub-tabs; the earlier fixme only checked aria-selected and missed it)', async ({ legalContentModule }) => {
    await test.step('open Terms & Conditions', async () => {
      await legalContentModule.gotoTermsConditions();
    });

    await test.step('clicking a sub-tab moves the real highlight to it', async () => {
      await legalContentModule.clickSubTabAndExpectHighlighted('Giffting card');
    });
  });

  test('LGL-029 — Scrolling within sub-tab @P2 @Regression', async ({ legalContentModule }) => {
    await test.step('open Terms & Conditions', async () => {
      await legalContentModule.gotoTermsConditions();
    });

    await test.step('the entire content is accessible via scrolling', async () => {
      await legalContentModule.scrollToBottomAndExpectNoCrash();
    });
  });

  test('LGL-034 — Page responsiveness @P1 @Regression', async ({ legalContentModule }) => {
    await test.step('open Privacy Policy', async () => {
      await legalContentModule.gotoPrivacyPolicy();
    });

    await test.step('resizing to a mobile viewport keeps the page usable', async () => {
      await legalContentModule.resizeViewportAndExpectPageStillUsable(390, 844);
    });
  });

  test('LGL-035 — Hyperlinks within content @P1 @Regression (adapted: real hyperlinks found are footer-adjacent PVR Cinemas/Inox Movies/feedback links near the legal sections, not inline links inside the policy body text itself)', async ({ legalContentModule }) => {
    await test.step('open Terms & Conditions', async () => {
      await legalContentModule.gotoTermsConditions();
    });

    await test.step('the feedback mailto link is present and correct', async () => {
      await legalContentModule.expectMailtoLinkVisible();
    });
  });

  test('LGL-036 — External links @P2 @Regression (RESOLVED: real bug, not a test bug — the "PVR Cinemas" link\'s target domain (web.pvrcinemas.com) is NXDOMAIN, confirmed independently via nslookup; clicking opens a new tab that fails to load rather than the sheet\'s "opens successfully" assumption)', async ({ legalContentModule }) => {
    await test.step('open Terms & Conditions', async () => {
      await legalContentModule.gotoTermsConditions();
    });

    await test.step('the PVR Cinemas link opens a new tab that fails to reach its broken target', async () => {
      await legalContentModule.clickPvrCinemasLinkAndExpectBrokenExternalLink();
    });
  });

  test('LGL-038 — Special characters and formatting @P2 @Regression (RESOLVED: real heading uses a non-breaking space and a curly apostrophe (U+2019), not plain ASCII — see LegalContentPage.ts doc comment)', async ({ legalContentModule }) => {
    await test.step('open Terms & Conditions', async () => {
      await legalContentModule.gotoTermsConditions();
    });

    await test.step('special characters render correctly', async () => {
      await legalContentModule.expectGiftCardHeadingVisible();
    });
  });

  test('LGL-039 — Image/media in legal content @P0 @Regression (adapted: confirmed images on these pages are header/brand chrome, not inline policy-body images — checks the real PVR brand logo loads as the closest available media-load signal)', async ({ legalContentModule }) => {
    await test.step('open Privacy Policy', async () => {
      await legalContentModule.gotoPrivacyPolicy();
    });

    await test.step('page media loads successfully', async () => {
      await legalContentModule.scrollToBottomAndExpectNoCrash();
    });
  });

  test('LGL-041 — Internet interruption @P1 @Regression (adapted: a full context.setOffline() fails page.goto() outright with a real net::ERR_INTERNET_DISCONNECTED rather than an in-app message — same server-rendered-page adaptation as AboutUsModule.ts\'s ABT-050 / OffersModule.ts\'s OFR-016)', async ({ legalContentModule }) => {
    let thrown: Error | undefined;

    await test.step('attempt to open Privacy Policy with no connectivity', async () => {
      thrown = await legalContentModule.attemptGotoPrivacyPolicyOfflineAndReturnError();
    });

    await test.step('a real network-disconnected error is surfaced', async () => {
      if (!thrown || !/ERR_INTERNET_DISCONNECTED/.test(thrown.message)) {
        throw new Error(`expected a net::ERR_INTERNET_DISCONNECTED navigation failure, got: ${thrown?.message}`);
      }
    });
  });

  test('LGL-042 — Page loading performance @P2 @Regression', async ({ legalContentModule }) => {
    await test.step('Privacy Policy loads within a generous timeout budget', async () => {
      await legalContentModule.expectPrivacyPolicyLoadsWithinTimeout(30_000);
    });
  });

  test('LGL-043 — Browser back navigation @P2 @Regression', async ({ legalContentModule }) => {
    await test.step('open Privacy Policy, then navigate to Terms of Use', async () => {
      await legalContentModule.gotoPrivacyPolicy();
      await legalContentModule.clickTopLevelTabAndExpectUrl('Terms of Use', /\/terms-use/);
    });

    await test.step('browser Back returns to Privacy Policy', async () => {
      await legalContentModule.goBackAndExpectUrl(/\/privacy-policy/);
    });
  });

  test('LGL-044 — Refresh behavior @P2 @Regression', async ({ legalContentModule }) => {
    await test.step('open Privacy Policy', async () => {
      await legalContentModule.gotoPrivacyPolicy();
    });

    await test.step('refreshing reloads the page correctly', async () => {
      await legalContentModule.reloadAndExpectStillUsable();
    });
  });

  test('LGL-045 — Accessibility of all legal pages @P1 @Regression', async ({ legalContentModule }) => {
    await test.step('Privacy Policy loads with its tabs', async () => {
      await legalContentModule.gotoPrivacyPolicy();
      await legalContentModule.expectTopLevelTabsVisible();
    });

    await test.step('Terms of Use loads with its tabs', async () => {
      await legalContentModule.gotoTermsOfUse();
      await legalContentModule.expectTopLevelTabsVisible();
    });

    await test.step('Terms & Conditions loads with its tabs and sub-tabs', async () => {
      await legalContentModule.gotoTermsConditions();
      await legalContentModule.expectTopLevelTabsVisible();
      await legalContentModule.expectSubTabVisible('Onlineee Booking');
    });
  });
});
