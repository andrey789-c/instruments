// client/src/shared/api/authApi.ts
// Полная замена файла — добавлены методы phone верификации

import { apiClient } from './apiClient';

export interface LoginRequest { email: string; password: string; }
export interface RegisterRequest {
  email: string;
  password: string;
  organizationName: string;
  phone?: string;  // ← НОВОЕ
}
export interface User {
  id: string;
  email: string;
  role: 'USER' | 'ADMIN' | 'SUPERADMIN';
  organizationName: string;
  ownerId: string | null;
  phone?: string;           // ← НОВОЕ
  phoneVerified?: boolean;  // ← НОВОЕ
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

  // ─── Password Reset ───────────────────────────────────────────────────

  async forgotPassword(email: string): Promise<{ message: string }> {
    return apiClient.post('/auth/forgot-password', { email });
  }

  async verifyOtp(email: string, code: string): Promise<{ resetToken: string }> {
    return apiClient.post('/auth/verify-otp', { email, code });
  }

  async resetPassword(resetToken: string, password: string): Promise<{ message: string }> {
    return apiClient.post('/auth/reset-password', { resetToken, password });
  }

  // ─── Phone Verification (NEW) ─────────────────────────────────────────

  /**
   * Генерирует deep link для кнопки «Подтвердить через Telegram»
   */
  async getPhoneDeepLink(phone: string): Promise<{ url: string; hash: string }> {
    return apiClient.post('/auth/phone/deep-link', { phone });
  }

  /**
   * Проверяет, подтверждён ли номер (polling)
   */
  async getPhoneVerificationStatus(phone: string): Promise<{ verified: boolean }> {
    return apiClient.get(`/auth/phone/status?phone=${encodeURIComponent(phone)}`);
  }

  isAuthenticated(): boolean {
    return apiClient.isAuthenticated();
  }
}

export const authApi = new AuthApi();