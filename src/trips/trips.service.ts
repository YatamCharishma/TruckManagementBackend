import { Injectable, Inject } from '@nestjs/common';
import { NEST_PGPROMISE_CONNECTION } from 'nestjs-pgpromise';
import { IDatabase } from 'pg-promise';
import { TripEntity } from './trips.entity';

@Injectable()
export class TripService {
  constructor(
    @Inject(NEST_PGPROMISE_CONNECTION) public readonly pg: IDatabase<any>,
    private readonly tripEntity: TripEntity,
  ) {}

  async getAllTrips() {
    const query = this.pg.$config.pgp.as.format(
      `SELECT * FROM ${this.tripEntity.table()} WHERE is_active = TRUE ORDER BY trip_id DESC`,
    );
    return this.tripEntity.runQuery(query);
  }

  async createTrip(data: any) {
    return this.tripEntity.runQuery(this.tripEntity.queryInsertAndReturn(data));
  }

  async updateTrip(tripId: number, updatedData: any) {
    // Deactivate the old trip record if using immutable update strategy
    await this.tripEntity.runQuery(
      this.tripEntity.querySetOldRecordFalseCustom(
        tripId,
        'trip_id',
        'is_active',
      ),
    );
    return this.tripEntity.runQuery(
      this.tripEntity.queryInsertAndReturn(updatedData),
    );
  }

  async deactivateTrip(tripId: number) {
    const query = this.pg.$config.pgp.as.format(
      `UPDATE ${this.tripEntity.table()} SET is_active = FALSE WHERE trip_id = $1`,
      [tripId],
    );
    return this.tripEntity.runQuery(query);
  }

  async getTripsByClient(clientId: number) {
    const query = this.pg.$config.pgp.as.format(
      `SELECT * FROM ${this.tripEntity.table()} WHERE client_id = $1 AND is_active = TRUE ORDER BY trip_date DESC`,
      [clientId],
    );
    return this.tripEntity.runQuery(query);
  }

  async getTripsByDriver(driverId: number) {
    const query = this.pg.$config.pgp.as.format(
      `SELECT * FROM ${this.tripEntity.table()} WHERE driver_id = $1 AND is_active = TRUE ORDER BY trip_date DESC`,
      [driverId],
    );
    return this.tripEntity.runQuery(query);
  }

  async getTripsByTruck(truckId: number) {
    const query = this.pg.$config.pgp.as.format(
      `SELECT * FROM ${this.tripEntity.table()} WHERE truck_id = $1 AND is_active = TRUE ORDER BY trip_date DESC`,
      [truckId],
    );
    return this.tripEntity.runQuery(query);
  }
}
