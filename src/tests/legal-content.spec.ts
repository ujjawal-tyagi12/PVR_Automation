import { test } from '@fixtures/index';

/**
 * Ticket: requirements/legal-content.md, sourced from `TC_Web_52–96` (the "Legal Content" module
 * rows of the M8 Website sheet). Grounded 2026-09-08 against UAT (`inox-uat-web.pvrinox.com`),
 * Mumbai geolocation granted, via headless Playwright (Playwright MCP's browser fails in this
 * sandbox — see the `pvr-inox-grounding-technique` project memory).
 *
 * **Headline findings** (see `LegalContentPage.ts` for the full trail):
 * - Real routes are `/privacy-policy`, `/terms-use`, `/terms-conditions` — confirmed via the
 *   footer's real `href`s, not the sheet's guessed names.
 * - Unlike About Us, the three TOP-LEVEL tabs ARE real per-page navigation (clicking one changes
 *   the URL and title). The Terms & Conditions page's SIX sub-tabs, however, use the same
 *   scroll-anchor pattern as About Us's tabs — no URL change, all content already in the DOM.
 * - Real sub-tab labels are dummy/typo'd UAT content: "Onlineee Booking", "Privilege Plus",
 *   "Giffting card", "SS dd gg s", "Eas eas eas", "M-coupon data". The sheet's "Contest &
 *   Promotion" (LGL-023) has no matching real label — `test.fixme`.
 * - Terms of Use's real content is a ~330-character generic placeholder paragraph ending in the
 *   literal word "test" — genuinely dummy UAT data, not truncated/broken.
 * - No `aria-selected`/active class exists on either tier's tab buttons — "selected tab
 *   highlighted" (LGL-010) is adapted to checking the URL matches the visible tab.
 * - This suite covers LGL-001–023 (footer nav, top-level tabs, Privacy Policy, Terms of Use, and
 *   the start of Terms & Conditions); see `legal-content-extended.spec.ts` for LGL-024–045.
 */
