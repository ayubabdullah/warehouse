import { Base } from 'src/common/entities/base.entity';
import { Genders } from 'src/common/enums/gender.enum';
import { Department } from 'src/departments/entities/department.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, OneToOne } from 'typeorm';

@Entity('employees')
export class Employee extends Base {
  @Column()
  name: string;
  @Column()
  address: string;
  @Column()
  salary: number;
  @Column({ type: 'enum', enum: Genders, default: Genders.MALE })
  gender: string;
  @Column()
  startedAt: Date;
  @Column()
  note: string;
  @OneToOne(() => User, (user) => user.employee, { onDelete: 'CASCADE' })
  user: User;
  @ManyToOne(() => Department, (department) => department.employees)
  department: Department;
}
