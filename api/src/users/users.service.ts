import { Injectable, ForbiddenException, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService, private auth: AuthService) {}

  async createUser(dto: CreateUserDto, actor: any) {
    const role = dto.role ?? 'USER';

    // Если создают USER или ADMIN — только SUPERADMIN может
    if ((role === 'USER' || role === 'ADMIN')) {
      if (!actor || actor.role !== 'SUPERADMIN') {
        throw new ForbiddenException('Only superadmin can create users/admins.');
      }
      // ownerId = actor.id
      return this.auth.createUser({ ...dto, role, ownerId: actor.id, organizationName: actor.organizationName });
    }

    // Если пытаются создать SUPERADMIN — разрешить только, если actor === SUPERADMIN (или сделать через seed)
    if (role === 'SUPERADMIN') {
      if (!actor || actor.role !== 'SUPERADMIN') {
        throw new ForbiddenException('Only superadmin can create another superadmin.');
      }
      if(!dto.organizationName) throw new UnprocessableEntityException('Введите название Вашей организации')
      // ownerId stays null
      return this.auth.createUser({ ...dto, role, ownerId: undefined,  });
    }
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async listForActor(actor: any) {
    if (actor.role === 'SUPERADMIN') {
      // superadmin видит только своих (owned) пользователей и себя
      return this.prisma.user.findMany({
        where: { OR: [{ ownerId: actor.id }, { id: actor.id }] },
        select: { id: true, email: true, role: true, ownerId: true, createdAt: true },
      });
    }
    // обычный пользователь видит только себя
    return [await this.findById(actor.id)];
  }

  async changeRole(targetUserId: string, newRole: string, actor: any) {
    // only superadmin can change roles
    if (!actor || actor.role !== 'SUPERADMIN') throw new ForbiddenException();

    // убедимся, что target принадлежит этому superadmin (если target не superadmin)
    const target = await this.prisma.user.findUnique({ where: { id: targetUserId } });
    if (!target) throw new NotFoundException('User not found');

    // если target.ownerId !== actor.id и target.role !== SUPERADMIN -> запрет
    if (target.ownerId !== actor.id && target.role !== 'SUPERADMIN') {
      throw new ForbiddenException('You can only manage users you own.');
    }

    // нельзя сделать кого-то супер-админом без проверки (мы позволяем только superadmin делать это)
    // в общем, мы уже проверили actor.role === SUPERADMIN
    return this.prisma.user.update({
      where: { id: targetUserId },
      data: { role: newRole as any, ownerId: newRole === 'SUPERADMIN' ? null : target.ownerId ?? actor.id },
      select: { id: true, email: true, role: true, ownerId: true },
    });
  }
}
