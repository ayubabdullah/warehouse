import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Response,
} from '@nestjs/common';
import { AuthUser } from 'src/common/decorators/auth-user.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('login')
  async login(@AuthUser() user, @Response() res) {
    return this.authService.login(user, res);
  }
  @Get('logout')
  async logout(@Response() res) {
    return this.authService.logout(res);
  }
  @Get('me')
  async getMe(@AuthUser() user) {
    return user;
  }
}
