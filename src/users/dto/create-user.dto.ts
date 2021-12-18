import { IsIn, IsPhoneNumber, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsIn(['admin', 'storeManager', 'storeEmployee'])
  role: string;
  @IsPhoneNumber('IQ')
  phone: string;
  @IsString()
  password: string;
}
