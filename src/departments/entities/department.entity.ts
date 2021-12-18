import { CreateUpdateAt } from 'src/common/entities/create-update-at.entity';
import { Employee } from 'src/employees/entities/employee.entity';
import { Item } from 'src/items/entities/item.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('departments')
export class Department extends CreateUpdateAt {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  address: string;
  @Column()
  note: string;
  @OneToMany(() => Item, (item) => item.department, {
    eager: true,
  })
  items: Item[];
  @OneToMany(() => Employee, (employee) => employee.department)
  employees: Employee[];
}