test.describe('Legal Content @RUN5', () => {
  test('LGL-001 — Privacy Policy option is displayed @P1 @Regression', async ({ legalContentModule }) => {
    await test.step('open the homepage', async () => {
      await legalContentModule.gotoHomepage();
    });

    await test.step('the Privacy Policy footer link is visible', async () => {
      await legalContentModule.expectFooterLinkVisible('Privacy Policy');
    });
  });

  test('LGL-002 — Terms of Use option is displayed @P1 @Regression', async ({ legalContentModule }) => {
    await test.step('open the homepage', async () => {
      await legalContentModule.gotoHomepage();
    });

    await test.step('the Terms of Use footer link is visible', async () => {
      await legalContentModule.expectFooterLinkVisible('Terms of Use');
    });
  });

  test('LGL-003 — Terms & Conditions option is displayed @P1 @Regression', async ({ legalContentModule }) => {
    await test.step('open the homepage', async () => {
      await legalContentModule.gotoHomepage();
    });

    await test.step('the Terms & Conditions footer link is visible', async () => {
      await legalContentModule.expectFooterLinkVisible('Terms & Conditions');
    });
  });

  test('LGL-004 — Navigation to Privacy Policy page @P0 @Regression', async ({ legalContentModule }) => {
    await test.step('open the homepage', async () => {
      await legalContentModule.gotoHomepage();
    });

    await test.step('clicking the footer link navigates to /privacy-policy', async () => {
      await legalContentModule.clickFooterLinkAndExpectUrl('Privacy Policy', /\/privacy-policy/);
    });
  });

  test('LGL-005 — Navigation to Terms of Use page @P0 @Regression', async ({ legalContentModule }) => {
    await test.step('open the homepage', async () => {
      await legalContentModule.gotoHomepage();
    });

    await test.step('clicking the footer link navigates to /terms-use', async () => {
      await legalContentModule.clickFooterLinkAndExpectUrl('Terms of Use', /\/terms-use/);
    });
  });

  test('LGL-006 — Navigation to Terms & Conditions page @P0 @Regression', async ({ legalContentModule }) => {
    await test.step('open the homepage', async () => {
      await legalContentModule.gotoHomepage();
    });

    await test.step('clicking the footer link navigates to /terms-conditions', async () => {
      await legalContentModule.clickFooterLinkAndExpectUrl('Terms & Conditions', /\/terms-conditions/);
    });
  });

  test('LGL-007 — Content is fetched from Admin Panel @P1 @Regression', async ({ legalContentModule }) => {
    await test.step('open Privacy Policy', async () => {
      await legalContentModule.gotoPrivacyPolicy();
    });

    await test.step('the real configured content is displayed', async () => {
      await legalContentModule.expectTextVisible('Your privacy is important to Us');
    });
  });

  test('LGL-008 — Top-level tabs are displayed @P0 @Regression', async ({ legalContentModule }) => {
    await test.step('open Privacy Policy', async () => {
      await legalContentModule.gotoPrivacyPolicy();
    });

    await test.step('all three top-level tabs are visible', async () => {
      await legalContentModule.expectTopLevelTabsVisible();
    });
  });

  test('LGL-010 — Selected top-level tab is highlighted @P2 @Regression (adapted: no aria-selected/active class exists on the tab buttons — proxied by the page URL matching the visible tab, see file doc comment)', async ({ legalContentModule }) => {
    await test.step('open Privacy Policy', async () => {
      await legalContentModule.gotoPrivacyPolicy();
    });

    await test.step('the URL corresponds to the Privacy Policy tab', async () => {
      await legalContentModule.expectCurrentUrlMatches(/\/privacy-policy/);
    });
  });

  test('LGL-011 — Privacy Policy content @P1 @Regression', async ({ legalContentModule }) => {
    await test.step('open Privacy Policy', async () => {
      await legalContentModule.gotoPrivacyPolicy();
    });

    await test.step('correct Privacy Policy content is displayed', async () => {
      await legalContentModule.expectTextVisible('Your privacy is important to Us');
    });
  });

  test('LGL-012 — Privacy Policy scroll functionality @P2 @Regression', async ({ legalContentModule }) => {
    await test.step('open Privacy Policy', async () => {
      await legalContentModule.gotoPrivacyPolicy();
    });

    await test.step('user can scroll through the complete content', async () => {
      await legalContentModule.scrollToBottomAndExpectNoCrash();
    });
  });

  test('LGL-013 — Formatting of Privacy Policy @P2 @Regression (adapted: exact "formatting" is not independently assertable via accessibility APIs — proxies with a real section-header text check)', async ({ legalContentModule }) => {
    await test.step('open Privacy Policy', async () => {
      await legalContentModule.gotoPrivacyPolicy();
    });

    await test.step('the real section structure is intact', async () => {
      await legalContentModule.expectTextVisible('DATA AND/OR INFORMATION COLLECTION');
    });
  });

  test('LGL-014 — Terms of Use content @P1 @Regression (RESOLVED: real content is a short, genuinely-dummy UAT placeholder paragraph, not broken/missing — see file doc comment)', async ({ legalContentModule }) => {
    await test.step('open Terms of Use', async () => {
      await legalContentModule.gotoTermsOfUse();
    });

    await test.step('the configured (dummy) content is displayed', async () => {
      await legalContentModule.expectTextVisible('A Terms of Use agreement is a legal agreement');
    });
  });

  test('LGL-015 — Terms of Use scroll functionality @P2 @Regression (adapted: real content is short/single-viewport dummy text, not long content — confirms scrolling doesn\'t break the page rather than testing a genuinely long scroll)', async ({ legalContentModule }) => {
    await test.step('open Terms of Use', async () => {
      await legalContentModule.gotoTermsOfUse();
    });

    await test.step('scrolling does not break the page', async () => {
      await legalContentModule.scrollToBottomAndExpectNoCrash();
    });
  });

  test('LGL-016 — Formatting of Terms of Use @P2 @Regression (adapted: same proxy approach as LGL-013)', async ({ legalContentModule }) => {
    await test.step('open Terms of Use', async () => {
      await legalContentModule.gotoTermsOfUse();
    });

    await test.step('the configured content text is intact', async () => {
      await legalContentModule.expectTextVisible('professional and trustworthy organization');
    });
  });

  test('LGL-017 — Terms & Conditions content page @P1 @Regression', async ({ legalContentModule }) => {
    await test.step('open Terms & Conditions', async () => {
      await legalContentModule.gotoTermsConditions();
    });

    await test.step('the page opens successfully', async () => {
      await legalContentModule.expectTextVisible('Definitions');
    });
  });

  test('LGL-018 — Configured sub-tabs are displayed @P0 @Regression', async ({ legalContentModule }) => {
    await test.step('open Terms & Conditions', async () => {
      await legalContentModule.gotoTermsConditions();
    });

    await test.step('the real configured sub-tabs are visible', async () => {
      await legalContentModule.expectSubTabVisible('Onlineee Booking');
      await legalContentModule.expectSubTabVisible('Privilege Plus');
      await legalContentModule.expectSubTabVisible('Giffting card');
    });
  });

  test('LGL-019 — Sub-tab sequence @P1 @Regression (adapted: DOM order is the closest real proxy for "Admin-configured sequence", matching AboutUsModule/CuratedShowsModule)', async ({ legalContentModule }) => {
    await test.step('open Terms & Conditions', async () => {
      await legalContentModule.gotoTermsConditions();
    });

    await test.step('sub-tabs render in the confirmed live order', async () => {
      await legalContentModule.expectSubTabsInOrder(['Onlineee Booking', 'Privilege Plus', 'Giffting card', 'SS dd gg s', 'Eas eas eas', 'M-coupon data']);
    });
  });

  test('LGL-020 — Default sub-tab selection @P0 @Regression (adapted: like About Us, all sub-tab content renders on load without clicking anything — see file doc comment)', async ({ legalContentModule }) => {
    await test.step('open Terms & Conditions', async () => {
      await legalContentModule.gotoTermsConditions();
    });

    await test.step('the first sub-tab\'s content is visible without clicking', async () => {
      await legalContentModule.expectTextVisible('Definitions');
    });
  });

  test('LGL-021 — Default sub-tab content @P1 @Regression', async ({ legalContentModule }) => {
    await test.step('open Terms & Conditions', async () => {
      await legalContentModule.gotoTermsConditions();
    });

    await test.step('correct default content is displayed', async () => {
      await legalContentModule.expectTextVisible('Purchasing tickets online');
    });
  });

  test('LGL-022 — Online Booking sub-tab @P1 @Regression', async ({ legalContentModule }) => {
    await test.step('open Terms & Conditions', async () => {
      await legalContentModule.gotoTermsConditions();
    });

    await test.step('clicking Online Booking shows its content', async () => {
      await legalContentModule.clickOnlineBookingSubTabAndExpectDefinitionsVisible();
    });
  });

  test.fixme(
    'LGL-023 — Contest & Promotion sub-tab @P1 @Regression — BLOCKED: grounded 2026-09-08 — no sub-tab resembling "Contest & Promotion" exists on the real /terms-conditions page. The six real sub-tabs are "Onlineee Booking", "Privilege Plus", "Giffting card", "SS dd gg s", "Eas eas eas", "M-coupon data" — the last two are unrelated placeholder labels (their own content, e.g. "No Pets Allowed Policy"/"For Bundle Offer:", is unrelated to contests too), not a disguised match.',
    () => {},
  );
});
