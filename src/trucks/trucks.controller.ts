import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/roles/roles.decorator';
import { RolesGuard } from 'src/roles/roles.guard';
import { TruckService } from 'src/trucks/trucks.service';
import { createSuccess, ErrorException } from 'src/utils/response.handler';

@Controller('trucks')
@UseGuards(JwtAuthGuard, RolesGuard)

export class TruckController {
  constructor(private readonly truckService: TruckService) {}

  @Get()
  async getAllTrucks() {
    try {
      return createSuccess(
        'getAllTrucks',
        await this.truckService.getAllTrucks(),
      );
    } catch (error) {
      throw new ErrorException(
        'getAllTrucks',
        'Error in getting all trucks',
        error,
      );
    }
  }

  @Post()
  async addTruck(@Body() truck: any) {
    try {
      return createSuccess('addTruck', await this.truckService.addTruck(truck));
    } catch (error) {
      throw new ErrorException('addTruck', 'Error in adding truck', error);
    }
  }

  @Put(':truckId')
  async editTruck(@Param('truckId') truckId: number, @Body() body: any) {
    try {
      return createSuccess(
        'editTruck',
        await this.truckService.editTruck(Number(truckId), body),
      );
    } catch (error) {
      throw new ErrorException(
        'editTruck',
        'Error updating truck details',
        error,
      );
    }
  }
  
  @Roles('Admin')
  @Delete(':truckId')
  async deactivateTruck(@Param('truckId') truckId: number) {
    try {
      return createSuccess(
        'deactivateTruck',
        await this.truckService.deactivateTruck(truckId),
      );
    } catch (error) {
      throw new ErrorException(
        'deactivateTruck',
        'Error in deactivating truck',
        error,
      );
    }
  }

  @Get(':truckId/usage')
  async getTruckUsage(@Param('truckId') truckId: number) {
    try {
      return createSuccess(
        'getTruckUsage',
        await this.truckService.getUsageStats(Number(truckId)),
      );
    } catch (error) {
      throw new ErrorException(
        'getTruckUsage',
        'Error fetching truck usage stats',
        error,
      );
    }
  }

  @Get('available')
  async getAvailableTrucks() {
    try {
      return createSuccess(
        'getAvailableTrucks',
        await this.truckService.getAvailableTrucks(),
      );
    } catch (error) {
      throw new ErrorException(
        'getAvailableTrucks',
        'Error fetching available trucks',
        error,
      );
    }
  }
}
