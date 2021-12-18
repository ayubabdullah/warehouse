import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { QueryDto } from 'src/common/dto/query.dto';
import { LogsService } from 'src/logs/logs.service';
import { Like, Repository } from 'typeorm';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { Department } from './entities/department.entity';

@Injectable()
export class DepartmentsService {
  constructor(
    private readonly logsService: LogsService,
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) {}
  create(createDepartmentDto: CreateDepartmentDto) {
    const department = this.departmentRepository.create(createDepartmentDto);
    this.logsService.create({ action: 'Create a department' });
    return this.departmentRepository.save(department);
  }

  async findAll(queryDto: QueryDto): Promise<Pagination<Department>> {
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
    this.logsService.create({ action: 'Get all departments' });
    return paginate<Department>(
      this.departmentRepository,
      {
        page,
        limit,
        route: 'http://localhost:5000/api/v1/departments',
      },
      query,
    );
  }

  async update(id: number, updateDepartmentDto: UpdateDepartmentDto) {
    const department = await this.departmentRepository.preload({
      id,
      ...updateDepartmentDto,
    });
    if (!department) {
      throw new NotFoundException(`department with id: id not found`);
    }
    this.logsService.create({ action: `Update department with id: ${id}` });
    return this.departmentRepository.save(department);
  }

  async remove(id: number) {
    const department = await this.departmentRepository.findOne(id);
    if (!department) {
      throw new NotFoundException(`department with id: ${id} not found`);
    }
    this.logsService.create({
      action: `Delete department with name ${department.name}`,
    });
    return this.departmentRepository.remove(department);
  }
}
