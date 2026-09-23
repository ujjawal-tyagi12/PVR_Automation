import type { Page } from '@playwright/test';

/**
 * Grounded 2026-09-09 against UAT (`/investors-section`) via a background research agent
 * driving headless Playwright (Playwright MCP fails in this sandbox — see
 * `pvr-inox-grounding-technique` project memory).
 *
 * **Navigation:** header "More" (real name "More Arrow Down") -> `menuitem` "Investor" (exact
 * match, unlike Careers' "Career" mismatch — see `more-menu-real-labels` project memory). Real
 * landing URL: `/investors-section?tab=team` — **directly `goto`-able**, confirmed live; no
 * distinct content-fetch API for page content (RSC/SSR, same as every prior module), though one
 * real exception exists for document downloads — see `downloadButton` below.
 *
 * **Tabs are query-param driven and directly deep-linkable**: `?tab={slug}` for the 6 top-level
 * tabs (real DOM order: Team, Financials, Statutory Disclosures, Investor Support, Scheme of
 * merger PVR & INOX, Statement of Deviation(s) or Variations(s) — note the URL slug for the last
 * one is singular `statement-of-deviation`). Financials/Statutory Disclosures/Investor Support
 * add a second `&subtype={slug}` param for their own sub-navigation; Investor Support's second
 * sub-tab additionally uses a third `&category={slug}` param. Selecting a Year filter (inside
 * Quarterly Financials or Statutory Disclosures) does NOT change the URL — client state only.
 *
 * **Active-tab detection**: the active top-level tab button carries class `tab-active` plus a
 * `radial-gradient(...)` background; its inner `<span>` loses the inactive `text-[#858585]`
 * grey. Sub-nav pills reuse the same radial-gradient marker on the pill itself, but the
 * active/inactive text-color classes differ from the top-level tabs (`text-(--text_cta)` vs
 * plain `text-(--primary_text)`, not the grey used at top level) — confirmed via raw DOM, not
 * assumed. Detecting "active" via `class` attribute substring is intentional here (matches this
 * codebase's precedent from `LegalContentPage.ts`'s sub-tab highlighting).
 *
 * **Invalid tab/subtype deep links do NOT fall back to a default tab** (the sheet's TC_Web_220
 * assumption is false) — confirmed live: the URL is left unchanged, no tab/pill shows active,
 * and the content area renders a real, reproducible fallback: `"{Humanized slug} content will
 * be available soon."` (dashes become spaces, first letter capitalized). This is a genuinely
 * live-testable proxy for "unconfigured tab/section" that needs no Admin access — it upgrades
 * INV-047/INV-050/INV-059 from admin-state-blocked to directly testable.
 *
 * **Document downloads use two different real mechanics**, confirmed via `page.waitForEvent`:
 * Annual Report cards proxy through a real API, `GET /api/media-download?path=...&filename=...`
 * (the one confirmed content-related API on this page); Quarterly Financials/Subsidiary
 * Report/Scheme of Merger/Statement of Deviation documents download directly from
 * `uat-media.pvrinox.com`. Both fire a genuine Playwright `download` event either way. One real
 * audio document exists (Statutory Disclosures -> Analyst/Investor Meet -> "PVR INOX Q3FY26
 * INVESTOR CALL", an `.mp3`) and opens as a new tab/popup instead of a download — a real,
 * confirmed difference in open-mechanic by file type.
 *
 * **Confirmed real file types across 7 sampled sections: PDF and MP3 audio only** — no DOC,
 * standalone image-as-document, or video document was found anywhere sampled (card thumbnail
 * images exist, but the underlying downloadable document for those same cards is a PDF, not an
 * image file). INV-053 (DOC)/INV-054 (Image) have no real example to assert against.
 *
 * **Broken document handling has no visible UI error** (confirmed via two real interception
 * techniques — `route.abort('failed')` and `route.fulfill({status: 404})` on
 * `/api/media-download`): neither produces the sheet's assumed "Unable to open the document"
 * message anywhere in the DOM (`role="alert"`/`role="status"` both empty); the abort case throws
 * an uncaught `pageerror` ("Failed to fetch") with zero user-facing feedback. This is a real
 * product gap, not a test-locator gap — INV-046 asserts the real (silent-failure) behavior.
 *
 * Team member click opens a real `role="dialog"` vaul drawer (`data-vaul-drawer`,
 * `data-slot="drawer-content"`, close via `[data-slot="drawer-close"]`) — same family as every
 * other dialog on this site (News, Legal Content, Curated Shows).
 */
