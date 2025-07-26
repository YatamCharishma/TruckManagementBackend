import { BaseModel } from 'src/utils/base.model';
import { Inject } from '@nestjs/common';
import { NEST_PGPROMISE_CONNECTION } from 'nestjs-pgpromise';
import { IDatabase } from 'pg-promise';

export class TripEntity extends BaseModel<any> {
  dataColumnSet: any;
  columnSet: any;
  tableAlias = 'trips';

  constructor(
    @Inject(NEST_PGPROMISE_CONNECTION) public readonly pg: IDatabase<any>,
  ) {
    super(pg);

    this.dataColumnSet = new this.pg.$config.pgp.helpers.ColumnSet(
      [
        'trip_uuid',
        'truck_id',
        'driver_id',
        'client_id',
        'trip_date',
        'start_location',
        'end_location',
        'revenue',
        'expenses',
        'notes',
        'is_active',
        'created_at',
      ],
      { table: { table: 'trips' } },
    );

    this.columnSet = this.dataColumnSet.extend(['?trip_id']);
  }
}
