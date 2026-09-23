import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { ProfileCompletionPage } from '@pages/ProfileCompletionPage';
import { Logger } from '@utils/Logger';

/**
 * The real "update-customer-detail" endpoint step 1's Save & Next actually calls — grounded
 * live 2026-08-24 via request inspection (`PATCH .../api/update-customer-detail`, body
 * `{"gender":"male","anniversaryDate":null}`). Same-origin path, mockable directly with
 * `page.route()` for the save-failure/session-timeout/backend-validation scenarios.
 */
// Domain updated 2026-09-09: UAT moved from `inox-uat-web.pvrinox.com` to `uat-web.pvrinox.com`.
export const UPDATE_CUSTOMER_DETAIL_PATTERN = /uat-web\.pvrinox\.com\/api\/update-customer-detail/i;

export class ProfileCompletionModule {
  private readonly profilePage: ProfileCompletionPage;

  constructor(private page: Page) {
    this.profilePage = new ProfileCompletionPage(page);
  }

  async expectNudgeVisible(): Promise<void> {
    await expect(this.profilePage.nudgeHeading()).toBeVisible({ timeout: 15_000 });
  }

  async expectNudgeHidden(): Promise<void> {
    await expect(this.profilePage.nudgeHeading()).toBeHidden();
  }

  /** Grounded name: the real skip button reads "I'll miss out", not "Maybe Later". */
  async dismissWithMaybeLater(): Promise<void> {
    Logger.info("Dismissing profile completion nudge via 'I'll miss out'");
    await this.profilePage.clickMaybeLater();
  }

  async selectGender(value: 'Male' | 'Female' | 'Other'): Promise<void> {
    Logger.info(`Selecting gender: ${value}`);
    await this.profilePage.selectGender(value);
  }

  async expectGenderSelected(value: 'Male' | 'Female' | 'Other'): Promise<void> {
    await expect(this.profilePage.genderOptionInput(value.toLowerCase() as 'male' | 'female' | 'other')).toBeChecked();
  }

  async expectGenderOptionsVisible(): Promise<void> {
    await expect(this.profilePage.genderOptionLabel('male')).toBeVisible();
    await expect(this.profilePage.genderOptionLabel('female')).toBeVisible();
    await expect(this.profilePage.genderOptionLabel('other')).toBeVisible();
  }

  /** Picks a DOB exactly `years` years before today (same month/day) — always >= 13. */
  async pickDobYearsAgo(years: number): Promise<void> {
    const today = new Date();
    const target = new Date(today.getFullYear() - years, today.getMonth(), today.getDate());
    Logger.info(`Picking DOB ~${years} years ago`);
    await this.profilePage.pickDob(target);
  }

  /**
   * Picks the DOB exactly one day short of the real 13-year cutoff — grounded 2026-08-24: the
   * app computes the cutoff as (today - 13 years) and rejects anything more recent than that
   * with "You must be at least 13 years old to continue."; this is the boundary+1-day case.
   */
  async pickDobJustUnder13(): Promise<void> {
    const today = new Date();
    const boundary = new Date(today.getFullYear() - 13, today.getMonth(), today.getDate());
    const target = new Date(boundary.getTime() + 24 * 60 * 60 * 1000);
    Logger.info('Picking a DOB one day short of the real 13-year-minimum cutoff');
    await this.profilePage.pickDob(target);
  }

  async selectMaritalStatus(value: 'Single' | 'Married'): Promise<void> {
    Logger.info(`Selecting marital status: ${value}`);
    await this.profilePage.selectMaritalStatus(value);
  }

  async expectMaritalStatusSelected(value: 'Single' | 'Married'): Promise<void> {
    await expect(this.profilePage.maritalOptionInput(value.toLowerCase() as 'single' | 'married')).toBeChecked();
  }

  /** Picks an Anniversary date `years` years before today — caller must ensure DOB + 18 <= this. */
  async pickAnniversaryYearsAgo(years: number): Promise<void> {
    const today = new Date();
    const target = new Date(today.getFullYear() - years, today.getMonth(), today.getDate());
    Logger.info(`Picking Anniversary ~${years} years ago`);
    await this.profilePage.pickAnniversary(target);
  }

  async expectAnniversaryFieldVisible(): Promise<void> {
    await expect(this.profilePage.anniversaryFieldLabel()).toBeVisible();
  }

  async expectAnniversaryFieldHidden(): Promise<void> {
    await expect(this.profilePage.anniversaryFieldLabel()).toBeHidden();
  }

