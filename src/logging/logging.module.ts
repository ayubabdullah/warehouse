import { Module } from '@nestjs/common';
import { LogsService } from './logging.service';
import { LogsController } from './logging.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Log } from './entities/log.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Log, User])],
  controllers: [LogsController],
  providers: [LogsService],
  exports: [LogsService],
})
export class LogsModule {}
