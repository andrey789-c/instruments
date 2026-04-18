import { BadRequestException, ConflictException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";

import * as bcrypt from "bcrypt";
import * as crypto from "crypto";
import { ConfigService } from "@nestjs/config";
import { TelegramService } from "src/telegram/telegram.service";

const OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 минут
const MAX_ATTEMPTS = 5; // макс попыток ввода кода

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private telegram: TelegramService,
  ) {}

  // ─── Auth ─────────────────────────────────────────────────────────

  async validateUser(email: string, pass: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return null;
    const match = await bcrypt.compare(pass, user.password);
    if (!match) return null;
    const { password, ...rest } = user as any;
    return rest;
  }

  async login(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      ownerId: user.ownerId || user.id,
    };
    return { access_token: this.jwt.sign(payload) };
  }

  async createUser(data: {
    email: string;
    password: string;
    role?: string;
    ownerId?: string;
    organizationName: string;
    phone?: string;
  }) {
    const hashed = await bcrypt.hash(data.password, 10);
   
    try {
      return await this.prisma.user.create({
        data: {
          email: data.email,
          password: hashed,
          role: data.role as any,
          organizationName: data.organizationName,
          ownerId: data.ownerId,
          phone: data.phone ? this.normalizePhone(data.phone) : undefined,
        },
        select: {
          id: true,
          email: true,
          role: true,
          organizationName: true,
          ownerId: true,
          phone: true,
          phoneVerified: true,
          createdAt: true,
        },
      });
    } catch (error) {
      // P2002 — нарушение уникального ограничения
      if (error?.code === 'P2002') {
        const field = error?.meta?.target?.[0];
        if (field === 'email') {
          throw new ConflictException('Пользователь с таким email уже существует');
        }
        if (field === 'phone') {
          throw new ConflictException('Этот номер телефона уже привязан к другому аккаунту');
        }
        throw new ConflictException('Такая запись уже существует');
      }
      throw error;
    }
  }

  // ─── Step 1: отправить OTP в Telegram ─────────────────────────────

  async sendOtp(email: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    // Не раскрываем, существует ли пользователь
    if (!user) return;

    if (!user.telegramId) {
      throw new BadRequestException(
        "К этому аккаунту не привязан Telegram. Обратитесь к администратору.",
      );
    }

    // Удаляем старые неиспользованные коды
    await this.prisma.passwordResetToken.deleteMany({
      where: { userId: user.id, usedAt: null },
    });

    // Генерируем 6-значный код
    const code = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MS);

    await this.prisma.passwordResetToken.create({
      data: { code, userId: user.id, expiresAt },
    });

    await this.telegram.sendOtpCode(user.telegramId, code);
  }

  // ─── Step 2: проверить OTP, выдать resetToken ──────────────────────

  async verifyOtp(email: string, code: string): Promise<string> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new BadRequestException("Неверный код");

    const record = await this.prisma.passwordResetToken.findFirst({
      where: { userId: user.id, usedAt: null },
      orderBy: { createdAt: "desc" },
    });

    if (!record) {
      throw new BadRequestException("Код не найден. Запросите новый.");
    }

    if (record.expiresAt < new Date()) {
      throw new BadRequestException(
        "Срок действия кода истёк. Запросите новый.",
      );
    }

    if (record.attempts >= MAX_ATTEMPTS) {
      throw new BadRequestException(
        "Слишком много неверных попыток. Запросите новый код.",
      );
    }

    if (record.code !== code) {
      await this.prisma.passwordResetToken.update({
        where: { id: record.id },
        data: { attempts: { increment: 1 } },
      });
      const left = MAX_ATTEMPTS - record.attempts - 1;
      throw new BadRequestException(
        `Неверный код. Осталось попыток: ${left}`,
      );
    }

    // Код верный — генерируем одноразовый resetToken и помечаем OTP как использованный
    const resetToken = crypto.randomBytes(32).toString("hex");

    await this.prisma.passwordResetToken.update({
      where: { id: record.id },
      data: {
        usedAt: new Date(),
        // Сохраняем resetToken в поле code (он уже использован как OTP)
        code: `verified:${resetToken}`,
      },
    });

    return resetToken;
  }

  // ─── Step 3: сменить пароль по resetToken ─────────────────────────

  private normalizePhone(phone: string): string {
    let digits = phone.replace(/\D/g, '');
    if (digits.startsWith('8') && digits.length === 11) {
      digits = '7' + digits.slice(1);
    }
    return digits;
  }

  async resetPassword(resetToken: string, newPassword: string): Promise<void> {
    const record = await this.prisma.passwordResetToken.findFirst({
      where: { code: `verified:${resetToken}` },
    });

    if (!record) {
      throw new BadRequestException(
        "Сессия сброса недействительна. Начните заново.",
      );
    }

    // resetToken действителен 15 минут после верификации OTP
    const resetExpiry = new Date(record.usedAt!.getTime() + 15 * 60 * 1000);
    if (resetExpiry < new Date()) {
      throw new BadRequestException(
        "Время на смену пароля истекло. Начните заново.",
      );
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: record.userId },
        data: { password: hashed },
      }),
      this.prisma.passwordResetToken.delete({
        where: { id: record.id },
      }),
    ]);
  }
}
