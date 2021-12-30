import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { QueryDto } from 'src/common/dto/query.dto';
import { LogsService } from 'src/logging/logging.service';
import { Like, Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    private readonly logsService: LogsService,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}
  async create(createCategoryDto: CreateCategoryDto) {
    const category = this.categoryRepository.create(createCategoryDto);
    this.logsService.create({ action: 'Create a category' });
    await this.categoryRepository.save(category);
    return {
      success: true,
      data: category,
    };
  }

  async findAll(queryDto: QueryDto): Promise<Pagination<Category>> {
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
    this.logsService.create({ action: 'Get all categories' });
    return paginate<Category>(
      this.categoryRepository,
      {
        page,
        limit,
        route: 'http://localhost:5000/api/v1/items',
      },
      query,
    );
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryRepository.preload({
      id,
      ...updateCategoryDto,
    });

    if (!category) {
      throw new NotFoundException(`category with id: ${id} not found`);
    }
    await this.categoryRepository.save(category);
    this.logsService.create({ action: `Update category with id: ${id}` });
    return {
      success: true,
      data: category,
    };
  }

  async remove(id: number) {
    const category = await this.categoryRepository.findOne(id);
    if (!category) {
      throw new NotFoundException(`category with id: ${id} not found`);
    }
    await this.categoryRepository.remove(category);
    this.logsService.create({
      action: `Remove category with name: ${category.name}`,
    });
    return {
      success: true,
      data: category,
    };
  }
}
