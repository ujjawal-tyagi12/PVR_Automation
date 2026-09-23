import type { APIRequestContext } from '@playwright/test';
import { ApiHelper } from '@utils/ApiHelper';

export interface LoginResponse {
  token: string;
  userId: string;
}

export class AuthApi {
  constructor(private request: APIRequestContext) {}

  async login(username: string, password: string): Promise<LoginResponse> {
    return ApiHelper.postJson<LoginResponse>(this.request, '/auth/login', { username, password });
  }

  async logout(): Promise<void> {
    await ApiHelper.postJson<{ success: boolean }>(this.request, '/auth/logout', {});
  }
}
