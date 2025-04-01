/*
  Warnings:

  - You are about to drop the column `productoId` on the `HorarioRetiro` table. All the data in the column will be lost.
  - Added the required column `productoId` to the `Proyeccion` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "HorarioRetiro" DROP CONSTRAINT "HorarioRetiro_productoId_fkey";

-- AlterTable
ALTER TABLE "HorarioRetiro" DROP COLUMN "productoId";

-- AlterTable
ALTER TABLE "Proyeccion" ADD COLUMN     "productoId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Proyeccion" ADD CONSTRAINT "Proyeccion_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
