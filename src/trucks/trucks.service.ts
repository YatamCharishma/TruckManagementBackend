import { Injectable, Inject } from '@nestjs/common';
import { NEST_PGPROMISE_CONNECTION } from 'nestjs-pgpromise';
import { IDatabase } from 'pg-promise';
import { TruckEntity } from 'src/trucks/trucks.entity';

@Injectable()
export class TruckService {
  constructor(
    @Inject(NEST_PGPROMISE_CONNECTION) public readonly pg: IDatabase<any>,
    private readonly truckEntity: TruckEntity,
  ) {}

  async getAllTrucks() {
    const query = this.pg.$config.pgp.as.format(
      `SELECT * FROM ${this.truckEntity.table()} WHERE is_active = TRUE ORDER BY truck_id DESC`,
    );
    return this.truckEntity.runQuery(query);
  }

  async addTruck(data: any) {
    return this.truckEntity.runQuery(
      this.truckEntity.queryInsertAndReturn(data),
    );
  }

  async editTruck(truckId: number, data: any) {
    await this.truckEntity.runQuery(
      this.truckEntity.querySetOldRecordFalseCustom(
        truckId,
        'truck_id',
        'is_active',
      ),
    );

    return await this.addTruck(data);
  }

  async deactivateTruck(truckId: number) {
    const query = this.pg.$config.pgp.as.format(
      `UPDATE ${this.truckEntity.table()} SET is_active = FALSE WHERE truck_id = $1`,
      [truckId],
    );
    return this.truckEntity.runQuery(query);
  }

  async getUsageStats(truckId: number) {
    const tripCountQuery = this.pg.$config.pgp.as.format(
      `SELECT COUNT(*)::int AS total_trips FROM trips WHERE truck_id = $1`,
      [truckId],
    );

    const activeTripQuery = this.pg.$config.pgp.as.format(
      `SELECT COUNT(*)::int AS active_trips FROM trips WHERE truck_id = $1;`,
      [truckId],
    );

    const [totalTrips] = await this.truckEntity.runQuery(tripCountQuery);
    const [activeTrips] = await this.truckEntity.runQuery(activeTripQuery);

    return {
      truck_id: truckId,
      total_trips: totalTrips?.total_trips || 0,
      status: activeTrips?.active_trips > 0 ? 'in_use' : 'available',
    };
  }

  async getAvailableTrucks() {
    const query = this.pg.$config.pgp.as.format(
      `
      SELECT t.*
      FROM ${this.truckEntity.table()} t
      WHERE t.is_active = TRUE AND t.truck_id NOT IN (
        SELECT truck_id FROM trips
      );
      `,
    );

    return this.truckEntity.runQuery(query);
  }
}
