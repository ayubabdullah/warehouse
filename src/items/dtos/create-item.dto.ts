import {
  IsNumber,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { Category } from 'src/category/entities/category.entity';
import { Department } from 'src/departments/entities/department.entity';
import { Type } from 'src/types/entities/type.entity';

export class CreateItemDto {
  @IsString()
  name: string;
  @IsOptional()
  @IsString()
  attachment: string;
  @IsString()
  description: string;
  @IsString()
  image: string;
  @IsString()
  serial: string;
  @IsString()
  address: string;
  @IsNumber()
  @IsPositive()
  quantity: number;
  @IsString()
  @IsOptional()
  note: string;
  @IsObject()
  type: Type;
  @IsObject()
  category: Category;
}
