-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "plantaId" INTEGER NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plantas" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "frecuencia" DOUBLE PRECISION,
    "ultimaCambioFrecuencia" TIMESTAMP(3),
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
CREATE TABLE "Destino" (
    "id" SERIAL NOT NULL,
    "createdByUserId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "distancia_planta" INTEGER,
    "condicionesEntrada" TEXT,
    "frecuenciaConsumo" INTEGER,
    "estimaProximoConsumo" TIMESTAMP(3),
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Destino_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chofer" (
    "id" SERIAL NOT NULL,
    "createdByUserId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "celular" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "plantaHabitualId" INTEGER,

    CONSTRAINT "Chofer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Viajes" (
    "id" SERIAL NOT NULL,
    "createdByUserId" INTEGER NOT NULL,
    "destinoId" INTEGER NOT NULL,
    "plantaId" INTEGER NOT NULL,
    "choferId" INTEGER NOT NULL,
    "kmRealesRecorridos" INTEGER,
    "tiempoEstimadoCarga" INTEGER,
    "horaDescarga" TEXT,
    "horaRetorno" TEXT,
    "observaciones" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "horarioRetiroId" INTEGER NOT NULL,

    CONSTRAINT "Viajes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Proyeccion" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "dateStart" TIMESTAMP(3) NOT NULL,
    "dateEnd" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" INTEGER NOT NULL,
    "productoId" INTEGER NOT NULL,
    "plantaId" INTEGER NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'borrador',

    CONSTRAINT "Proyeccion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HorarioRetiro" (
    "id" SERIAL NOT NULL,
    "proyeccionId" INTEGER NOT NULL,
    "productoId" INTEGER NOT NULL,
    "viajeId" INTEGER,
    "fecha" DATE NOT NULL,
    "hora" TIME NOT NULL,
    "disponible" BOOLEAN NOT NULL DEFAULT true,
    "observaciones" TEXT,

    CONSTRAINT "HorarioRetiro_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "PlantaProductos_plantaId_productoId_key" ON "PlantaProductos"("plantaId", "productoId");

-- CreateIndex
CREATE UNIQUE INDEX "Viajes_horarioRetiroId_key" ON "Viajes"("horarioRetiroId");

-- CreateIndex
CREATE UNIQUE INDEX "HorarioRetiro_viajeId_key" ON "HorarioRetiro"("viajeId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_plantaId_fkey" FOREIGN KEY ("plantaId") REFERENCES "Plantas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlantaProductos" ADD CONSTRAINT "PlantaProductos_plantaId_fkey" FOREIGN KEY ("plantaId") REFERENCES "Plantas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlantaProductos" ADD CONSTRAINT "PlantaProductos_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Destino" ADD CONSTRAINT "Destino_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chofer" ADD CONSTRAINT "Chofer_plantaHabitualId_fkey" FOREIGN KEY ("plantaHabitualId") REFERENCES "Plantas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chofer" ADD CONSTRAINT "Chofer_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Viajes" ADD CONSTRAINT "Viajes_plantaId_fkey" FOREIGN KEY ("plantaId") REFERENCES "Plantas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Viajes" ADD CONSTRAINT "Viajes_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Viajes" ADD CONSTRAINT "Viajes_destinoId_fkey" FOREIGN KEY ("destinoId") REFERENCES "Destino"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Viajes" ADD CONSTRAINT "Viajes_choferId_fkey" FOREIGN KEY ("choferId") REFERENCES "Chofer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Viajes" ADD CONSTRAINT "Viajes_horarioRetiroId_fkey" FOREIGN KEY ("horarioRetiroId") REFERENCES "HorarioRetiro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proyeccion" ADD CONSTRAINT "Proyeccion_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proyeccion" ADD CONSTRAINT "Proyeccion_plantaId_fkey" FOREIGN KEY ("plantaId") REFERENCES "Plantas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proyeccion" ADD CONSTRAINT "Proyeccion_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HorarioRetiro" ADD CONSTRAINT "HorarioRetiro_proyeccionId_fkey" FOREIGN KEY ("proyeccionId") REFERENCES "Proyeccion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HorarioRetiro" ADD CONSTRAINT "HorarioRetiro_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
