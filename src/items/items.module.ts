import { Module} from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { Department } from 'src/departments/entities/department.entity';
import { LogsModule } from 'src/logging/logging.module';


@Module({
  imports: [TypeOrmModule.forFeature([Item, Department]), LogsModule],
  providers: [ItemsService],
  controllers: [ItemsController],
  exports: [ItemsService],
})
export class ItemsModule {}
