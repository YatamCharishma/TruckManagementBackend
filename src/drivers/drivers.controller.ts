import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { DriverService } from 'src/drivers/drivers.service';
import { RolesGuard } from 'src/roles/roles.guard';
import { createSuccess, ErrorException } from 'src/utils/response.handler';

@Controller('drivers')
@UseGuards(JwtAuthGuard, RolesGuard)

export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Get()
  async getAllDrivers() {
    try {
      return createSuccess(
        'getAllDrivers',
        await this.driverService.getAllDrivers(),
      );
    } catch (error) {
      throw new ErrorException(
        'getAllDrivers',
        'Error in getting all drivers',
        error,
      );
    }
  }

  @Post()
  async addDriver(@Body() driver: any) {
    try {
      return createSuccess(
        'addDriver',
        await this.driverService.addDriver(driver),
      );
    } catch (error) {
      throw new ErrorException('addDriver', 'Error in adding driver', error);
    }
  }

  @Get('by-phone/:phone')
  async getDriverByPhone(@Param('phone') phone: string) {
    try {
      return createSuccess(
        'getDriverByPhone',
        await this.driverService.getDriverByPhone(phone),
      );
    } catch (error) {
      throw new ErrorException(
        'getDriverByPhone',
        'Error in getting driver by phone',
        error,
      );
    }
  }

  @Delete(':driverId')
  async deactivateDriver(@Param('driverId') driverId: number) {
    try {
      return createSuccess(
        'deactivateDriver',
        await this.driverService.deactivateDriver(driverId),
      );
    } catch (error) {
      throw new ErrorException(
        'deactivateDriver',
        'Error in deactivating driver',
        error,
      );
    }
  }

  @Post('assign')
  async assignDriverToTrip(
    @Body() payload: { driver_id: number; trip_id: number },
  ) {
    try {
      return createSuccess(
        'assignDriverToTrip',
        await this.driverService.assignDriverToTrip(payload),
      );
    } catch (error) {
      throw new ErrorException(
        'assignDriverToTrip',
        'Error in assigning driver to trip',
        error,
      );
    }
  }
}
