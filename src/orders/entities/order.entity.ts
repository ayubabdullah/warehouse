import { CreateUpdateAt } from 'src/common/entities/create-update-at.entity';
import { OrderItem } from 'src/order-items/entities/order-item.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('orders')
export class Order extends CreateUpdateAt {
  @Column()
  clientName: string;
  @Column()
  clientPhone: string;
  @Column()
  note: string;
  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  orderItems: OrderItem[];
}
