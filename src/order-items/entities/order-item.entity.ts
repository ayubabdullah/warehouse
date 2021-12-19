import { CreateUpdateAt } from "src/common/entities/create-update-at.entity";
import { Item } from "src/items/entities/item.entity";
import { Order } from "src/orders/entities/order.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";

@Entity('order-items')
export class OrderItem extends CreateUpdateAt {
  @Column()
  quantity: number;
  @ManyToOne(() => Order, (order) => order.orderItems)
  order: Order;
  @OneToOne(() => Item, (item) => item.orderItem)
  @JoinColumn()
  item: Item;
}
