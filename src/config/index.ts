export interface AppConfig {
  baseUrl: string;
  apiBaseUrl: string;
  adminBaseUrl: string;
  testUsername: string;
  testPassword: string;
  uatBaseUrl: string;
  otpBypassCode: string;
  apiTimeout: number;
  logLevel: string;
  mobile: {
    device: string;
    deviceSerial: string;
    appPackage: string;
    appActivity: string;
    webviewPackage: string;
    adbHost: string;
    adbPort: number;
  };
}

export const config: AppConfig = {
  baseUrl: process.env.BASE_URL || 'https://www.pvrinox.com/',
  apiBaseUrl: process.env.API_BASE_URL || 'https://www.pvrinox.com/api',
  // Grounded 2026-09-16: real Admin Portal URL confirmed live by the user (screenshot of the
  // "Welcome to PVR INOX Admin Panel!" login screen). Replaces the earlier unverified guess.
  // Login itself is protected by Google reCAPTCHA (confirmed via network logs — headless
  // Playwright cannot get past it, only an interactive/human-driven browser session can), so
  // any admin-flow automation against this host needs a real browser context, not headless.
  adminBaseUrl: process.env.ADMIN_BASE_URL || 'https://uat-admin.pvrinox.com/',
  testUsername: process.env.TEST_USERNAME || '',
  testPassword: process.env.TEST_PASSWORD || '',
  // Grounded 2026-09-09: real UAT frontend + same-origin API host, confirmed live
  // (`send-phone-otp`/`verify-phone-otp` respond from this exact origin). Replaces the retired
  // `inox-uat-web.pvrinox.com` host used earlier this session.
  uatBaseUrl: process.env.UAT_BASE_URL || 'https://uat-web.pvrinox.com',
  // Grounded 2026-09-09: confirmed live via a real `verify-phone-otp` call (real `200 Success`,
  // not a guess) — supersedes the earlier "any 6-digit code" bypass, which stopped working
  // partway through this session (see `otp-flow-automation-solved` project memory).
  otpBypassCode: process.env.OTP_BYPASS_CODE || '739416',
  apiTimeout: Number(process.env.API_TIMEOUT || 30000),
  logLevel: process.env.LOG_LEVEL || 'info',
  mobile: {
    device: process.env.MOBILE_DEVICE || 'Pixel 5',
    deviceSerial: process.env.ANDROID_DEVICE_SERIAL || '',
    appPackage: process.env.ANDROID_APP_PACKAGE || '',
    appActivity: process.env.ANDROID_APP_ACTIVITY || '',
    webviewPackage: process.env.ANDROID_WEBVIEW_PACKAGE || '',
    adbHost: process.env.ADB_HOST || '127.0.0.1',
    adbPort: Number(process.env.ADB_PORT || 5037),
  },
};
