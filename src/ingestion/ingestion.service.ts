import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class IngestionService {
  constructor(private prisma: PrismaService) {}

  async handleIngest(body: any) {
    if (body.type === 'meter') {
      return this.handleMeter(body);
    }

    if (body.type === 'vehicle') {
      return this.handleVehicle(body);
    }

    throw new BadRequestException('Invalid telemetry type');
  }

  private async handleMeter(body: any) {
    const timestamp = new Date(body.timestamp);

    // Insert into history
    await this.prisma.meterHistory.create({
      data: {
        meterId: body.meterId,
        kwhConsumedAc: body.kwhConsumedAc,
        voltage: body.voltage,
        timestamp,
      },
    });

    // Upsert into live
    await this.prisma.meterLive.upsert({
      where: { meterId: body.meterId },
      update: {
        kwhConsumedAc: body.kwhConsumedAc,
        voltage: body.voltage,
        timestamp,
      },
      create: {
        meterId: body.meterId,
        kwhConsumedAc: body.kwhConsumedAc,
        voltage: body.voltage,
        timestamp,
      },
    });

    return { status: 'meter data ingested' };
  }

  private async handleVehicle(body: any) {
    const timestamp = new Date(body.timestamp);

    // Insert into history
    await this.prisma.vehicleHistory.create({
      data: {
        vehicleId: body.vehicleId,
        soc: body.soc,
        kwhDeliveredDc: body.kwhDeliveredDc,
        batteryTemp: body.batteryTemp,
        timestamp,
      },
    });

    // Upsert into live
    await this.prisma.vehicleLive.upsert({
      where: { vehicleId: body.vehicleId },
      update: {
        soc: body.soc,
        kwhDeliveredDc: body.kwhDeliveredDc,
        batteryTemp: body.batteryTemp,
        timestamp,
      },
      create: {
        vehicleId: body.vehicleId,
        soc: body.soc,
        kwhDeliveredDc: body.kwhDeliveredDc,
        batteryTemp: body.batteryTemp,
        timestamp,
      },
    });

    return { status: 'vehicle data ingested' };
  }
}
