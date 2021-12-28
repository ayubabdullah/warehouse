import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from 'src/items/entities/item.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Repository } from 'typeorm';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { OrderItem } from './entities/order-item.entity';

@Injectable()
export class OrderItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
  ) {}
  async create(orderId: number, createOrderItemDto: CreateOrderItemDto) {
    const { quantity, item } = createOrderItemDto;
    const order = await this.orderRepository.findOne(orderId);

    if (!order) {
      throw new NotFoundException(`order with id: ${orderId} not found`);
    }
    if (item.quantity - quantity < 0) {
      throw new BadRequestException(
        `there is not enough quantity of that item, you request ${quantity} items and there is ${item.quantity} in warehouse`,
      );
    }
    const orderItem = await this.orderItemRepository.create(createOrderItemDto);
    orderItem.order = order;

    item.quantity -= quantity;
    await this.itemRepository.save(item);
    await this.orderItemRepository.save(orderItem);
    return {
      success: true,
      data: orderItem,
    };
  }

  async update(
    orderId: number,
    id: number,
    updateOrderItemDto: UpdateOrderItemDto,
  ) {
    let orderItem = await this.orderItemRepository.findOne(id, {
      relations: ['order', 'item'],
    });

    if (!orderItem) {
      throw new NotFoundException(`orderItem with id: ${id} not found`);
    }
    if (!(orderItem.order.id === orderId)) {
      throw new BadRequestException(
        `this orderItem doesn't belonge to this order with id: ${orderId}`,
      );
    }
    if (updateOrderItemDto.quantity) {
      if (orderItem.quantity > updateOrderItemDto.quantity) {
        orderItem.item.quantity +=
          orderItem.quantity - updateOrderItemDto.quantity;
      } else {
        if (
          orderItem.item.quantity -
            (updateOrderItemDto.quantity - orderItem.quantity) <
          0
        ) {
          throw new BadRequestException(
            `there is not enough quantity of that item`,
          );
        }
        orderItem.item.quantity -=
          updateOrderItemDto.quantity - orderItem.quantity;
      }
    }

    await this.itemRepository.save(orderItem.item);
    orderItem = await this.orderItemRepository.preload({
      id,
      ...updateOrderItemDto,
    });

    await this.orderItemRepository.save(orderItem);
    return {
      success: true,
      data: orderItem,
    };
  }

  async remove(orderId: number, id: number) {
    const orderItem = await this.orderItemRepository.findOne(id, {
      relations: ['order', 'item'],
    });
    if (!orderItem) {
      throw new NotFoundException(`orderItem with id: ${id} not found`);
    }

    if (!(orderItem.order.id === orderId)) {
      throw new BadRequestException(
        `this orderItem doesn't belonge to this order with id: ${orderId}`,
      );
    }
    orderItem.item.quantity += orderItem.quantity;
    await this.itemRepository.save(orderItem.item);
    await this.orderItemRepository.remove(orderItem);
    return {
      success: true,
      data: orderItem,
    };
  }
  async returnItem(id: number) {
    const orderItem = await this.orderItemRepository.findOne(id, {
      relations: ['order', 'item'],
    });
    if (!orderItem) {
      throw new NotFoundException(`orderItem with id: ${id} not found`);
    }
    orderItem.item.quantity += orderItem.quantity;
    await this.itemRepository.save(orderItem.item);
    await this.orderItemRepository.remove(orderItem);
    return {
      success: true,
      data: orderItem,
    };
  }
}
