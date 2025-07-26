import { BaseModel } from 'src/utils/base.model';
import { Inject } from '@nestjs/common';
import { NEST_PGPROMISE_CONNECTION } from 'nestjs-pgpromise';
import { IDatabase } from 'pg-promise';

export class ClientEntity extends BaseModel<any> {
  dataColumnSet: any;
  columnSet: any;
  tableAlias = 'clients';

  constructor(
    @Inject(NEST_PGPROMISE_CONNECTION) public readonly pg: IDatabase<any>,
  ) {
    super(pg);

    this.dataColumnSet = new this.pg.$config.pgp.helpers.ColumnSet(
      [
        'client_uuid',
        'name',
        'contact_email',
        'contact_phone',
        'address',
        'is_active',
        'created_at',
      ],
      { table: { table: 'clients' } },
    );

    this.columnSet = this.dataColumnSet.extend(['?client_id']);
  }
}
