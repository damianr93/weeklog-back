/*
  Warnings:

  - You are about to drop the column `planta` on the `Chofer` table. All the data in the column will be lost.
  - Added the required column `plantaId` to the `Viajes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Chofer" DROP COLUMN "planta",
ADD COLUMN     "plantaHabitualId" INTEGER;

-- AlterTable
ALTER TABLE "Viajes" ADD COLUMN     "plantaId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Chofer" ADD CONSTRAINT "Chofer_plantaHabitualId_fkey" FOREIGN KEY ("plantaHabitualId") REFERENCES "Plantas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Viajes" ADD CONSTRAINT "Viajes_plantaId_fkey" FOREIGN KEY ("plantaId") REFERENCES "Plantas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
