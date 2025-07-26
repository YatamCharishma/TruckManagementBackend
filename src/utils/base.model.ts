import { ColumnSet, IDatabase, ITask } from 'pg-promise';
import { Inject } from '@nestjs/common';
import { NEST_PGPROMISE_CONNECTION } from 'nestjs-pgpromise';
import { removeTrailingComma, removeQuotes } from './response.handler';

export class BaseModel<T> {
  public dataColumnSet: ColumnSet<unknown>;
  public columnSet: ColumnSet<unknown>;
  public tableAlias: string;

  protected constructor(
    @Inject(NEST_PGPROMISE_CONNECTION) public readonly pg: IDatabase<any>,
  ) {}

  table(): string {
    return this.columnSet.table.toString();
  }

  tableName(): string {
    return removeQuotes(this.table());
  }

  tableNameNoSchema(): string {
    return this.columnSet.table.table;
  }

  tableExtraAlias(extraAlias: string): string {
    return `${this.tableAlias}${extraAlias}`;
  }

  genJsonQueryNormal() {
    const start = 'JSON_BUILD_OBJECT(';
    const end = `)::json as ${this.tableNameNoSchema()}`;

    let mainString = '';
    this.columnSet.columns.forEach(
      (obj) =>
        (mainString += `'${obj.name}' , ${this.tableAlias}.${obj.name},`),
    );
    mainString = removeTrailingComma(mainString);

    return `${start} ${mainString} ${end}`;
  }

  getMainString(extraAlias: string) {
    let tableAliased = '';
    if (extraAlias && extraAlias.length > 0) {
      tableAliased = `${this.tableAlias}${extraAlias}`;
    } else {
      tableAliased = `${this.tableAlias}`;
    }
    let mainString = '';
    this.columnSet.columns.forEach(
      (obj) => (mainString += `'${obj.name}' , ${tableAliased}.${obj.name},`),
    );
    mainString = removeTrailingComma(mainString);
    return mainString;
  }

  getInnerMainString(nestedKey: string, extraAlias: string) {
    const start = 'JSON_BUILD_OBJECT(';
    const end = `)::json`;

    let sectionPathDashedQuery = '';
    if (this.tableNameNoSchema().toLowerCase() === 'shop_section_detail') {
      sectionPathDashedQuery = `,
                               'section_path_dashed', REPLACE(${this.tableAlias}${extraAlias}.section_path::text, '.', '-')`;
    }

    return `
          '${nestedKey}', ${start}
                      ${this.getMainString(extraAlias)}
                      ${sectionPathDashedQuery}
                   ${end}
       `;
  }

  genJsonQueryNested() {
    const start = 'JSON_BUILD_OBJECT(';
    const end = `)::json`;

    return `
          ${start}
             ${this.getInnerMainString('from', 'F')},
             ${this.getInnerMainString('current', 'C')},
             ${this.getInnerMainString('to', 'T')}
          ${end} as ${this.tableNameNoSchema()}
       `;
  }

  csvAllNames(): string {
    return this.columnSet.names;
  }

  csvAllNamesWithTable(): string {
    let finalString = '';
    this.columnSet.columns.forEach(
      (obj) => (finalString += `${this.table()}.${obj.name},`),
    );
    return removeTrailingComma(finalString);
  }

  csvAllNamesWithAlias(extraAlias?: string): string {
    let finalString = '';

    let extraAliasString = '';
    let tableAliased = '';
    if (extraAlias && extraAlias.length > 0) {
      extraAliasString = `${extraAlias}_`;
      tableAliased = `${this.tableAlias}${extraAlias}`;
    } else {
      extraAliasString = `_`;
      tableAliased = `${this.tableAlias}`;
    }

    this.columnSet.columns.forEach(
      (obj) =>
        (finalString += `${tableAliased}.${obj.name} as ${this.tableAlias}${extraAliasString}__${obj.name},`),
    );
    return removeTrailingComma(finalString);
  }

  csvModNames(): any {
    let finalString = '';
    const namesArray = this.columnSet.columns.filter((cs) => cs.cnd !== true);
    namesArray.forEach((obj) => (finalString += `${obj.name},`));
    return removeTrailingComma(finalString);
  }

  columnsToInsertToNames(): string {
    return this.dataColumnSet.names;
  }

  columnsToInsertToDollar(): string {
    return this.dataColumnSet.variables;
  }

  querySelectActive(): string {
    return this.pg.$config.pgp.as.format(`SELECT ${this.csvAllNames()}
                                              FROM ${this.table()}`);
  }

  queryInsertAndReturn(insertOptions: T): string {
    return this.pg.$config.pgp.as.format(
      `INSERT INTO ${this.table()}
                 (${this.columnsToInsertToNames()})
             VALUES (${this.columnsToInsertToDollar()})
             RETURNING *`,
      insertOptions,
    );
  }

  // querySetOldRecordFalse(insertOptions: T): string {
  //     return this.pg.$config.pgp.as.format(
  //        `UPDATE
  //              ${this.table()}
  //          SET is_active = false
  //          WHERE ${tableNameAndCardId[this.tableNameNoSchema()]} = $1 RETURNING *`,
  //        insertOptions[tableNameAndCardId[this.tableNameNoSchema()]],
  //     );
  // }

  querySetOldRecordFalseCustom(
    idValue: any,
    idColumn = 'id',
    isActiveColumn = 'is_active',
  ): string {
    return this.pg.$config.pgp.as.format(
      `UPDATE
                 ${this.table()}
             SET ${isActiveColumn} = false
             WHERE ${idColumn} = $1
             RETURNING *`,
      idValue,
    );
  }

  async runQuery(queryString: string, t?: ITask<any>): Promise<T[]> {
    const dbInstance: IDatabase<any> | ITask<any> = t == null ? this.pg : t;
    return await dbInstance.any(queryString);
  }
}
