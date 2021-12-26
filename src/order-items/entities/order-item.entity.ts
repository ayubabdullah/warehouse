import { Base } from 'src/common/entities/base.entity';
import { Item } from 'src/items/entities/item.entity';
import { Order } from 'src/orders/entities/order.entity';
import {
  Column,
  Entity,
  ManyToOne,
} from 'typeorm';

@Entity('order-items')
export class OrderItem extends Base {
  @Column()
  quantity: number;
  @ManyToOne(() => Order, (order) => order.orderItems)
  order: Order;
  @ManyToOne(() => Item, (item) => item.orderItems)
  item: Item;
}
