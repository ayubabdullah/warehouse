import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { Department } from 'src/departments/entities/department.entity';
import { Employee } from 'src/employees/entities/employee.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Item, Department, Employee])],
  providers: [ItemsService],
  controllers: [ItemsController],
  exports: [ItemsService]
})
export class ItemsModule {}
