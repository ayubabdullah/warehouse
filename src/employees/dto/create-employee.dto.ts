import {
  IsDate,
  IsIn,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  name: string;
  @IsString()
  address: string;
  @IsNumber()
  @IsPositive()
  salary: number;
  @IsString()
  @IsIn(['male', 'female'])
  gender: string;
  @IsDate()
  startedAt: Date;
  @IsString()
  @IsOptional()
  note: string;
}
