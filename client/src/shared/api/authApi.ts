import { apiClient } from './apiClient';

export interface LoginRequest { email: string; password: string; }
export interface RegisterRequest { email: string; password: string; organizationName: string; }
export interface User {
  id: string; email: string;
  role: 'USER' | 'ADMIN' | 'SUPERADMIN';
  organizationName: string;
  ownerId: string | null;
  createdAt: string;
}

class AuthApi {
  async login(data: LoginRequest) {
    return apiClient.post<{ success: boolean; user: Omit<User, 'ownerId' | 'createdAt'> }>('/auth/login', data);
  }

  async register(data: RegisterRequest): Promise<User> {
    return apiClient.post<User>('/auth/register', data);
  }

  async getCurrentUser(): Promise<User> {
    return apiClient.post<User>('/auth/me', {});
  }

  async logout(): Promise<void> {
    try { await apiClient.post('/auth/logout'); } catch { /* ignore */ }
  }

  // ─── Password Reset ───────────────────────────────────────────────

  /** Шаг 1: запросить OTP */
  async forgotPassword(email: string): Promise<{ message: string }> {
    return apiClient.post('/auth/forgot-password', { email });
  }

  /** Шаг 2: проверить OTP → получить resetToken */
  async verifyOtp(email: string, code: string): Promise<{ resetToken: string }> {
    return apiClient.post('/auth/verify-otp', { email, code });
  }

  /** Шаг 3: сменить пароль */
  async resetPassword(resetToken: string, password: string): Promise<{ message: string }> {
    return apiClient.post('/auth/reset-password', { resetToken, password });
  }

  isAuthenticated(): boolean {
    return apiClient.isAuthenticated();
  }
}

export const authApi = new AuthApi();