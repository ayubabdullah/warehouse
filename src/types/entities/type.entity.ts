import { Base } from 'src/common/entities/base.entity';
import { Item } from 'src/items/entities/item.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('types')
export class Type extends Base {
  @Column()
  name: string;
  @OneToMany(() => Item, (item) => item.type)
  items: Item[];
}
