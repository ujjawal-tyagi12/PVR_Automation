# Mobile Setup Add-ons

Apply **after** copying the full web template. Same architecture, same folders — only add the files and config below.

## Scope (Playwright TypeScript)

| Target | Supported | Mechanism |
|--------|-----------|-----------|
| Mobile web / PWA | Yes | Device profiles in `playwright.config.ts` (Pixel 5, iPhone 13, …) |
| Hybrid app (Android WebView) | Yes | Playwright `_android` module + ADB |
| Native Android/iOS (non-WebView) | No | Use Appium/XCUITest — out of scope for this skill |

Mobile tests still follow **Pages → Modules → Tests**. Do not create a parallel `src/mobile/` tree.

## Prerequisites (Android device / WebView)

- Android device or AVD emulator
- ADB running (`adb devices` shows device)
- Chrome 87+ on device
- On device: enable **Stay awake** (Developer options)
- On Chrome: `chrome://flags` → **Enable command line on non-rooted devices**

Optional for CI: Android SDK + emulator image in pipeline (document in README).

## Directory add-ons

```text
apps/                          # APK/AAB paths (binaries gitignored)
├── .gitkeep
└── README.md
src/fixtures/
└── mobile.fixture.ts          # Android device + WebView fixtures
src/utils/
└── AndroidDeviceHelper.ts     # Wraps playwright _android API
src/testdata/
└── mobile-devices.json        # Device profile names + app metadata
src/tests/
└── mobile-login.spec.ts       # Sample @Mobile spec (optional starter)
```

## Environment variables

Add to `.env.example` and `.env.local`:

```ini
# Mobile web emulation
MOBILE_DEVICE=Pixel 5

# Android device / hybrid app
ANDROID_DEVICE_SERIAL=
ANDROID_APP_PACKAGE=
ANDROID_APP_ACTIVITY=
ANDROID_WEBVIEW_PACKAGE=
ADB_HOST=127.0.0.1
ADB_PORT=5037
```

Extend `src/config/index.ts` with a `mobile` section reading these vars. Keep web `baseUrl` unchanged.

## playwright.config.ts add-ons

Keep existing web projects. Add or extend:

```typescript
import { defineConfig, devices } from '@playwright/test';

// Inside projects array:
{ name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
{ name: 'mobile-safari', use: { ...devices['iPhone 13'] } },
```

Base template already includes `mobile-chrome` in `playwright.config.ts` and `npm run test:mobile` in `package.json`.

Android WebView/hybrid specs use the `mobile.fixture.ts` fixture inside the test (not a separate Playwright browser project). Tag them `@Android` and `@Mobile`.

## package.json scripts (add)

```json
"test:mobile": "playwright test --project=mobile-chrome",
"test:mobile-safari": "playwright test --project=mobile-safari",
"test:mobile:all": "playwright test --project=mobile-chrome --project=mobile-safari",
"test:android": "playwright test --grep @Android"
```

## AndroidDeviceHelper.ts (pattern)

```typescript
import { _android as android, AndroidDevice } from 'playwright';
import { config } from '@config/index';
import { Logger } from '@utils/Logger';

export class AndroidDeviceHelper {
  static async connect(): Promise<AndroidDevice> {
    const devices = await android.devices({
      host: config.mobile.adbHost,
      port: config.mobile.adbPort,
    });
    const serial = config.mobile.deviceSerial;
    const device = serial
      ? devices.find((d) => d.serial() === serial) ?? devices[0]
      : devices[0];
    if (!device) throw new Error('No Android device found. Run adb devices.');
    Logger.info(`Connected: ${device.model()} (${device.serial()})`);
    return device;
  }
}
```

## mobile.fixture.ts (pattern)

```typescript
import { test as base } from '@playwright/test';
import { AndroidDeviceHelper } from '@utils/AndroidDeviceHelper';
import type { AndroidDevice } from 'playwright';

export const test = base.extend<{ androidDevice: AndroidDevice }>({
  androidDevice: async ({}, use) => {
    const device = await AndroidDeviceHelper.connect();
    await use(device);
    await device.close();
  },
});
```

Hybrid flow in a **Module** (not in the spec):

1. Fixture provides `androidDevice`
2. Module calls helper to launch app / attach WebView
3. Module returns a `Page` from WebView for Page objects to use

## Page / Module / Test naming (unchanged)

| Layer | Mobile example | Rule |
|-------|----------------|------|
| Page | `LoginPage.ts` | Same locators/actions; works on `Page` from WebView or mobile browser |
| Module | `LoginModule.ts` | Orchestrates pages; no `page.locator()` |
| Test | `mobile-login.spec.ts` | Tags: `@Mobile`, `@Android` or project `mobile-chrome` |

## .gitignore add-ons

```text
apps/*.apk
apps/*.aab
apps/*.ipa
```

## Install (mobile)

After `npm install`:

```bash
# Web browsers (still needed for mobile web projects)
npx playwright install chromium webkit

# Verify ADB
adb devices
```

For Android-only CI agents that skip desktop browsers:

```bash
PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npm install
# Still run playwright test with android fixture specs only
```

## Verify (mobile)

```bash
npm run build
npm run rules:check
npm run lint
npm run test:mobile                    # mobile web emulation
npm run test:android                   # @Android tagged specs (needs device)
```

## Bootstrap checklist (mobile-only deltas)

```text
- [ ] Copy full web template (same as Web path)
- [ ] Apply mobile add-ons from this file
- [ ] Add apps/ and mobile env vars
- [ ] Extend config + AndroidDeviceHelper + mobile.fixture
- [ ] Add mobile projects to playwright.config.ts
- [ ] Add npm scripts test:mobile, test:mobile-safari, test:android
- [ ] adb devices shows target emulator/phone
- [ ] npm run rules:check && npm run test:mobile
```
