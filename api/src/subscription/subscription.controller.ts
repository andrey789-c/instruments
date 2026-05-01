// src/subscription/subscription.controller.ts
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { SubscriptionService } from './subscription.service';
import { InitPaymentDto, Plan } from './dto/init-payment.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @UseGuards(JwtAuthGuard)
  @Get('status')
  async getStatus(@Req() req: Request) {
    const user = req.user as { id: string };
    return this.subscriptionService.getStatus(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('init')
  async initPayment(@Req() req: Request, @Body() dto: InitPaymentDto) {
    const user = req.user as { id: string };
    return this.subscriptionService.initPayment(user.id, dto.plan ?? Plan.PRO);
  }

  @Post('result')
  @HttpCode(200)
  async handleResult(
    @Body() body: Record<string, string>,
    @Res() res: Response,
  ) {
    const result = await this.subscriptionService.handleResult(body);
    res.setHeader('Content-Type', 'text/plain');
    res.send(result);
  }
}