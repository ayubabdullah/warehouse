import { IsOptional, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  clientName: string;
  @IsString()
  clientPhone: string;
  @IsOptional()
  @IsString()
  note: string;
}
