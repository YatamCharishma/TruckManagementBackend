import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.userService.getUserData(email);
    console.log('JWT_SECRET at runtime:', process.env.JWT_SECRET);
    const match = await bcrypt.compare(pass, user.password_hash);
    console.log('idddi', match, user.password_hash, pass);
    console.log(await bcrypt.hash("aws123", 10));
    return match ? user : null;
  }

  async login(user: any) {
    const payload = { email: user.user_email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
