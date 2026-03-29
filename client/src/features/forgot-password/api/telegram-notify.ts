/**
 * @file telegramNotify.ts
 * @description TEST utility — sends a password-reset notification to Telegram.
 *
 * В продакшне замените BOT_TOKEN и CHAT_ID переменными окружения:
 *   VITE_TELEGRAM_BOT_TOKEN
 *   VITE_TELEGRAM_CHAT_ID
 */

export interface TelegramPayload {
  email: string;
  requestedAt: string;
  userAgent?: string;
}

export interface TelegramResult {
  ok: boolean;
  messageId?: number;
  error?: string;
}

const BOT_TOKEN = process.env.VITE_TELEGRAM_BOT_TOKEN ?? "YOUR_BOT_TOKEN";
const CHAT_ID   = process.env.VITE_TELEGRAM_CHAT_ID   ?? "YOUR_CHAT_ID";

export async function sendPasswordResetToTelegram(
  payload: TelegramPayload
): Promise<TelegramResult> {
  const text = [
    "🔐 *Запрос сброса пароля*",
    "",
    `📧 Email: \`${payload.email}\``,
    `🕐 Время: ${payload.requestedAt}`,
    `🖥 UA: ${payload.userAgent ?? navigator.userAgent}`,
    "",
    "_⚠️ Это тестовое уведомление — не для продакшна_",
  ].join("\n");

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id:    CHAT_ID,
          text,
          parse_mode: "Markdown",
        }),
      }
    );

    const json = await res.json();

    if (!res.ok || !json.ok) {
      return { ok: false, error: json.description ?? "Telegram API error" };
    }

    return { ok: true, messageId: json.result?.message_id };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}