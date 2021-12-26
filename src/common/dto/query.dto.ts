import { Type } from 'class-transformer';
import { IsOptional, IsPositive, IsString } from 'class-validator';

export class QueryDto {
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  page: number;
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  limit: number;
  @IsOptional()
  @IsString()
  select: string;
  @IsString()
  @IsOptional()
  search: string;
  @IsOptional()
  @IsString()
  sort: string;
}
