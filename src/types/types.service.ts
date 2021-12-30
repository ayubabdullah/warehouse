import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { QueryDto } from 'src/common/dto/query.dto';
import { LogsService } from 'src/logging/logging.service';
import { Like, Repository } from 'typeorm';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';
import { Type } from './entities/type.entity';

@Injectable()
export class TypesService {
  constructor(
    private readonly logsService: LogsService,
    @InjectRepository(Type) private readonly typeRepository: Repository<Type>,
  ) {}
  async create(createTypeDto: CreateTypeDto) {
    const type = this.typeRepository.create(createTypeDto);
    await this.typeRepository.save(type);
    this.logsService.create({ action: `Create a type` });
      return {
        success: true,
        data: type,
      };
  }

  async findAll(queryDto: QueryDto): Promise<Pagination<Type>> {
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
    this.logsService.create({ action: `Get all types` });
    return paginate<Type>(
      this.typeRepository,
      {
        page,
        limit,
        route: 'http://localhost:5000/api/v1/types',
      },
      query,
    );
  }

  async update(id: number, updateTypeDto: UpdateTypeDto) {
    const type = await this.typeRepository.preload({ id, ...updateTypeDto });
    if (!type) {
      throw new NotFoundException(`type with id: ${id} not found`);
    }
    await this.typeRepository.save(type);
    this.logsService.create({ action: `Update type with id: ${id}` });
    return {
      success: true,
      data: type,
    };
  }

  async remove(id: number) {
    const type = await this.typeRepository.findOne(id);
    if (!type) {
      throw new NotFoundException(`type with id: ${id} not found`);
    }
    await this.typeRepository.remove(type);
    this.logsService.create({ action: `Delete type this id: ${type.name}` });
    return {
      success: true,
      data: type,
    };
  }
}
