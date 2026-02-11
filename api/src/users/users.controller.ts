import { Controller, Get, Patch, Param, UseGuards, Request, Body, Post } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private users: UsersService) {}

  @Get()
  async list(@Request() req) {
    return this.users.listForActor(req.user);
  }

  // только superadmin
  @Roles('SUPERADMIN')
  @Post(':id/role')
  async changeRole(@Param('id') id: string, @Body('role') role: string, @Request() req) {
    return this.users.changeRole(id, role, req.user);
  }
}
