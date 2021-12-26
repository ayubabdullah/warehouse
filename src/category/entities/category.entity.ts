import { Base } from 'src/common/entities/base.entity';
import { Item } from 'src/items/entities/item.entity';
import {
  Column,
  Entity,
  OneToMany
} from 'typeorm';

@Entity('categories')
export class Category extends Base {
  @Column()
  name: string;
  @OneToMany(() => Item, (item) => item.category)
  items: Item[];
}
