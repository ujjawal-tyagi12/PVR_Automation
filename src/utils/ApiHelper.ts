import type { APIRequestContext } from '@playwright/test';
import { config } from '@config/index';

export const ApiHelper = {
  async getJson<T>(request: APIRequestContext, path: string): Promise<T> {
    const response = await request.get(`${config.apiBaseUrl}${path}`, {
      timeout: config.apiTimeout,
    });
    if (!response.ok()) {
      throw new Error(`GET ${path} failed: ${response.status()} ${await response.text()}`);
    }
    return (await response.json()) as T;
  },

  async postJson<T>(request: APIRequestContext, path: string, body: unknown): Promise<T> {
    const response = await request.post(`${config.apiBaseUrl}${path}`, {
      data: body,
      timeout: config.apiTimeout,
    });
    if (!response.ok()) {
      throw new Error(`POST ${path} failed: ${response.status()} ${await response.text()}`);
    }
    return (await response.json()) as T;
  },
};
