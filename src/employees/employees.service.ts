import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { QueryDto } from 'src/common/dto/query.dto';
import { Department } from 'src/departments/entities/department.entity';
import { LogsService } from 'src/logs/logs.service';
import { User } from 'src/users/entities/user.entity';
import { Like, Repository } from 'typeorm';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employee } from './entities/employee.entity';

@Injectable()
export class EmployeesService {
  constructor(
    private readonly logsService: LogsService,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) {}

  async create(
    departmentId: number,
    user: User,
    createEmployeeDto: CreateEmployeeDto,
  ) {
    const department = await this.departmentRepository.findOne(departmentId);

    if (!department) {
      throw new NotFoundException(
        `department with id: ${departmentId} not found`,
      );
    }

    const employee = this.employeeRepository.create(createEmployeeDto);
    employee.user = user;
    employee.department = department;

    await this.employeeRepository.save(employee);
    this.logsService.create({ action: `Create an Employee` });
    return {
      success: true,
      data: employee,
    };
  }

  async findAll(queryDto: QueryDto): Promise<Pagination<Employee>> {
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
    this.logsService.create({ action: `Get All Employees` });
    return paginate<Employee>(
      this.employeeRepository,
      {
        page,
        limit,
        route: 'http://localhost:5000/api/v1/employees',
      },
      query,
    );
  }

  async findOne(id: number) {
    const employee = await this.employeeRepository.findOne(id);

    if (!employee) {
      throw new NotFoundException(`employee with id: ${id} not found`);
    }
    this.logsService.create({ action: `Get single employee with id: ${id}` });
    return {
      success: true,
      data: employee,
    };
  }

  async update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    const employee = await this.employeeRepository.preload({
      id,
      ...updateEmployeeDto,
    });
    if (!employee) {
      throw new NotFoundException(`employee with id: ${id} not found`);
    }
    await this.employeeRepository.save(employee);
    this.logsService.create({ action: `Update Employee with id: ${id}` });
    return {
      success: true,
      data: employee,
    };
  }
}
