-- CreateTable
CREATE TABLE "MeterHistory" (
    "id" TEXT NOT NULL,
    "meterId" TEXT NOT NULL,
    "kwhConsumedAc" DOUBLE PRECISION NOT NULL,
    "voltage" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MeterHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VehicleHistory" (
    "id" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "soc" DOUBLE PRECISION NOT NULL,
    "kwhDeliveredDc" DOUBLE PRECISION NOT NULL,
    "batteryTemp" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VehicleHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MeterLive" (
    "meterId" TEXT NOT NULL,
    "kwhConsumedAc" DOUBLE PRECISION NOT NULL,
    "voltage" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MeterLive_pkey" PRIMARY KEY ("meterId")
);

-- CreateTable
CREATE TABLE "VehicleLive" (
    "vehicleId" TEXT NOT NULL,
    "soc" DOUBLE PRECISION NOT NULL,
    "kwhDeliveredDc" DOUBLE PRECISION NOT NULL,
    "batteryTemp" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VehicleLive_pkey" PRIMARY KEY ("vehicleId")
);

-- CreateIndex
CREATE INDEX "MeterHistory_meterId_timestamp_idx" ON "MeterHistory"("meterId", "timestamp");

-- CreateIndex
CREATE INDEX "VehicleHistory_vehicleId_timestamp_idx" ON "VehicleHistory"("vehicleId", "timestamp");
