import { Injectable, Inject } from '@nestjs/common';
import { NEST_PGPROMISE_CONNECTION } from 'nestjs-pgpromise';
import { IDatabase } from 'pg-promise';
import { ClientEntity } from 'src/clients/clients.entity';

@Injectable()
export class ClientService {
  constructor(
    @Inject(NEST_PGPROMISE_CONNECTION) public readonly pg: IDatabase<any>,
    private readonly clientEntity: ClientEntity,
  ) {}

  async getAllClients() {
    const query = this.pg.$config.pgp.as.format(
      `SELECT * FROM ${this.clientEntity.table()} WHERE is_active = TRUE ORDER BY client_id DESC`,
    );
    return this.clientEntity.runQuery(query);
  }

  async addClient(data: any) {
    return this.clientEntity.runQuery(
      this.clientEntity.queryInsertAndReturn(data),
    );
  }

  async deactivateClient(clientId: number) {
    const query = this.pg.$config.pgp.as.format(
      `UPDATE ${this.clientEntity.table()} SET is_active = FALSE WHERE client_id = $1`,
      [clientId],
    );
    return this.clientEntity.runQuery(query);
  }

  async getClientByEmail(email: string) {
    const query = this.pg.$config.pgp.as.format(
      `SELECT * FROM ${this.clientEntity.table()} WHERE contact_email = $1 AND is_active = TRUE`,
      [email],
    );
    return this.clientEntity.runQuery(query);
  }

  async getClientTripHistory(clientId: number) {
    const query = this.pg.$config.pgp.as.format(
      `
      SELECT t.*, d.name as driver_name, tr.name as truck_name
      FROM trips t
      JOIN drivers d ON t.driver_id = d.driver_id
      JOIN trucks tr ON t.truck_id = tr.truck_id
      WHERE t.client_id = $1
      ORDER BY t.trip_date DESC
    `,
      [clientId],
    );

    return this.clientEntity.runQuery(query);
  }
}
