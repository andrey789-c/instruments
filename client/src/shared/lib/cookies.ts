/**
 * Утилиты для работы с cookies
 * Поддерживает SSR (Server-Side Rendering)
 */

export interface CookieOptions {
  expires?: number | Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}

class CookieManager {
  /**
   * Установить cookie
   */
  set(name: string, value: string, options: CookieOptions = {}): void {
    if (typeof window === 'undefined') return;

    const {
      expires,
      path = '/',
      domain,
      secure = process.env.NODE_ENV === 'production',
      sameSite = 'lax',
    } = options;

    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

    if (expires) {
      const expiresDate = typeof expires === 'number' 
        ? new Date(Date.now() + expires * 1000)
        : expires;
      cookieString += `; expires=${expiresDate.toUTCString()}`;
    }

    cookieString += `; path=${path}`;

    if (domain) {
      cookieString += `; domain=${domain}`;
    }

    if (secure) {
      cookieString += '; secure';
    }

    cookieString += `; samesite=${sameSite}`;

    document.cookie = cookieString;
  }

  /**
   * Получить значение cookie
   */
  get(name: string): string | null {
    if (typeof window === 'undefined') return null;

    const nameEQ = encodeURIComponent(name) + '=';
    const cookies = document.cookie.split(';');

    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i];
      while (cookie.charAt(0) === ' ') {
        cookie = cookie.substring(1);
      }
      if (cookie.indexOf(nameEQ) === 0) {
        return decodeURIComponent(cookie.substring(nameEQ.length));
      }
    }

    return null;
  }

  /**
   * Удалить cookie
   */
  remove(name: string, options: Pick<CookieOptions, 'path' | 'domain'> = {}): void {
    this.set(name, '', {
      ...options,
      expires: new Date(0),
    });
  }

  /**
   * Проверить существование cookie
   */
  has(name: string): boolean {
    return this.get(name) !== null;
  }

  /**
   * Получить все cookies как объект
   */
  getAll(): Record<string, string> {
    if (typeof window === 'undefined') return {};

    const cookies: Record<string, string> = {};
    const cookieStrings = document.cookie.split(';');

    for (const cookieString of cookieStrings) {
      const [name, value] = cookieString.split('=').map(c => c.trim());
      if (name) {
        cookies[decodeURIComponent(name)] = decodeURIComponent(value || '');
      }
    }

    return cookies;
  }
}

export const cookies = new CookieManager();