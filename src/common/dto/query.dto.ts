import { IsOptional, IsPositive, IsString } from 'class-validator';

export class QueryDto {
  @IsOptional()
  @IsPositive()
  page: number;
  @IsOptional()
  @IsPositive()
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
