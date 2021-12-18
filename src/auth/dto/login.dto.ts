import {
  IsDefined,
  IsNotEmpty,
  IsEmail,
  MinLength,
  Validate,
  IsString,
  IsIn,
  IsPhoneNumber,
} from 'class-validator';

export class LoginDto {
  @IsDefined()
  @IsPhoneNumber('IQ')
  phone: string;

  @IsDefined()
  @MinLength(8)
  @IsString()
  password: string;
}
