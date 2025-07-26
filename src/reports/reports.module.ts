import { Module } from '@nestjs/common';
import { ReportController } from './reports.controller';
import { ReportService } from 'src/reports/reports.service';
import { ReportEntity } from 'src/reports/reports.entity';

@Module({
  controllers: [ReportController],
  providers: [
    ReportService,
    {
      provide: ReportEntity,
      useClass: ReportEntity,
    },
  ],
})
export class ReportModule {}
