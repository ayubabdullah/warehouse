import { Base } from 'src/common/entities/base.entity';
import { Role } from 'src/common/enums/role.enum';
import { Log } from 'src/logging/entities/log.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Genders } from 'src/common/enums/gender.enum';
import { Department } from 'src/departments/entities/department.entity';

@Entity('users')
export class User extends Base {
  @Column({ type: 'enum', enum: Role, default: Role.STORE_EMPLOYEE })
  role: string;
  @Column({ unique: true })
  phone: string;
  @Column()
  password: string;
  @Column()
  name: string;
  @Column()
  address: string;
  @Column({ nullable: true })
  salary: number;
  @Column({ type: 'enum', enum: Genders, default: Genders.MALE })
  gender: string;
  @Column()
  startedAt: Date;
  @Column({ nullable: true })
  note: string;
  @ManyToOne(() => Department, (department) => department.users, {
    onDelete: 'CASCADE',
  })
  department: Department;
  @OneToMany(() => Log, (log) => log.user)
  logs: Log[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    const salt = await bcrypt.genSalt();
    if (!/^\$2a\$\d+\$/.test(this.password)) {
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  async checkPassword(enteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
  }
}
