import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { QueryDto } from 'src/common/dto/query.dto';
import { Item } from 'src/items/entities/item.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Like, Repository } from 'typeorm';
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

    const orderItem = await this.orderItemRepository.create(createOrderItemDto);
    orderItem.order = order;
    if (item.quantity - quantity <= 0) {
      throw new BadRequestException(
        `there is not enough quantity of that item, you request ${quantity} items and there is ${item.quantity} in warehouse`,
      );
    }
    item.quantity = item.quantity - quantity;
    await this.itemRepository.save(item);
    return this.orderItemRepository.save(orderItem);
  }

  async update(
    orderId: number,
    id: number,
    updateOrderItemDto: UpdateOrderItemDto,
  ) {
    const order = await this.orderRepository.findOne(orderId);

    if (!order) {
      throw new NotFoundException(`order with id: ${orderId} not found`);
    }
    let orderItem = await this.orderItemRepository.findOne(id);

    if (!orderItem) {
      throw new NotFoundException(`orderItem with id: ${id} not found`);
    }

    if (updateOrderItemDto.quantity) {
      if (orderItem.quantity > updateOrderItemDto.quantity) {
        orderItem.item.quantity +=
          orderItem.quantity - updateOrderItemDto.quantity;
      } else {
        if (orderItem.item.quantity - updateOrderItemDto.quantity <= 0) {
          throw new BadRequestException(
            `there is not enough quantity of that item`,
          );
        }
        orderItem.item.quantity -=
          updateOrderItemDto.quantity - orderItem.quantity;
      }
    }

    if (!(orderItem.order.id === orderId)) {
      throw new BadRequestException(
        `this orderItem doesn't belonge to this order with id: ${orderId}`,
      );
    }

    await this.itemRepository.save(orderItem.item);
    orderItem = await this.orderItemRepository.preload({
      id,
      ...updateOrderItemDto,
    });

    return this.orderItemRepository.save(orderItem);
  }

  async remove(orderId: number, id: number) {
    const order = await this.orderRepository.findOne(orderId);

    if (!order) {
      throw new NotFoundException(`order with id: ${orderId} not found`);
    }

    const orderItem = await this.orderItemRepository.findOne(id);
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
    return this.orderItemRepository.remove(orderItem);
  }
}
