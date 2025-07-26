import { Module } from '@nestjs/common';
import { TripController } from './trips.controller';
import { TripService } from 'src/trips/trips.service';
import { TripEntity } from 'src/trips/trips.entity';

@Module({
  controllers: [TripController],
  providers: [
    TripService,
    {
      provide: TripEntity,
      useClass: TripEntity,
    },
  ],
})
export class TripModule {}
