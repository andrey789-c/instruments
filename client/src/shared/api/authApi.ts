const API_URL = process.env.NEXT_PUBLIC_API_URL;

export class ApiError extends Error {
  status: number;
  phone?: string;

  constructor(message: string, status: number, phone?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.phone = phone;
  }
}

export interface User {
  id: string;
  email: string;
  role: 'USER' | 'ADMIN' | 'SUPERADMIN';
  organizationName: string;
  ownerId?: string | null;
  phone?: string | null;
  phoneVerified?: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  organizationName: string;
  phone: string;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = `Ошибка ${res.status}`;
    let phone: string | undefined;

    try {
      const data = await res.json();

      if (data && typeof data === 'object' && 'phone' in data && typeof data.phone === 'string') {
        phone = data.phone;
      }

      if (Array.isArray(data.message)) {
        const first = data.message[0];
        if (typeof first === 'string') message = first;
        else if (first?.errors?.length) message = first.errors[0];
      } else if (typeof data.message === 'string') {
        message = data.message;
      } else if (data.message && typeof data.message === 'object') {
        if ('message' in data.message && typeof data.message.message === 'string') {
          message = data.message.message;
        }
        if ('phone' in data.message && typeof data.message.phone === 'string') {
          phone = data.message.phone;
        }
      }
    } catch { /* ignore */ }
    throw new ApiError(message, res.status, phone);
  }
  return res.json() as Promise<T>;
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<{ success: boolean; user: User }> => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(credentials),
    });
    return handleResponse(res);
  },

  register: async (data: RegisterData): Promise<User> => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  logout: async (): Promise<void> => {
    await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  },

  getCurrentUser: async (): Promise<User> => {
    const res = await fetch(`${API_URL}/auth/me`, {
      method: 'POST',
      credentials: 'include',
    });
    return handleResponse(res);
  },

  isAuthenticated: (): boolean => {
    if (typeof document === 'undefined') return false;
    return document.cookie.includes('auth_token');
  },

  forgotPassword: async (email: string): Promise<{ message: string }> => {
    const res = await fetch(`${API_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return handleResponse(res);
  },

  verifyOtp: async (email: string, code: string): Promise<{ resetToken: string }> => {
    const res = await fetch(`${API_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code }),
    });
    return handleResponse(res);
  },

  resetPassword: async (resetToken: string, password: string): Promise<{ message: string }> => {
    const res = await fetch(`${API_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resetToken, password }),
    });
    return handleResponse(res);
  },

  getPhoneDeepLink: async (phone: string): Promise<{ url: string; hash: string }> => {
    const res = await fetch(`${API_URL}/auth/phone/deep-link`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    });
    return handleResponse(res);
  },

  checkPhoneStatus: async (phone: string): Promise<{ verified: boolean }> => {
    const res = await fetch(`${API_URL}/auth/phone/status?phone=${encodeURIComponent(phone)}`, {
      credentials: 'include',
    });
    return handleResponse(res);
  },
};