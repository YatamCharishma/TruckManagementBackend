import { BaseModel } from 'src/utils/base.model';
import { NEST_PGPROMISE_CONNECTION } from 'nestjs-pgpromise';
import { Inject } from '@nestjs/common';
import { IDatabase } from 'pg-promise';

export class UserModel extends BaseModel<any> {
  dataColumnSet: any;
  columnSet: any;
  tableAlias = 'users';

  constructor(
    @Inject(NEST_PGPROMISE_CONNECTION) public readonly pg: IDatabase<any>,
  ) {
    super(pg);

    this.dataColumnSet = new this.pg.$config.pgp.helpers.ColumnSet(
      [
        'user_uuid',
        'team_uuid',
        'user_name',
        'user_email',
        'password_hash',
        'role',
        'is_active',
        'updated_date',
        'updated_by',
        'created_date',
        'created_by',
      ],
      {
        table: {
          table: 'users',
          schema: '',
        },
      },
    );

    this.columnSet = this.dataColumnSet.extend(['?user_id']);
  }
}
