import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { LogsModule } from 'src/logs/logs.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItemsModule } from 'src/order-items/order-items.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order]), OrderItemsModule,LogsModule],
  controllers: [OrdersController],
  providers: [OrdersService]
})
export class OrdersModule {}
