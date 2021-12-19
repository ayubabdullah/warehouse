import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { QueryDto } from 'src/common/dto/query.dto';
import { Like, Repository } from 'typeorm';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { OrderItem } from './entities/order-item.entity';

@Injectable()
export class OrderItemsService {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
  ) {}
  async create(createOrderItemDto: CreateOrderItemDto) {
    const orderItem = await this.orderItemRepository.create(createOrderItemDto);
    return this.orderItemRepository.save(orderItem);
  }

  async findAll(queryDto: QueryDto): Promise<Pagination<OrderItem>> {
    let query: any = {};
    const page = queryDto.page || 1;
    const limit = queryDto.limit || 25;

    if (queryDto.select) {
      const fields = queryDto.select.split(',');
      query.select = ['id', ...fields, 'createdAt'];
    }
    query.orderItem = { createdAt: -1 };
    if (queryDto.search) {
      query.where = { name: Like(`%${queryDto.search}%`) };
    }
    return paginate<OrderItem>(
      this.orderItemRepository,
      {
        page,
        limit,
        route: 'http://localhost:5000/api/v1/orderitems',
      },
      query,
    );
  }

  async findOne(id: number) {
    const orderItem = await this.orderItemRepository.findOne(id);
    if (!orderItem) {
      throw new NotFoundException(`orderItem with id: ${id} not found`);
    }
    return orderItem;
  }

  async update(id: number, updateOrderItemDto: UpdateOrderItemDto) {
    const orderItem = await this.orderItemRepository.preload({
      id,
      ...updateOrderItemDto,
    });
    if (!orderItem) {
      throw new NotFoundException(`orderItem with id: ${id} not found`);
    }
    return this.orderItemRepository.save(orderItem);
  }

  async remove(id: number) {
    const orderItem = await this.findOne(id);
    return this.orderItemRepository.remove(orderItem);
  }
}
