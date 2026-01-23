import { Injectable } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'src/generated/client';


@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super()
  }
}