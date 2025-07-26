import { BaseModel } from 'src/utils/base.model';
import { Inject } from '@nestjs/common';
import { NEST_PGPROMISE_CONNECTION } from 'nestjs-pgpromise';
import { IDatabase } from 'pg-promise';

export class TruckEntity extends BaseModel<any> {
  dataColumnSet: any;
  columnSet: any;
  tableAlias = 'trucks';

  constructor(
    @Inject(NEST_PGPROMISE_CONNECTION) public readonly pg: IDatabase<any>,
  ) {
    super(pg);

    this.dataColumnSet = new this.pg.$config.pgp.helpers.ColumnSet(
      ['truck_uuid', 'name', 'type', 'capacity', 'is_active', 'created_at'],
      { table: { table: 'trucks' } },
    );

    this.columnSet = this.dataColumnSet.extend(['?truck_id']);
  }
}
