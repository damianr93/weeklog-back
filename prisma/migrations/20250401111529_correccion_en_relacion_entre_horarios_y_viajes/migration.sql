/*
  Warnings:

  - You are about to drop the column `horarioRetiroId` on the `Viajes` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[viajeId]` on the table `HorarioRetiro` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Viajes" DROP COLUMN "horarioRetiroId";

-- CreateIndex
CREATE UNIQUE INDEX "HorarioRetiro_viajeId_key" ON "HorarioRetiro"("viajeId");
