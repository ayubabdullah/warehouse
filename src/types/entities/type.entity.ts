import { CreateUpdateAt } from 'src/common/entities/create-update-at.entity';
import { Item } from 'src/items/entities/item.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('types')
export class Type extends CreateUpdateAt {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @OneToMany(() => Item, (item) => item.type)
  items: Item[];
}
