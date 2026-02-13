import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { TableService } from "./table.service";
import { CreateTableDto } from "./dto/create-table.dto";
import { UpdateTableDto } from "./dto/update-table.dto";
import { AddItemDto } from "./dto/add-item.dto";
import { UpdateItemDto } from "./dto/update-item.dto";
import { IdDto } from "./dto/id.dto";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "src/common/guards/roles.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

@Controller("tables")
@UseGuards(JwtAuthGuard)
export class TableController {
  constructor(private readonly tableService: TableService) {}
  
  @UseGuards(AuthGuard("jwt"))
  @Get()
  async getAllTables(@Req() req: any) {
    const ownerId = req?.user?.ownerId || req?.user?.id;

    return this.tableService.getAllTables(ownerId);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get(":id")
  async getTable(@Param("id") id: string, @Req() req: any) {

    const ownerId = req?.user?.ownerId || req?.user?.id;
    return this.tableService.getTableById(id, ownerId);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("create")
  @Roles("ADMIN", "SUPERADMIN")
  async createTable(@Body() dto: CreateTableDto, @Req() req: any) {

    const ownerId = req?.user?.ownerId || req?.user?.id;
    return this.tableService.createTable(dto.name, ownerId);
  }

  @Post("update")
  @Roles("ADMIN", "SUPERADMIN")
  async updateTable(@Body() dto: UpdateTableDto, @Req() req: any) {
    const ownerId = req?.user?.ownerId || req?.user?.id;

    return this.tableService.updateTable(dto.tableId, dto.name, ownerId);
  }

  @Post("delete")
  @Roles("ADMIN", "SUPERADMIN")
  async deleteTable(@Body() dto: IdDto, @Req() req: any) {
    const ownerId = req?.user?.ownerId || req?.user?.id;

    return this.tableService.deleteTable(dto.id, ownerId);
  }

  @Post("item/add")
  @Roles("ADMIN", "SUPERADMIN")
  async addItem(@Body() dto: AddItemDto, @Req() req: any) {
    const ownerId = req?.user?.ownerId || req?.user?.id;

    return this.tableService.addItem(dto.tableId, {
      name: dto.name,
      description: dto.description,
      price: dto.price,
    }, ownerId);
  }

  @Post("item/update")
  @Roles("ADMIN", "SUPERADMIN")
  async updateItem(@Body() dto: UpdateItemDto, @Req() req: any) {
    const ownerId = req?.user?.ownerId || req?.user?.id;

    return this.tableService.updateItem(dto.itemId, {
      name: dto.name,
      description: dto.description,
      price: dto.price,
    }, ownerId);
  }

  @Post("item/delete")
  @Roles("ADMIN", "SUPERADMIN")
  async deleteItem(@Body() dto: IdDto, @Req() req: any) {
    const ownerId = req?.user?.ownerId || req?.user?.id;

    return this.tableService.deleteItem(dto.id, ownerId);
  }
}
