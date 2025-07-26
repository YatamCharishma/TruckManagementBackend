import { Module } from '@nestjs/common';
import { DriverController } from './drivers.controller';
import { DriverService } from 'src/drivers/drivers.service';
import { DriverEntity } from 'src/drivers/drivers.entity';

@Module({
  controllers: [DriverController],
  providers: [
    DriverService,
    {
      provide: DriverEntity,
      useClass: DriverEntity,
    },
  ],
})
export class DriverModule {}
