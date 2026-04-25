import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HistoryService {
  constructor(private readonly prisma: PrismaService) {}

  async saveSnapshot(
  tableId: string,
  user?: { id: string; firstName?: string; lastName?: string },
) {
  const table = await this.prisma.inventoryTable.findUnique({
    where: { id: tableId },
    include: { items: true },
  });

  if (!table) return;

  const userName = user
    ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()
    : null;

  await this.prisma.inventoryTableHistory.create({
    data: {
      tableId,
      snapshot: {
        name: table.name,
        items: table.items.map((i) => ({
          name: i.name,
          description: i.description,
          price: i.price,
          quantity: i.quantity,
        })),
      },
      userId: user?.id,
      userName,
    },
  });
}

  async getHistory(tableId: string, ownerId: string) {
    const table = await this.prisma.inventoryTable.findUnique({
      where: { id: tableId, ownerId },
    });

    if (!table) throw new NotFoundException('Table not found');

    return this.prisma.inventoryTableHistory.findMany({
      where: { tableId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        createdAt: true,
      },
    });
  }

  async restoreSnapshot(historyId: string, ownerId: string) {
    const history = await this.prisma.inventoryTableHistory.findUnique({
      where: { id: historyId },
    });

    if (!history) throw new NotFoundException('History not found');

    const table = await this.prisma.inventoryTable.findUnique({
      where: { id: history.tableId, ownerId },
    });

    if (!table) throw new NotFoundException('Table not found');

    const snapshot = history.snapshot as any;

    await this.prisma.inventoryItem.deleteMany({
      where: { tableId: history.tableId },
    });

    await this.prisma.inventoryTable.update({
      where: { id: history.tableId },
      data: { name: snapshot.name },
    });

    await this.prisma.inventoryItem.createMany({
      data: snapshot.items.map((i) => ({
        ...i,
        tableId: history.tableId,
      })),
    });

    return { success: true };
  }

  async cleanupOldSnapshots() {
    const date = new Date();
    date.setDate(date.getDate() - 30);

    await this.prisma.inventoryTableHistory.deleteMany({
      where: {
        createdAt: { lt: date },
      },
    });
  }
}
