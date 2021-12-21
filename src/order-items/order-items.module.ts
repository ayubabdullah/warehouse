import { Module } from '@nestjs/common';
import { OrderItemsService } from './order-items.service';
import { OrderItemsController } from './order-items.controller';
import { OrderItem } from './entities/order-item.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogsModule } from 'src/logs/logs.module';
import { Order } from 'src/orders/entities/order.entity';
import { Item } from 'src/items/entities/item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderItem, Order, Item]), LogsModule],
  controllers: [OrderItemsController],
  providers: [OrderItemsService],
  exports: [OrderItemsService],
})
export class OrderItemsModule {}
