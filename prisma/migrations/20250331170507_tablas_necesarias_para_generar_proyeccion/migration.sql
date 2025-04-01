/*
  Warnings:

  - You are about to drop the column `secuencia` on the `Proyeccion` table. All the data in the column will be lost.
  - Added the required column `createdById` to the `Proyeccion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombre` to the `Proyeccion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `plantaId` to the `Proyeccion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Plantas" ADD COLUMN     "ultimaCambioFrecuencia" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Proyeccion" DROP COLUMN "secuencia",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdById" INTEGER NOT NULL,
ADD COLUMN     "estado" TEXT NOT NULL DEFAULT 'borrador',
ADD COLUMN     "nombre" TEXT NOT NULL,
ADD COLUMN     "plantaId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Viajes" ADD COLUMN     "horarioRetiroId" INTEGER;

-- CreateTable
CREATE TABLE "HorarioRetiro" (
    "id" SERIAL NOT NULL,
    "proyeccionId" INTEGER NOT NULL,
    "fechaHora" TIMESTAMP(3) NOT NULL,
    "productoId" INTEGER,
    "disponible" BOOLEAN NOT NULL DEFAULT true,
    "viajeId" INTEGER,
    "observaciones" TEXT,

    CONSTRAINT "HorarioRetiro_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Proyeccion" ADD CONSTRAINT "Proyeccion_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proyeccion" ADD CONSTRAINT "Proyeccion_plantaId_fkey" FOREIGN KEY ("plantaId") REFERENCES "Plantas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HorarioRetiro" ADD CONSTRAINT "HorarioRetiro_proyeccionId_fkey" FOREIGN KEY ("proyeccionId") REFERENCES "Proyeccion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HorarioRetiro" ADD CONSTRAINT "HorarioRetiro_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Productos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HorarioRetiro" ADD CONSTRAINT "HorarioRetiro_viajeId_fkey" FOREIGN KEY ("viajeId") REFERENCES "Viajes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
