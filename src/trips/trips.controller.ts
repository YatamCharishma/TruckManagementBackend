import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TripService } from './trips.service';
import { createSuccess, ErrorException } from 'src/utils/response.handler';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';

@Controller('trips')
@UseGuards(JwtAuthGuard, RolesGuard)

export class TripController {
  constructor(private readonly tripService: TripService) {}

  @Get()
  async getAllTrips() {
    try {
      return createSuccess('getAllTrips', await this.tripService.getAllTrips());
    } catch (error) {
      throw new ErrorException(
        'getAllTrips',
        'Error in getting all trips',
        error,
      );
    }
  }

  @Roles('Admin', 'Staff')
  @Post()
  async createTrip(@Body() trip: any) {
    try {
      return createSuccess(
        'createTrip',
        await this.tripService.createTrip(trip),
      );
    } catch (error) {
      throw new ErrorException('createTrip', 'Error in creating trip', error);
    }
  }

  @Put(':tripId')
  async updateTrip(@Param('tripId') tripId: number, @Body() trip: any) {
    try {
      return createSuccess(
        'updateTrip',
        await this.tripService.updateTrip(tripId, trip),
      );
    } catch (error) {
      throw new ErrorException('updateTrip', 'Error in updating trip', error);
    }
  }

  @Delete(':tripId')
  async deactivateTrip(@Param('tripId') tripId: number) {
    try {
      return createSuccess(
        'deactivateTrip',
        await this.tripService.deactivateTrip(tripId),
      );
    } catch (error) {
      throw new ErrorException(
        'deactivateTrip',
        'Error in deactivating trip',
        error,
      );
    }
  }

  @Get('by-client/:clientId')
  async getTripsByClient(@Param('clientId') clientId: number) {
    try {
      return createSuccess(
        'getTripsByClient',
        await this.tripService.getTripsByClient(clientId),
      );
    } catch (error) {
      throw new ErrorException(
        'getTripsByClient',
        'Error in getting trips by client',
        error,
      );
    }
  }

  @Get('by-driver/:driverId')
  async getTripsByDriver(@Param('driverId') driverId: number) {
    try {
      return createSuccess(
        'getTripsByDriver',
        await this.tripService.getTripsByDriver(driverId),
      );
    } catch (error) {
      throw new ErrorException(
        'getTripsByDriver',
        'Error in getting trips by driver',
        error,
      );
    }
  }

  @Get('by-truck/:truckId')
  async getTripsByTruck(@Param('truckId') truckId: number) {
    try {
      return createSuccess(
        'getTripsByTruck',
        await this.tripService.getTripsByTruck(truckId),
      );
    } catch (error) {
      throw new ErrorException(
        'getTripsByTruck',
        'Error in getting trips by truck',
        error,
      );
    }
  }
}
