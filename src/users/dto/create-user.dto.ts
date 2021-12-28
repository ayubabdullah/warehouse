import {
  IsDate,
  IsIn,
  IsNumber,
  IsObject,
  IsOptional,
  IsPhoneNumber,
  IsPositive,
  IsString,
} from 'class-validator';
import { Department } from 'src/departments/entities/department.entity';

export class CreateUserDto {
  @IsString()
  name: string;
  @IsOptional()
  @IsString()
  @IsIn(['admin', 'storeManager', 'storeEmployee'])
  role: string;
  @IsPhoneNumber('IQ')
  phone: string;
  @IsString()
  password: string;
  @IsString()
  address: string;
  @IsNumber()
  @IsPositive()
  salary: number;
  @IsString()
  @IsIn(['male', 'female'])
  gender: string;
  @IsString()
  startedAt: Date;
  @IsString()
  @IsOptional()
  note: string;
  @IsObject()
  department: Department
}
