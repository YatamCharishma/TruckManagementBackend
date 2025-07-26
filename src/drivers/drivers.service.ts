import { Injectable, Inject } from '@nestjs/common';
import { NEST_PGPROMISE_CONNECTION } from 'nestjs-pgpromise';
import { IDatabase } from 'pg-promise';
import { DriverEntity } from 'src/drivers/drivers.entity';

@Injectable()
export class DriverService {
  constructor(
    @Inject(NEST_PGPROMISE_CONNECTION) public readonly pg: IDatabase<any>,
    private readonly driverEntity: DriverEntity,
  ) {}

  async getAllDrivers() {
    const query = this.pg.$config.pgp.as.format(
      `SELECT * FROM ${this.driverEntity.table()} WHERE is_active = TRUE ORDER BY driver_id DESC`,
    );
    return this.driverEntity.runQuery(query);
  }

  async addDriver(data: any) {
    return this.driverEntity.runQuery(
      this.driverEntity.queryInsertAndReturn(data),
    );
  }

  async deactivateDriver(driverId: number) {
    const query = this.pg.$config.pgp.as.format(
      `UPDATE ${this.driverEntity.table()} SET is_active = FALSE WHERE driver_id = $1`,
      [driverId],
    );
    return this.driverEntity.runQuery(query);
  }

  async getDriverByPhone(phoneNumber: string) {
    const query = this.pg.$config.pgp.as.format(
      `SELECT * FROM ${this.driverEntity.table()} WHERE phone_number = $1 AND is_active = TRUE`,
      [phoneNumber],
    );
    return this.driverEntity.runQuery(query);
  }

  async assignDriverToTrip({
    driver_id,
    trip_id,
  }: {
    driver_id: number;
    trip_id: number;
  }) {
    // Example query, adapt if using different schema or naming
    const trip = await this.pg.oneOrNone(
      'SELECT * FROM trips WHERE trip_id = $1',
      [trip_id],
    );
    if (!trip) throw new Error('Trip not found');

    const driver = await this.pg.oneOrNone(
      'SELECT * FROM drivers WHERE driver_id = $1 AND is_active = true',
      [driver_id],
    );
    if (!driver) throw new Error('Driver not found or inactive');

    await this.pg.none('UPDATE trips SET driver_id = $1 WHERE trip_id = $2', [
      driver_id,
      trip_id,
    ]);

    return { message: `Driver ${driver_id} assigned to trip ${trip_id}` };
  }
}
