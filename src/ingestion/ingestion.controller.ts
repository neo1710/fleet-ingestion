import { Body, Controller, Post } from '@nestjs/common';
import { IngestionService } from './ingestion.service';

@Controller('v1/ingest')
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @Post()
  async ingest(@Body() body: any) {
    return this.ingestionService.handleIngest(body);
  }
}
