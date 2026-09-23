import type { Page } from '@playwright/test';

/**
 * Grounded 2026-08-19 against a real event detail page on UAT
 * (`inox-uat-web.pvrinox.com/eventsessions/mumbai/live-karan-aujla-concert/30199`, reached
 * via the homepage Events carousel — see EventListingPage.ts). Confirmed real content: an
 * `<h1>`/`<h2>`-level event title (e.g. "Live: Karan Aujla Concert"), a "{N} SHOWS IN {M}
 * CINEMA(S)" heading, and cinema-list entries carrying the same
 * "Enable location to get directions" text confirmed in GlobalSearchPage.ts.
 *
 * Re-grounded 2026-08-25 (ED-003/004/006/008/009/010/011): the earlier pass's "page still
 * loading" conclusion was itself premature — with Mumbai geolocation granted before
 * navigation (`EventDetailsModule.gotoKnownEventDetailWithLocationGranted`, mirroring
 * `LocationHelper.grantMumbaiGeolocation`) the page consistently finishes loading well within
 * a few seconds and every interactive element below is now confirmed real against a live run:
 * an "Event Banner" hero image, a working Share popover (page URL + copy button — the site's
 * own fallback for browsers without the native Web Share API, which headless Chromium is),
 * date-filter tabs where today's tab renders in the accent/CTA text color and other days in a
 * muted gray, a cinema-name heading that toggles its showtime list open/closed on click, and a
 * showtime button whose time-text color is driven by availability (confirmed via
 * `page.route()` on the real `api/movie-detail` endpoint: forcing a show's `isAvailable`/
 * `balance`/`status` to a sold-out shape turns the time-text from the "Available" legend's
 * green to a distinct red/orange, and the click that normally redirects to `/seatLayout/...`
 * becomes a no-op). `dateFilter`/`bookEventSection`/`cinemaCards`/`noCinemasFoundMessage`
 * below remain unconfirmed guesses (out of scope for this pass — see ED-005/ED-012 in the
 * spec).
 *
 * Re-grounded 2026-09-06 (ED-002/005/006/008/009/010/011 un-fixme pass): the file's single
 * hardcoded anchor event (`live-karan-aujla-concert/30199`) confirmed permanently expired (see
 * EventDetailsModule.ts's file doc comment) AND the Events homepage carousel/`/events` listing
 * that would normally supply a replacement are themselves both confirmed still absent (see
 * event-listing.spec.ts's own REGRESSION note, re-confirmed live today) — there is no UI-
 * rendered events list left to pick a new anchor from at all. `EventDetailsModule
 * .openLiveEventWithCinemaData()` works around this the same "hop until something's alive" way
 * `MovieDetailsModule.openMovieFromHomepage`/`CinemasListingDetailModule.openCinemaWithShows` do,
 * adapted to probe the real `api/movie-detail` endpoint directly by nearby catalog id (the
 * `/eventsessions/{city}/{any-slug}/{id}` route itself is confirmed purely id-driven — the slug
 * is never validated, and ANY currently-live catalog id, whether the backend calls it a "movie"
 * or an "event", renders through this exact same template). `getDirectionsButton`/
 * `watchTrailerDialog` above and the widened `watchTrailerButton` regex are new locators
 * confirmed against that dynamically-found live candidate.
 */
export class EventDetailsPage {
  constructor(private page: Page) {}

  // Grounded 2026-08-19.
  readonly eventTitle = (title?: string | RegExp) =>
    this.page.getByRole('heading', { level: 1 }).or(this.page.getByRole('heading', { name: title ?? /.+/, level: 2 }));
  // BUG FIX (2026-08-25): confirmed live this event's data now sits at exactly 1 show/1 cinema,
  // and the site renders singular wording for that count ("1 Show IN 1 Cinema", no trailing "s"
  // on either word) — the original regex required the literal plural "shows", which broke
  // ED-001 once the live data reached this count. Accepts singular or plural on both words.
  readonly showsCountHeading = () => this.page.getByRole('heading', { name: /shows? in \d+ cinemas?/i });
  readonly cinemaListEntries = () => this.page.getByText(/enable location to get directions/i);
  readonly loadingSpinner = () => this.page.locator('img[alt="Spinner: White decorative"]');

