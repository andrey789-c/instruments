/**
 * Универсальный HTTP клиент для работы с API
 * Поддерживает автоматическую авторизацию, обработку ошибок и типизацию
 * Использует cookies для хранения токена
 */

import { cookies } from '../lib/cookies';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export interface ApiError {
  message: string;
  statusCode?: number;
  errors?: Array<{ field: string; errors: string[] }>;
}

export interface RequestConfig extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

class ApiClient {
  private readonly baseURL: string;
  private readonly tokenKey = 'auth_token';
  private readonly tokenExpireDays = 7; // Токен истекает через 7 дней

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getToken(): string | null {
    return cookies.get(this.tokenKey);
  }

  setToken(token: string): void {
    cookies.set(this.tokenKey, token, {
      expires: this.tokenExpireDays * 24 * 60 * 60, // в секундах
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
  }

  removeToken(): void {
    cookies.remove(this.tokenKey, { path: '/' });
  }

  isAuthenticated(): boolean {
    return cookies.has(this.tokenKey);
  }

  private buildURL(endpoint: string, params?: Record<string, string | number | boolean>): string {
    const url = new URL(`${this.baseURL}${endpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    return url.toString();
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (response.status === 204) {
      return null as T;
    }

    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');

    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      if (Array.isArray(data)) {
        const validationErrors = data
          .map((err) => err.errors?.join(', '))
          .filter(Boolean)
          .join('; ');
        throw new Error(validationErrors || 'Ошибка валидации данных');
      }

      // Если 401 - удаляем токен и редиректим на авторизацию
      // if (response.status === 401) {
      //   this.removeToken();
      //   // if (typeof window !== 'undefined') {
      //   //   window.location.href = '/auth';
      //   // }
      // }

      // Обычная ошибка с сообщением
      throw new Error(data?.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return data;
  }

  private async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const { params, headers, ...restConfig } = config;

    const url = this.buildURL(endpoint, params);
    const token = this.getToken();

    const requestConfig: RequestInit = {
      ...restConfig,
      credentials: 'include', // Важно для работы с cookies
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...headers,
      },
    };

    try {
      const response = await fetch(url, requestConfig);
      return this.handleResponse<T>(response);
    } catch (error) {
      // Обработка сетевых ошибок
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error('Не удалось подключиться к серверу. Проверьте соединение.');
      }
      throw error;
    }
  }

  /**
   * GET запрос
   */
  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'GET',
    });
  }

  /**
   * POST запрос
   */
  async post<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async upload<T>(
    endpoint: string,
    formData: FormData,
    config?: RequestConfig
  ): Promise<T> {
    const token = this.getToken();

    const requestConfig: RequestInit = {
      ...config,
      method: 'POST',
      body: formData,
      credentials: 'include',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        ...config?.headers,
      },
    };

    try {
      const url = this.buildURL(endpoint, config?.params);
      const response = await fetch(url, requestConfig);
      return this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error('Не удалось подключиться к серверу. Проверьте соединение.');
      }
      throw error;
    }
  }
}

export const apiClient = new ApiClient(API_URL);