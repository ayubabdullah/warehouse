import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { LogsModule } from 'src/logging/logging.module';
import { Department } from 'src/departments/entities/department.entity';
@Module({
  imports: [TypeOrmModule.forFeature([User, Department]), LogsModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
