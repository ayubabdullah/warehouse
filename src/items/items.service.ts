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
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { QueryDto } from 'src/common/dto/query.dto';
import { Department } from 'src/departments/entities/department.entity';
import { User } from 'src/users/entities/user.entity';
import { LogsService } from 'src/logging/logging.service';

@Injectable()
export class ItemsService {
  constructor(
    private readonly logsService: LogsService,
    @InjectRepository(Item) private readonly itemRepository: Repository<Item>,
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) {}
  // Admin Only
  async findAll(queryDto: QueryDto): Promise<Pagination<Item>> {
    let query: any = {};
    const page = queryDto.page || 1;
    const limit = queryDto.limit || 25;

    if (queryDto.select) {
      const fields = queryDto.select.split(',');
      query.select = ['id', ...fields, 'createdAt'];
    }
    query.order = { createdAt: -1 };
    query.relations = ['category', 'type', 'department'];
    if (queryDto.search) {
      query.where = { name: Like(`%${queryDto.search}%`) };
    }
    this.logsService.create({ action: `Get All Items` });
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
  async findDepartmentItems(
    departmentId: number,
    queryDto: QueryDto,
  ): Promise<Pagination<Item>> {
    const department = await this.departmentRepository.findOne(departmentId);
    if (!department) {
      throw new NotFoundException(
        `department with id: ${departmentId} not found`,
      );
    }

    let query: any = {};
    const page = queryDto.page || 1;
    const limit = queryDto.limit || 25;
    query.relations = ['category', 'type'];
    query.order = { createdAt: -1 };
    query.where = { department };

    this.logsService.create({ action: `Get department's items` });
    return paginate<Item>(
      this.itemRepository,
      {
        page,
        limit,
        route: `http://localhost:5000/api/v1/departments/${departmentId}/items`,
      },
      query,
    );
  }
  // Admin Only
  async findOne(id: number) {
    const item = await this.itemRepository.findOne(id, {
      relations: ['category', 'type', 'department'],
    });

    if (!item) {
      throw new NotFoundException(`item with id: ${id} not found`);
    }
    this.logsService.create({ action: `Get single item this id: ${id}` });
    return {
      success: true,
      data: item,
    };
  }
  async findDepartmentItem(departmentId: number, id: number) {
    const item = await this.itemRepository.findOne(id, {
      relations: ['category', 'type', 'department'],
    });

    if (!item) {
      throw new NotFoundException(`item with id: ${id} not found`);
    }
    if (!(item.department.id === departmentId)) {
      throw new UnauthorizedException(
        `item ${id} doesn't belonge to this department`,
      );
    }
    this.logsService.create({ action: `Get single item this id: ${id}` });
    return {
      success: true,
      data: item,
    };
  }

  async create(departmentId: number, user: User, createItemDto: CreateItemDto) {
    const department = await this.departmentRepository.findOne(departmentId);
    if (!department) {
      throw new NotFoundException(
        `department with id: ${departmentId} not found`,
      );
    }

    if (!(user.department.id === departmentId)) {
      throw new UnauthorizedException(
        `user ${user.id} is not authorize to add item`,
      );
    }

    const item = await this.itemRepository.create(createItemDto);
    item.department = department;
    await this.itemRepository.save(item);
    this.logsService.create({ action: `Create an item` });
    return {
      success: true,
      data: item,
    };
  }
  async update(
    departmentId: number,
    user: User,
    id: number,
    updateItemDto: UpdateItemDto,
  ) {
    if (!(user.department.id === departmentId)) {
      throw new UnauthorizedException(
        `user ${user.id} is not authorize to update item`,
      );
    }
    const item = await this.itemRepository.preload({
      id,
      ...updateItemDto,
    });

    if (!item) {
      throw new NotFoundException(`item with id: ${id} not found`);
    }
    this.logsService.create({ action: `Update item this id: ${id}` });
    await this.itemRepository.save(item);
    return {
      success: true,
      data: item,
    };
  }
  // Admin Only
  async remove(id: number) {
    const item = await this.itemRepository.findOne(id);
    if (!item) {
      throw new NotFoundException(`item with id: ${id} not found`);
    }
    await this.itemRepository.remove(item);
    this.logsService.create({ action: `Delete item this name: ${item.name}` });
    return {
      success: true,
      data: item,
    };
  }
  async removeDepartmentItem(departmentId: number, user: User, id: number) {
    if (!(user.department.id === departmentId)) {
      throw new UnauthorizedException(
        `user ${user.id} is not authorize to delete item`,
      );
    }
    const item = await this.itemRepository.findOne(id);
    if (!item) {
      throw new NotFoundException(`item with id: ${id} not found`);
    }
    this.logsService.create({ action: `Delete item with name: ${item.name}` });
    await this.itemRepository.remove(item);
    return {
      success: true,
      data: item,
    };
  }
}
