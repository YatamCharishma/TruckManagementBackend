import { BaseModel } from 'src/utils/base.model';
import { Inject } from '@nestjs/common';
import { IDatabase } from 'pg-promise';
import { NEST_PGPROMISE_CONNECTION } from 'nestjs-pgpromise';

export class ReportEntity extends BaseModel<any> {
  constructor(
    @Inject(NEST_PGPROMISE_CONNECTION) public readonly pg: IDatabase<any>,
  ) {
    super(pg);
  }

  runRawQuery(query: string) {
    return this.pg.any(query);
  }
}
