import { ApiHelper } from '@utils/ApiHelper';

export interface LoginResponse {
  token: string;
  userId: string;
}

export class AuthApi {
  static async login(username: string, password: string): Promise<LoginResponse> {
    return ApiHelper.post<LoginResponse>('/auth/login', { username, password });
  }

  static async logout(token: string): Promise<void> {
    await ApiHelper.post('/auth/logout', {}, { Authorization: `Bearer ${token}` });
  }
}
