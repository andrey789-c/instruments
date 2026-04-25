import { Module } from '@nestjs/common';
import { TableService } from './table.service';
import { TableController } from './table.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { HistoryModule } from 'src/history/history.module';

@Module({
  imports: [PrismaModule, HistoryModule],
  controllers: [TableController],
  providers: [TableService],
})
export class TableModule {}
