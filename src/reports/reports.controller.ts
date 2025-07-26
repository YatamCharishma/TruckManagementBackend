import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ReportService } from 'src/reports/reports.service';
import { Roles } from 'src/roles/roles.decorator';
import { RolesGuard } from 'src/roles/roles.guard';
import { createSuccess, ErrorException } from 'src/utils/response.handler';

@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)

export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Roles('Admin', 'Staff')
  @Get('driver-wise')
  async getDriverWiseReport() {
    try {
      const data = await this.reportService.getDriverWiseReport();
      return createSuccess('getDriverWiseReport', data);
    } catch (error) {
      throw new ErrorException(
        'getDriverWiseReport',
        'Error getting driver-wise report',
        error,
      );
    }
  }

  @Roles('Admin', 'Staff')
  @Get('truck-wise')
  async getTruckWiseReport() {
    try {
      const data = await this.reportService.getTruckWiseReport();
      return createSuccess('getTruckWiseReport', data);
    } catch (error) {
      throw new ErrorException(
        'getTruckWiseReport',
        'Error getting truck-wise report',
        error,
      );
    }
  }

  @Roles('Admin', 'Staff')
  @Get('client-wise')
  async getClientWiseReport(@Query('period') period: 'monthly' | 'yearly') {
    try {
      if (period !== 'monthly' && period !== 'yearly') {
        throw new Error('Invalid period, must be "monthly" or "yearly"');
      }
      const data = await this.reportService.getClientWiseReport(period);
      return createSuccess('getClientWiseReport', data);
    } catch (error) {
      throw new ErrorException(
        'getClientWiseReport',
        'Error getting client-wise report',
        error,
      );
    }
  }
}
