import { Base } from 'src/common/entities/base.entity';
import { Role } from 'src/common/enums/role.enum';
import { Employee } from 'src/employees/entities/employee.entity';
import { Log } from 'src/logs/entities/log.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity('users')
export class User extends Base {
  @Column({ type: 'enum', enum: Role, default: Role.STORE_EMPLOYEE })
  role: string;
  @Column({ unique: true })
  phone: string;
  @Column()
  password: string;
  @OneToOne(() => Employee, (employee) => employee.user, {
    cascade: true,
  })
  @JoinColumn()
  employee: Employee;

  @OneToMany(() => Log, (log) => log.user, {
    onDelete: 'CASCADE',
  })
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
