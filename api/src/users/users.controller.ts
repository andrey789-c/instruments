import {
  Controller, Get, Param, UseGuards,
  Request, Body, Post, Delete, HttpCode, HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private users: UsersService) {}

  /** Список участников организации */
  @Get()
  async list(@Request() req) {
    return this.users.listForActor(req.user);
  }

  /** Создать участника (только SUPERADMIN) */
  @Roles('SUPERADMIN')
  @Post('members')
  @HttpCode(HttpStatus.CREATED)
  async createMember(@Body() dto: CreateMemberDto, @Request() req) {
    return this.users.createMember(dto, req.user);
  }

  /** Изменить роль (только SUPERADMIN) */
  @Roles('SUPERADMIN')
  @Post(':id/role')
  async changeRole(
    @Param('id') id: string,
    @Body('role') role: string,
    @Request() req,
  ) {
    return this.users.changeRole(id, role, req.user);
  }

  /** Удалить участника (только SUPERADMIN) */
  @Roles('SUPERADMIN')
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteMember(@Param('id') id: string, @Request() req) {
    return this.users.deleteMember(id, req.user);
  }

  /** Сменить пароль участника (только SUPERADMIN) */
  @Roles('SUPERADMIN')
  @Post(':id/password')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @Param('id') id: string,
    @Body() dto: UpdatePasswordDto,
    @Request() req,
  ) {
    return this.users.changePassword(id, dto.password, req.user);
  }
}