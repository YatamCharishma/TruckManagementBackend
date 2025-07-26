import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { Request, Response } from 'express';
import { createSuccess, ErrorException } from 'src/utils/response.handler';
import { Roles } from 'src/roles/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/roles/roles.guard';

@Controller('user')
export class UserController {
  constructor(private userInfoService: UserService) {}

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('Admin')
  @Get('/all-users-info')
  async getAllUsersInfo(req: Request, res: Response) {
    try {
      return createSuccess(
        'getAllUsersInfo',
        await this.userInfoService.getAllUsersInfo(),
      );
    } catch (error) {
      throw new ErrorException(
        'getAllUsersInfo',
        'Error in getting all users info',
        error,
      );
    }
  }

  @Put('/update-user-info')
  async updateUserInfo(@Body() userData: any) {
    try {
      console.log('Received user data for update:', userData);
      return createSuccess(
        'updateUserInfo',
        this.userInfoService.updateUserInfo(userData),
      );
    } catch (error) {
      throw new ErrorException(
        'updateUserInfo',
        'Error in updating user info',
        error,
      );
    }
  }

  @Delete('/delete-user-info/:user_email')
  async deleteUserInfo(@Param('user_email') userEmail: string) {
    try {
      return createSuccess(
        'deleteUserInfo',
        await this.userInfoService.deleteUserInfo(userEmail),
      );
    } catch (error) {
      throw new ErrorException(
        'deleteUserInfo',
        'Error in deleting user info',
        error,
      );
    }
  }

  @Post('/add-user')
  async addUser(@Body() userData: any) {
    try {
      console.log('Received user data for creation:', userData);
      return createSuccess(
        'createUserInfo',
        await this.userInfoService.addUser(userData),
      );
    } catch (error) {
      throw new ErrorException(
        'createUserInfo',
        'Error in creating user info',
        error,
      );
    }
  }
}
