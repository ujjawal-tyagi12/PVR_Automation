/** Real, live-grounded News content on UAT (2026-09-08) — see `NewsPage.ts`'s doc comment for
 * the full grounding trail. Shared between `NewsPage.ts` (locators) and `news*.spec.ts`
 * (assertions) so neither hardcodes a duplicate copy of this content.
 *
 * IMPORTANT (Healer note, real test failures): titles below use the real DOM `textContent`
 * casing, NOT the all-caps visual rendering (CSS `text-transform`) — confirmed via a direct
 * `allTextContents()` dump: real DOM text is "PVR cinemas", "PVR Inox", "PVR Inoxx" (mixed case)
 * even though the page visually renders them all-caps. Only "PVR INOX REDEFINES WEST DELHI" is
 * genuinely all-caps in the real DOM. Getting this wrong caused several real strict-mode/
 * not-found failures during the Generator->Healer pass — do not "fix" the casing back to
 * all-caps without re-verifying live first. */
export const NEWS_CARDS = {
  /** Clean, real card — used for content assertions. */
  westDelhi: {
    title: 'PVR INOX REDEFINES WEST DELHI',
    source: 'CULTURAL LANDSCAPE WITH LUXURY',
    date: '16 July 2026',
    /** Deliberately avoids the word "DELHI'S" — the real text uses a curly apostrophe (U+2019),
     * not ASCII, same class of bug already found in LegalContentPage.ts's Gift Card heading. */
    descriptionSnippet: 'CULTURAL LANDSCAPE WITH LUXURY THREE-SCREEN MULTIPLEX AT DLF MIDTOWN PLAZA',
  },
  /** Real but shares the same templated description as westDelhi — used for the June/2026 filter case. */
  plainInox: {
    title: 'PVR Inox',
    date: '18 June 2026',
  },
  /** The only 2025 item — real date, typo'd title ("PVR Inoxx"), used only for existence/filter
   * checks, never content-quality assertions. */
  inoxx2025: {
    title: 'PVR Inoxx',
    date: '15 June 2025',
  },
  /** Genuinely dummy UAT placeholder data — garbled description, tiny thumbnail. Used only to
   * confirm it renders without crashing, never as "real" content. */
  dummyPvrCinemas: {
    title: 'PVR cinemas',
    date: '9 August 2026',
  },
} as const;

export const NEWS_TOTAL_CARD_COUNT = 4;
