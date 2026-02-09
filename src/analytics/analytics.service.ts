import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getPerformance(vehicleId: string) {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Vehicle stats
    const vehicleStats = await this.prisma.vehicleHistory.aggregate({
      where: {
        vehicleId,
        timestamp: { gte: since },
      },
      _sum: {
        kwhDeliveredDc: true,
      },
      _avg: {
        batteryTemp: true,
      },
    });

    // Meter stats (assuming meterId = vehicleId for assignment)
    const meterStats = await this.prisma.meterHistory.aggregate({
      where: {
        meterId: vehicleId,
        timestamp: { gte: since },
      },
      _sum: {
        kwhConsumedAc: true,
      },
    });

    const totalDc = vehicleStats._sum.kwhDeliveredDc || 0;
    const totalAc = meterStats._sum.kwhConsumedAc || 0;

    const efficiency =
      totalAc > 0 ? Number((totalDc / totalAc).toFixed(3)) : 0;

    return {
      vehicleId,
      totalAcConsumed: totalAc,
      totalDcDelivered: totalDc,
      efficiencyRatio: efficiency,
      avgBatteryTemp: vehicleStats._avg.batteryTemp || 0,
    };
  }
}