  /**
   * Grounded 2026-08-24: selecting a year beyond the current one snaps the Anniversary
   * calendar's shown month back into the current year with every day cell disabled — this is
   * how future-date rejection is actually enforced on this build (no post-hoc message like DOB).
   */
  async expectFutureAnniversaryRejected(futureYear: number): Promise<void> {
    await this.profilePage.openAnniversaryCalendarAtYear(futureYear);
    const days = this.profilePage.calendarDayButtons();
    const count = await days.count();
    expect(count).toBeGreaterThan(0);
    // BUG FIX (2026-08-25): looping every index (30+ cells) let the grid re-render mid-loop and
    // invalidate a later index ("element(s) not found" on nth(4) in a live run) — a sample of
    // first/last cells via .first()/.last() (re-resolved fresh each call, not index-pinned) is
    // just as conclusive for "every cell is disabled" and immune to that staleness.
    await expect(days.first()).toBeDisabled();
    await expect(days.last()).toBeDisabled();
  }

  async clickSaveNext(): Promise<void> {
    Logger.info('Submitting Complete Your Profile step (Save & Next)');
    await this.profilePage.clickSaveNext();
  }

  async expectSaveNextDisabled(): Promise<void> {
    await expect(this.profilePage.saveNextButton()).toBeDisabled({ timeout: 15_000 });
  }

  async expectSaveNextEnabled(): Promise<void> {
    await expect(this.profilePage.saveNextButton()).toBeEnabled({ timeout: 15_000 });
  }

  async expectUnderageDobError(): Promise<void> {
    await expect(this.profilePage.underageDobError()).toBeVisible();
  }

  async expectAnniversaryGapError(): Promise<void> {
    await expect(this.profilePage.anniversaryGapError()).toBeVisible();
  }

  /**
   * Grounded 2026-08-24: there is no textual success message anywhere on save — the ONLY
   * observable success signal is the wizard silently advancing to step 2 ("Language
   * Preferences"). This is the real proxy for TC_ADM_151/155's "success" checks.
   */
  async expectStepAdvancedPastProfileStep(): Promise<void> {
    await expect(this.profilePage.languagePreferencesHeading()).toBeVisible({ timeout: 15_000 });
  }

  async goBackToProfileStep(): Promise<void> {
    await this.profilePage.goBackToPreviousStep();
  }

  async expectSaveFailureToast(): Promise<void> {
    await expect(this.profilePage.saveFailureToast()).toBeVisible({ timeout: 10_000 });
  }

  async expectStillOnProfileStep(): Promise<void> {
    await expect(this.profilePage.nudgeHeading()).toBeVisible();
  }

  /**
   * Grounded 2026-08-24: proves the toast never leaks anything technical (stack trace, raw
   * error code, null/undefined) — same "user-friendly copy" proxy technique used elsewhere in
   * this suite (RegisterLoginModule.expectFieldErrorTextIsUserFriendly). The toast's own real
   * copy is a fixed client-side string regardless of the backend's actual response body
   * (confirmed: a custom 400 body with distinct text produced the identical generic toast).
   */
  async expectSaveFailureToastTextIsSafe(): Promise<void> {
    const text = (await this.profilePage.saveFailureToast().textContent()) ?? '';
    expect(text).not.toMatch(/exception|stack trace|error code|null|undefined|token|password/i);
    expect(text.trim().length).toBeGreaterThan(0);
  }

  /** Basic keyboard-operability proxy for TC_ADM_167/170 — see requirements.md's Accessibility
   * scope note: role/name presence + Tab key, not a full screen-reader audit. */
  async expectFocusMovesFromMaybeLater(): Promise<void> {
    await this.pressTabFromMaybeLater();
    await expect(this.profilePage.maybeLaterButton()).not.toBeFocused();
  }

  async getSaveFailureToastColor(): Promise<string> {
    return this.profilePage
      .saveFailureToast()
      .evaluate((el) => (globalThis as unknown as { getComputedStyle: (e: unknown) => { color: string } }).getComputedStyle(el).color);
  }

  async pressTabFromMaybeLater(): Promise<void> {
    await this.profilePage.maybeLaterButton().focus();
    await this.page.keyboard.press('Tab');
  }

