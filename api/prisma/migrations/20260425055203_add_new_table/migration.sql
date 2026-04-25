-- CreateTable
CREATE TABLE "InventoryTableHistory" (
    "id" TEXT NOT NULL,
    "tableId" TEXT NOT NULL,
    "snapshot" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InventoryTableHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "InventoryTableHistory" ADD CONSTRAINT "InventoryTableHistory_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "InventoryTable"("id") ON DELETE CASCADE ON UPDATE CASCADE;
