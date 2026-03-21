import { apiClient } from './apiClient';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  organizationName: string;
}

export interface AuthResponse {
  access_token: string;
}

export interface User {
  id: string;
  email: string;
  role: 'USER' | 'ADMIN' | 'SUPERADMIN';
  organizationName: string;
  ownerId: string | null;
  createdAt: string;
}

class AuthApi {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    return response;
  }

  async register(data: RegisterRequest): Promise<User> {
    // if (!this.isAuthenticated()) {
    //   throw new Error('Требуется авторизация');
    // }

    const response = await apiClient.post<User>('/auth/create', data);
    return response;
  }

  async getCurrentUser(): Promise<User> {
    if (!this.isAuthenticated()) {
      throw new Error('Требуется авторизация');
    }

    return apiClient.get<User>('/auth/me');
  }

  /**
   * Выход из системы
   */
  async logout(): Promise<void> {
    // Если на бэкенде есть endpoint для logout
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      // Игнорируем ошибку, всё равно удаляем токен
      console.error('Logout error:', error);
    } finally {
      this.removeToken();
    }
  }

  /**
   * Сохранить токен
   */
  saveToken(token: string): void {
    apiClient.setToken(token);
  }

  /**
   * Получить токен
   */
  getToken(): string | null {
    return apiClient.isAuthenticated() ? 'exists' : null; // Для обратной совместимости
  }

  /**
   * Удалить токен (выход)
   */
  removeToken(): void {
    apiClient.removeToken();
  }

  /**
   * Проверка авторизации
   */
  isAuthenticated(): boolean {
    return apiClient.isAuthenticated();
  }
}

export const authApi = new AuthApi();