import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { IngestionModule } from './ingestion/ingestion.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [PrismaModule, IngestionModule, AnalyticsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
