import { test, expect } from '@fixtures/index';
import {
  TOP_TABS,
  SCHEME_OF_MERGER_DOC_SAMPLE,
  STATEMENT_OF_DEVIATION_DOC_SAMPLE,
  STATUTORY_AUDIO_DOC_SAMPLE,
  ANALYST_COVERAGE_SAMPLE,
  ANALYST_COVERAGE_HOUSES_ALPHABETICAL,
  INVESTOR_SUPPORT_ROLE_SAMPLE,
  INVESTOR_SUPPORT_CATEGORY_SLUG,
  TEAM_GROUPS,
} from '@testdata/investorSectionData';

/**
 * Continuation of `investor-section.spec.ts` (INV-031–059) — same live grounding pass, see that
 * file's imported `InvestorSectionPage.ts`/`InvestorSectionModule.ts` doc comments for the full
 * trail (real URL scheme, active-tab class detection, download mechanics, the fallback-message
 * finding that upgrades several "admin-state" scenarios to directly testable).
 */
test.describe('Investor Section (extended) @Regression @RUN4', () => {
  test('INV-031/032 — Statutory Disclosures real year filter and document download @P1', async ({ investorSectionModule }) => {
    await test.step('Open Analyst/Investor Meet and confirm the real audio document', async () => {
      await investorSectionModule.gotoTab(TOP_TABS.statutoryDisclosures.slug, 'analyst-investor-meet');
      await investorSectionModule.expectDocumentVisible(STATUTORY_AUDIO_DOC_SAMPLE);
    });
    await test.step('Open the document and confirm the real new-tab open mechanic', async () => {
      await investorSectionModule.openAudioDocumentAndExpectNewTab(STATUTORY_AUDIO_DOC_SAMPLE);
    });
  });

  test('INV-033/034 — Analyst Coverage cards are real-confirmed alphabetical, with contact details @P0', async ({ investorSectionModule }) => {
    await test.step('Open Analyst Coverage', async () => {
      await investorSectionModule.gotoTab(TOP_TABS.investorSupport.slug, 'analyst-coverage');
    });
    await test.step('Confirm real alphabetical order', async () => {
      await investorSectionModule.expectAnalystCoverageAlphabetical([...ANALYST_COVERAGE_HOUSES_ALPHABETICAL]);
    });
    await test.step('Confirm real analyst contact details', async () => {
      await investorSectionModule.expectAnalystContactVisible(ANALYST_COVERAGE_SAMPLE.house, ANALYST_COVERAGE_SAMPLE.analystName);
    });
  });

  test('INV-035/036 — Investor Support roles and contact information @P1', async ({ investorSectionModule }) => {
    await test.step('Open Investor Support', async () => {
      await investorSectionModule.gotoTab(TOP_TABS.investorSupport.slug, 'investor-support', INVESTOR_SUPPORT_CATEGORY_SLUG);
    });
    await test.step('Confirm the real role and contact info are displayed', async () => {
      await investorSectionModule.expectDocumentVisible(INVESTOR_SUPPORT_ROLE_SAMPLE);
      await investorSectionModule.expectDocumentVisible('investorrelations@pvrinox.com');
    });
  });

  test('INV-037/038/039 — Scheme of Merger document list and download @P1', async ({ investorSectionModule }) => {
    await test.step('Open Scheme of Merger', async () => {
      await investorSectionModule.gotoTab(TOP_TABS.schemeOfMerger.slug);
    });
    await test.step('Confirm the real document and download it', async () => {
      await investorSectionModule.expectDocumentVisible(SCHEME_OF_MERGER_DOC_SAMPLE);
      await investorSectionModule.downloadDocumentByTitleAndExpectPdf(SCHEME_OF_MERGER_DOC_SAMPLE);
    });
  });

  test('INV-040/041 — Statement of Deviation documents displayed and downloadable @P1', async ({ investorSectionModule }) => {
    await test.step('Open Statement of Deviation(s)', async () => {
      await investorSectionModule.gotoTab(TOP_TABS.statementOfDeviation.slug);
    });
    await test.step('Confirm the real document and download it', async () => {
      await investorSectionModule.expectDocumentVisible(STATEMENT_OF_DEVIATION_DOC_SAMPLE);
      await investorSectionModule.downloadDocumentByTitleAndExpectPdf(STATEMENT_OF_DEVIATION_DOC_SAMPLE);
    });
  });

  test('INV-042/043/044 — Team groups and member details @P1', async ({ investorSectionModule }) => {
    await test.step('Open the Team tab', async () => {
      await investorSectionModule.gotoTab(TOP_TABS.team.slug);
    });
    await test.step('Confirm both real groups and a real member from each are displayed', async () => {
      await investorSectionModule.expectTeamGroupVisible(TEAM_GROUPS.management.label);
      await investorSectionModule.expectTeamGroupVisible(TEAM_GROUPS.boardOfDirectors.label);
      await investorSectionModule.expectDocumentVisible(TEAM_GROUPS.management.memberSample);
      await investorSectionModule.expectDocumentVisible(TEAM_GROUPS.boardOfDirectors.memberSample);
    });
  });

  test('INV-045 — Team member popup is a real vaul-drawer dialog @P0', async ({ investorSectionModule }) => {
    await test.step('Open the Team tab', async () => {
      await investorSectionModule.gotoTab(TOP_TABS.team.slug);
    });
    await test.step('Click a real member and confirm the dialog opens, then closes', async () => {
      await investorSectionModule.clickTeamMemberAndExpectDialogOpen(TEAM_GROUPS.management.memberSample);
      await investorSectionModule.closeDialog();
    });
  });

  test('INV-046 — Document open failure — RESOLVED: real behavior is a silent failure, not the sheet\'s error message @P1', async ({ investorSectionModule }) => {
    await test.step('Open Scheme of Merger', async () => {
      await investorSectionModule.gotoTab(TOP_TABS.schemeOfMerger.slug);
    });
    await test.step('Block the download endpoint and confirm no UI error appears (real, confirmed product gap)', async () => {
      await investorSectionModule.blockDocumentDownloadAndExpectSilentFailure(SCHEME_OF_MERGER_DOC_SAMPLE);
    });
  });

  test('INV-047/059 — RESOLVED: an unconfigured tab/section renders a real, live-testable fallback message @P0', async ({ investorSectionModule }) => {
    await test.step('Open an intentionally unconfigured top-level tab slug', async () => {
      await investorSectionModule.gotoTab('totally-invalid-tab-xyz');
    });
    await test.step('Confirm the real "content will be available soon" fallback, not a hidden/empty tab', async () => {
      await investorSectionModule.expectFallbackMessageForInvalidSlug('totally-invalid-tab-xyz', 'Totally invalid tab xyz');
      await investorSectionModule.expectNoTabIsActive(Object.values(TOP_TABS).map((t) => t.label));
    });
  });

  test('INV-048/049 — Deep link lands directly on a real tab and sub-section @P0', async ({ investorSectionModule }) => {
    await test.step('Deep-link directly to Financials > Annual Report', async () => {
      await investorSectionModule.gotoTab(TOP_TABS.financials.slug, 'annual-report');
    });
    await test.step('Confirm the tab is active on direct load, no menu click needed', async () => {
      await investorSectionModule.expectTabActive(TOP_TABS.financials.label);
    });
  });

  test('INV-050 — RESOLVED: invalid deep link stays on the invalid URL with the fallback message, not a default-tab redirect @P0', async ({ investorSectionModule }) => {
    await test.step('Open Financials with an intentionally invalid subtype', async () => {
      await investorSectionModule.gotoTab(TOP_TABS.financials.slug, 'bogus-subtype');
    });
    await test.step('Confirm the real fallback behavior (Financials stays active, sub-nav shows the message)', async () => {
      await investorSectionModule.expectTabActive(TOP_TABS.financials.label);
      await investorSectionModule.expectFallbackMessageForInvalidSlug('bogus-subtype', 'Bogus subtype');
    });
  });

  test('INV-051 — Unique URL per tab/sub-section @P1', async ({ investorSectionModule, page }) => {
    await test.step('Navigate to two different tab/subtype combinations', async () => {
      await investorSectionModule.gotoTab(TOP_TABS.financials.slug, 'annual-report');
      expect(page.url()).toContain('subtype=annual-report');
      await investorSectionModule.gotoTab(TOP_TABS.team.slug);
      expect(page.url()).not.toContain('subtype=annual-report');
    });
  });

  test('INV-052/056 — Real confirmed file types: PDF and Audio support @P0', async ({ investorSectionModule }) => {
    await test.step('Confirm a real PDF document downloads correctly', async () => {
      await investorSectionModule.gotoTab(TOP_TABS.schemeOfMerger.slug);
      await investorSectionModule.downloadDocumentByTitleAndExpectPdf(SCHEME_OF_MERGER_DOC_SAMPLE);
    });
    await test.step('Confirm a real audio document opens correctly', async () => {
      await investorSectionModule.gotoTab(TOP_TABS.statutoryDisclosures.slug, 'analyst-investor-meet');
      await investorSectionModule.openAudioDocumentAndExpectNewTab(STATUTORY_AUDIO_DOC_SAMPLE);
    });
  });

  test.fixme(
    'INV-053 — DOC support — BLOCKED: sampled 7 real sections live (Annual Report, Investor Presentation, Quarterly Financials, Subsidiary Report, Statutory Disclosures, Scheme of Merger, Statement of Deviation) and found only PDF and MP3 documents configured — no real DOC file exists anywhere reachable to assert against.',
    () => {},
  );

  test.fixme(
    'INV-054 — Image support — BLOCKED: the only images found are card thumbnails (a UI element, not a downloadable "document"); no real standalone image-as-document exists among the same 7 sections sampled.',
    () => {},
  );

  test.fixme(
    'INV-055 — Video support — BLOCKED: same sampling as INV-053/054 — no real video document exists anywhere reachable on this page.',
    () => {},
  );

  test('INV-057 — Browser back navigation between tabs @P1', async ({ investorSectionModule }) => {
    await test.step('Navigate Team -> Financials, then press Back', async () => {
      await investorSectionModule.gotoTab(TOP_TABS.team.slug);
    });
    await test.step('Confirm real push-based routing returns to Team', async () => {
      await investorSectionModule.navigateThroughTabsAndExpectBackNavigationWorks(TOP_TABS.team.slug, TOP_TABS.financials.label, TOP_TABS.financials.slug);
    });
  });

  test('INV-058 — Responsive UI at a real mobile viewport @P1', async ({ investorSectionModule }) => {
    await test.step('Open Investor Section directly at a mobile viewport width', async () => {
      await investorSectionModule.gotoTab(TOP_TABS.team.slug);
    });
    await test.step('Resize to 390x844 and confirm the page remains usable', async () => {
      await investorSectionModule.resizeViewportAndExpectPageStillUsable(390, 844);
    });
  });
});
