import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './src/tests',
  timeout: 60000,
  expect: {
    timeout: 10000,
  },
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 2 : 3,
  reporter: [
    ['./src/utils/CustomTTAReporter.ts'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['list'],
  ],
  use: {
    baseURL: process.env.BASE_URL || 'https://example.com',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15000,
    // Grounded 2026-08-31: the live app under test shows a mandatory, occasionally
    // self-re-triggering "Enable Location" -> "Select Your City" gate on every fresh,
    // unauthenticated session that blocks all other interaction until dismissed — and
    // dismissing it via UI clicks proved racy (the app can re-open it moments later while
    // waiting on a background geolocation check). Pre-granting geolocation permission with
    // Mumbai's coordinates lets the app auto-detect the city and skip the gate entirely,
    // which is what every admin-portal test in this suite assumes as its starting state.
    geolocation: { latitude: 19.076, longitude: 72.8777 },
    permissions: ['geolocation'],
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
    // Uses the system-installed Microsoft Edge via Playwright's built-in channel — confirmed
    // installed at /usr/bin/microsoft-edge-stable, 2026-09-21.
    { name: 'edge', use: { ...devices['Desktop Edge'], channel: 'msedge' } },
    // Opera has no official Playwright channel (unlike msedge/chrome), but it's Chromium-based,
    // so it's launched as a custom executable through the chromium browser type — confirmed
    // installed at /usr/bin/opera, 2026-09-21.
    { name: 'opera', use: { ...devices['Desktop Chrome'], launchOptions: { executablePath: '/usr/bin/opera' } } },
  ],
});
