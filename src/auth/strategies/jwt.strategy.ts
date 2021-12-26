import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { Payload } from '../interfaces/payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (request: Request) => {
          if (!request || !request.cookies) {
            return null;
          }
          return request.cookies['token'];
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: Payload) {
    return this.authService.verifyPayload(payload);
  }
}
