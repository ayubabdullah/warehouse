import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { LogsModule } from 'src/logs/logs.module';
@Module({
  imports: [TypeOrmModule.forFeature([User]), LogsModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
