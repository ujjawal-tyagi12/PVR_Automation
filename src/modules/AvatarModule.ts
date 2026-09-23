import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { AvatarPage } from '@pages/AvatarPage';
import { grantMumbaiGeolocation, UAT_BASE_URL } from '@utils/LocationHelper';
import { Logger } from '@utils/Logger';
import { config } from '@config/index';

/**
 * Grounded live 2026-09-16 — see `AvatarPage.ts`'s doc comment. Drives Edit Profile entry and
 * the Avatar section/gallery itself.
 *
 * `loginOnly` is a deliberately self-contained login path, NOT a reuse of
 * `RegisterLoginModule.gotoLogin()`. Confirmed live: `RegisterLoginPage`'s shared
 * `clickThroughOverlays`/`dismissLocationAndSelectCity` retry wrapper hung indefinitely in this
 * exact call sequence (reproduced 3 times) even though the *same* User-Icon -> Login ->
 * phone-input steps work reliably when driven directly with `grantMumbaiGeolocation` (which
 * skips the Enable Location modal chain entirely) instead of going through that wrapper. This
 * is a real, separate pre-existing bug in shared login infrastructure used by dozens of other
 * passing tests — out of scope to fix here (too much blast radius for this module's ticket).
 * This method is a scoped workaround, not a reusable fix.
 */
export class AvatarModule {
  private readonly avatarPage: AvatarPage;

  constructor(private page: Page) {
    this.avatarPage = new AvatarPage(page);
  }

  /** Stops right after OTP verification — for a brand-new phone number this environment then
   * requires completing the registration form and dismissing the profile-completion nudge
   * before the account panel is usable (confirmed live: a fresh number hangs on the follow-up
   * User Icon click otherwise). See `avatar.spec.ts`'s `reachEditProfile` helper, which composes
   * this with `registrationModule`/`profileCompletionModule` — deliberately NOT bundled into
   * this module, matching this repo's existing test-level-composition pattern (see
   * `profile-edit.spec.ts`'s `reachProfileEdit`). */
  async loginOnly(phone: string, otp = config.otpBypassCode): Promise<void> {
    Logger.info('Logging in via the direct (non-wrapper) sequence');
    await grantMumbaiGeolocation(this.page);
    await this.page.goto(UAT_BASE_URL);
    await expect(this.avatarPage.userIconButton()).toBeVisible({ timeout: 20_000 });

    await this.avatarPage.userIconButton().click({ timeout: 15_000 });
    await this.avatarPage.loginButtonInAccountPanel().click({ timeout: 15_000 });
    await this.avatarPage.phoneNumberInput().fill(phone);
    await this.avatarPage.getOtpButton().click();
    await this.avatarPage.otpInput().fill(otp);
    await expect(this.avatarPage.otpInput()).toBeHidden({ timeout: 20_000 });
  }

  /** Real, grounded: a second confirmation dialog ("Complete your profile for a better
   * experience") can follow the first "I'll miss out" dismissal — dismisses it if present. */
  async dismissSkipConfirmationIfPresent(): Promise<void> {
    const visible = await this.avatarPage.skipAnywayButton().isVisible({ timeout: 8_000 }).catch(() => false);
    if (visible) await this.avatarPage.skipAnywayButton().click();
  }

  async openEditProfileFromAccountPanel(): Promise<void> {
    await this.avatarPage.userIconButton().click({ timeout: 15_000 });
    await this.clickEditProfile();
  }

  async openAccountPanel(): Promise<void> {
    await this.avatarPage.userIconButton().click({ timeout: 15_000 });
  }

  async reload(): Promise<void> {
    await this.page.reload({ waitUntil: 'domcontentloaded' });
  }

  async clickEditProfile(): Promise<void> {
    await this.avatarPage.editProfileButton().click();
  }

  async expectAvatarControlsVisible(): Promise<void> {
    await expect(this.avatarPage.viewAvatarButton()).toBeVisible();
    await expect(this.avatarPage.editAvatarButton()).toBeVisible();
  }

