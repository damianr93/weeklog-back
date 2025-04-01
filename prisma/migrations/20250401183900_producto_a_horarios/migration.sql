/*
  Warnings:

  - A unique constraint covering the columns `[productosId]` on the table `HorarioRetiro` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `productoId` to the `HorarioRetiro` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productosId` to the `HorarioRetiro` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "HorarioRetiro" ADD COLUMN     "productoId" INTEGER NOT NULL,
ADD COLUMN     "productosId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "HorarioRetiro_productosId_key" ON "HorarioRetiro"("productosId");

-- AddForeignKey
ALTER TABLE "HorarioRetiro" ADD CONSTRAINT "HorarioRetiro_productosId_fkey" FOREIGN KEY ("productosId") REFERENCES "Productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
