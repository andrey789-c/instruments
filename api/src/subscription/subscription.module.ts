// src/subscription/subscription.module.ts
import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { PrismaModule } from '../prisma/prisma.module'; // замените на свой путь

@Module({
  imports: [PrismaModule],
  controllers: [SubscriptionController],
  providers:   [SubscriptionService],
  exports:     [SubscriptionService],
})
export class SubscriptionModule {}