import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { QueryDto } from 'src/common/dto/query.dto';
import { LogsService } from 'src/logs/logs.service';
import { Like, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    private readonly logsService: LogsService,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}
  async create(createOrderDto: CreateOrderDto) {
    const order = await this.orderRepository.create(createOrderDto);
    this.logsService.create({ action: `Create an order` });
    return this.orderRepository.save(order);
  }

  async findAll(queryDto: QueryDto): Promise<Pagination<Order>> {
    let query: any = {};
    const page = queryDto.page || 1;
    const limit = queryDto.limit || 25;

    if (queryDto.select) {
      const fields = queryDto.select.split(',');
      query.select = ['id', ...fields, 'createdAt'];
    }
    query.order = { createdAt: -1 };
    if (queryDto.search) {
      query.where = { name: Like(`%${queryDto.search}%`) };
    }
    this.logsService.create({ action: `Get all orders` });
    return paginate<Order>(
      this.orderRepository,
      {
        page,
        limit,
        route: 'http://localhost:5000/api/v1/orders',
      },
      query,
    );
  }

  async findOne(id: number) {
    const order = await this.orderRepository.findOne(id);
    if (!order) {
      throw new NotFoundException(`order with id: ${id} not found`);
    }
    this.logsService.create({ action: `Get single order with id: ${id}` });
    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    const order = await this.orderRepository.preload({
      id,
      ...updateOrderDto,
    });
    if (!order) {
      throw new NotFoundException(`order with id: ${id} not found`);
    }
    this.logsService.create({ action: `Update order with id: ${id}` });
    return this.orderRepository.save(order);
  }

  async remove(id: number) {
    const order = await this.findOne(id);
    this.logsService.create({
      action: `Delete order with client phone: ${order.clientPhone}`,
    });
    return this.orderRepository.remove(order);
  }
}
