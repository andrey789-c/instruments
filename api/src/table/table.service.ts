import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class TableService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllTables(ownerId: string) {
    const tables = await this.prisma.inventoryTable.findMany({
      where: { ownerId },
      select: {
        id: true,
        name: true,
        items: {
          select:{price:true}
        }
      },
    });

    return tables.map((table) => ({
      id: table.id,
      name: table.name,
      totalPrice: table.items.reduce((sum, item) => sum + item.price, 0),
    }));
  }

  async getTableById(tableId: string, ownerId: string) {
    const table = await this.prisma.inventoryTable.findUnique({
      where: { id: tableId, ownerId },
      include: {
        items: {
          omit: {
            createdAt: true,
            updatedAt: true,
          },
        },
        // owner: { select: { id: true, email: true, role: true } },
      },
      omit: {
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!table) throw new NotFoundException("Table not found");

    const totalPrice = table.items.reduce((sum, item) => sum + item.price, 0);

    return { ...table, totalPrice };
  }

  async createTable(name: string, ownerId: string) {
    return this.prisma.inventoryTable.create({
      data: {
        name,
        ownerId,
      },
      omit: {
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async updateTable(tableId: string, name: string, ownerId: string) {
    const table = await this.prisma.inventoryTable.findUnique({
      where: { id: tableId, ownerId },
    });
    if (!table) throw new NotFoundException("Table not found");

    return this.prisma.inventoryTable.update({
      where: { id: tableId },
      data: { name },
      omit: {
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async deleteTable(tableId: string, ownerId: string) {
    const table = await this.prisma.inventoryTable.findUnique({
      where: { id: tableId, ownerId },
    });
    if (!table) throw new NotFoundException("Table not found");

    return this.prisma.inventoryTable.delete({
      where: { id: tableId },
      omit: {
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async addItem(
    tableId: string,
    dto: { name: string; description: string; price: number },
    ownerId: string,
  ) {
    const table = await this.prisma.inventoryTable.findUnique({
      where: { id: tableId, ownerId },
    });
    if (!table) throw new NotFoundException("Table not found");

    return this.prisma.inventoryItem.create({
      data: {
        ...dto,
        tableId,
      },
      omit: {
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async updateItem(
    itemId: string,
    dto: { name?: string; description?: string; price?: number },
    ownerId: string,
  ) {
    const item = await this.prisma.inventoryItem.findUnique({
      where: { id: itemId },
    });
    if (!item) throw new NotFoundException("Item not found");

    return this.prisma.inventoryItem.update({
      where: { id: itemId, table: { ownerId } },
      data: dto,
      omit: {
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async deleteItem(itemId: string, ownerId: string) {
    const item = await this.prisma.inventoryItem.findUnique({
      where: { id: itemId, table: { ownerId } },
    });
    if (!item) throw new NotFoundException("Item not found");

    return this.prisma.inventoryItem.delete({
      where: { id: itemId },
      omit: {
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
