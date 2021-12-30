import { IsObject, IsString } from 'class-validator';
import { User } from 'src/users/entities/user.entity';

export class CreateLogDto {
  @IsString()
  action: string;
}
