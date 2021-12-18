import {
  IsDate,
  IsDateString,
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
  @IsString()
  startedAt: String;
  @IsString()
  @IsOptional()
  note: string;
}
