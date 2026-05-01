// src/subscription/dto/init-payment.dto.ts
import { IsEnum } from 'class-validator';

export enum Plan {
  PRO        = 'PRO',
  ENTERPRISE = 'ENTERPRISE',
}

export class InitPaymentDto {
  @IsEnum(Plan)
  plan: Plan = Plan.PRO;
}