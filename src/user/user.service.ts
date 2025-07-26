import { Injectable, Inject } from '@nestjs/common';
import { NEST_PGPROMISE_CONNECTION } from 'nestjs-pgpromise';
import { IDatabase } from 'pg-promise';
import { UserModel } from 'src/user/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @Inject(NEST_PGPROMISE_CONNECTION) public readonly pg: IDatabase<any>,
    private usersEntity: UserModel,
  ) {}

  runUsersQuery(queryString: string) {
    return this.usersEntity.runQuery(queryString);
  }

  async getUserData(userEmail: String) {
    console.log('In the getUserData function!');

    const userDataQuery = this.pg.$config.pgp.as.format(
      `SELECT user_id, user_uuid, user_name, user_email, password_hash, role, is_active, team_uuid
   FROM users
   WHERE LOWER(user_email) = $1 AND is_active = TRUE`,
      [userEmail.toLowerCase().trim()],
    );

    const userData = await this.runUsersQuery(userDataQuery);
    if (!userData || userData.length === 0) {
      throw new Error('User not found or inactive');
    }

    return userData[0];
  }

  async checkUserExists(
    userEmail: string,
  ): Promise<{ exists: boolean; message?: string }> {
    try {
      const userCheckQuery = this.pg.$config.pgp.as.format(
        `
      SELECT EXISTS (
        SELECT 1 FROM wab_tsg.tieqraft_users 
        WHERE lower(user_email) = $1 AND is_active = TRUE
      ) as user_exists
    `,
        [userEmail],
      );

      const result = await this.runUsersQuery(userCheckQuery);

      if (!result || result.length === 0 || !result[0].user_exists) {
        return {
          exists: false,
          message:
            'User not authorized to access this application, please contact administrator.',
        };
      }

      return { exists: true };
    } catch (error) {
      console.error('Error checking user existence:', error);
      return {
        exists: false,
        message: 'Error verifying user authorization',
      };
    }
  }

  async getAllUsersInfo() {
    try {
      console.log(
        'In the getAllUsersInfo function!',
        this.pg.$config.pgp.as.format(
          `SELECT * FROM ${this.usersEntity.table()} where is_active order by user_id DESC;`,
        ),
      );
      const data = await this.usersEntity.runQuery(
        this.pg.$config.pgp.as.format(
          `SELECT * FROM ${this.usersEntity.table()} where is_active order by user_id DESC;`,
        ),
      );
      return data;
    } catch (error) {
      console.error('Error Getting All Users Info', error);
      return {
        error: error,
        message: 'Error Getting All Users Info',
      };
    }
  }

  async updateUserInfo(userData: any) {
    try {
      const userId = userData.user_id;

      if (userData.password) {
        userData.password_hash = await bcrypt.hash(userData.password, 10);
        delete userData.password;
      }

      await this.usersEntity.runQuery(
        this.usersEntity.querySetOldRecordFalseCustom(
          userId,
          'user_id',
          'is_active',
        ),
      );

      await this.usersEntity.runQuery(
        this.usersEntity.queryInsertAndReturn(userData),
      );

      return {
        message: 'User info updated successfully',
      };
    } catch (error) {
      console.error('Error Updating User Info', error);
      return {
        error,
        message: 'Error Updating User Info',
      };
    }
  }

  async deleteUserInfo(userEmail: string) {
    try {
      await this.usersEntity.runQuery(
        this.pg.$config.pgp.as.format(
          `UPDATE ${this.usersEntity.table()} SET is_active = false WHERE user_email = $1`,
          [userEmail],
        ),
      );
      return { message: 'User info deleted successfully' };
    } catch (error) {
      console.error('Error Deleting User Info', error);
      return {
        error: error,
        message: 'Error Deleting User Info',
      };
    }
  }

  async addUser(userData: any) {
    userData.user_email = userData.user_email.toLowerCase();

    if (userData.password) {
      userData.password_hash = await bcrypt.hash(userData.password, 10);
      delete userData.password;
    }

    await this.usersEntity.runQuery(
      this.usersEntity.queryInsertAndReturn(userData),
    );

    return {
      message: 'User added successfully',
    };
  }
}
