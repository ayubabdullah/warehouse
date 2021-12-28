import { Base } from 'src/common/entities/base.entity';
import { Department } from 'src/departments/entities/department.entity';
import { OrderItem } from 'src/order-items/entities/order-item.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity('orders')
export class Order extends Base {
  @Column()
  clientName: string;
  @Column()
  clientPhone: string;
  @Column()
  note: string;
  @ManyToOne(() => Department, (department) => department.orders)
  department: Department;
  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  orderItems: OrderItem[];
}
