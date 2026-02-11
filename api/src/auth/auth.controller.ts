import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService, private users: UsersService) {}

  @Post('login')
  async login(@Body() body: LoginDto) {
    const user = await this.auth.validateUser(body.email, body.password);
    if (!user) throw new Error('Invalid credentials');
    return this.auth.login(user);
  }

  // Создание пользователя — закрытый маршрут (доступен только супер-админу)
  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Body() dto: CreateUserDto, @Request() req) {
    const actor = req.user;

    const created = await this.users.createUser(dto, actor);
    return created;
  }
}
