// api/src/telegram/telegram-webhook.controller.ts

import { Controller, Post, Body, Logger } from '@nestjs/common';
import { TelegramBotService } from './telegram-bot.service';

@Controller('telegram')
export class TelegramWebhookController {
  private readonly logger = new Logger(TelegramWebhookController.name);

  constructor(private readonly bot: TelegramBotService) {}

  /**
   * Telegram шлёт сюда все обновления.
   * Зарегистрировать webhook:
   *   curl -X POST "https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://yourdomain.com/api/telegram/webhook"
   */
  @Post('webhook')
  async handleWebhook(@Body() update: TelegramUpdate) {
    this.logger.debug(`Incoming update: ${JSON.stringify(update)}`);

    const msg = update.message;
    if (!msg) return { ok: true };

    const chatId = String(msg.chat.id);

    // ── /start с deep link: /start phone_HASH ──────────────────────
    if (msg.text?.startsWith('/start')) {
      const parts = msg.text.split(' ');
      const payload = parts[1]; // phone_<хэш> или undefined

      if (payload?.startsWith('phone_')) {
        // Пользователь пришёл по ссылке с регистрации
        await this.bot.handleDeepLink(chatId, payload);
      } else {
        // Обычный /start — просто приветствие
        await this.bot.sendMessage(
          chatId,
          '👋 Привет! Я бот StockFlow.\n\nЧтобы подтвердить аккаунт, перейдите по ссылке из формы регистрации.',
        );
      }
      return { ok: true };
    }

    // ── Пользователь поделился контактом ───────────────────────────
    if (msg.contact) {
      await this.bot.handleContact(chatId, msg.contact.phone_number, msg.contact.user_id);
      return { ok: true };
    }

    return { ok: true };
  }
}

// ── Типы Telegram Update (минимальные) ────────────────────────────────────

interface TelegramUpdate {
  update_id: number;
  message?: {
    message_id: number;
    chat: { id: number; type: string };
    from?: { id: number; username?: string };
    text?: string;
    contact?: {
      phone_number: string;
      first_name: string;
      user_id?: number;
    };
  };
}