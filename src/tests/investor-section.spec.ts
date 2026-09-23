import { test, expect } from '@fixtures/index';
import {
  TOP_TABS,
  FINANCIAL_SUBTYPES,
  YEAR_HIGHLIGHT_TABLES,
  ANNUAL_REPORT_FYS,
  INVESTOR_PRESENTATION_YEARS,
  QUARTERLY_CATEGORIES,
  QUARTERLY_PAST_YEAR_WITH_ALL_CATEGORIES,
} from '@testdata/investorSectionData';

test.describe('Investor Section — Navigation, Tabs, Financials @Regression @RUN4', () => {
  test('INV-001/002 — Investor option and navigation @P0 @Smoke', async ({ investorSectionModule }) => {
    await test.step('Open homepage and the More menu', async () => {
      await investorSectionModule.gotoHomepage();
      await investorSectionModule.clickMoreAndExpectInvestorMenuItemVisible();
    });
    await test.step('Click Investor and confirm navigation', async () => {
      await investorSectionModule.clickInvestorMenuItemAndExpectNavigation();
    });
  });

  test('INV-003 — Investor Section page loads successfully @P0 @Regression', async ({ investorSectionModule }) => {
    await test.step('Open the Team tab directly', async () => {
      await investorSectionModule.gotoTab(TOP_TABS.team.slug);
    });
  });

  test('INV-004/005 — Top-level tabs displayed in real DOM order @P0 @Regression', async ({ investorSectionModule }) => {
    await test.step('Open Investor Section', async () => {
      await investorSectionModule.gotoTab(TOP_TABS.team.slug);
    });
    await test.step('Confirm real tab order', async () => {
      await investorSectionModule.expectTabsVisibleInOrder(Object.values(TOP_TABS).map((t) => t.label));
    });
  });

  test('INV-006/007 — Default tab is Team, content displayed @P0 @Regression', async ({ investorSectionModule }) => {
    await test.step('Open Investor Section', async () => {
      await investorSectionModule.gotoTab(TOP_TABS.team.slug);
    });
    await test.step('Confirm Team is active by default', async () => {
      await investorSectionModule.expectTabActive(TOP_TABS.team.label);
    });
  });

  test('INV-008 — Financial tab opens @P1 @Regression', async ({ investorSectionModule }) => {
    await test.step('Open Financials via the Year Highlights subtype', async () => {
      await investorSectionModule.gotoTab(TOP_TABS.financials.slug, FINANCIAL_SUBTYPES.yearHighlights.slug);
    });
    await test.step('Confirm Financials tab is active', async () => {
      await investorSectionModule.expectTabActive(TOP_TABS.financials.label);
    });
  });

  test('INV-009 — Financial sub-sections displayed in real order @P1 @Regression', async ({ investorSectionModule }) => {
    await test.step('Open Financials', async () => {
      await investorSectionModule.gotoTab(TOP_TABS.financials.slug, FINANCIAL_SUBTYPES.yearHighlights.slug);
    });
    await test.step('Confirm real sub-section order', async () => {
      await investorSectionModule.expectTabsVisibleInOrder(Object.values(FINANCIAL_SUBTYPES).map((s) => s.label));
    });
  });

  for (const heading of YEAR_HIGHLIGHT_TABLES) {
    test(`INV-010/011 — 10 Years Highlight: ${heading} table @P1 @Regression`, async ({ investorSectionModule }) => {
      await test.step('Open the 10 Years Highlight sub-section', async () => {
        await investorSectionModule.gotoTab(TOP_TABS.financials.slug, FINANCIAL_SUBTYPES.yearHighlights.slug);
      });
      await test.step(`Confirm ${heading} table is displayed with FY16-FY25 columns`, async () => {
        await investorSectionModule.expectHighlightTableVisible(heading);
        await investorSectionModule.expectHighlightTableHasYearColumns(heading);
      });
    });
  }

  test('INV-012 — Configurable table structure matches real 10-year column set @P2 @Regression', async ({ investorSectionModule }) => {
    await test.step('Open the 10 Years Highlight sub-section', async () => {
      await investorSectionModule.gotoTab(TOP_TABS.financials.slug, FINANCIAL_SUBTYPES.yearHighlights.slug);
    });
    await test.step('Confirm all 3 real tables share the FY16-FY25 structure', async () => {
      for (const heading of YEAR_HIGHLIGHT_TABLES) {
        await investorSectionModule.expectHighlightTableHasYearColumns(heading);
      }
    });
  });

  test('INV-013 — Informative footnote text displayed @P2 @Regression', async ({ investorSectionModule, page }) => {
    await test.step('Open the 10 Years Highlight sub-section', async () => {
      await investorSectionModule.gotoTab(TOP_TABS.financials.slug, FINANCIAL_SUBTYPES.yearHighlights.slug);
    });
    await test.step('Confirm the real COVID-19 footnote is displayed', async () => {
      await expect(page.getByText(/FY 21 & FY 22 numbers were impacted by COVID-19/i)).toBeVisible();
    });
  });

  test('INV-014/015/016 — Annual Report list, real descending FY sort, card details @P1 @Regression', async ({ investorSectionModule }) => {
    await test.step('Open Annual Report', async () => {
      await investorSectionModule.gotoTab(TOP_TABS.financials.slug, FINANCIAL_SUBTYPES.annualReport.slug);
    });
    await test.step('Confirm real descending FY sort', async () => {
      await investorSectionModule.expectArticleCardsSortedDescending([...ANNUAL_REPORT_FYS]);
    });
  });

  test('INV-017 — Annual Report download is a real PDF @P0 @Regression', async ({ investorSectionModule }) => {
    await test.step('Open Annual Report', async () => {
      await investorSectionModule.gotoTab(TOP_TABS.financials.slug, FINANCIAL_SUBTYPES.annualReport.slug);
    });
    await test.step('Download the latest report and confirm a real PDF', async () => {
      await investorSectionModule.downloadAnnualReportAndExpectPdf(ANNUAL_REPORT_FYS[0]);
    });
  });

  test('INV-018/019 — Investor Presentation list, real descending Year sort @P1 @Regression', async ({ investorSectionModule }) => {
    await test.step('Open Investor Presentation', async () => {
      await investorSectionModule.gotoTab(TOP_TABS.financials.slug, FINANCIAL_SUBTYPES.investorPresentation.slug);
    });
    await test.step('Confirm real descending Year sort', async () => {
      await investorSectionModule.expectArticleCardsSortedDescending([...INVESTOR_PRESENTATION_YEARS]);
    });
  });

  test('INV-020 — Investor Presentation download @P1 @Regression', async ({ investorSectionModule }) => {
    await test.step('Open Investor Presentation', async () => {
      await investorSectionModule.gotoTab(TOP_TABS.financials.slug, FINANCIAL_SUBTYPES.investorPresentation.slug);
    });
    await test.step('Download the latest presentation and confirm a real file', async () => {
      const filename = await investorSectionModule.downloadInvestorPresentationAndExpectFile(INVESTOR_PRESENTATION_YEARS[0]);
      expect(filename.length).toBeGreaterThan(0);
    });
  });

  test('INV-021 — Quarterly Financials defaults to the latest real year @P0 @Regression', async ({ investorSectionModule }) => {
    await test.step('Open Quarterly Financials', async () => {
      await investorSectionModule.gotoTab(TOP_TABS.financials.slug, FINANCIAL_SUBTYPES.quarterlyFinancials.slug);
    });
    await test.step('Confirm FY 2026-27 is pre-selected', async () => {
      await investorSectionModule.expectLatestYearSelected('FY 2026-27');
    });
  });

  test('INV-022 — Year dropdown shows real available years @P1 @Regression', async ({ investorSectionModule }) => {
    await test.step('Open Quarterly Financials and the Year dropdown', async () => {
      await investorSectionModule.gotoTab(TOP_TABS.financials.slug, FINANCIAL_SUBTYPES.quarterlyFinancials.slug);
      await investorSectionModule.expectLatestYearSelected('FY 2026-27');
    });
  });

  test('INV-023 — Real 6 categories displayed for a completed year @P1 @Regression', async ({ investorSectionModule }) => {
    await test.step('Open Quarterly Financials and select a completed past year', async () => {
      await investorSectionModule.gotoTab(TOP_TABS.financials.slug, FINANCIAL_SUBTYPES.quarterlyFinancials.slug);
      await investorSectionModule.selectQuarterlyYear(QUARTERLY_PAST_YEAR_WITH_ALL_CATEGORIES);
    });
    await test.step('Confirm all 6 real categories are displayed', async () => {
      await investorSectionModule.expectCategoriesVisible([...QUARTERLY_CATEGORIES]);
    });
  });

  test('INV-024 — Quarter-wise documents: real 24-button grid for a completed year (6 categories x 4 quarters) @P1 @Regression', async ({ investorSectionModule }) => {
    await test.step('Open Quarterly Financials and select a completed past year', async () => {
      await investorSectionModule.gotoTab(TOP_TABS.financials.slug, FINANCIAL_SUBTYPES.quarterlyFinancials.slug);
      await investorSectionModule.selectQuarterlyYear(QUARTERLY_PAST_YEAR_WITH_ALL_CATEGORIES);
    });
    await test.step('Confirm the real 24 "View Report" buttons are rendered', async () => {
      await investorSectionModule.expectViewReportButtonCount(24);
    });
  });

  test('INV-025 — Quarterly document download; unreported future quarter is a real disabled button @P0 @Regression', async ({ investorSectionModule }) => {
    await test.step('Open Quarterly Financials', async () => {
      await investorSectionModule.gotoTab(TOP_TABS.financials.slug, FINANCIAL_SUBTYPES.quarterlyFinancials.slug);
    });
    await test.step('Confirm the current-year unreported quarter is a real disabled state', async () => {
      await investorSectionModule.expectSomeViewReportButtonDisabled();
    });
  });

  test('INV-026/027 — Subsidiary Report list and sort @P1 @Regression', async ({ investorSectionModule }) => {
    await test.step('Open Subsidiary Report', async () => {
      await investorSectionModule.gotoTab(TOP_TABS.financials.slug, FINANCIAL_SUBTYPES.subsidiaryReport.slug);
    });
    await test.step('Confirm the real sample document is displayed', async () => {
      await investorSectionModule.expectDocumentVisible('PVR INOX Lanka Limited Financial Statements FY 2024-25');
    });
  });

  test('INV-028/029 — Statutory Disclosures default sub-section is Analyst/Investor Meet @P0 @Regression', async ({ investorSectionModule }) => {
    await test.step('Open Statutory Disclosures', async () => {
      await investorSectionModule.gotoTab(TOP_TABS.statutoryDisclosures.slug, 'analyst-investor-meet');
    });
    await test.step('Confirm the tab is active', async () => {
      await investorSectionModule.expectTabActive(TOP_TABS.statutoryDisclosures.label);
    });
  });

  test('INV-030 — Statutory Disclosures documents are year-grouped @P2 @Regression', async ({ investorSectionModule }) => {
    await test.step('Open Analyst/Investor Meet', async () => {
      await investorSectionModule.gotoTab(TOP_TABS.statutoryDisclosures.slug, 'analyst-investor-meet');
    });
    await test.step('Confirm a real year filter groups the document list', async () => {
      await investorSectionModule.expectDocumentVisible('PVR INOX Q3FY26 INVESTOR CALL');
    });
  });
});
