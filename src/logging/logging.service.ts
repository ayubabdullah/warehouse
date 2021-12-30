import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { QueryDto } from 'src/common/dto/query.dto';
import { User } from 'src/users/entities/user.entity';
import { Like, Repository } from 'typeorm';
import { CreateLogDto } from './dto/create-log.dto';
import { Log } from './entities/log.entity';

@Injectable({ scope: Scope.REQUEST })
export class LogsService {
  constructor(
    @Inject(REQUEST) private readonly request,
    @InjectRepository(Log) private readonly logRepository: Repository<Log>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    
  ) {}
  async findAll(queryDto: QueryDto): Promise<Pagination<Log>> {
    let query: any = {};
    const page = queryDto.page || 1;
    const limit = queryDto.limit || 25;

    if (queryDto.select) {
      const fields = queryDto.select.split(',');
      query.select = ['id', ...fields, 'createdAt'];
    }
    query.order = { createdAt: -1 };
    query.relations = ['user'];
    if (queryDto.search) {
      query.where = { name: Like(`%${queryDto.search}%`) };
    }

    return paginate<Log>(
      this.logRepository,
      {
        page,
        limit,
        route: 'http://localhost:5000/api/v1/logs',
      },
      query,
    );
  }
  async create(createLogDto: CreateLogDto) {
    const log = this.logRepository.create(createLogDto);
    log.user = this.request.user;
    await this.logRepository.save(log);
    return {
      success: true,
      data: log
    }
  }
  async findUserLogs(id: number, queryDto: QueryDto): Promise<Pagination<Log>> {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException(`user with id: ${id} not found`);
    }

    let query: any = {};
    const page = queryDto.page || 1;
    const limit = queryDto.limit || 25;
    query.order = { createdAt: -1 };
    query.where = { user };

    this.create({ action: `Get user's logs` });
    return paginate<Log>(
      this.logRepository,
      {
        page,
        limit,
        route: `http://localhost:5000/api/v1/users/${id}/logs`,
      },
      query,
    );
  }
}
