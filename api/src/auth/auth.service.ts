import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";
import * as bcrypt from "bcrypt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService,) {
   
  }

  async validateUser(email: string, pass: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return null;
    const match = await bcrypt.compare(pass, user.password);
    if (!match) return null;
    const { password, ...rest } = user as any;
    return rest;
  }

  async login(user: any) {
    console.log(user)
    const payload = { sub: user.id, email: user.email, role: user.role, ownerId: user.ownerId || user.id};
    return {
      access_token: this.jwt.sign(payload),
    };
  }

  async createUser(
    data: { email: string; password: string; role?: string; ownerId?: string, organizationName: string },
  ) {
    const hashed = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({
      data: {
        email: data.email,
        password: hashed,
        role: data.role as any,
        organizationName: data.organizationName,
        ownerId: data.ownerId,
      },
      select: {
        id: true,
        email: true,
        role: true,
        organizationName: true,
        ownerId: true,
        createdAt: true,
      },
    });
  }
}
