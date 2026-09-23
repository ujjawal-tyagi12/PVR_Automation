import type { Page } from '@playwright/test';

/**
 * Grounded live 2026-09-16 via a real user-recorded `playwright codegen` session (interactive
 * Playwright MCP fails in this sandbox — see `pvr-inox-grounding-technique` project memory) —
 * a full real account creation through to editing the avatar twice.
 *
 * **Real entry path**: header **User Icon** -> **"Edit profile"** button (lowercase "p",
 * confirmed exact live text — not "Edit Profile") -> Edit Avatar. The Avatar section itself is
 * NOT a distinct "View"/"Edit" button pair as the sheet describes — the real controls are
 * **"Edit Avatar"** (opens the gallery) and, separately, **"View avatar"** (opens a preview) —
 * both real accessible names, confirmed live.
 *
 * **Gallery**: opens directly (no `role="dialog"` wrapper was exercised in the recording —
 * confirm on next grounding pass whether it's a modal or an inline panel). Each avatar tile is
 * a real `getByRole('button', {name:'Select avatar'})` — **the name is IDENTICAL across every
 * tile** (not unique per avatar), located by index only (`.nth(n)`). The real save control is
 * labeled **"Update"**, not "Save" as originally guessed. The gallery's own heading text reads
 * "Select Your Avatar" (confirmed via a combined `getByText('Select Your AvatarUpdate')` hit —
 * heading and Update button sit adjacent with no separating whitespace in the accessibility
 * tree).
 *
 * **Preview**: "View avatar" opens something containing a real `getByRole('img', {name:'Profile
 * avatar'})` — confirmed exact accessible name.
 *
 * **Close/logout, grounded live 2026-09-16 via a second codegen recording (save → view → close →
 * logout → re-login → verify persisted)**: the preview's real close control is a
 * `getByRole('button', {name: 'Close Popup Icon'})` — an icon-only button whose accessible name
 * comes from an inner `alt`, same shape as `LocationHelper.dismissPromoPopup`'s rating-popup
 * closer. Confirmed this control does NOT appear while the gallery (not the preview) is open —
 * the gallery genuinely has no close control at all, only "Update" (see `avatar.spec.ts`'s
 * AVT-016 doc comment; a real bug, not an automation gap). Logout is reached via **User Icon ->
 * "Settings right arrow" (exact) -> "Logout" -> "Yes, Logout"** — confirmed real accessible
 * names for all four. Re-login re-uses the same phone/OTP flow as `loginOnly`. A saved avatar's
 * `src` was confirmed byte-identical before logout and after a fresh re-login (same phone).
 */
export class AvatarPage {
  constructor(private page: Page) {}

  /** Login-path locators — reused here rather than via `RegisterLoginPage` because that page's
   * shared retry wrapper has a confirmed, separate bug in this exact sequence; see
   * `AvatarModule.loginAndReachEditProfile`'s doc comment. Same real accessible
   * names/attributes `RegisterLoginPage.ts` already confirmed. */
  readonly userIconButton = () => this.page.getByRole('button', { name: 'User Icon' });
  readonly loginButtonInAccountPanel = () => this.page.getByRole('button', { name: /^login$/i });
  readonly phoneNumberInput = () => this.page.getByRole('textbox', { name: /phone number/i });
  readonly getOtpButton = () => this.page.getByRole('button', { name: /get otp/i });
  readonly otpInput = () => this.page.locator('input[name="otp"]');

  /** Real, grounded live 2026-09-16: clicking "I'll miss out" on the profile-completion wizard
   * opens a SECOND confirmation dialog ("Complete your profile for a better experience") with
   * its own "Skip Anyway"/"Complete Now" choice — not documented on `ProfileCompletionPage.ts`,
   * which only models the first dismissal. Confirm this exists before assuming
   * `dismissWithMaybeLater()` alone is sufficient anywhere it's reused. */
  readonly skipAnywayButton = () => this.page.getByRole('button', { name: 'Skip Anyway', exact: true });

  readonly editProfileButton = () => this.page.getByRole('button', { name: 'Edit profile', exact: true });

  readonly viewAvatarButton = () => this.page.getByRole('button', { name: 'View avatar', exact: true });
  readonly editAvatarButton = () => this.page.getByRole('button', { name: 'Edit Avatar', exact: true });

  readonly profileAvatarImage = () => this.page.getByRole('img', { name: 'Profile avatar', exact: true });
  /** Real, confirmed live 2026-09-16 (see this file's top doc comment) — an icon-only button,
   * accessible name from its inner `alt`. Confirmed present on the preview; confirmed ABSENT on
   * the gallery (`galleryCloseButton` below stays a real bug, not this same control). */
  readonly previewCloseButton = () => this.page.getByRole('button', { name: 'Close Popup Icon', exact: true });

  readonly galleryHeading = () => this.page.getByText('Select Your Avatar');
  readonly galleryAvatarTile = (index: number) => this.page.getByRole('button', { name: 'Select avatar', exact: true }).nth(index);
  readonly galleryUpdateButton = () => this.page.getByRole('button', { name: 'Update', exact: true });
  /** BUG (confirmed live 2026-09-16, both by user verification and independently via a headless
   * diagnostic checking for `previewCloseButton()`'s own "Close Popup Icon" control while the
   * gallery is open — not present): no real close control exists for the avatar gallery. Update
   * is the only way out. See `avatar.spec.ts`'s AVT-016 fixme reason; kept as a guess only so a
   * future close affordance has a home here. */
  readonly galleryCloseButton = () => this.page.getByRole('button', { name: /^close( dialog)?$/i });

  /** Real, confirmed live 2026-09-16 — reached from the account panel (after `userIconButton`),
   * a distinct entry point from `editProfileButton`. */
  readonly settingsArrowButton = () => this.page.getByRole('button', { name: 'Settings right arrow', exact: true });
  readonly logoutButton = () => this.page.getByRole('button', { name: 'Logout', exact: true });
  readonly confirmLogoutButton = () => this.page.getByRole('button', { name: 'Yes, Logout', exact: true });
}
