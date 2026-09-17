import { APIRequestContext, request } from '@playwright/test';
import { config } from '@config/index';
import { Logger } from '@utils/Logger';

export class ApiHelper {
  private static context: APIRequestContext | null = null;

  static async getContext(): Promise<APIRequestContext> {
    if (!this.context) {
      this.context = await request.newContext({
        baseURL: config.apiBaseUrl,
        timeout: config.apiTimeout,
      });
    }
    return this.context;
  }

  static async get<T>(path: string, headers?: Record<string, string>): Promise<T> {
    const ctx = await this.getContext();
    const response = await ctx.get(path, { headers });
    Logger.debug(`GET ${path} -> ${response.status()}`);
    return response.json() as Promise<T>;
  }

  static async post<T>(path: string, data: unknown, headers?: Record<string, string>): Promise<T> {
    const ctx = await this.getContext();
    const response = await ctx.post(path, { data, headers });
    Logger.debug(`POST ${path} -> ${response.status()}`);
    return response.json() as Promise<T>;
  }

  static async dispose(): Promise<void> {
    await this.context?.dispose();
    this.context = null;
  }
}
