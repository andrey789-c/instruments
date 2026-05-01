import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService, private auth: AuthService) {}

  async createUser(dto: CreateUserDto) {
    const role = dto.role ?? 'USER';

    if (!dto.organizationName) {
      throw new UnprocessableEntityException('Введите название Вашей организации');
    }
    if (!dto.phone || dto.phone.replace(/\D/g, '').length < 10) {
      throw new UnprocessableEntityException('Введите корректный номер телефона');
    }
    return this.auth.createUser({ ...dto, role, ownerId: undefined });
  }

  async createMember(
    dto: { email: string; password: string; phone: string; role?: string },
    actor: any,
  ) {
    if (!actor || actor.role !== 'SUPERADMIN') throw new ForbiddenException();

    return this.auth.createUser({
      email: dto.email,
      password: dto.password,
      phone: dto.phone,
      role: (dto.role as any) ?? 'USER',
      organizationName: actor.organizationName,
      ownerId: actor.id,
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async listForActor(actor: any) {
    if (actor.role === 'SUPERADMIN') {
      return this.prisma.user.findMany({
        where: { OR: [{ ownerId: actor.id }, { id: actor.id }] },
        select: {
          id: true,
          email: true,
          role: true,
          ownerId: true,
          phone: true,
          phoneVerified: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'asc' },
      });
    }
    return [await this.findById(actor.id)];
  }

  async changeRole(targetUserId: string, newRole: string, actor: any) {
    if (!actor || actor.role !== 'SUPERADMIN') throw new ForbiddenException();

    const target = await this.prisma.user.findUnique({ where: { id: targetUserId } });
    if (!target) throw new NotFoundException('User not found');

    if (target.ownerId !== actor.id && target.id !== actor.id) {
      throw new ForbiddenException('You can only manage users you own.');
    }

    return this.prisma.user.update({
      where: { id: targetUserId },
      data: {
        role: newRole as any,
        ownerId: newRole === 'SUPERADMIN' ? null : target.ownerId ?? actor.id,
      },
      select: { id: true, email: true, role: true, ownerId: true },
    });
  }

  async deleteMember(targetUserId: string, actor: any) {
    if (!actor || actor.role !== 'SUPERADMIN') throw new ForbiddenException();

    const target = await this.prisma.user.findUnique({ where: { id: targetUserId } });
    if (!target) throw new NotFoundException('User not found');

    if (target.id === actor.id) {
      throw new ForbiddenException('Нельзя удалить собственный аккаунт');
    }

    if (target.ownerId !== actor.id) {
      throw new ForbiddenException('You can only delete users you own.');
    }

    await this.prisma.user.delete({ where: { id: targetUserId } });
    return { success: true };
  }

  async changePassword(targetUserId: string, newPassword: string, actor: any) {
    if (!actor || actor.role !== 'SUPERADMIN') throw new ForbiddenException();

    const target = await this.prisma.user.findUnique({ where: { id: targetUserId } });
    if (!target) throw new NotFoundException('User not found');

    if (target.ownerId !== actor.id && target.id !== actor.id) {
      throw new ForbiddenException('You can only manage users you own.');
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id: targetUserId },
      data: { password: hashed },
    });

    return { success: true };
  }
}