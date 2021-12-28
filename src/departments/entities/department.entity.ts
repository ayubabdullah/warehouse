import { Base } from 'src/common/entities/base.entity';
import { Item } from 'src/items/entities/item.entity';
import { Order } from 'src/orders/entities/order.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('departments')
export class Department extends Base {
  @Column()
  name: string;
  @Column()
  address: string;
  @Column()
  note: string;
  @OneToMany(() => Item, (item) => item.department)
  items: Item[];
  @OneToMany(() => Order, (order) => order.department)
  orders: Order[];
  @OneToMany(() => User, (user) => user.department)
  users: User[];
}
