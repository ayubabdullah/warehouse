import { Base } from 'src/common/entities/base.entity';
import { Employee } from 'src/employees/entities/employee.entity';
import { Item } from 'src/items/entities/item.entity';
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
  @OneToMany(() => Employee, (employee) => employee.department)
  employees: Employee[];
}
