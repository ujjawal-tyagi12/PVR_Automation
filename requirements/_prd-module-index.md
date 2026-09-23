# PRD Module Index — PVR INOX (Customer App, M-Site, Website & Admin Portal)

Source: `requirements/PVR INOX_Product Requirement Document.pdf` (773 pages, Sep 15 2025, V1–V7).

Purpose: working checklist to drive `/generate-test-cases` module-by-module. That skill
requires one interactive run per module (module name, navigation, source scenarios, testing
types, then an approval gate before it writes `requirements/{module}.md`) — it cannot be
batch-invoked, so this index exists to make each run fast: look up the module's page range,
open those pages, paste the relevant use case as source material.

Legend: ✅ = a `requirements/*.md` file already exists that plausibly covers this module.
❓ = existing file found but mapping to this exact PRD module is uncertain — verify before reuse.
⬜ = not started.

## Part A — App / M-Site / Website (47 modules, PRD pages 8–463)

| # | Module | Page | Status | Existing file |
|---|--------|------|--------|----------------|
| 1 | Splash Screen | 8 | ⬜ | |
| 2 | Tutorial/Walkthrough Screens | 10 | ⬜ | |
| 3 | Register/Login Screens/Social logins | 12 | ✅ | register-login.md, registration.md, login.md, guest-login.md, multi-device-login.md |
| 4 | OTP Verification Screen (Phone) | 39 | ✅ | otp-screen.md |
| 5 | Complete Your Profile | 46 | ✅ | complete-your-profile.md |
| 6 | Profile Completion > Email Verification & Edit Profile | 49 | ✅ | profile-edit.md |
| 7 | Logout | 56 | ⬜ | |
| 8 | Location Permission | 58 | ⬜ | |
| 9 | City Selection | 62 | ✅ | city-selection.md |
| 10 | Cinemas listing & detail page | 65 | ✅ | cinemas-listing-detail.md |
| 11 | Cinema format/Experience | 85 | ✅ | experience.md |
| 12 | Now Showing — Movies Details page | 90 | ✅ | movie-details.md |
| 13 | Global Search | 106 | ✅ | global-search.md |
| 14 | Coming Soon | 113 | ✅ | coming-soon.md |
| 15 | Homepage (Progressive) | 124 | ✅ | home-screen.md |
| 16 | Error page & Maintenance page | 150 | ⬜ | |
| 17 | Events listing & detail page | 152 | ✅ | event-listing.md, event-details.md |
| 18 | (untitled in PRD TOC) | 161 | ⬜ | |
| 19 | Seat Layout Screen | 161 | ⬜ | |
| 20 | Checkout Screen | 169 | ⬜ | |
| 21 | Select Payment Method | 194 | ⬜ | |
| 22 | My Bookings (Movies & Events) | 217 | ⬜ | |
| 23 | Quick Book | 234 | ❓ | pickup-your-time.md (verify) |
| 24 | Personalization Recommendations | 246 | ⬜ | |
| 25 | Curated Shows | 266 | ✅ | curated-shows.md |
| 26 | Promoted Offers | 269 | ⬜ | |
| 27 | Explore Food | 271 | ⬜ | |
| 28 | Adhoc Vouchers (Offers for you) | 285 | ⬜ | |
| 29 | Retail offers (App/M-site) | 303 | ⬜ | |
| 30 | Gift Card | 307 | ⬜ | |
| 31 | Star Pass | 329 | ⬜ | |
| 32 | Gyftr / Voucher Gram | 338 | ⬜ | |
| 33 | M-Coupon | 347 | ⬜ | |
| 34 | Privilege Plus | 358 | ⬜ | |
| 35 | Passport | 370 | ⬜ | |
| 36 | Offers & Discounts | 395 | ✅ | offers.md |
| 37 | Movie Jockey | 404 | ❓ | movie-alerts.md (verify) |
| 38 | Promotions | 426 | ⬜ | |
| 39 | Informational Content Pages | 429 | ✅ | about-us.md, legal-content.md, faqs.md, news.md, investor-section.md, corporate-booking.md, bulk-gift-card.md (all M8|Website sub-modules now ticketed — Corporate Booking/Bulk Gift Card seeded 2026-09-16, not yet implemented; Careers tracked separately under row 40) |
| 40 | Careers / Job Application | 437 | ✅ | careers.md (automated: 46/59 pass, 13 fixme — see ticket) |
| 41 | Request forms | 440 | ⬜ | |
| 42 | Early Access Show | 445 | ⬜ | |
| 43 | Trailer Screening Show | 450 | ⬜ | |
| 44 | Deeplinks | 453 | ⬜ | |
| 45 | Analytics (GA4) | 453 | ⬜ | |
| 46 | Notifications | 453 | ⬜ | |
| 47 | Fandom | 463 | ⬜ | |

