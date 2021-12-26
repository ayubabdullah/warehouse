import { Controller, Get, Post, UseGuards, Response } from '@nestjs/common';
import { AuthUser } from 'src/common/decorators/auth-user.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { Serialize } from 'src/common/decorators/serialize.decorator';
import { UserDto } from 'src/users/dto/user.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
@Serialize(UserDto)
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