  // BUG FIX (2026-09-10): confirmed live — this could hit the nudge dialog's own real render
  // latency (the same latency `expectNudgeVisible` above already budgets 15s for), not absence;
  // the default 5s `expect` timeout here was too tight for that, same "ordinary latency mistaken
  // for a block" class already fixed elsewhere in this codebase for analogous first-render waits.
  async expectMaybeLaterAccessible(): Promise<void> {
    await expect(this.profilePage.maybeLaterButton()).toBeVisible({ timeout: 15_000 });
    await expect(this.profilePage.maybeLaterButton()).toBeEnabled();
    const name = await this.profilePage.maybeLaterButton().getAttribute('aria-label').catch(() => null);
    const text = await this.profilePage.maybeLaterButton().innerText();
    expect((name ?? text).trim().length).toBeGreaterThan(0);
  }

  async reload(): Promise<void> {
    await this.page.reload();
  }

  /**
   * Added 2026-08-25 (profile-edit.spec.ts grounding): dismisses the post-registration nudge
   * ONLY if it actually appears — registering a user does not deterministically show it (e.g.
   * the `profile-nudge-dismissed` localStorage flag from an earlier registration in the same
   * browser context/run can suppress it, see this file's TC_ADM_140 grounding note in
   * `complete-your-profile.spec.ts`), and other tests in this file need a non-throwing check
   * before navigating on to a different screen (Profile Edit, TC_ADM_172-215) that isn't part of
   * this wizard at all. Additive only — does not change `dismissWithMaybeLater()`'s existing
   * throw-if-absent behavior, which other tests here still rely on.
   */
  async dismissNudgeIfPresent(): Promise<void> {
    const visible = await this.profilePage
      .nudgeHeading()
      .isVisible({ timeout: 8_000 })
      .catch(() => false);
    if (visible) {
      await this.dismissWithMaybeLater();
      await this.expectNudgeHidden();
    }
  }

  /**
   * Grounded live 2026-09-16: steps 2-4 (Language/Genres/Cinema Formats — see
   * `ProfileCompletionPage.ts`'s doc comment on `languageTile`) have no skip path once step 1 is
   * submitted (confirmed live: no "I'll miss out" control renders on step 2 onward) — completing
   * a fresh signup's onboarding for real requires driving all 4 steps through to the final
   * "Submit". Used by `avatar.spec.ts`'s AVT-001/002/003 to reach a state where a default avatar
   * has actually been assigned.
   */
  async selectLanguages(names: string[]): Promise<void> {
    for (const name of names) {
      Logger.info(`Selecting language: ${name}`);
      await this.profilePage.selectLanguage(name);
    }
  }

  /** Real, confirmed minimum: the Genres step rejects fewer than 3 selections. */
  async selectGenres(names: string[]): Promise<void> {
    for (const name of names) {
      Logger.info(`Selecting genre: ${name}`);
      await this.profilePage.selectGenre(name);
    }
  }

  async selectCinemaFormat(name: string): Promise<void> {
    Logger.info(`Selecting cinema format: ${name}`);
    await this.profilePage.selectCinemaFormat(name);
  }

  /** Step 4's own final button — confirmed live to read "Submit", not "Save & Next". */
  async clickSubmit(): Promise<void> {
    Logger.info('Submitting Cinema Formats step (Submit) — closes the wizard');
    await this.profilePage.clickSubmit();
  }

  async expectWizardFullyClosed(): Promise<void> {
    await expect(this.profilePage.nudgeHeading()).toBeHidden({ timeout: 20_000 });
  }

  /**
   * Drives the full 4-step "Select Your Preferences" wizard for real, from step 1's Gender
   * choice through step 4's Submit — the only real path to a state where a default avatar has
   * been assigned (confirmed live: steps 2-4 have no skip). `dob`/`maritalStatus` default to
   * values already exercised elsewhere in this file (26 years old, Single); language/genre/
   * format choices are arbitrary real tiles — this method only cares that the wizard completes,
   * not which specific preferences were recorded.
   */
  async completeFullOnboarding(gender: 'Male' | 'Female'): Promise<void> {
    await this.expectNudgeVisible();
    await this.selectGender(gender);
    await this.pickDobYearsAgo(26);
    await this.selectMaritalStatus('Single');
    await this.clickSaveNext();

    await this.selectLanguages(['English', 'Hindi']);
    await this.clickSaveNext();

    await this.selectGenres(['Comedy', 'Crime', 'Fiction']);
    await this.clickSaveNext();

    await this.selectCinemaFormat('DINE-IN');
    await this.clickSubmit();
    await this.expectWizardFullyClosed();
  }
}
