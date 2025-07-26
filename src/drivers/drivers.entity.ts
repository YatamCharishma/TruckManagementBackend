import { BaseModel } from 'src/utils/base.model';
import { Inject } from '@nestjs/common';
import { NEST_PGPROMISE_CONNECTION } from 'nestjs-pgpromise';
import { IDatabase } from 'pg-promise';

export class DriverEntity extends BaseModel<any> {
  dataColumnSet: any;
  columnSet: any;
  tableAlias = 'drivers';

  constructor(
    @Inject(NEST_PGPROMISE_CONNECTION) public readonly pg: IDatabase<any>,
  ) {
    super(pg);

    this.dataColumnSet = new this.pg.$config.pgp.helpers.ColumnSet(
      [
        'driver_uuid',
        'name',
        'phone_number',
        'license_number',
        'is_active',
        'created_at',
      ],
      { table: { table: 'drivers' } },
    );

    this.columnSet = this.dataColumnSet.extend(['?driver_id']);
  }
}
