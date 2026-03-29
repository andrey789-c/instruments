'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { authApi } from '@/src/shared/api';

export type VerificationState =
  | 'idle'          // ещё не начато
  | 'generating'    // запрашиваем deep link
  | 'waiting'       // ждём пока пользователь подтвердит в Telegram
  | 'verified'      // подтверждено
  | 'expired'       // истекло 15 минут
  | 'error';        // ошибка сети

export interface UsePhoneVerificationReturn {
  state: VerificationState;
  telegramUrl: string | null;
  secondsLeft: number;
  start: (phone: string) => Promise<void>;
  reset: () => void;
}

const POLL_INTERVAL_MS = 2000;  // опрашиваем каждые 2 сек
const EXPIRE_SECONDS   = 15 * 60; // 15 минут — как на бэкенде

export function usePhoneVerification(): UsePhoneVerificationReturn {
  const [state, setState]         = useState<VerificationState>('idle');
  const [telegramUrl, setUrl]     = useState<string | null>(null);
  const [secondsLeft, setSeconds] = useState(EXPIRE_SECONDS);

  const pollRef      = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerRef     = useRef<ReturnType<typeof setInterval> | null>(null);
  const phoneRef     = useRef<string>('');

  const clearTimers = useCallback(() => {
    if (pollRef.current)  clearInterval(pollRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    pollRef.current  = null;
    timerRef.current = null;
  }, []);

  // Запустить polling
  const startPolling = useCallback((phone: string) => {
    clearTimers();

    // Обратный отсчёт
    setSeconds(EXPIRE_SECONDS);
    timerRef.current = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          clearTimers();
          setState('expired');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Polling статуса
    pollRef.current = setInterval(async () => {
      try {
        const { verified } = await authApi.getPhoneVerificationStatus(phone);
        if (verified) {
          clearTimers();
          setState('verified');
        }
      } catch {
        // сетевая ошибка — продолжаем polling, не прерываем
      }
    }, POLL_INTERVAL_MS);
  }, [clearTimers]);

  const start = useCallback(async (phone: string) => {
    if (!phone || phone.replace(/\D/g, '').length < 10) return;

    phoneRef.current = phone;
    setState('generating');

    try {
      const { url } = await authApi.getPhoneDeepLink(phone);
      setUrl(url);
      setState('waiting');
      startPolling(phone);
    } catch (err) {
      setState('error');
    }
  }, [startPolling]);

  const reset = useCallback(() => {
    clearTimers();
    setState('idle');
    setUrl(null);
    setSeconds(EXPIRE_SECONDS);
    phoneRef.current = '';
  }, [clearTimers]);

  // Чистим при unmount
  useEffect(() => () => clearTimers(), [clearTimers]);

  return { state, telegramUrl, secondsLeft, start, reset };
}