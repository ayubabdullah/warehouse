import { Module } from '@nestjs/common';
import { TypesService } from './types.service';
import { TypesController } from './types.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Type } from './entities/type.entity';
import { LogsModule } from 'src/logging/logging.module';

@Module({
  imports: [TypeOrmModule.forFeature([Type]), LogsModule],
  controllers: [TypesController],
  providers: [TypesService],
})
export class TypesModule {}
