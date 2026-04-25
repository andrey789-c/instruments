import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HistoryService } from 'src/history/history.service';

@Injectable()
export class TableService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly historyService: HistoryService,
  ) {}

  async getAllTables(ownerId: string) {
    const tables = await this.prisma.inventoryTable.findMany({
      where: { ownerId },
      select: {
        id: true,
        name: true,
        items: {
          select: { price: true, quantity: true },
        },
      },
    });

    return tables.map((table) => ({
      id: table.id,
      name: table.name,
      totalPrice: table.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      ),
      totalQuantity: table.items.reduce((sum, item) => sum + item.quantity, 0),
    }));
  }

  async getTableById(tableId: string, ownerId: string) {
    const table = await this.prisma.inventoryTable.findUnique({
      where: { id: tableId, ownerId },
      include: {
        items: {
          omit: { createdAt: true, updatedAt: true },
        },
      },
      omit: { createdAt: true, updatedAt: true },
    });

    if (!table) throw new NotFoundException('Table not found');

    const totalPrice = table.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const totalQuantity = table.items.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );

    return { ...table, totalPrice, totalQuantity };
  }

  async createTable(name: string, ownerId: string) {
    const table = await this.prisma.inventoryTable.create({
      data: { name, ownerId },
      omit: { createdAt: true, updatedAt: true },
    });

    await this.historyService.saveSnapshot(table.id);

    return table;
  }

  async updateTable(tableId: string, name: string, ownerId: string) {
    const table = await this.prisma.inventoryTable.findUnique({
      where: { id: tableId, ownerId },
    });
    if (!table) throw new NotFoundException('Table not found');

    await this.historyService.saveSnapshot(tableId, {
      id: ownerId,
      firstName: 'User',
      lastName: 'Name',
    });

    return this.prisma.inventoryTable.update({
      where: { id: tableId },
      data: { name },
      omit: { createdAt: true, updatedAt: true },
    });
  }

  async deleteTable(tableId: string, ownerId: string) {
    const table = await this.prisma.inventoryTable.findUnique({
      where: { id: tableId, ownerId },
    });
    if (!table) throw new NotFoundException('Table not found');

    await this.historyService.saveSnapshot(tableId); // ← ДО удаления

    return this.prisma.inventoryTable.delete({
      where: { id: tableId },
      omit: { createdAt: true, updatedAt: true },
    });
  }

  async addItem(
    tableId: string,
    dto: { name: string; description: string; price: number; quantity: number },
    ownerId: string,
  ) {
    const table = await this.prisma.inventoryTable.findUnique({
      where: { id: tableId, ownerId },
    });
    if (!table) throw new NotFoundException('Table not found');

    await this.historyService.saveSnapshot(tableId);

    return this.prisma.inventoryItem.create({
      data: { ...dto, tableId },
      omit: { createdAt: true, updatedAt: true },
    });
  }

  async updateItem(
    itemId: string,
    dto: {
      name?: string;
      description?: string;
      price?: number;
      quantity?: number;
    },
    ownerId: string,
  ) {
    const item = await this.prisma.inventoryItem.findUnique({
      where: { id: itemId },
      include: { table: true },
    });

    if (!item || item.table.ownerId !== ownerId) {
      throw new NotFoundException('Item not found');
    }

    await this.historyService.saveSnapshot(item.tableId);

    return this.prisma.inventoryItem.update({
      where: { id: itemId },
      data: dto,
      omit: { createdAt: true, updatedAt: true },
    });
  }

  async deleteItem(itemId: string, ownerId: string) {
    const item = await this.prisma.inventoryItem.findUnique({
      where: { id: itemId },
      include: { table: true },
    });

    if (!item || item.table.ownerId !== ownerId) {
      throw new NotFoundException('Item not found');
    }

    await this.historyService.saveSnapshot(item.tableId);

    return this.prisma.inventoryItem.delete({
      where: { id: itemId },
      omit: { createdAt: true, updatedAt: true },
    });
  }
}