  async openPreview(): Promise<void> {
    await this.avatarPage.viewAvatarButton().click();
    await expect(this.avatarPage.profileAvatarImage()).toBeVisible();
  }

  /** Real, confirmed live 2026-09-16 — see `AvatarPage.ts`'s `previewCloseButton` doc comment.
   * Asserts the close button itself goes away rather than the preview image (the same "Profile
   * avatar" accessible name can also match a thumbnail elsewhere on the Edit Profile screen,
   * confirmed live to stay visible after the popup closes — an unreliable "closed" signal). */
  async closePreview(): Promise<void> {
    await this.avatarPage.previewCloseButton().click();
    await expect(this.avatarPage.previewCloseButton()).toBeHidden({ timeout: 10_000 });
  }

  async getCurrentAvatarSrc(): Promise<string | null> {
    return this.avatarPage.profileAvatarImage().getAttribute('src');
  }

  async openGallery(): Promise<void> {
    await this.avatarPage.editAvatarButton().click();
    await expect(this.avatarPage.galleryHeading()).toBeVisible();
    // Tiles render progressively just after the heading — confirmed live (a bare heading-visible
    // wait caught 0-1 tiles rendered; waiting for the first one settles the rest).
    await expect(this.avatarPage.galleryAvatarTile(0)).toBeVisible({ timeout: 10_000 });
  }

  async closeGalleryWithoutSelecting(): Promise<void> {
    await this.avatarPage.galleryCloseButton().click();
  }

  async selectAvatarTile(index: number): Promise<void> {
    await this.avatarPage.galleryAvatarTile(index).click();
  }

  async expectGalleryHasMultipleTiles(): Promise<void> {
    const count = await this.page.getByRole('button', { name: 'Select avatar', exact: true }).count();
    expect(count).toBeGreaterThan(1);
  }

  async clickUpdate(): Promise<void> {
    await this.avatarPage.galleryUpdateButton().click();
  }

  /** Real, confirmed-safer save signal than trying to pin down the header's own avatar image
   * (unconfirmed structure) — the gallery heading disappearing after Update is the real,
   * observable "save succeeded" state. */
  async expectGalleryClosedAfterSave(): Promise<void> {
    await expect(this.avatarPage.galleryHeading()).toBeHidden({ timeout: 15_000 });
  }

  /** Real, confirmed live 2026-09-16 — see `AvatarPage.ts`'s top doc comment. Assumes the
   * account panel is already open (i.e. `userIconButton()` was just clicked). */
  async logout(): Promise<void> {
    Logger.info('Logging out via Settings -> Logout -> Yes, Logout');
    await this.avatarPage.settingsArrowButton().click();
    await this.avatarPage.logoutButton().click();
    await this.avatarPage.confirmLogoutButton().click();
  }

  /** Real, confirmed live: after logout, opening the account panel again shows "Login" instead
   * of a logged-in account — the same login entry point `loginOnly` uses. */
  async expectLoggedOut(): Promise<void> {
    await this.avatarPage.userIconButton().click({ timeout: 15_000 });
    await expect(this.avatarPage.loginButtonInAccountPanel()).toBeVisible({ timeout: 15_000 });
  }

  /** Re-login with the SAME phone number an earlier `loginOnly` used — for persistence checks
   * (AVT-015) where the account must be the one that already has a saved avatar. Assumes the
   * account panel is already showing "Login" (i.e. `expectLoggedOut()` just ran). */
  async reLogin(phone: string, otp = config.otpBypassCode): Promise<void> {
    Logger.info('Re-logging in with the same phone number (persistence check)');
    await this.avatarPage.loginButtonInAccountPanel().click({ timeout: 15_000 });
    await this.avatarPage.phoneNumberInput().fill(phone);
    await this.avatarPage.getOtpButton().click();
    await this.avatarPage.otpInput().fill(otp);
    await expect(this.avatarPage.otpInput()).toBeHidden({ timeout: 20_000 });
  }
}
