-- CreateTable
CREATE TABLE "Viajes" (
    "id" SERIAL NOT NULL,
    "createdByUserId" INTEGER NOT NULL,
    "fechaCarga" TIMESTAMP(3) NOT NULL,
    "horaCarga" TIMESTAMP(3) NOT NULL,
    "choferId" INTEGER NOT NULL,
    "destinoId" INTEGER NOT NULL,
    "kmRealesRecorridos" INTEGER NOT NULL,
    "tiempoEstimadoCarga" INTEGER NOT NULL,
    "horaDescarga" TIMESTAMP(3) NOT NULL,
    "horaRetorno" TIMESTAMP(3) NOT NULL,
    "observaciones" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Viajes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Viajes" ADD CONSTRAINT "Viajes_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Viajes" ADD CONSTRAINT "Viajes_destinoId_fkey" FOREIGN KEY ("destinoId") REFERENCES "Destino"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
