import { IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  clientName: string;
  @IsPhoneNumber('IQ')
  clientPhone: string;
  @IsOptional()
  @IsString()
  note: string;
}
