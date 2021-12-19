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
} from 'typeorm';

@Entity('items')
export class Item extends CreateUpdateAt {
  @PrimaryGeneratedColumn()
  id: number;
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
  note: string;

  @ManyToOne(() => Type, (type) => type.items, { eager: true })
  type: Type;

  @ManyToOne(() => Category, (category) => category.items, {
    onDelete: 'SET NULL',
  })
  category: Category;

  @ManyToOne(() => Department, (department) => department.items)
  department: Department;
  @OneToOne(() => OrderItem, orderItem => orderItem.item)
  orderItem: OrderItem;
}
