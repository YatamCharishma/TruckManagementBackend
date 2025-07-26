import { Module } from '@nestjs/common';
import { TruckController } from './trucks.controller';
import { TruckService } from 'src/trucks/trucks.service';
import { TruckEntity } from 'src/trucks/trucks.entity';

@Module({
  controllers: [TruckController],
  providers: [
    TruckService,
    {
      provide: TruckEntity,
      useClass: TruckEntity,
    },
  ],
})
export class TruckModule {}
