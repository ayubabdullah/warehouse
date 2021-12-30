import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { LogsModule } from 'src/logging/logging.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItemsModule } from 'src/order-items/order-items.module';
import { Department } from 'src/departments/entities/department.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order,Department]), OrderItemsModule,LogsModule],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService]
})
export class OrdersModule {}
