import { Category } from 'src/category/entities/category.entity';
import { CreateUpdateAt } from 'src/common/entities/create-update-at.entity';
import { Department } from 'src/departments/entities/department.entity';
import { OrderItem } from 'src/order-items/entities/order-item.entity';
import { Type } from 'src/types/entities/type.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToOne,
  OneToMany,
} from 'typeorm';

@Entity('items')
export class Item extends CreateUpdateAt {
  @Column()
  name: string;
  @Column({ nullable: true })
  attachment: string;
  @Column()
  description: string;
  @Column()
  image: string;
  @Column()
  serial: string;
  @Column()
  address: string;
  @Column()
  quantity: number;
  @Column()
  note: string;

  @ManyToOne(() => Type, (type) => type.items, { onDelete: 'SET NULL' })
  type: Type;

  @ManyToOne(() => Category, (category) => category.items, {
    onDelete: 'SET NULL',
  })
  category: Category;

  @ManyToOne(() => Department, (department) => department.items)
  department: Department;
  @OneToMany(() => OrderItem, (orderItem) => orderItem.item)
  orderItems: OrderItem[];
}
