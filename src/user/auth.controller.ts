import {
  Body,
  Controller,
  Headers,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { UserService } from './user.service';

@Controller('auth') // (url/auth)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  // + Login route (POST /auth/login)
  //todo: utilize response handler
  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res() res: Response,
  ) {
    const user = await this.userService.findByEmail(email);

    if (
      !user ||
      !(await this.userService.comparePassword(password, user.password))
    ) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        status: HttpStatus.UNAUTHORIZED,
        message: 'Invalid email or password',
      });
    }

    const token = await this.authService.generateToken(user);
    return res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      message: 'Login successful',
      token,
    });
  }

  // + Logout route (POST /auth/logout)
  //todo: utilize response handler
  @Post('logout')
  async logout(@Headers('token') token: string, @Res() res: Response) {
    await this.authService.invalidateToken(token);
    return res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      message: 'Logout successful',
    });
  }
}
