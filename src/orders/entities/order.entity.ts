import { Base } from 'src/common/entities/base.entity';
import { OrderItem } from 'src/order-items/entities/order-item.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('orders')
export class Order extends Base {
  @Column()
  clientName: string;
  @Column()
  clientPhone: string;
  @Column()
  note: string;
  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  orderItems: OrderItem[];
}
