import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { Telegraf, Markup } from 'telegraf';
import * as crypto from 'crypto';

@Injectable()
export class TelegramBotService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(TelegramBotService.name);
  private bot: Telegraf;
  private running = false;

  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    const token = this.config.get<string>('TELEGRAM_BOT_TOKEN', '');
    this.bot = new Telegraf(token);
  }

  // ─── Lifecycle: автозапуск polling ───────────────────────────────

  async onModuleInit() {
    this.registerHandlers();

    try {
      // Сносим webhook чтобы polling не конфликтовал
      await this.bot.telegram.deleteWebhook({ drop_pending_updates: true });

      // ВАЖНО: bot.launch() в polling-режиме возвращает Promise, который
      // резолвится только при остановке бота. Поэтому НЕ await, иначе
      // onModuleInit зависнет навсегда.
      this.bot
        .launch(
          { dropPendingUpdates: true },
          () => {
            this.running = true;
            this.logger.log('Telegram bot started (long polling)');
          },
        )
        .catch((err) => {
          this.running = false;
          this.logger.error('Telegram bot crashed', err?.message || err);
        });
    } catch (err) {
      this.logger.error('Failed to init Telegram bot', err);
    }
  }

  async onModuleDestroy() {
    if (this.running) {
      try {
        this.bot.stop('App shutdown');
        this.logger.log('Telegram bot stopped');
      } catch (err) {
        this.logger.warn(`Bot stop skipped: ${err?.message || err}`);
      }
    }
  }

  // ─── Handlers ───────────────────────────────────────────────────

  private registerHandlers() {
    // /start с deep link: /start phone_HASH
    this.bot.start(async (ctx) => {
      const payload = (ctx as any).startPayload as string | undefined;

      if (payload?.startsWith('phone_')) {
        await this.handleDeepLink(ctx, payload);
      } else {
        await ctx.reply(
          '👋 Привет! Я бот StockFlow.\n\nЧтобы подтвердить аккаунт, перейдите по ссылке из формы регистрации.',
        );
      }
    });

    // Пользователь поделился контактом
    this.bot.on('contact', async (ctx) => {
      const contact = ctx.message.contact;
      const chatId = String(ctx.chat.id);
      await this.handleContact(chatId, contact.phone_number, contact.user_id);
    });
  }

  // ─── Deep link (регистрация) ────────────────────────────────────

  async generateDeepLink(phone: string): Promise<{ url: string; hash: string }> {
    const normalized = this.normalizePhone(phone);
    const hash = crypto.randomBytes(16).toString('hex');

    // Удаляем старые записи для этого номера
    await this.prisma.phoneVerification.deleteMany({ where: { phone: normalized } });

    // Сохраняем в БД
    await this.prisma.phoneVerification.create({
      data: {
        hash,
        phone: normalized,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 минут
      },
    });

    const botUsername = this.config.get<string>('TELEGRAM_BOT_USERNAME');
    const url = `https://t.me/${botUsername}?start=phone_${hash}`;

    return { url, hash };
  }

  /**
   * Вызывается когда пользователь нажал deep link и бот получил /start phone_HASH.
   * Просим поделиться контактом через кнопку.
   */
  private async handleDeepLink(ctx: any, payload: string): Promise<void> {
    const chatId = String(ctx.chat.id);
    const hash = payload.replace('phone_', '');

    console.log(hash)

    // Ищем в БД
    const pending = await this.prisma.phoneVerification.findUnique({ where: { hash } });

    if (!pending || pending.expiresAt < new Date()) {
      await ctx.reply('❌ Ссылка устарела. Пожалуйста, вернитесь на сайт и попробуйте снова.');
      return;
    }

    // Просим поделиться контактом — Telegram сам верифицирует номер
    await ctx.reply(
      '📱 Чтобы подтвердить аккаунт StockFlow, нажмите кнопку ниже и поделитесь номером телефона.',
      Markup.keyboard([
        [Markup.button.contactRequest('📲 Поделиться номером')],
      ]).oneTime().resize(),
    );

    // Привязываем chatId к записи
    await this.prisma.phoneVerification.update({
      where: { hash },
      data: { chatId },
    });
  }

  // ─── Обработка контакта ─────────────────────────────────────────

  private async handleContact(chatId: string, phoneFromTelegram: string, telegramUserId?: number): Promise<void> {
    // Ищем pending верификацию по chatId
    const pending = await this.prisma.phoneVerification.findFirst({
      where: { chatId },
      orderBy: { createdAt: 'desc' },
    });

    if (!pending || pending.expiresAt < new Date()) {
      await this.bot.telegram.sendMessage(chatId, '❌ Сессия истекла. Вернитесь на сайт и начните заново.');
      return;
    }

    const normalizedFromTg = this.normalizePhone(phoneFromTelegram);
    const normalizedExpected = pending.phone;

    console.log('normalizedFromTg', normalizedFromTg);
    console.log('normalizedExpected', normalizedExpected);

    // Проверяем что номер совпадает с тем, что вводил пользователь на сайте
    if (normalizedFromTg !== normalizedExpected) {
      await this.bot.telegram.sendMessage(
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

    // Удаляем использованную запись
    await this.prisma.phoneVerification.delete({ where: { id: pending.id } });

    // Убираем клавиатуру и показываем успех
    await this.bot.telegram.sendMessage(
      chatId,
      '✅ Отлично! Номер телефона подтверждён.\n\nТеперь вы можете войти в StockFlow.',
      { reply_markup: { remove_keyboard: true } },
    );
  }

  // ─── Отправка OTP (сброс пароля) ───────────────────────────────

  async sendOtpCode(chatId: string, code: string): Promise<void> {
    const text = [
      `🔐 *Код подтверждения StockFlow*`,
      ``,
      `Ваш код: *${code}*`,
      ``,
      `⏱ Действителен 10 минут.`,
    ].join('\n');

    await this.bot.telegram.sendMessage(chatId, text, { parse_mode: 'Markdown' });
  }

  // ─── Утилиты ───────────────────────────────────────────────────

  async sendMessage(chatId: string, text: string, parseMode?: string): Promise<void> {
    await this.bot.telegram.sendMessage(chatId, text, parseMode ? { parse_mode: parseMode as any } : {});
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