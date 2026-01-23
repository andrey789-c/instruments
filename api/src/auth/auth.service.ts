import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { RegisterDto } from "./dto/register.dto";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { LoginDto } from "./dto/login.dto";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
  }

  async register(dto: RegisterDto) {
    const { phone, password } = dto;

    const existingUser = await this.prisma.user.findUnique({
      where: { phone },
    });

    console.log(existingUser);

    if (existingUser) {
      throw new BadRequestException("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        phone,
        password: hashedPassword,
        role: "admin",
      },
    });

    return {
      phone,
    };
  }

  async login(dto: LoginDto) {
    const { phone, password } = dto;

    const user = await this.prisma.user.findUnique({ where: { phone } });
    if (!user) throw new UnauthorizedException("Invalid credentials");

    // 2. Проверка пароля
    const isPasswordValid = await bcrypt.compare(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const payload = {
      sub: user.id,
      phone: user.phone,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow<string>("JWT_ACCESS_SECRET"),
      expiresIn: "15m",
    });

    return {
      accessToken,
    };
  }
}
