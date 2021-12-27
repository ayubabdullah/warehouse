import { IsIn, IsObject, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { Employee } from 'src/employees/entities/employee.entity';

export class CreateUserDto {
  @IsOptional()
  @IsString()
  @IsIn(['admin', 'storeManager', 'storeEmployee'])
  role: string;
  @IsPhoneNumber('IQ')
  phone: string;
  @IsString()
  password: string;
  @IsObject()
  employee: Employee
}
