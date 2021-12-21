import { IsNumber, IsObject, IsPositive } from 'class-validator';
import { Item } from 'src/items/entities/item.entity';

export class CreateOrderItemDto {
  @IsNumber()
  @IsPositive()
  quantity: number;
  @IsObject()
  item: Item;
}
