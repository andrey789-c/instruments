import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);
  private readonly botToken: string;
  private readonly apiUrl: string;

  constructor(private config: ConfigService) {
    this.botToken = this.config.get<string>('TELEGRAM_BOT_TOKEN', '');
    this.apiUrl = `https://api.telegram.org/bot${this.botToken}`;
  }

  async sendOtpCode(chatId: string, code: string): Promise<void> {
    if (!this.botToken) {
      this.logger.error('TELEGRAM_BOT_TOKEN is not set');
      throw new Error('Telegram не настроен. Обратитесь к администратору.');
    }

    const text = [
      `🔐 *Код для сброса пароля StockFlow*`,
      ``,
      `Ваш код: *${code}*`,
      ``,
      `⏱ Действителен 10 минут.`,
      `Если вы не запрашивали сброс — проигнорируйте это сообщение.`,
    ].join('\n');

    const response = await fetch(`${this.apiUrl}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'Markdown',
      }),
    });

    const data = await response.json() as { ok: boolean; description?: string };

    if (!data.ok) {
      this.logger.error(`Telegram sendMessage failed: ${data.description}`);

      // Удобное сообщение для частых ошибок
      if (data.description?.includes('chat not found')) {
        throw new Error(
          'Telegram-аккаунт не найден. Убедитесь, что вы написали боту /start и указали верный chat_id в профиле.',
        );
      }
      if (data.description?.includes('bot was blocked')) {
        throw new Error('Бот заблокирован. Разблокируйте его в Telegram и попробуйте снова.');
      }

      throw new Error('Не удалось отправить код в Telegram. Попробуйте позже.');
    }

    this.logger.log(`OTP sent to Telegram chat ${chatId}`);
  }
}