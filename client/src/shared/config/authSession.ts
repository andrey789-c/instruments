/**
 * Срок жизни auth_token — совпадает с API (кука + JWT).
 * Дубликат: api/src/auth/auth-session.constants.ts (менять в двух местах одинаково).
 */
export const AUTH_SESSION_MAX_AGE_MS = 24 * 60 * 60 * 1000;
export const AUTH_REMEMBER_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;
