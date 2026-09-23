import type { Page } from '@playwright/test';

/**
 * Grounded 2026-09-08 against UAT (inox-uat-web.pvrinox.com, Mumbai geolocation granted) via
 * headless Playwright (Playwright MCP's browser fails in this sandbox — see the
 * `pvr-inox-grounding-technique` project memory; this pass used a background research agent
 * plus one direct verification script). Real route: `/news` (direct-navigable, confirmed 200).
 * Query-string filter guesses (`?year=`, `?month=`) are silently ignored — filters are pure
 * client React state, not URL-driven.
 *
 * **UAT has exactly 4 real news cards** (confirmed live, `All`/no filter):
 * - "PVR INOX REDEFINES WEST DELHI" — Source "CULTURAL LANDSCAPE WITH LUXURY" — 16 July 2026 —
 *   real, clean content, a genuine long-form description. Used as the primary test card.
 * - "PVR INOX" — Source "PVR Inox" — 18 June 2026 — shares the exact same description
 *   paragraph as the card above (templated/duplicated content, not unique per card).
 * - "PVR INOXX" (typo, extra X) — Source "PVR Inox" — 15 June 2025 — same shared description;
 *   the only 2025 item.
 * - "PVR CINEMAS" — Source "news" — 9 August 2026 — genuinely dummy: garbled description
 *   ("dbfdvdsfvdvfgjefgegwegrgrrgsdafaf"), tiny placeholder thumbnail. Not used for content
 *   assertions, only existence/count checks.
 *
 * Each card is a single `<button>` containing "Source:" text — not separate clickable
 * sub-elements; the whole card is the click target. `getByRole('heading')` returns mixed-case
 * DOM text ("PVR cinemas" etc.) while the page renders it visually all-caps via CSS
 * `text-transform` — match the real DOM text, not the visual case.
 *
 * **Year/Month filters are real custom buttons, not native `<select>`.** The Year button's own
 * label is `"Year - All"` by default; clicking it opens a `<ul><li><button>` list with options
 * `"All"`, `"Year - 2026"`, `"Year - 2025"`. The Month button (label `"Month - All"`-style) is
 * **disabled until a Year is picked**; after Year=2026 its options are `"All"`, `"Jun"`, `"Jul"`,
 * `"Aug"` (short form, no prefix); after Year=2025, only `"All"`, `"Jun"`. Options are generated
 * from real data — confirmed live: Year=2026+Jul -> only "PVR INOX REDEFINES WEST DELHI";
 * Year=2026+Jun -> only "PVR INOX"; Year=2025 -> only "PVR INOXX". Since every exposed option is
 * derived from existing data, there is no way to construct an empty-result combination through
 * this UI (NWS-024 is blocked by construction, not just "not found").
 *
 * **Category tabs exist but do not filter.** Two real tabs, `getByRole('button', { name: 'All',
 * exact: true })` and `{ name: 'New Initiatives', exact: true }`. "All" carries class
 * `tab-active` by default; clicking "New Initiatives" correctly moves that class to it, but the
 * underlying news list does NOT change (same 4 cards either way) — confirmed live, a real
 * non-functional-filter finding, not a locator gap.
 *
 * **No separate detail page — a same-URL dialog.** Clicking a card opens a real `role="dialog"`
 * (Radix + vaul drawer, same family as `CuratedShowsPage.ts`/`LegalContentPage.ts`) containing a
 * real `<img>` (real `uat-media.pvrinox.com` src), the title, source, date, and full body text.
 * Closes via `[data-slot="drawer-close"]` (icon-only, no accessible name) or `Escape`; the list
 * state is preserved after closing. The dialog pushes NO history entry — `page.goBack()` while
 * it's open navigates away from the site's history entirely (confirmed: lands on `about:blank`
 * in an isolated context) — the sheet's "browser back returns to listing" premise is false.
 *
 * No distinct News content API exists (zero `/api/` calls fire on card-open or filter change) —
 * same server/client-rendered pattern as About Us/Legal Content/FAQs. Blocking a real thumbnail
 * request and reloading leaves it broken with `naturalWidth`/`naturalHeight` 0 — no
 * placeholder/fallback exists, same as every prior module.
 *
 * **Two real bugs found and fixed during the Generator->Healer pass (real test failures, not
 * guesses):**
 * 1. The Year/Month dropdown's OPTION buttons ("Year - 2026", "Year - 2025") stay in the
 *    accessibility tree even when the dropdown is visually closed — a plain
 *    `getByRole('button', { name: /^Year/i })` matches 3 elements (trigger + 2 options), a real
 *    Playwright strict-mode violation. Fixed by excluding `<li>`-nested buttons via
 *    `button:not(li button)`, since option buttons are confirmed to live inside `<li>`.
 * 2. Cards 2 and 3 ("PVR INOX", "PVR INOXX") share the EXACT SAME templated description
 *    paragraph as card 1, and that description literally starts with "PVR INOX REDEFINES WEST
 *    DELHI..." — so a plain substring `hasText` match on card 1's title accidentally matched all
 *    three cards' shared description text. Fixed by anchoring the match to the START of the
 *    button's text (`^`-prefixed regex) — only the true title-holder has this phrase first.
 */
export class NewsPage {
  constructor(private page: Page) {}

  async goto(baseUrl: string): Promise<void> {
    await this.page.goto(`${baseUrl}/news`);
  }

  /** Real accessible name is "More Arrow Down" (see AboutUsPage.ts doc comment) — leading-substring match. */
  readonly moreMenuButton = () => this.page.getByRole('button', { name: /^more/i });
  readonly newsMenuItem = () => this.page.getByRole('menuitem', { name: 'News', exact: true });

  /** `:not(li button)` excludes the dropdown's own option buttons, which stay in the a11y tree
   * even when visually closed (see class doc comment's Healer note). */
  readonly yearFilterButton = () => this.page.locator('button:not(li button)', { hasText: /^Year/i });
  readonly monthFilterButton = () => this.page.locator('button:not(li button)', { hasText: /^Month/i });
  readonly filterOption = (label: string) => this.page.locator('li button', { hasText: label }).first();

  readonly allCategoryTab = () => this.page.getByRole('button', { name: 'All', exact: true });
  readonly newInitiativesCategoryTab = () => this.page.getByRole('button', { name: 'New Initiatives', exact: true });

  readonly newsCards = () => this.page.locator('button', { hasText: 'Source:' });
  readonly firstCardThumbnail = () => this.newsCards().first().locator('img').first();
  readonly cardThumbnailByTitle = (title: string) => this.newsCardByTitle(title).locator('img').first();
  /**
   * Anchored to the real, confirmed structure of every card's text: `"{title}Source: ..."` with
   * no separator (see class doc comment's Healer note). Matching just `^{title}` wrongly caught
   * other cards' shared templated description text; matching `^{title}` with a following-letter
   * lookahead over-corrected and broke titles that are themselves immediately followed by a
   * letter (e.g. "...WEST DELHISource:") since a lookahead can't tell "legitimately followed by
   * a different word" apart from "this title is itself a prefix of another real title" (the
   * "PVR Inox" / "PVR Inoxx" case). Anchoring on the literal `"Source:"` boundary that every
   * real card has resolves both problems at once.
   */
  readonly newsCardByTitle = (title: string) => this.newsCards().filter({ hasText: new RegExp(`^${NewsPage.escapeRegExp(title)}Source:`) });

  readonly dialog = () => this.page.getByRole('dialog');
  readonly dialogCloseButton = () => this.dialog().locator('[data-slot="drawer-close"]');
  readonly dialogImage = () => this.dialog().locator('img').first();

  private static escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
