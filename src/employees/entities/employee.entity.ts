import { CreateUpdateAt } from 'src/common/entities/create-update-at.entity';
import { Genders } from 'src/common/enums/gender.enum';
import { Department } from 'src/departments/entities/department.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('employees')
export class Employee extends CreateUpdateAt {
  @PrimaryGeneratedColumn()
  id: number;
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
  @OneToOne(() => User, (user) => user.employee, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn()
  user: User;
  @ManyToOne(() => Department, (department) => department.employees, {eager: true})
  department: Department;
}
