/*
  Warnings:

  - You are about to drop the column `productosId` on the `HorarioRetiro` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "HorarioRetiro" DROP CONSTRAINT "HorarioRetiro_productosId_fkey";

-- AlterTable
ALTER TABLE "HorarioRetiro" DROP COLUMN "productosId";

-- AddForeignKey
ALTER TABLE "HorarioRetiro" ADD CONSTRAINT "HorarioRetiro_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
