import type { Page } from '@playwright/test';
import { VERIFY_OTP_PATTERN } from './OtpMock';

/**
 * In-memory simulation of the "max simultaneous devices" business rule (PRD: max 2 devices,
 * admin-configurable 1-5; 3rd login identifies the oldest session and prompts Cancel/Continue).
 * No real backend/session API is available to test against, so this models the rule in the
 * Node process and drives the mocked verify-OTP response for each context accordingly. State
 * is shared across `Page` instances that are given the same `DeviceSessionMock` object,
 * simulating multiple devices hitting one backend within a single test.
 */
export interface DeviceSession {
  deviceId: string;
  deviceName: string;
  loginAt: number;
}

export class DeviceSessionMock {
  private sessions: DeviceSession[] = [];

  constructor(private readonly maxDevices = 2) {}

  attempt(deviceId: string, deviceName: string): { status: 'ok' | 'limit-warning'; oldest?: DeviceSession } {
    const existing = this.sessions.find((s) => s.deviceId === deviceId);
    if (existing) {
      existing.loginAt = Date.now();
      return { status: 'ok' };
    }
    if (this.sessions.length < this.maxDevices) {
      this.sessions.push({ deviceId, deviceName, loginAt: Date.now() });
      return { status: 'ok' };
    }
    const oldest = [...this.sessions].sort((a, b) => a.loginAt - b.loginAt)[0];
    return { status: 'limit-warning', oldest };
  }

  confirmReplace(deviceId: string, deviceName: string, oldestDeviceId: string): void {
    this.sessions = this.sessions.filter((s) => s.deviceId !== oldestDeviceId);
    this.sessions.push({ deviceId, deviceName, loginAt: Date.now() });
  }

  logout(deviceId: string): void {
    this.sessions = this.sessions.filter((s) => s.deviceId !== deviceId);
  }

  list(): DeviceSession[] {
    return [...this.sessions];
  }
}

/**
 * Wires a page's verify-OTP mock to a shared DeviceSessionMock. A request body of
 * `{ forceLogout: true }` is treated as the user confirming the "Continue" option on the
 * device-limit warning popup — this request-shape is a guess (no real endpoint contract
 * available); confirm/adjust once the real API is known.
 */
export async function mockLoginWithDeviceSession(page: Page, session: DeviceSessionMock, deviceId: string, deviceName: string): Promise<void> {
  await page.route(VERIFY_OTP_PATTERN, async (route) => {
    let forceLogout = false;
    try {
      const body = route.request().postDataJSON() as { forceLogout?: boolean } | null;
      forceLogout = Boolean(body?.forceLogout);
    } catch {
      forceLogout = false;
    }

    if (forceLogout) {
      const result = session.attempt(deviceId, deviceName);
      if (result.status === 'limit-warning' && result.oldest) {
        session.confirmReplace(deviceId, deviceName, result.oldest.deviceId);
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, isNewUser: false, user: { phone: '9876543210' } }),
      });
      return;
    }

    const result = session.attempt(deviceId, deviceName);
    if (result.status === 'limit-warning' && result.oldest) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          deviceLimitReached: true,
          oldestDevice: { name: result.oldest.deviceName, lastUsedDaysAgo: Math.max(1, Math.round((Date.now() - result.oldest.loginAt) / 86_400_000)) },
        }),
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, isNewUser: false, user: { phone: '9876543210' } }),
    });
  });
}
