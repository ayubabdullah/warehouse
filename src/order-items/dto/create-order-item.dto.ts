import { IsNumber, IsPositive } from 'class-validator';

export class CreateOrderItemDto {
  @IsNumber()
  @IsPositive()
  quantity: number;
}
