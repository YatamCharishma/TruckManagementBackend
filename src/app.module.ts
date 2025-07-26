import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { NestPgpromiseModule } from 'nestjs-pgpromise';
import { TruckModule } from './trucks/trucks.module';
import { DriverModule } from './drivers/drivers.module';
import { ClientModule } from './clients/clients.module';
import { TripModule } from './trips/trips.module';
import { ReportModule } from './reports/reports.module';
import { AuthModule } from './auth/auth.module';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    NestPgpromiseModule.register({
      isGlobal: true,
      connection: {
        host: process.env.PGHOST,
        port: +(process.env.PGPORT || 5432),
        database: process.env.PGDATABASE,
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
      },
    }),
    UserModule,
    TruckModule,
    DriverModule,
    ClientModule,
    TripModule,
    ReportModule,
    AuthModule,
  ],
})
export class AppModule {}
