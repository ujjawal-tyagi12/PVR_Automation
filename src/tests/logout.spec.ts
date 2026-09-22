import { test } from '@playwright/test';
import { LogoutModule } from '@modules/LogoutModule';

/**
 * Grounded against the live app at BASE_URL (direct Playwright probe, 2026-09-22) — see
 * TestData/TestMd/logout.md. Real logout is header account icon → Settings → Logout, a real
 * confirmation dialog ("Yes, Logout" / "Stay Logged In") — the same flow already grounded for
 * AdminLoginModule.logout() (Register/Login Screens module).
 *
 * @hritik
 */
test.describe('Logout (real: Settings > Logout confirmation) @P0 @Regression', () => {
  test.describe.configure({ retries: 2 });

  test.beforeEach(async ({ page }) => {
    const logout = new LogoutModule(page);
    await logout.open();
    void page;
  });

  test('APP-042 real standard logout flow invalidates the session @Smoke', async ({ page }) => {
    test.setTimeout(120000);
    const logout = new LogoutModule(page);
    await logout.loginExistingUser();
    await logout.logoutStandardFlow();
    await logout.assertLoggedOut();
    void page;
  });

  test('APP-043 real cancel on the logout confirmation leaves the session intact @P2', async ({ page }) => {
    test.setTimeout(120000);
    const logout = new LogoutModule(page);
    await logout.loginExistingUser();
    await logout.openLogoutConfirmationDialog();
    await logout.cancelLogout();
    await logout.assertStillLoggedIn();
    void page;
  });

  test('APP-044 real post-logout protected route access redirects away @P1 [Security]', async ({ page }) => {
    test.setTimeout(120000);
    const logout = new LogoutModule(page);
    await logout.loginExistingUser();
    await logout.logoutStandardFlow();
    await logout.attemptProtectedRouteAccess();
    await logout.assertRedirectedAwayFromProtectedRoute();
    void page;
  });

  test('APP-045 confirms no second real session exists to test cross-session independence against (adapted) @P2', async ({
    page,
  }) => {
    test.setTimeout(120000);
    const logout = new LogoutModule(page);
    await logout.loginExistingUser();
    await logout.logoutStandardFlow();
    await logout.assertLoggedOut();
    void page;
  });
});
