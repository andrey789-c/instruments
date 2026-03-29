import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class TelegramBotService {
  private readonly logger = new Logger(TelegramBotService.name);
  private readonly botToken: string;
  private readonly apiUrl: string;

  // Временное хранилище: hash → phone (живёт 15 мин)
  // В продакшне замените на Redis
  private readonly pendingLinks = new Map<string, { phone: string; expiresAt: number }>();

  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.botToken = this.config.get<string>('TELEGRAM_BOT_TOKEN', '');
    this.apiUrl = `https://api.telegram.org/bot${this.botToken}`;
  }

  generateDeepLink(phone: string): { url: string; hash: string } {
    const normalized = this.normalizePhone(phone);
    const hash = crypto.randomBytes(16).toString('hex');

    this.pendingLinks.set(hash, {
      phone: normalized,
      expiresAt: Date.now() + 15 * 60 * 1000, // 15 минут
    });

    const botUsername = this.config.get<string>('TELEGRAM_BOT_USERNAME');
    const url = `https://t.me/${botUsername}?start=phone_${hash}`;

    return { url, hash };
  }

  /**
   * Вызывается когда пользователь нажал deep link и бот получил /start phone_HASH.
   * Просим поделиться контактом через кнопку.
   */
  async handleDeepLink(chatId: string, payload: string): Promise<void> {
    const hash = payload.replace('phone_', '');
    const pending = this.pendingLinks.get(hash);

    if (!pending || pending.expiresAt < Date.now()) {
      await this.sendMessage(chatId, '❌ Ссылка устарела. Пожалуйста, вернитесь на сайт и попробуйте снова.');
      return;
    }

    // Просим поделиться контактом — Telegram сам верифицирует номер
    await this.sendMessageWithKeyboard(chatId, {
      text: '📱 Чтобы подтвердить аккаунт StockFlow, нажмите кнопку ниже и поделитесь номером телефона.',
      keyboard: {
        keyboard: [[{ text: '📲 Поделиться номером', request_contact: true }]],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    });

    // Привязываем chatId к hash для дальнейшей обработки контакта
    // Сохраняем в тот же pending
    this.pendingLinks.set(hash, { ...pending, chatId } as any);
    // Также индексируем по chatId чтобы найти при получении контакта
    this.pendingLinks.set(`chat_${chatId}`, { ...pending, hash } as any);
  }


  async handleContact(chatId: string, phoneFromTelegram: string, telegramUserId?: number): Promise<void> {
    const pendingKey = `chat_${chatId}`;
    const pending = this.pendingLinks.get(pendingKey) as any;

    if (!pending || pending.expiresAt < Date.now()) {
      await this.sendMessage(chatId, '❌ Сессия истекла. Вернитесь на сайт и начните заново.');
      return;
    }

    const normalizedFromTg = this.normalizePhone(phoneFromTelegram);
    const normalizedExpected = this.normalizePhone(pending.phone);

    // Проверяем что номер совпадает с тем, что вводил пользователь на сайте
    if (normalizedFromTg !== normalizedExpected) {
      await this.sendMessage(
        chatId,
        `❌ Номер в Telegram (${phoneFromTelegram}) не совпадает с указанным на сайте.\n\nВернитесь на сайт и введите номер, привязанный к вашему Telegram.`,
      );
      return;
    }

    // Сохраняем telegramId и помечаем телефон как подтверждённый
    await this.prisma.user.updateMany({
      where: { phone: normalizedExpected },
      data: {
        telegramId: chatId,
        phoneVerified: true,
      },
    });

    // Чистим временные записи
    this.pendingLinks.delete(pendingKey);
    this.pendingLinks.delete(pending.hash);

    // Убираем клавиатуру и показываем успех
    await this.sendMessageWithKeyboard(chatId, {
      text: '✅ Отлично! Номер телефона подтверждён.\n\nТеперь вы можете войти в StockFlow.',
      keyboard: { remove_keyboard: true },
    });
  }


  async sendOtpCode(chatId: string, code: string): Promise<void> {
    const text = [
      `🔐 *Код подтверждения StockFlow*`,
      ``,
      `Ваш код: *${code}*`,
      ``,
      `⏱ Действителен 10 минут.`,
    ].join('\n');

    await this.sendMessage(chatId, text, 'Markdown');
  }

  async sendMessage(chatId: string, text: string, parseMode?: string): Promise<void> {
    await fetch(`${this.apiUrl}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        ...(parseMode && { parse_mode: parseMode }),
      }),
    });
  }

  private async sendMessageWithKeyboard(
    chatId: string,
    opts: { text: string; keyboard: object },
  ): Promise<void> {
    await fetch(`${this.apiUrl}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: opts.text,
        reply_markup: opts.keyboard,
      }),
    });
  }

  async checkPhoneVerified(phone: string): Promise<boolean> {
    const normalized = this.normalizePhone(phone);
    const user = await this.prisma.user.findUnique({
      where: { phone: normalized },
      select: { phoneVerified: true },
    });
    return user?.phoneVerified ?? false;
  }

  private normalizePhone(phone: string): string {
    // Убираем всё кроме цифр, заменяем ведущую 8 на 7
    let digits = phone.replace(/\D/g, '');
    if (digits.startsWith('8') && digits.length === 11) {
      digits = '7' + digits.slice(1);
    }
    return digits;
  }
}