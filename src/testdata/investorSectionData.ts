/**
 * Grounded live 2026-09-09 against UAT (`/investors-section`) via a background research agent
 * driving headless Playwright (Playwright MCP's browser fails in this sandbox — see
 * `pvr-inox-grounding-technique` project memory). Real URL slugs and real strings only — see
 * `InvestorSectionPage.ts` for the full grounding narrative.
 */

export const TOP_TABS = {
  team: { label: 'Team', slug: 'team' },
  financials: { label: 'Financials', slug: 'financials' },
  statutoryDisclosures: { label: 'Statutory Disclosures', slug: 'statutory-disclosures' },
  investorSupport: { label: 'Investor Support', slug: 'investor-support' },
  schemeOfMerger: { label: 'Scheme of merger PVR & INOX', slug: 'scheme-of-merger' },
  statementOfDeviation: { label: 'Statement of Deviation(s) or Variations(s)', slug: 'statement-of-deviation' },
} as const;

export const FINANCIAL_SUBTYPES = {
  yearHighlights: { label: '10 Years Highlight', slug: 'year-highlights' },
  annualReport: { label: 'Annual Report', slug: 'annual-report' },
  investorPresentation: { label: 'Investor Presentation', slug: 'investor-presentation' },
  quarterlyFinancials: { label: 'Quarterly Financials', slug: 'quarterly-financials' },
  subsidiaryReport: { label: 'Subsidiary Report', slug: 'subsidiary-report' },
} as const;

export const YEAR_HIGHLIGHT_TABLES = ['Operational Highlights', 'P&L Account', 'Balance Sheet'] as const;

// Real, descending-sorted card titles confirmed live (first two of each list is enough to assert order).
export const ANNUAL_REPORT_FYS = ['2024-25', '2023-24', '2022-23'] as const;
export const INVESTOR_PRESENTATION_YEARS = ['2021', '2019', '2018'] as const;

export const QUARTERLY_CATEGORIES = [
  'Board Meeting Notes',
  'Earnings Call Transcripts',
  'Integrated Filing (Governance)',
  'Investor Presentation',
  'SEBI Financials',
  'Shareholding Pattern',
] as const;

// Real, confirmed live: the current default year (FY 2026-27) only has 1 of 6 categories
// populated (still in progress); a completed past year like this one renders all 6.
export const QUARTERLY_PAST_YEAR_WITH_ALL_CATEGORIES = 'FY 2024-25';

export const SUBSIDIARY_REPORT_SAMPLE = 'PVR INOX Lanka Limited Financial Statements FY 2024-25';

export const STATUTORY_CATEGORIES = {
  analystInvestorMeet: { label: 'Analyst/Investor Meet', slug: 'analyst-investor-meet' },
  communicationToShareholders: { label: 'Communication To Shareholders', slug: 'communication-to-shareholders' },
} as const;

export const STATUTORY_AUDIO_DOC_SAMPLE = 'PVR INOX Q3FY26 INVESTOR CALL';

export const ANALYST_COVERAGE_SAMPLE = {
  house: 'Ambit Capital',
  analystName: 'Vivekanand Subbaraman',
} as const;
export const ANALYST_COVERAGE_HOUSES_ALPHABETICAL = ['Ambit Capital', 'Anand Rathi', 'Avendus Spark', 'Axis Capital'] as const;

export const INVESTOR_SUPPORT_ROLE_SAMPLE = 'Company Secretary and Nodal Officer for the IEPF Authority';
export const INVESTOR_SUPPORT_CATEGORY_SLUG = 'company-secretary-and-nodal-officer-for-the-iepf-authority';

export const SCHEME_OF_MERGER_DOC_SAMPLE = 'Scheme of Amalgamation';
// Real on-page title (confirmed live) differs from the downloaded file's real name
// (`PVR_Statement_of_Deviation_Regulation32_Q3_FY2019-20.pdf`) — the list itself is titled by date.
export const STATEMENT_OF_DEVIATION_DOC_SAMPLE = 'PVR Statement of Deviation 23.01.2020';

export const TEAM_GROUPS = {
  management: { label: 'Management', memberSample: 'Mr. Alok Tandon' },
  boardOfDirectors: { label: 'Board of Directors', memberSample: 'Ms. Renuka Ramnath' },
} as const;
