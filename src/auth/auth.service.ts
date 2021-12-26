import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import { LogsService } from 'src/logs/logs.service';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async validateUser(phone: string, password: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { phone } });
    if (!user) {
      throw new UnauthorizedException('invalid credentials');
    }
    if (!(await user.checkPassword(password))) {
      throw new UnauthorizedException('invalid credentials');
    }
    return user;
  }

  async login(user: any, res: Response) {
    const payload = { sub: user.id };
    const token = this.jwtService.sign(payload);
    const options = {
      expires: new Date(
        Date.now() +
          this.configService.get('JWT_COOKIE_EXPIRE') * 24 * 60 * 60 * 1000,
      ),
      httpOnly: true,
    };

    res.cookie('token', token, options).json({ token });
  }
  async logout(res: Response) {
    res
      .cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
      })
      .json({ success: true });
  }

  async verifyPayload(payload): Promise<User> {
    let user: User;

    user = await this.userRepository.findOne(payload.sub);
    if (!user) {
      throw new NotFoundException(`user with id: ${payload.sub} not found`);
    }
    return user;
  }
}
