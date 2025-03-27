/*
  Warnings:

  - You are about to drop the column `sector` on the `User` table. All the data in the column will be lost.
  - Added the required column `plantaId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Chofer" ADD COLUMN     "planta" TEXT;

-- AlterTable
ALTER TABLE "Destino" ADD COLUMN     "estimaProximoConsumo" TIMESTAMP(3),
ADD COLUMN     "frecuenciaConsumo" INTEGER,
ALTER COLUMN "distancia_planta" DROP NOT NULL,
ALTER COLUMN "condicionesEntrada" DROP NOT NULL,
ALTER COLUMN "lat" DROP NOT NULL,
ALTER COLUMN "lng" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "sector",
ADD COLUMN     "plantaId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Plantas" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "frecuencia" DOUBLE PRECISION,
    "horariosRetiros" TEXT,

    CONSTRAINT "Plantas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Productos" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "presentacion" TEXT NOT NULL,

    CONSTRAINT "Productos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlantaProductos" (
    "id" SERIAL NOT NULL,
    "plantaId" INTEGER NOT NULL,
    "productoId" INTEGER NOT NULL,

    CONSTRAINT "PlantaProductos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Proyeccion" (
    "id" SERIAL NOT NULL,
    "dateStart" TIMESTAMP(3) NOT NULL,
    "dateEnd" TIMESTAMP(3) NOT NULL,
    "secuencia" TIMESTAMP(3)[],

    CONSTRAINT "Proyeccion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlantaProductos_plantaId_productoId_key" ON "PlantaProductos"("plantaId", "productoId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_plantaId_fkey" FOREIGN KEY ("plantaId") REFERENCES "Plantas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlantaProductos" ADD CONSTRAINT "PlantaProductos_plantaId_fkey" FOREIGN KEY ("plantaId") REFERENCES "Plantas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlantaProductos" ADD CONSTRAINT "PlantaProductos_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
