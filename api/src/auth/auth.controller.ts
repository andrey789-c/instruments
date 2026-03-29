import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Res,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService, private users: UsersService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.auth.validateUser(body.email, body.password);
    if (!user) throw new UnauthorizedException('Неверный email или пароль');

    const { access_token } = await this.auth.login(user);

    res.cookie('auth_token', access_token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        organizationName: user.organizationName,
      },
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('auth_token', { path: '/' });
    return { success: true };
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: CreateUserDto) {
    return this.users.createUser(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Body() dto: CreateUserDto) {
    return this.users.createUser({ ...dto, role: 'SUPERADMIN' });
  }

  @UseGuards(JwtAuthGuard)
  @Post('me')
  async getCurrentUser(@Request() req) {
    return {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role,
      organizationName: req.user.organizationName,
      ownerId: req.user.ownerId,
    };
  }

  // ─── Password Reset (3 шага) ──────────────────────────────────────

  /** Шаг 1: отправить OTP-код в Telegram */
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    await this.auth.sendOtp(dto.email);
    return {
      message:
        'Если аккаунт с таким email существует и к нему привязан Telegram — код отправлен.',
    };
  }

  /** Шаг 2: проверить OTP, получить resetToken */
  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    const resetToken = await this.auth.verifyOtp(dto.email, dto.code);
    return { resetToken };
  }

  /** Шаг 3: сменить пароль */
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.auth.resetPassword(dto.resetToken, dto.password);
    return { message: 'Пароль успешно изменён. Теперь вы можете войти.' };
  }
}