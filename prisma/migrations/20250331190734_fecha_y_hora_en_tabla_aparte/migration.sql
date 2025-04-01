/*
  Warnings:

  - You are about to drop the column `fechaCarga` on the `Viajes` table. All the data in the column will be lost.
  - You are about to drop the column `horaCarga` on the `Viajes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Viajes" DROP COLUMN "fechaCarga",
DROP COLUMN "horaCarga";
