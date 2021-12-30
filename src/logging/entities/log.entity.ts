import { Base } from 'src/common/entities/base.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity('logs')
export class Log extends Base {
  @Column()
  action: string;
  @ManyToOne(() => User, (user) => user.logs, {onDelete: 'CASCADE'})
  user: User;
}
  