  // Grounded 2026-08-25 — confirmed live, see class doc comment.
  readonly eventBanner = () => this.page.getByAltText(/event banner/i);
  readonly shareButton = () => this.page.getByRole('button', { name: /share/i });
  readonly shareDialog = () => this.page.getByRole('dialog');
  readonly shareDialogCopyButton = () => this.shareDialog().getByRole('button');
  readonly dateFilterButtons = () => this.page.getByRole('button', { name: /^\d{1,2}\s*(Sun|Mon|Tue|Wed|Thu|Fri|Sat)$/i });
  // The cinema entry's own name heading (e.g. "INOX Megaplex, Inorbit Mall (Adfree Shows)") —
  // clicking it toggles that cinema's showtime list open/closed. `.first()`: this event's
  // single cinema also produces one longer combined heading further up the tree wrapping the
  // whole card's text; the shorter name-only heading is what's confirmed clickable.
  readonly cinemaEntryHeading = () => this.page.getByRole('heading', { name: /inox megaplex|inorbit mall/i }).first();
  readonly showtimeButtons = () => this.page.getByRole('button', { name: /\d{1,2}:\d{2}\s?(am|pm)/i });
  // The showtime button's own time label (e.g. "02:00 PM") — its text color is the confirmed
  // real color-coding signal, not the button's outer background.
  readonly showtimeTimeText = () => this.showtimeButtons().first().locator('p').first();
  // The language label (e.g. "Hindi") in the same button, one DOM level down from the time
  // text — confirmed live to always use a fixed, non-status CSS var (`--movie_timing_text`)
  // regardless of the showtime's Available/Filling Fast/Sold Out/Lapsed status, unlike the time
  // text above. A reliable "known different" color to diff the time text's color against.
  readonly showtimeLanguageText = () => this.showtimeButtons().first().locator('p').nth(1);
  // The small colored dot next to each legend label (Available/Filling Fast/Sold Out/Lapsed).
  readonly legendDot = (label: string) =>
    this.page.getByText(label, { exact: true }).first().locator('xpath=preceding-sibling::span[1]//span');

  // Grounded 2026-09-06 (see EventDetailsModule.openLiveEventWithCinemaData doc comment): the
  // sheet's "Watch Trailer" wording doesn't match the shipped button at all — confirmed live
  // its real accessible name is "Watch Promos", never "Watch Trailer", across every currently
  // live candidate checked. Kept as an `.or()` alternate in case a future event genuinely ships
  // the "Watch Trailer" label instead.
  readonly watchTrailerButton = () => this.page.getByRole('button', { name: /watch trailer|watch promos?/i });
  // Grounded 2026-09-06: clicking the button above opens a real `role="dialog"` titled "WATCH
  // PROMOS" listing each real promo video ("Promo 1", "Promo 2", ...), each backed by a genuine
  // playable YouTube `<iframe>` — confirmed live via a network/DOM dump.
  readonly watchTrailerDialog = () => this.page.getByRole('dialog').filter({ hasText: /watch (trailer|promos?)/i });
  // The embedded YouTube player(s) inside the dialog above — confirmed live (2 real `<iframe>`s
  // for 2 promos on the grounded candidate).
  readonly watchTrailerDialogPlayers = () => this.watchTrailerDialog().locator('iframe');
  readonly bookEventSection = () => this.page.getByRole('heading', { name: /book event/i });
  readonly dateFilter = () => this.page.getByRole('button', { name: /today|current date/i });
  readonly cinemaCards = () => this.page.getByRole('article');
  // Grounded 2026-09-06: the real, confirmed "Get Directions" control on each cinema card —
  // `role="button"`, confirmed live via a DOM dump. Renders instead of `cinemaListEntries`'s
  // "Enable location to get directions" copy once geolocation is pre-granted (the state
  // `openLiveEventWithCinemaData` navigates through) — a reliable "a real cinema card rendered"
  // signal independent of which cinema/event/movie is currently live.
  readonly getDirectionsButton = () => this.page.getByRole('button', { name: /get directions/i });

  // Grounded 2026-08-26 (ED-012): mocking the real `api/movie-detail?...&type=EVENT` endpoint's
  // `data.cinemas` to an empty array and reloading renders this exact real, confirmed message —
  // "Sorry, no cinemas found under the selected filter." — the same copy already confirmed on
  // Movie Details (see MovieDetailsPage.ts's `noCinemasFoundMessage`).
  readonly noCinemasFoundMessage = () => this.page.getByText(/no cinemas found/i);

  // Grounded 2026-09-07 (requirements/offers.md OFR-036): the `/eventsessions/{city}/{any-slug}/
  // {id}` route is confirmed purely id-driven (see class doc comment on `openLiveEventWithCinemaData`)
  // — ANY currently-live catalog id renders through the identical movie-detail template, "Also
  // playing" section included, whether the backend calls it a "movie" or an "event". So this page
  // carries the exact same `alsoPlayingHeading`/discount-chip pair already confirmed on
  // MovieDetailsPage, and the same data-driven, per-candidate/per-load volatility applies —
  // `EventDetailsModule.openEventWithAlsoPlayingOfferChip` hops through several live candidates
  // for the same reason `MovieDetailsModule.openMovieWithAlsoPlayingOfferChip` hops through tiles.
  readonly alsoPlayingHeading = () => this.page.getByRole('heading', { name: 'Also playing', exact: true });
  readonly alsoPlayingDiscountChip = () => this.page.getByText(/off$/i).first();
}
