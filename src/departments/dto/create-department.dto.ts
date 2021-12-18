import { IsOptional, IsString } from 'class-validator';

export class CreateDepartmentDto {
  @IsString()
  name: string;
  @IsString()
  address: string;
  @IsString()
  @IsOptional()
  note: string;
}
