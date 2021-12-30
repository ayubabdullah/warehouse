import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { QueryDto } from 'src/common/dto/query.dto';
import { Department } from 'src/departments/entities/department.entity';
import { LogsService } from 'src/logging/logging.service';
import { OrderItemsService } from 'src/order-items/order-items.service';
import { User } from 'src/users/entities/user.entity';
import { Like, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    private readonly logsService: LogsService,
    private readonly orderItemsService: OrderItemsService,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) {}
  async create(
    departmentId: number,
    user: User,
    createOrderDto: CreateOrderDto,
  ) {
    const department = await this.departmentRepository.findOne(departmentId);
    if (!department) {
      throw new NotFoundException(
        `department with id: ${departmentId} not found`,
      );
    }

    if (!(user.department.id === departmentId)) {
      throw new UnauthorizedException(
        `user ${user.id} is not authorize to add order`,
      );
    }

    const order = await this.orderRepository.create(createOrderDto);
    order.department = department;
    await this.orderRepository.save(order);
    this.logsService.create({ action: `Create an order` });
    return {
      success: true,
      data: order,
    };
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
  async findDepartmentOrders(
    departmentId: number,
    queryDto: QueryDto,
  ): Promise<Pagination<Order>> {
    const department = await this.departmentRepository.findOne(departmentId);
    if (!department) {
      throw new NotFoundException(
        `department with id: ${departmentId} not found`,
      );
    }

    let query: any = {};
    const page = queryDto.page || 1;
    const limit = queryDto.limit || 25;
    // query.relations = ['category', 'type'];
    query.order = { createdAt: -1 };
    query.where = { department };

    this.logsService.create({ action: `Get department's orders` });
    return paginate<Order>(
      this.orderRepository,
      {
        page,
        limit,
        route: `http://localhost:5000/api/v1/departments/${departmentId}/orders`,
      },
      query,
    );
  }
  async findOne(id: number) {
    const order = await this.orderRepository.findOne(id, {
      relations: ['orderItems'],
    });
    if (!order) {
      throw new NotFoundException(`order with id: ${id} not found`);
    }
    this.logsService.create({ action: `Get single order with id: ${id}` });
    return {
      success: true,
      data: order,
    };
  }
  async findDepartmentOrder(departmentId: number, id: number) {
    const order = await this.orderRepository.findOne(id, {
      relations: ['orderItems', 'department'],
    });

    if (!order) {
      throw new NotFoundException(`order with id: ${id} not found`);
    }
    if (!(order.department.id === departmentId)) {
      throw new UnauthorizedException(
        `order ${id} doesn't belonge to this department`,
      );
    }
    this.logsService.create({ action: `Get single order this id: ${id}` });
    return {
      success: true,
      data: order,
    };
  }
  async update(
    departmentId: number,
    user: User,
    id: number,
    updateOrderDto: UpdateOrderDto,
  ) {
    if (!(user.department.id === departmentId)) {
      throw new UnauthorizedException(
        `user ${user.id} is not authorize to update item`,
      );
    }
    const order = await this.orderRepository.preload({
      id,
      ...updateOrderDto,
    });

    if (!order) {
      throw new NotFoundException(`order with id: ${id} not found`);
    }
    this.logsService.create({ action: `Update order this id: ${id}` });
    await this.orderRepository.save(order);
    return {
      success: true,
      data: order,
    };
  }

  async remove(id: number) {
    const order = await this.orderRepository.findOne(id,{relations:['orderItems']});
    if (!order) {
      throw new NotFoundException(`order with id: ${id} not found`);
    }
    await this.orderRepository.remove(order);
    order.orderItems.forEach((orderItem) =>
      this.orderItemsService.returnItem(orderItem.id),
    );
    this.logsService.create({
      action: `Delete order with client phone: ${order.clientName}`,
    });
    return {
      success: true,
      data: order,
    };
  }
  async removeDepartmentOrder(departmentId: number, user: User, id: number) {
    if (!(user.department.id === departmentId)) {
      throw new UnauthorizedException(
        `user ${user.id} is not authorize to delete item`,
      );
    }
    const order = await this.orderRepository.findOne(id, {
      relations: ['orderItems'],
    });
    if (!order) {
      throw new NotFoundException(`order with id: ${id} not found`);
    }
    await this.orderRepository.remove(order);
    order.orderItems.forEach((orderItem) =>
    this.orderItemsService.returnItem(orderItem.id),
    );
    
    this.logsService.create({
      action: `Delete order with name: ${order.clientName}`,
    });
    return {
      success: true,
      data: order,
    };
  }
}
