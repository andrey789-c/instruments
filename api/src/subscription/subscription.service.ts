import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';
import { addMonths } from 'date-fns';
import { PrismaService } from '../prisma/prisma.service';
import { Plan } from './dto/init-payment.dto';

const PLAN_PRICES: Record<Plan, number> = {
  [Plan.PRO]:        990,
  [Plan.ENTERPRISE]: 1999,
};

const PLAN_DESCRIPTIONS: Record<Plan, string> = {
  [Plan.PRO]:        'Подписка StockFlow PRO',
  [Plan.ENTERPRISE]: 'Подписка StockFlow Enterprise',
};

@Injectable()
export class SubscriptionService {
  private readonly logger = new Logger(SubscriptionService.name);

  private readonly merchantLogin: string;
  private readonly password1: string;
  private readonly password2: string;
  private readonly isTest: boolean;

  constructor(private readonly prisma: PrismaService) {
    this.merchantLogin = process.env.ROBOKASSA_MERCHANT_LOGIN ?? '';
    this.password1     = process.env.ROBOKASSA_PASSWORD1 ?? '';
    this.password2     = process.env.ROBOKASSA_PASSWORD2 ?? '';
    this.isTest        = process.env.ROBOKASSA_TEST === 'true';
  }

  async getStatus(userId: string) {
    const sub = await this.prisma.subscription.findUnique({
      where: { userId },
    });

    const isActive = !!sub && sub.expiresAt > new Date();

    return {
      active:    isActive,
      expiresAt: isActive ? sub.expiresAt.toISOString() : null,
      plan:      isActive ? sub.plan : 'FREE',
    };
  }

  async initPayment(userId: string, plan: Plan) {
    const outSum = PLAN_PRICES[plan];
    const invId  = Math.floor(Date.now() / 1000);

    await this.prisma.pendingPayment.create({
      data: { invId, userId, plan, amount: outSum },
    });

    const signature = this.sign(
      `${this.merchantLogin}:${outSum}:${invId}:${this.password1}`,
    );

    const params = new URLSearchParams({
      MerchantLogin:  this.merchantLogin,
      OutSum:         String(outSum),
      InvId:          String(invId),
      Description:    PLAN_DESCRIPTIONS[plan],
      SignatureValue: signature,
      ...(this.isTest ? { IsTest: '1' } : {}),
    });

    const paymentUrl = `https://auth.robokassa.ru/Merchant/Index.aspx?${params}`;

    this.logger.log(`Payment initiated: userId=${userId} invId=${invId} plan=${plan}`);

    return { paymentUrl, invId };
  }

  async handleResult(body: Record<string, string>): Promise<string> {
    const { OutSum, InvId, SignatureValue } = body;

    if (!OutSum || !InvId || !SignatureValue) {
      throw new BadRequestException('Missing required Robokassa fields');
    }

    const expected = this.sign(`${OutSum}:${InvId}:${this.password2}`);

    if (SignatureValue.toLowerCase() !== expected) {
      this.logger.warn(`Bad signature invId=${InvId}: got=${SignatureValue} want=${expected}`);
      throw new BadRequestException('Invalid signature');
    }

    const invId   = Number(InvId);
    const pending = await this.prisma.pendingPayment.findUnique({
      where: { invId },
    });

    if (!pending) {
      this.logger.warn(`Unknown invId=${invId}`);
      throw new BadRequestException('Unknown invId');
    }

    if (pending.status === 'PAID') {
      return `OK${InvId}`;
    }

    await this.prisma.$transaction([
      this.prisma.subscription.upsert({
        where:  { userId: pending.userId },
        create: {
          userId:    pending.userId,
          plan:      pending.plan,
          active:    true,
          expiresAt: addMonths(new Date(), 1),
        },
        update: {
          plan:      pending.plan,
          active:    true,
          expiresAt: addMonths(new Date(), 1),
        },
      }),
      this.prisma.pendingPayment.update({
        where: { invId },
        data:  { status: 'PAID' },
      }),
    ]);

    this.logger.log(`Subscription activated: userId=${pending.userId} plan=${pending.plan}`);

    return `OK${InvId}`;
  }

  private sign(str: string): string {
    return crypto.createHash('md5').update(str).digest('hex').toLowerCase();
  }
}