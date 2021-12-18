import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateItemDto } from './dtos/create-item.dto';
import { UpdateItemDto } from './dtos/update-item.dto';
import { Item } from './entities/item.entity';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { QueryDto } from 'src/common/dto/query.dto';
import * as faker from 'faker';
import { Department } from 'src/departments/entities/department.entity';
import { User } from 'src/users/entities/user.entity';
import { Employee } from 'src/employees/entities/employee.entity';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item) private readonly itemRepository: Repository<Item>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) {}

  async findAll(queryDto: QueryDto): Promise<Pagination<Item>> {
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

    return paginate<Item>(
      this.itemRepository,
      {
        page,
        limit,
        route: 'http://localhost:5000/api/v1/items',
      },
      query,
    );
  }
  async findOneById(id: string) {
    const item = await this.itemRepository.findOne(id);

    if (!item) {
      throw new NotFoundException(`item with id: ${id} not found`);
    }

    return item;
  }

  async create(departmentId: number, user: User, createItemDto: CreateItemDto) {
    const department = await this.departmentRepository.findOne(departmentId);
    if (!department) {
      throw new NotFoundException(
        `department with id: ${departmentId} not found`,
      );
    }
    const employee = await this.employeeRepository.findOne({ user });
    if (!employee) {
      throw new NotFoundException(`employee with id: ${user.id} not found`);
    }
    if (!(employee.department.id === departmentId)) {
      throw new UnauthorizedException(
        `employee ${employee.id} is not authorize to add item`,
      );
    }

    const item = await this.itemRepository.create(createItemDto);
    item.department = department;
    return this.itemRepository.save(item);
  }
  async update(
    departmentId: number,
    user: User,
    id: string,
    updateItemDto: UpdateItemDto,
  ) {
    const department = await this.departmentRepository.findOne(departmentId);
    if (!department) {
      throw new NotFoundException(
        `department with id: ${departmentId} not found`,
      );
    }
    const employee = await this.employeeRepository.findOne({ user });
    if (!employee) {
      throw new NotFoundException(`employee with id: ${user.id} not found`);
    }
    if (!(employee.department.id === departmentId)) {
      throw new UnauthorizedException(
        `employee ${employee.id} is not authorize to update item`,
      );
    }
    const item = await this.itemRepository.preload({
      id: +id,
      ...updateItemDto,
    });

    if (!item) {
      throw new NotFoundException(`item with id: ${id} not found`);
    }

    return this.itemRepository.save(item);
  }
  async remove(departmentId: number, user: User, id: string) {
    const department = await this.departmentRepository.findOne(departmentId);
    if (!department) {
      throw new NotFoundException(
        `department with id: ${departmentId} not found`,
      );
    }
    const employee = await this.employeeRepository.findOne({ user });
    if (!employee) {
      throw new NotFoundException(`employee with id: ${user.id} not found`);
    }
    if (!(employee.department.id === departmentId)) {
      throw new UnauthorizedException(
        `employee ${employee.id} is not authorize to delete item`,
      );
    }
    const item = await this.itemRepository.findOne(id);
    if (!item) {
      throw new NotFoundException(`item with id: ${id} not found`);
    }
    return this.itemRepository.remove(item);
  }
}
