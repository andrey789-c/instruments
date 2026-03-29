import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';         // существующий (OTP для сброса пароля)
import { TelegramBotService } from './telegram-bot.service'; // новый (deep link + contacts)
import { TelegramWebhookController } from './telegram-webhook.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TelegramWebhookController],
  providers: [TelegramService, TelegramBotService],
  exports: [TelegramService, TelegramBotService]
})
export class TelegramModule {}