import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { AuthUser } from 'src/common/decorators/auth-user.decorator';
import { Roles } from 'src/common/decorators/role.decorator';
import { QueryDto } from 'src/common/dto/query.dto';
import { Role } from 'src/common/enums/role.enum';
import { CreateEmployeeDto } from 'src/employees/dto/create-employee.dto';
import { EmployeesService } from 'src/employees/employees.service';
import { CreateItemDto } from 'src/items/dtos/create-item.dto';
import { UpdateItemDto } from 'src/items/dtos/update-item.dto';
import { ItemsService } from 'src/items/items.service';
import { User } from 'src/users/entities/user.entity';
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { Department } from './entities/department.entity';

@Controller('departments')
export class DepartmentsController {
  constructor(
    private readonly departmentsService: DepartmentsService,
    private readonly employeesService: EmployeesService,
    private readonly itemsService: ItemsService,
  ) {}

  // Department Controllers
  @Roles(Role.ADMIN)
  @Post()
  create(@Body() createDepartmentDto: CreateDepartmentDto) {
    return this.departmentsService.create(createDepartmentDto);
  }

  @Roles(Role.ADMIN)
  @Get()
  async findAll(@Query() qeuryDto: QueryDto): Promise<Pagination<Department>> {
    return this.departmentsService.findAll(qeuryDto);
  }

  @Roles(Role.ADMIN)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.departmentsService.findOne(+id);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ) {
    return this.departmentsService.update(+id, updateDepartmentDto);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.departmentsService.remove(+id);
  }

  // Item Controllers
  @Get(':departmentId/items')
  getAllItems(
    @Param('departmentId') departmentId: string,
    @Query() queryDto: QueryDto,
  ) {
    return this.itemsService.findDepartmentItems(+departmentId, queryDto);
  }
  @Get(':departmentId/items/:id')
  getItem(
    @Param('departmentId') departmentId: string,
    @Param('id') id: string,
  ) {
    return this.itemsService.findDepartmentItem(+departmentId, +id);
  }

  @Post(':departmentId/items')
  createItem(
    @Param('departmentId') departmentId: string,
    @AuthUser() user: User,
    @Body() createItemDto: CreateItemDto,
  ) {
    return this.itemsService.create(+departmentId, user, createItemDto);
  }
  @Patch(':departmentId/items/:id')
  updateItem(
    @Param('departmentId') departmentId: string,
    @AuthUser() user: User,
    @Param('id') id: string,
    @Body() body: UpdateItemDto,
  ) {
    return this.itemsService.update(+departmentId, user, +id, body);
  }
  @Delete(':departmentId/items/:id')
  removeItem(
    @Param('departmentId') departmentId: string,
    @AuthUser() user: User,
    @Param('id') id: string,
  ) {
    return this.itemsService.remove(+departmentId, user, +id);
  }

  // Employee Controllers
  @Roles(Role.ADMIN)
  @Post(':departmentId/employees')
  createEmployee(
    @Param('departmentId') departmentId: string,
    @AuthUser() user: User,
    @Body() createEmpployeeDto: CreateEmployeeDto,
  ) {
    return this.employeesService.create(
      +departmentId,
      user,
      createEmpployeeDto,
    );
  }
}
