/**
 * Срок жизни auth_token (cookie) и access JWT — должны совпадать.
 * Дубликат: client/src/shared/config/authSession.ts (менять в двух местах одинаково).
 */
export const AUTH_SESSION_MAX_AGE_MS = 24 * 60 * 60 * 1000;
export const AUTH_REMEMBER_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;
