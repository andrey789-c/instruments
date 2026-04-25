import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { HistoryService } from './history.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { IdDto } from 'src/table/dto/id.dto';

@Controller('history')
@UseGuards(JwtAuthGuard)
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Get(':tableId')
  @Roles('ADMIN', 'SUPERADMIN')
  async getHistory(@Param('tableId') tableId: string, @Req() req: any) {
    const ownerId = req?.user?.ownerId || req?.user?.id;
    return this.historyService.getHistory(tableId, ownerId);
  }

  @Post('restore')
  @Roles('ADMIN', 'SUPERADMIN')
  async restore(@Body() dto: IdDto, @Req() req: any) {
    const ownerId = req?.user?.ownerId || req?.user?.id;
    return this.historyService.restoreSnapshot(dto.id, ownerId);
  }
}