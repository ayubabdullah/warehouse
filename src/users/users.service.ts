import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { QueryDto } from 'src/common/dto/query.dto';
import { Log } from 'src/logs/entities/log.entity';
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
  ) {}
  create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    this.logsService.create({ action: `Create a user` });
    return this.userRepository.save(user);
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

  async findOne(id: number) {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException(`user with id: ${id} not found`);
    }
    this.logsService.create({ action: `Get single user with id: ${id}` });
    return user;
  }

  
  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.preload({ id, ...updateUserDto });
    if (!user) {
      throw new NotFoundException(`user with id: ${id} not found`);
    }
    this.logsService.create({ action: `Update user with id: ${id}` });
    return this.userRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    this.logsService.create({
      action: `Delete user with phone number: ${user.phone}`,
    });
    return this.userRepository.remove(user);
  }
}
