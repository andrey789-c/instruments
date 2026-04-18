import { Injectable, Logger } from '@nestjs/common';
import { TelegramBotService } from './telegram-bot.service';

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);

  constructor(private readonly bot: TelegramBotService) {}

  async sendOtpCode(chatId: string, code: string): Promise<void> {
    try {
      await this.bot.sendOtpCode(chatId, code);
      this.logger.log(`OTP sent to Telegram chat ${chatId}`);
    } catch (err) {
      this.logger.error(`Telegram sendOtpCode failed`, err);

      const msg = err?.message || '';
      if (msg.includes('chat not found')) {
        throw new Error(
          'Telegram-аккаунт не найден. Убедитесь, что вы написали боту /start и указали верный chat_id в профиле.',
        );
      }
      if (msg.includes('bot was blocked')) {
        throw new Error('Бот заблокирован. Разблокируйте его в Telegram и попробуйте снова.');
      }

      throw new Error('Не удалось отправить код в Telegram. Попробуйте позже.');
    }
  }
}