import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../prisma/prisma.service";
import { Request } from "express";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private config: ConfigService, private prisma: PrismaService) {
    super({
      // Извлекаем токен из cookies или из Authorization header
      jwtFromRequest: ExtractJwt.fromExtractors([
        // 1. Сначала пробуем cookie
        (request: Request) => {
          return request?.cookies?.["auth_token"];
        },
        // 2. Если нет в cookie, пробуем Authorization header
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: config.get<string>("JWT_ACCESS_SECRET", {
        infer: true,
      }) as string,
    });
  }

  async validate(payload: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });
    if (!user) return null;

    const { password, ...rest } = user as any;
    return rest;
  }
}
