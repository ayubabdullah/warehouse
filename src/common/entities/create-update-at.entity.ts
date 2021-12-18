import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class CreateUpdateAt {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
