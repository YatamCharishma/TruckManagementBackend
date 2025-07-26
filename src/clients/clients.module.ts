import { Module } from '@nestjs/common';
import { ClientController } from './clients.controller';
import { ClientService } from 'src/clients/clients.service';
import { ClientEntity } from 'src/clients/clients.entity';

@Module({
  controllers: [ClientController],
  providers: [
    ClientService,
    {
      provide: ClientEntity,
      useClass: ClientEntity,
    },
  ],
})
export class ClientModule {}