export class InvestorSectionPage {
  constructor(private page: Page) {}

  async goto(baseUrl: string, params: { tab: string; subtype?: string; category?: string }): Promise<void> {
    const query = new URLSearchParams({ tab: params.tab });
    if (params.subtype) query.set('subtype', params.subtype);
    if (params.category) query.set('category', params.category);
    await this.page.goto(`${baseUrl}/investors-section?${query.toString()}`);
  }

  readonly moreMenuButton = () => this.page.getByRole('button', { name: /^more/i });
  readonly investorMenuItem = () => this.page.getByRole('menuitem', { name: 'Investor', exact: true });

  readonly heading = () => this.page.getByRole('heading', { name: 'Investor Section', exact: true });
  readonly navButton = (label: string) => this.page.getByRole('button', { name: label, exact: true });

  /** Healer fix: the `table` is NOT a direct CSS sibling of its `h3` — confirmed live the `h3`
   * sits inside its own `<div class="flex items-center justify-between ...">` wrapper (paired
   * with a "Units: Numbers / %" label), so a `h3 + table` adjacent-sibling selector never
   * matched. `xpath=following::table[1]` finds the next table in document order regardless of
   * the wrapper depth — the only real, confirmed-working relationship between the two. */
  readonly highlightTableByHeading = (heading: string) => this.page.locator('h3', { hasText: heading }).locator('xpath=following::table[1]');

  readonly allButtons = () => this.page.locator('button');
  readonly articleCards = () => this.page.locator('article');
  readonly annualReportCard = (fy: string) => this.page.locator('article', { hasText: fy });
  readonly downloadButton = (label: string) => this.page.getByRole('button', { name: `Download ${label}` });
  readonly investorPresentationCard = (year: string) => this.page.locator('article', { hasText: year });
  /** `.first()`: Investor Presentation has real same-year ties (multiple uploads in one year,
   * confirmed live — e.g. two "2021" cards), so more than one card can share `cardText`. */
  readonly articleDownloadButton = (cardText: string) => this.articleCards().filter({ hasText: cardText }).first().getByRole('button', { name: /download/i });

  readonly yearSelectTrigger = () => this.page.locator('[data-slot="select-trigger"]').first();
  readonly yearSelectOption = (label: string) => this.page.getByRole('option', { name: label, exact: true });
  /** Real Quarterly Financials categories are `<h3>` section headings, not clickable buttons —
   * confirmed live (no `role`/`onclick` on the element or its first 4 ancestors). */
  readonly categoryHeading = (label: string) => this.page.getByRole('heading', { name: label, exact: true });
  readonly viewReportButtons = () => this.page.getByRole('button', { name: 'View Report' });

  readonly documentByTitle = (title: string) => this.page.getByText(title, { exact: false }).first();

  readonly analystHouseHeading = (house: string) => this.page.getByRole('heading', { name: house, exact: true });
  /** No stable container class exists around an analyst card, so the mailto link is found via its
   * position relative to the confirmed real `<h3>` heading rather than a fabricated selector. */
  readonly mailtoLinkAfterHeading = (house: string) => this.analystHouseHeading(house).locator('xpath=following::a[contains(@href,"mailto:")][1]');

  readonly teamGroupHeading = (group: string) => this.page.getByText(group, { exact: true });
  readonly teamMemberButton = (name: string) => this.page.locator('button', { hasText: name });

  readonly dialog = () => this.page.getByRole('dialog');
  readonly dialogCloseButton = () => this.dialog().locator('[data-slot="drawer-close"]');

  /** Real, reproducible "unconfigured tab/subtype" fallback — see class doc comment. */
  readonly fallbackMessage = (humanizedLabel: string) => this.page.getByText(new RegExp(`${InvestorSectionPage.escapeRegExp(humanizedLabel)} content will be available soon`, 'i'));

  private static escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
