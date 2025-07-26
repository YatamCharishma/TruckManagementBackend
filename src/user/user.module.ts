import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserModel } from './user.entity';

@Module({
  controllers: [UserController],
  exports: [UserService],
  providers: [UserService, UserModel],
})
export class UserModule {}
