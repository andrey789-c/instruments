import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TelegramBotService } from './telegram-bot.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [TelegramBotService, TelegramService],
  exports: [TelegramService, TelegramBotService],
})
export class TelegramModule {}