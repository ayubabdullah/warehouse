import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { QueryDto } from 'src/common/dto/query.dto';
import { Department } from 'src/departments/entities/department.entity';
import { LogsService } from 'src/logs/logs.service';
import { Like, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    private readonly logsService: LogsService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    await this.userRepository.save(user);
    this.logsService.create({ action: `Create a user` });
    return {
      success: true,
      data: user,
    };
  }

  async findAll(queryDto: QueryDto): Promise<Pagination<User>> {
    let query: any = {};
    const page = queryDto.page || 1;
    const limit = queryDto.limit || 25;

    if (queryDto.select) {
      const fields = queryDto.select.split(',');
      query.select = ['id', ...fields, 'createdAt'];
    }
    query.order = { createdAt: -1 };
    query.relations = ['department']
    if (queryDto.search) {
      query.where = { name: Like(`%${queryDto.search}%`) };
    }
    this.logsService.create({ action: `Get all users` });
    return paginate<User>(
      this.userRepository,
      {
        page,
        limit,
        route: 'http://localhost:5000/api/v1/users',
      },
      query,
    );
  }
  async findDepartmentUsers(
    departmentId: number,
    queryDto: QueryDto,
  ): Promise<Pagination<User>> {
    const department = await this.departmentRepository.findOne(departmentId);
    if (!department) {
      throw new NotFoundException(
        `department with id: ${departmentId} not found`,
      );
    }

    let query: any = {};
    const page = queryDto.page || 1;
    const limit = queryDto.limit || 25;
    query.order = { createdAt: -1 };
    query.where = { department };

    this.logsService.create({ action: `Get department's users` });
    return paginate<User>(
      this.userRepository,
      {
        page,
        limit,
        route: `http://localhost:5000/api/v1/departments/${departmentId}/users`,
      },
      query,
    );
  }
  async findOne(id: number) {
    const user = await this.userRepository.findOne(id, { relations: ['department']});
    if (!user) {
      throw new NotFoundException(`user with id: ${id} not found`);
    }
    this.logsService.create({ action: `Get single user with id: ${id}` });
    return {
      success: true,
      data: user,
    };
  }
  async findDepartmentUser(departmentId: number, id: number) {
    const user = await this.userRepository.findOne(id, {
      relations: ['department'],
    });

    if (!user) {
      throw new NotFoundException(`user with id: ${id} not found`);
    }
    if (!(user.department.id === departmentId)) {
      throw new UnauthorizedException(
        `user ${id} doesn't belonge to this department`,
      );
    }
    this.logsService.create({ action: `Get single user this id: ${id}` });
    return {
      success: true,
      data: user,
    };
  }
  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.preload({ id, ...updateUserDto });
    if (!user) {
      throw new NotFoundException(`user with id: ${id} not found`);
    }
    await this.userRepository.save(user);
    this.logsService.create({ action: `Update user with id: ${id}` });
    return {
      success: true,
      data: user,
    };
  }

  async remove(id: number) {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException(`user with id: ${id} not found`);
    }
    await this.userRepository.remove(user);
    this.logsService.create({
      action: `Delete user with phone number: ${user.phone}`,
    });
    return {
      success: true,
      data: user,
    };
  }
}
