const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Member {
  id: string;
  email: string;
  role: 'USER' | 'ADMIN' | 'SUPERADMIN';
  ownerId: string | null;
  phone: string | null;
  phoneVerified: boolean;
  createdAt: string;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = `Ошибка ${res.status}`;
    try {
      const data = await res.json();
      if (Array.isArray(data.message)) {
        const first = data.message[0];
        if (typeof first === 'string') message = first;
        else if (first?.errors?.length) message = first.errors[0];
      } else if (typeof data.message === 'string') {
        message = data.message;
      }
    } catch { /* ignore */ }
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

export const usersApi = {
  /** Получить список участников организации */
  list: async (): Promise<Member[]> => {
    const res = await fetch(`${API_URL}/users`, {
      credentials: 'include',
    });
    return handleResponse(res);
  },

  /** Создать нового участника */
  createMember: async (data: {
    email: string;
    password: string;
    phone: string;
    role?: 'USER' | 'ADMIN';
  }): Promise<Member> => {
    const res = await fetch(`${API_URL}/users/members`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  /** Изменить роль участника */
  changeRole: async (userId: string, role: string): Promise<Member> => {
    const res = await fetch(`${API_URL}/users/${userId}/role`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ role }),
    });
    return handleResponse(res);
  },

  /** Удалить участника */
  deleteMember: async (userId: string): Promise<{ success: boolean }> => {
    const res = await fetch(`${API_URL}/users/${userId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    return handleResponse(res);
  },

  /** Сменить пароль участника */
  changePassword: async (userId: string, password: string): Promise<{ success: boolean }> => {
    const res = await fetch(`${API_URL}/users/${userId}/password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ password }),
    });
    return handleResponse(res);
  },
};