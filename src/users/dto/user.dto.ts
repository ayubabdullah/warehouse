import { Expose } from 'class-transformer';

export class UserDto {
  @Expose()
  id: number;
  @Expose()
  phone: string;
  @Expose()
  role: string;
  @Expose()
  createdAt: Date;
  @Expose()
  updatedAt: Date;
}
