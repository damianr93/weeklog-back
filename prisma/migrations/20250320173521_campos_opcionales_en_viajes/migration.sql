-- AlterTable
ALTER TABLE "Viajes" ALTER COLUMN "kmRealesRecorridos" DROP NOT NULL,
ALTER COLUMN "tiempoEstimadoCarga" DROP NOT NULL,
ALTER COLUMN "horaDescarga" DROP NOT NULL,
ALTER COLUMN "horaRetorno" DROP NOT NULL,
ALTER COLUMN "observaciones" DROP NOT NULL;
