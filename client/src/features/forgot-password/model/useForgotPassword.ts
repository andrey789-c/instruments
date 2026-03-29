'use client'

import { useState } from "react";
import { sendPasswordResetToTelegram } from "../api/telegram-notify";

export type ForgotPasswordStatus =
  | "idle"
  | "loading"
  | "success"
  | "error"
  | "telegram_sent"
  | "telegram_failed";

export interface ForgotPasswordState {
  email:    string;
  status:   ForgotPasswordStatus;
  errorMsg: string | null;
}

export function useForgotPassword() {
  const [state, setState] = useState<ForgotPasswordState>({
    email:    "",
    status:   "idle",
    errorMsg: null,
  });

  const setEmail = (email: string) =>
    setState((s) => ({ ...s, email, errorMsg: null }));

  const submit = async () => {
    if (!state.email.includes("@")) {
      setState((s) => ({ ...s, errorMsg: "Введите корректный email" }));
      return;
    }

    setState((s) => ({ ...s, status: "loading", errorMsg: null }));

    // --- Имитация вызова вашего API ---
    await new Promise((r) => setTimeout(r, 800));

    // --- TEST: отправка уведомления в Telegram ---
    const result = await sendPasswordResetToTelegram({
      email:       state.email,
      requestedAt: new Date().toLocaleString("ru-RU"),
    });

    setState((s) => ({
      ...s,
      status: result.ok ? "telegram_sent" : "telegram_failed",
      errorMsg: result.ok ? null : `Telegram: ${result.error}`,
    }));
  };

  const reset = () =>
    setState({ email: "", status: "idle", errorMsg: null });

  return { state, setEmail, submit, reset };
}