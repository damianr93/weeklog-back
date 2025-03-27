-- CreateTable
CREATE TABLE "Destino" (
    "id" SERIAL NOT NULL,
    "createdByUserId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "distancia_planta" INTEGER NOT NULL,
    "condicionesEntrada" TEXT NOT NULL,
    "lat" TEXT NOT NULL,
    "lng" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Destino_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Destino" ADD CONSTRAINT "Destino_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
