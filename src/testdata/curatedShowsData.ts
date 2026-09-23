/**
 * Mock payload builders for `GET /api/curated-shows?cityId=...`.
 *
 * Grounded 2026-09-01: UAT (`inox-uat-web.pvrinox.com`) never has real `curatedShows` content —
 * every city with a cinema (11 checked directly via the API, including Mumbai/cityId=1) returns
 * `curatedShows: []`. Rather than guess a shape, the field names below were extracted directly
 * from the real shipped Next.js bundle (`_next/static/chunks/cda341eb1bfe6351.js`, fetched and
 * grepped live) that renders this page — `categoryDisplayName`, `categoryType`, `subHeading`,
 * `description` (HTML), `webImage`/`webImageLight` (the per-category banner, reused for both the
 * "Category Banner" and the "Learn More" popup's "About Banner"), and `movies[]` using the same
 * movie shape (`filmCommonCode`, `filmCommonName`, `certificate`, `genres`, `languages`,
 * `commonImgVert` for the poster path, `runningTime` in minutes, `releaseDate`) the rest of the
 * app's movie objects use (cross-checked against `GET /api/quick-book-init`). A mock built from
 * these exact keys was confirmed live to render real category headings, movie cards with correct
 * "2h 8m" runtime formatting, and a working "Learn More" info popup — see
 * `CuratedShowsPage.ts`/`CuratedShowsModule.ts` doc comments for what was and wasn't verified.
 *
 * **`filmId`/`categoryName` added 2026-09-07 — the real fix for the CSH-019/034/035/036/044
 * "dead click" finding.** Re-grounded live: the movie card's real `onClick` (read directly out of
 * the shipped bundle, function body extracted via `node.onclick.toString()`/React fiber props, not
 * guessed) is `()=>{if(h)return void h();if(c?.filmId){...router.push('/moviesessions/'+city+'/'+
 * slug+'/'+c.filmId + (categoryType==='Special Shows' ? '?curatedType='+categoryName : ''))}}` —
 * it silently no-ops whenever `movie.filmId` is falsy. The original mock only ever set
 * `filmCommonCode`, never `filmId` — a genuinely different field the handler reads instead — so
 * the guard always failed and the click was a real, reproducible no-op, NOT a dead handler needing
 * unavailable live session/cinema context (the earlier theory). Adding `filmId` (confirmed live:
 * clicking a mocked card with `filmId: 30212`, a real currently-showing UAT film's id, navigated to
 * a fully working `/moviesessions/mumbai/ramayanamhindi/30212` session page) makes the click
 * genuinely navigate. `categoryName` is a second, separate real field (found the same way, plus
 * confirmed via its own call site — `jsx(S,{...,categoryName:e.categoryName,...})` — mapping
 * straight off the category object) that feeds the `?curatedType=` query param on the session URL
 * for a "Special Shows" category; it is NOT the same value as `categoryDisplayName` (confirmed by
 * setting them to different values live and seeing the query param follow `categoryName`).
 */

export interface CuratedShowMovieMock {
  filmCommonCode: number;
  filmCommonName: string;
  certificate: string;
  genres: string[];
  languages: string[];
  commonImgVert: string;
  runningTime: number;
  releaseDate: string;
  /** The real field the movie-card's `onClick` handler actually reads to build the
   * `/moviesessions/{city}/{slug}/{filmId}` navigation URL — see class doc comment. Without this,
   * the handler's `if (movie.filmId)` guard fails and the click silently no-ops. */
  filmId: number;
}

export interface CuratedShowCategoryMock {
  _id: string;
  categoryDisplayName: string;
  categoryType: string;
  subHeading: string;
  description: string;
  webImage: string;
  webImageLight: string;
  movies: CuratedShowMovieMock[];
  /** A real field distinct from `categoryDisplayName` — feeds the `?curatedType=` query param
   * appended to the session-page URL when `categoryType` is `'Special Shows'` — see class doc
   * comment for how this was confirmed live. */
  categoryName: string;
}

let movieSeq = 1;
export function buildCuratedMovie(overrides: Partial<CuratedShowMovieMock> = {}): CuratedShowMovieMock {
  const n = movieSeq++;
  const filmCommonCode = 90_000 + n;
  return {
    filmCommonCode,
    filmCommonName: `Mock Curated Movie ${n}`,
    certificate: 'UA',
    genres: ['Drama', 'Thriller'],
    languages: ['Hindi', 'English'],
    commonImgVert: '',
    runningTime: 128,
    releaseDate: '2026-08-01',
    filmId: filmCommonCode,
    ...overrides,
  };
}

let categorySeq = 1;
export function buildCuratedCategory(overrides: Partial<CuratedShowCategoryMock> = {}): CuratedShowCategoryMock {
  const n = categorySeq++;
  return {
    _id: `mock-cat-${n}`,
    categoryDisplayName: `Mock Category ${n}`,
    categoryType: 'Now Showing',
    categoryName: `Mock Category ${n}`,
    subHeading: `Mock category ${n} sub-heading text`,
    description: `<p>Mock category ${n} description used for the info-popup assertion.</p>`,
    webImage: 'curated-show.svg',
    webImageLight: 'curated-show.svg',
    movies: [buildCuratedMovie()],
    ...overrides,
  };
}

/** Grounded 2026-09-01: the real Next.js proxy route the browser actually calls (confirmed via a
 * live network trace) — distinct from the underlying `/movie/api/v1/curated-show/curated-shows`
 * backend route the proxy forwards to internally. */
export const CURATED_SHOWS_API_ROUTE_PATTERN = '**/api/curated-shows*';

/** Grounded 2026-09-01: Mumbai's real `cityId` (the sub-city selected by `UAT_CITY`/`UAT_SUB_CITY`
 * in `LocationHelper.ts`), confirmed via a direct `GET /api/get-city-list` fetch. */
export const MUMBAI_CITY_ID = '1';
/** Grounded 2026-09-01: Bangalore's real `cityId` (a popular city with no sub-cities), used as the
 * "different city" target for city-switch scenarios. */
export const BANGALORE_CITY_ID = '15';
