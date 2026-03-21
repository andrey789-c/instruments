import { Controller, Post, Body, UseGuards, Request, Res, HttpCode, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService, private users: UsersService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginDto, @Res({ passthrough: true }) res: Response) {
    const user = await this.auth.validateUser(body.email, body.password);
    
    if (!user) {
      throw new UnauthorizedException('Неверный email или пароль');
    }
    
    const { access_token } = await this.auth.login(user);
 
    // Устанавливаем HttpOnly cookie
    res.cookie('auth_token', access_token, {
      httpOnly: true,  // Защита от XSS - JavaScript не может прочитать
      secure: process.env.NODE_ENV === 'production', // Только HTTPS в production
      sameSite: 'lax', // CSRF защита
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
      path: '/',
    });
 
    // Возвращаем информацию о пользователе (без токена в body)
    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        organizationName: user.organizationName,
      }
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('auth_token', { path: '/' });
    
    return { success: true };
  }

  // Создание пользователя — закрытый маршрут (доступен только супер-админу)
  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Body() dto: CreateUserDto, @Request() req) {
    const created = await this.users.createUser({...dto, role: 'SUPERADMIN'});
    return created;
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
}