**19 of 47 covered / mapped, 26 remaining (2 unverified).**

## Part B — Admin Portal (92 modules, PRD pages 463–863)

| # | Module | Page | Status |
|---|--------|------|--------|
| 1 | Admin Login | 463 | ⬜ |
| 2 | Forgot Password | 469 | ⬜ |
| 3 | Admin Profile | 474 | ⬜ |
| 4 | Change Password | 479 | ⬜ |
| 5 | Tutorial Screen Management | 481 | ⬜ |
| 6 | Customer Management | 493 | ⬜ |
| 7 | Countries - Location Management | 503 | ⬜ |
| 8 | Cities - Location Management | 506 | ⬜ |
| 9 | Experience Management | 516 | ⬜ |
| 10 | Format Management | 527 | ⬜ |
| 11 | Cinema Management | 533 | ⬜ |
| 12 | Amenities Management | 548 | ⬜ |
| 13 | Now Showing - Movies Management | 555 | ⬜ |
| 14 | Coming Soon - Movies Management | 567 | ⬜ |
| 15 | Movie Master - Movies Management | 578 | ⬜ |
| 16 | Movie Data Provider - Movies Management | 588 | ⬜ |
| 17 | Curated Shows Category - Movies Management | 592 | ⬜ |
| 18 | Trending Movies/Events | 599 | ⬜ |
| 19 | Now Showing Sequence | 605 | ⬜ |
| 20 | Events Management | 608 | ⬜ |
| 21 | Global Maintenance | 617 | ⬜ |
| 22 | Nudge Management | 620 | ⬜ |
| 23 | Booking Management - Reports | 624 | ⬜ |
| 24 | User Show Time - Reports | 639 | ⬜ |
| 25 | Food Category Management | 641 | ⬜ |
| 26 | Food Items Management | 646 | ⬜ |
| 27 | Preferences Management | 649 | ⬜ |
| 28 | Offers - Offers Management | 652 | ⬜ |
| 29 | Vouchers - Offers Management | 655 | ⬜ |
| 30 | Retail Vouchers - Offers Management | 659 | ⬜ |
| 31 | Email SMS Action | 662 | ⬜ |
| 32 | Adhoc Vouchers | 664 | ⬜ |
| 33 | In-Cinema Food Section - Static Management | 668 | ⬜ |
| 34 | Pay Mode Management | 670 | ⬜ |
| 35 | Passport Management | 680 | ⬜ |
| 36 | Passport Master | 683 | ⬜ |
| 37 | Gift Card Master | 688 | ⬜ |
| 38 | Gift Card Section - Static Management | 691 | ⬜ |
| 39 | App100 Cinema Performers - Reports | 694 | ⬜ |
| 40 | APP100 Redemption - Reports | 696 | ⬜ |
| 41 | APP100 Error Reports - Reports | 697 | ⬜ |
| 42 | Customer Feedback (Movie Ratings) - Reports | 699 | ⬜ |
| 43 | Passport Purchase - Reports | 701 | ⬜ |
| 44 | Gift Card Purchase - Reports | 705 | ⬜ |
| 45 | Gift Card Redemption - Reports | 708 | ⬜ |
| 46 | Offers & Vouchers - Reports | 710 | ⬜ |
| 47 | M-Coupon - Static Management | 713 | ⬜ |
| 48 | Privilege Plus - Static Management | 716 | ⬜ |
| 49 | Passport Notifications - Reports | 719 | ⬜ |
| 50 | Gift Card Retry - Gift Cards Management | 721 | ⬜ |
| 51 | Terms of Use - Static Management | 723 | ⬜ |
| 52 | Privacy Policy - Static Management | 727 | ⬜ |
| 53 | Frequently Asked Questions - Static Management | 731 | ⬜ |
| 54 | Contact Information - Static Management | 735 | ⬜ |
| 55 | Social Media Handles - Static Management | 738 | ⬜ |
| 56 | About Us | 741 | ⬜ |
| 57 | Terms & Conditions - Static Management | 751 | ⬜ |
| 58 | Corporate Bookings - Static Management | 755 | ⬜ |
| 59 | Bulk Gift Cards - Static Management | 757 | ⬜ |
| 60 | Careers Page - Static Management | 760 | ⬜ |
| 61 | News Management | 763 | ⬜ |
| 62 | Jobs - Jobs Management | 768 | ⬜ |
| 63 | Departments - Jobs Management | 772 | ⬜ |
| 64 | Job Requests - Reports | 775 | ⬜ |
| 65 | Customer Experience - Reports | 777 | ⬜ |
| 66 | Corporate Bookings - Reports | 779 | ⬜ |
| 67 | Bulk Gift Cards - Reports | 781 | ⬜ |
| 68 | Promotions Management | 782 | ⬜ |
| 69 | User Management - RBAC | 792 | ⬜ |
| 70 | Role Management - RBAC | 797 | ⬜ |
| 71 | Trailer Screening Show (TSS) Management | 802 | ⬜ |
| 72 | EAS Management - Screening Management | 807 | ⬜ |
| 73 | Deeplinks Management | 813 | ⬜ |
| 74 | Global Configurations | 816 | ⬜ |
| 75 | Affiliates Management | 819 | ⬜ |
| 76 | Version Management | 823 | ⬜ |
| 77 | Templates Management | 826 | ⬜ |
| 78 | Booking Experience - Reports | 831 | ⬜ |
| 79 | Audit Reports - Reports | 833 | ⬜ |
| 80 | TSS - Reports | 836 | ⬜ |
| 81 | EAS - Reports | 839 | ⬜ |
| 82 | Investor Presentation - Financials | 843 | ⬜ |
| 83 | Annual Reports - Financials | 845 | ⬜ |
| 84 | Quarterly Reports - Financials | 847 | ⬜ |
| 85 | Subsidiary Report - Financials | 850 | ⬜ |
| 86 | Other Reports - Financials | 851 | ⬜ |
| 87 | Investor Support - Financials | 854 | ⬜ |
| 88 | Scheme of Merger PVR & INOX - Financials | 857 | ⬜ |
| 89 | Statement of Deviation(s) or Variation(s) - Financials | 859 | ⬜ |
| 90 | Badges Management | 861 | ⬜ |
| 91 | (untitled in PRD TOC) | 863 | ⬜ |
| 92 | Configuration Management - Global Configurations | 863 | ⬜ |

**0 of 92 covered — Admin Portal has no `requirements/*.md` yet.**

## Suggested run order

1. Fill the ❓ gaps first (Quick Book vs `pickup-your-time.md`, Movie Jockey vs `movie-alerts.md`) — quick to confirm.
2. Finish Part A's ⬜ rows (26 modules) — these back the app/M-site/website spec files already in `src/tests/`.
3. Start Part B (Admin Portal, 92 modules) — none automated yet; no `Admin*Page.ts`/`Admin*Module.ts` exist in `src/pages`/`src/modules` either, so this is greenfield.

Each row becomes one `/generate-test-cases` invocation: give it the module name, the navigation
to reach that screen, and the relevant PRD pages (open with `Read` on the PDF using the `pages`
param) as the "PRD excerpt" source material.
